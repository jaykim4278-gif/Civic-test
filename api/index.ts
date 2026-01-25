import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { asc, sql, eq, desc, gte, and } from "drizzle-orm";
import { addDays } from "date-fns";
import * as schema from "../shared/schema";
import { questions, userProgress } from "../shared/schema";

// Database setup
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}
const sqlClient = neon(DATABASE_URL);
const db = drizzle(sqlClient, { schema });

// Civics data for seeding
const CIVICS_DATA = [
  { question: "What is the supreme law of the land?", answer: "the Constitution", translation: "이 나라의 최고 법은 무엇입니까? - 헌법", category: "American Government - Principles of American Democracy", keywords: '[{"word":"Supreme","definition":"최고의"},{"word":"Law","definition":"법"},{"word":"Constitution","definition":"헌법"}]' },
  { question: "What does the Constitution do?", answer: "sets up the government, defines the government, protects basic rights of Americans", translation: "헌법은 무엇을 합니까? - 정부를 수립하고, 정부를 정의하고, 미국인들의 기본권을 보호합니다", category: "American Government - Principles of American Democracy", keywords: '[{"word":"Constitution","definition":"헌법"},{"word":"Government","definition":"정부"},{"word":"Rights","definition":"권리"}]' },
];

// Track seeding
let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  try {
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(questions);
    if (Number(countResult[0]?.count || 0) === 0) {
      // Fetch full data from the original civics_data module would be better,
      // but for now we'll rely on the database already having data or manual seeding
      console.log("Database appears empty, seeding may be needed");
    }
    seeded = true;
  } catch (e) {
    console.error("Seed check error:", e);
  }
}

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

// Seed middleware
app.use("/api", async (_req, _res, next) => {
  await ensureSeeded();
  next();
});

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
