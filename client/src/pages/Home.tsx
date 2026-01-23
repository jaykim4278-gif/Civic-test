import { Link } from "wouter";
import { BookOpen, Calendar, Trophy, ArrowRight, Flag, Zap, Flame, AlertCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useStudyStats } from "@/hooks/use-study";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: stats, isLoading } = useStudyStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const masteryPercent = stats ? Math.round((stats.masteredCount / stats.totalQuestions) * 100) : 0;
  const streak = stats?.currentStreak || 0;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Top Bar */}
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-slate-800">
            Welcome back! 🇺🇸
          </h1>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm transition-colors",
            streak > 0 ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-400"
          )}>
            <Flame className={cn("w-5 h-5", streak > 0 ? "fill-orange-500" : "")} />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Main Dashboard */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Mastery Donut */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100"
              />
              <motion.circle
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * masteryPercent) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-emerald-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-display font-black text-slate-800">{masteryPercent}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mastered</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex-1 w-full space-y-4">
            <Link href="/study">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl font-display font-bold text-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 transition-all"
              >
                <BookOpen className="w-6 h-6" />
                Continue Learning
              </motion.button>
            </Link>

            <Link href="/study?mode=random">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white hover:bg-slate-50 text-slate-600 border-2 border-slate-200 p-6 rounded-2xl font-display font-bold text-xl flex items-center justify-center gap-3 transition-all"
              >
                <Zap className="w-6 h-6 text-orange-500" />
                Random Practice
              </motion.button>
            </Link>
          </div>
        </section>

        {/* Library Section */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-2xl font-display font-bold text-slate-800">Library</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/questions">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Browse All</h4>
                <p className="text-slate-500 text-sm">View all 100 civics questions</p>
              </motion.div>
            </Link>

            <Link href="/vocabulary">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Vocabulary</h4>
                <p className="text-slate-500 text-sm">Master 300+ core terms</p>
              </motion.div>
            </Link>
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
