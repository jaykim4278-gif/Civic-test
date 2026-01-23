import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { addDays } from "date-fns";
import { CIVICS_DATA } from "./civics_data";
import { db } from "./db";
import { asc, sql, eq, lt, desc, gte } from "drizzle-orm";
import { questions, userProgress } from "@shared/schema";

// SM-2 Algorithm Implementation
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
  
  // Force Reset (Manual Seed)
  app.post("/api/seed", async (req, res) => {
    try {
      console.log("Creating/Seeding Database...");
      await db.delete(userProgress);
      await db.delete(questions);
      await db.insert(questions).values(CIVICS_DATA);
      console.log("Database seeded with 100 questions.");
      res.json({ message: "Database reset and seeded successfully." });
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
      // Disable Cache for Session
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

      const result = sessionQuestions.map(q => ({ ...q, isNew: true, progress: undefined }));
      res.json(result);
    } catch (error) {
      console.error("Session Error:", error);
      res.status(500).json({ message: "Failed to load session" });
    }
  });

  app.post(api.study.review.path, async (req, res) => {
    try {
      const { questionId, quality } = api.study.review.input.parse(req.body);
      console.log(`[Review] Received for Q${questionId}, Quality: ${quality}`);

      const currentProgress = await storage.getUserProgress(questionId);
      const previousInterval = currentProgress?.interval ?? 0;
      const previousEaseFactor = currentProgress?.easeFactor ?? 2.5;
      const previousReviewCount = currentProgress?.reviewCount ?? 0;

      const { interval, easeFactor, reviewCount } = calculateSM2(
        quality,
        previousInterval,
        previousEaseFactor,
        previousReviewCount
      );

      await storage.updateUserProgress({
        questionId,
        interval,
        easeFactor,
        reviewCount,
        nextReviewDate: addDays(new Date(), interval),
        lastReviewedAt: new Date()
      });

      console.log(`[Review] Saved Q${questionId}. New Interval: ${interval}`);
      res.json({ success: true });
    } catch (error) {
      console.error("[Review] Save Failed:", error);
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  app.get(api.study.stats.path, async (req, res) => {
    try {
      // CRITICAL FIX: Disable Caching for Stats
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      
      const allQuestions = await db.select().from(questions).orderBy(asc(questions.id));
      const totalQuestions = allQuestions.length;

      const allProgress = await db.select().from(userProgress);
      const touchedIds = new Set(allProgress.map(p => p.questionId));

      const nextQuestion = allQuestions.find(q => !touchedIds.has(q.id));
      const nextQuestionId = nextQuestion ? nextQuestion.id : 1;

      console.log(`[Stats] Total: ${totalQuestions}, Touched: ${touchedIds.size}, Next Q: ${nextQuestionId}`);

      const masteredCount = allProgress.filter(p => p.reviewCount > 0 && p.easeFactor > 2.0).length;
      
      const reviews = await db.select({ date: sql`DISTINCT DATE(${userProgress.lastReviewedAt})` })
        .from(userProgress).orderBy(desc(sql`DATE(${userProgress.lastReviewedAt})`));

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

  // Safe Seeding
  try {
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(questions);
    if (Number(countResult[0]?.count || 0) === 0) {
      await db.insert(questions).values(CIVICS_DATA);
    }
  } catch (e) { console.error("Seed error:", e); }

  return httpServer;
}