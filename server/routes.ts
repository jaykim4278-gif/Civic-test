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

function calculateSM2(quality: number, previousInterval: number, previousEaseFactor: number, reviewCount: number) {
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

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post("/api/seed", async (req, res) => {
    try {
      const { userProgress } = await import("@shared/schema");
      await db.delete(userProgress);
      await db.delete(questions);
      await db.insert(questions).values(CIVICS_DATA);
      res.json({ message: "Database seeded successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.questions.list.path, async (req, res) => {
    const allQuestions = await storage.getQuestions();
    res.json(allQuestions);
  });

  app.get("/api/study/session", async (req, res) => {
    try {
      const mode = req.query.mode as string | undefined;
      const startId = parseInt(req.query.startId as string) || undefined;
      let sessionQuestions;

      if (mode === "random") {
        sessionQuestions = await db.select().from(questions).orderBy(sql`RANDOM()`);
      } else {
        // Default (Ordered): Support startId
        let query = db.select().from(questions);
        if (startId) {
          query = query.where(gte(questions.id, startId)) as any;
        }
        sessionQuestions = await query.orderBy(asc(questions.id));
      }
      const result = sessionQuestions.map(q => ({ ...q, isNew: true, progress: undefined }));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to load session" });
    }
  });

  app.post(api.study.review.path, async (req, res) => {
    const { questionId, quality } = api.study.review.input.parse(req.body);
    const currentProgress = await storage.getUserProgress(questionId);
    
    const { interval, easeFactor, reviewCount } = calculateSM2(
      quality,
      currentProgress?.interval ?? 0,
      currentProgress?.easeFactor ?? 2.5,
      currentProgress?.reviewCount ?? 0
    );

    const updated = await storage.updateUserProgress({
      questionId, interval, easeFactor, reviewCount, nextReviewDate: addDays(new Date(), interval)
    });
    res.json({ nextReviewDate: updated.nextReviewDate.toISOString(), interval: updated.interval });
  });

  app.get(api.study.stats.path, async (req, res) => {
    try {
      const allQuestions = await db.select().from(questions).orderBy(asc(questions.id));
      const totalQuestions = allQuestions.length;

      // Get ALL progress records to find what has been touched at all
      const allProgress = await db.select().from(userProgress);
      const touchedIds = allProgress.map(p => p.questionId);

      // Mastered = actually learned (reviewCount > 0)
      const masteredCount = allProgress.filter(p => p.reviewCount > 0).length;
      
      // Hard Count
      const hardCount = allProgress.filter(p => p.easeFactor < 2.5).length;

      // Next Question: Find the lowest ID that has NEVER been touched (not in userProgress)
      const nextQuestion = allQuestions.find(q => !touchedIds.includes(q.id));
      // If all touched, default to 1, otherwise the first new one
      const nextQuestionId = nextQuestion ? nextQuestion.id : 1;

      // Streak Logic
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

      res.json({ totalQuestions, masteredCount, currentStreak, hardCount, nextQuestionId, totalLearned: masteredCount, dueToday: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to load stats" });
    }
  });

  await storage.seedQuestions([]); 
  return httpServer;
}