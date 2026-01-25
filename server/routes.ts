import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { addDays } from "date-fns";
import { CIVICS_DATA } from "./civics_data";
import { db } from "./db";
import { asc, sql, eq, desc, gte, and } from "drizzle-orm";
import { questions, userProgress } from "@shared/schema";

// SM-2 Algorithm
function calculateSM2(
  quality: number,
  previousInterval: number,
  previousEaseFactor: number,
  reviewCount: number
) {
  let interval: number;
  let easeFactor: number;

  if (quality >= 3) {
    if (reviewCount === 0) interval = 1;
    else if (reviewCount === 1) interval = 6;
    else interval = Math.round(previousInterval * previousEaseFactor);
    reviewCount += 1;
  } else {
    reviewCount = 0;
    interval = 1; 
  }

  easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return { interval, easeFactor, reviewCount };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Helper: Get User ID from Headers
  const getUserId = (req: any) => {
    const headerVal = req.headers['x-user-id'];
    // Default to 1 if header is missing or invalid
    const uid = parseInt(Array.isArray(headerVal) ? headerVal[0] : headerVal);
    return isNaN(uid) ? 1 : uid;
  };

  // Reset Progress (User Specific)
  app.post("/api/seed", async (req, res) => {
    try {
      const userId = getUserId(req);
      console.log(`Resetting progress for User ${userId}...`);
      
      // Only delete progress for this specific user
      await db.delete(userProgress).where(eq(userProgress.userId, userId));
      
      // Ensure questions exist (idempotent check)
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(questions);
      if (Number(countResult[0]?.count || 0) === 0) {
        await db.insert(questions).values(CIVICS_DATA);
      }

      res.json({ message: `Progress reset for User ${userId}.` });
    } catch (err: any) {
      console.error("Seed failed:", err);
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.questions.list.path, async (req, res) => {
    const allQuestions = await storage.getQuestions();
    res.json(allQuestions);
  });

  app.get("/api/study/session", async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const mode = req.query.mode as string | undefined;
      const startId = parseInt(req.query.startId as string) || undefined;
      
      let sessionQuestions;
      if (mode === "random") {
        sessionQuestions = await db.select().from(questions).orderBy(sql`RANDOM()`);
      } else {
        let query = db.select().from(questions);
        if (startId) {
          query = query.where(gte(questions.id, startId)) as any;
        }
        sessionQuestions = await query.orderBy(asc(questions.id));
      }
      // Ensure clean response
      const result = sessionQuestions.map(q => ({ ...q, isNew: true, progress: undefined }));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to load session" });
    }
  });

  // Review Endpoint (Multi-User Logic)
  app.post(api.study.review.path, async (req, res) => {
    try {
      const userId = getUserId(req);
      const mode = req.query.mode as string | undefined;
      const { questionId, quality } = api.study.review.input.parse(req.body);
      
      console.log(`[Review] User ${userId} - Q${questionId} (${mode || 'linear'})`);

      if (mode === 'random' || mode === 'jump') {
        return res.json({ success: true, skipped: true });
      }

      // Check existence for THIS USER
      const [existing] = await db.select().from(userProgress)
        .where(and(
          eq(userProgress.questionId, questionId),
          eq(userProgress.userId, userId)
        ));
      
      const previousInterval = existing?.interval ?? 0;
      const previousEaseFactor = existing?.easeFactor ?? 2.5;
      const previousReviewCount = existing?.reviewCount ?? 0;

      const { interval, easeFactor, reviewCount } = calculateSM2(
        quality,
        previousInterval,
        previousEaseFactor,
        previousReviewCount
      );

      const nextReviewDate = addDays(new Date(), interval);
      const lastReviewedAt = new Date();

      if (existing) {
        // Update existing record
        await db.update(userProgress).set({
          interval,
          easeFactor,
          reviewCount,
          nextReviewDate,
          lastReviewedAt
        })
        .where(and(
          eq(userProgress.questionId, questionId),
          eq(userProgress.userId, userId)
        ));
      } else {
        // Insert NEW record with userId
        await db.insert(userProgress).values({
          userId: userId, 
          questionId,
          interval,
          easeFactor,
          reviewCount,
          nextReviewDate,
          lastReviewedAt
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("[Review] Save Failed:", error);
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  app.get(api.study.stats.path, async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const userId = getUserId(req);
      
      const allQuestions = await db.select().from(questions).orderBy(asc(questions.id));
      const totalQuestions = allQuestions.length;

      // Filter progress by User ID
      const allProgress = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
      const touchedIds = new Set(allProgress.map(p => p.questionId));

      const nextQuestion = allQuestions.find(q => !touchedIds.has(q.id));
      const nextQuestionId = nextQuestion ? nextQuestion.id : 1;

      console.log(`[Stats] User ${userId} - Touched: ${touchedIds.size}, Next Q: ${nextQuestionId}`);

      const masteredCount = allProgress.filter(p => p.reviewCount > 0 && p.easeFactor > 2.0).length;
      
      const reviews = await db.select({ date: sql`DISTINCT DATE(${userProgress.lastReviewedAt})` })
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .orderBy(desc(sql`DATE(${userProgress.lastReviewedAt})`));

      let currentStreak = 0;
      if (reviews.length > 0) {
        let checkDate = new Date();
        checkDate.setHours(0,0,0,0);
        for (const review of reviews) {
          const rDate = new Date(review.date as string);
          rDate.setHours(0,0,0,0);
          const diff = Math.floor((checkDate.getTime() - rDate.getTime()) / 86400000);
          if (diff <= 1) { currentStreak++; checkDate = rDate; } else break;
        }
      }

      res.json({
        totalQuestions,
        masteredCount,
        currentStreak,
        hardCount: 0, 
        nextQuestionId, 
        totalLearned: touchedIds.size, 
        dueToday: 0
      });
    } catch (error) {
      console.error("Stats Error:", error);
      res.status(500).json({ message: "Failed to load stats" });
    }
  });

  // Initial Seed Check
  try {
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(questions);
    if (Number(countResult[0]?.count || 0) === 0) {
      await db.insert(questions).values(CIVICS_DATA);
    }
  } catch (e) { console.error("Seed error:", e); }

  return httpServer;
}
