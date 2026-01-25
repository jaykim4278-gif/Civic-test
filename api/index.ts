import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { asc, sql, eq, gte, and } from "drizzle-orm";
import { addDays } from "date-fns";

// Schema definitions (inline to avoid module resolution issues in serverless)
const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  translation: text("translation"),
  category: text("category").default("general"),
  keywords: text("keywords"),
});

const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  questionId: integer("question_id").notNull(),
  interval: integer("interval").notNull().default(0),
  easeFactor: real("ease_factor").notNull().default(2.5),
  reviewCount: integer("review_count").notNull().default(0),
  nextReviewDate: timestamp("next_review_date").notNull().defaultNow(),
  lastReviewedAt: timestamp("last_reviewed_at"),
});

// Database setup
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}
const sqlClient = neon(DATABASE_URL);
const db = drizzle(sqlClient);

// Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security
const ACCESS_PIN = "1020";
const verifyPin = (req: any, res: any) => {
  const pin = req.headers["x-access-pin"];
  if (pin !== ACCESS_PIN) {
    res.status(401).json({ message: "Invalid Access PIN" });
    return false;
  }
  return true;
};

const getUserId = (req: any) => {
  const headerVal = req.headers["x-user-id"];
  const uid = parseInt(Array.isArray(headerVal) ? headerVal[0] : headerVal);
  return isNaN(uid) ? 1 : uid;
};

// SM-2 Algorithm
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

// Routes
app.get("/api/questions", async (_req, res) => {
  try {
    const allQuestions = await db.select().from(questions).orderBy(asc(questions.id));
    res.json(allQuestions);
  } catch (error) {
    console.error("Questions error:", error);
    res.status(500).json({ message: "Failed to load questions" });
  }
});

app.get("/api/study/session", async (req, res) => {
  try {
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
    const result = sessionQuestions.map((q) => ({ ...q, isNew: true, progress: undefined }));
    res.json(result);
  } catch (error) {
    console.error("Session error:", error);
    res.status(500).json({ message: "Failed to load session" });
  }
});

app.get("/api/study/stats", async (req, res) => {
  try {
    const userId = getUserId(req);
    const allQuestions = await db.select().from(questions).orderBy(asc(questions.id));
    const totalQuestions = allQuestions.length;
    const allProgress = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    const touchedIds = new Set(allProgress.map((p) => p.questionId));
    const nextQuestion = allQuestions.find((q) => !touchedIds.has(q.id));
    const nextQuestionId = nextQuestion ? nextQuestion.id : 1;
    const masteredCount = allProgress.filter((p) => p.reviewCount > 0 && p.easeFactor > 2.0).length;

    res.json({
      totalQuestions,
      masteredCount,
      currentStreak: 0,
      hardCount: 0,
      nextQuestionId,
      totalLearned: touchedIds.size,
      dueToday: 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

app.post("/api/study/review", async (req, res) => {
  if (!verifyPin(req, res)) return;
  try {
    const userId = getUserId(req);
    const mode = req.query.mode as string | undefined;
    const { questionId, quality } = req.body;
    if (mode === "random" || mode === "jump") {
      return res.json({ success: true, skipped: true });
    }
    const [existing] = await db.select().from(userProgress).where(and(eq(userProgress.questionId, questionId), eq(userProgress.userId, userId)));
    const previousInterval = existing?.interval ?? 0;
    const previousEaseFactor = existing?.easeFactor ?? 2.5;
    const previousReviewCount = existing?.reviewCount ?? 0;
    const { interval, easeFactor, reviewCount } = calculateSM2(quality, previousInterval, previousEaseFactor, previousReviewCount);
    const nextReviewDate = addDays(new Date(), interval);
    const lastReviewedAt = new Date();
    if (existing) {
      await db.update(userProgress).set({ interval, easeFactor, reviewCount, nextReviewDate, lastReviewedAt }).where(and(eq(userProgress.questionId, questionId), eq(userProgress.userId, userId)));
    } else {
      await db.insert(userProgress).values({ userId, questionId, interval, easeFactor, reviewCount, nextReviewDate, lastReviewedAt });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Failed to save progress" });
  }
});

app.post("/api/seed", async (req, res) => {
  if (!verifyPin(req, res)) return;
  try {
    const userId = getUserId(req);
    await db.delete(userProgress).where(eq(userProgress.userId, userId));
    res.json({ message: `Progress reset for User ${userId}.` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export for Vercel
export default app;
