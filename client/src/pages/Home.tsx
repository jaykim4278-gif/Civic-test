import { Link, useLocation } from "wouter";
import { BookOpen, Trophy, Zap, Flame, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useStudyStats } from "@/hooks/use-study";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: stats, isLoading } = useStudyStats();
  const [jumpInput, setJumpInput] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [, setLocation] = useLocation();

  const handleReset = async () => {
    try {
      await fetch("/api/seed", { method: "POST" });
      window.location.reload(); 
    } catch (e) {
      alert("Failed to reset.");
    }
  };

  // Validating Input Logic (1-100 only)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setJumpInput("");
      return;
    }
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num > 100) num = 100; 
    setJumpInput(num.toString());
  };

  const handleJump = () => {
    let num = parseInt(jumpInput);
    if (num < 1) num = 1;
    if (num > 100) num = 100;
    if (jumpInput) {
      setLocation(`/study?startId=${num}&mode=jump`);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full"/></div>;

  const masteryPercent = stats ? Math.round((stats.masteredCount / stats.totalQuestions) * 100) : 0;
  const streak = stats?.currentStreak || 0;
  const nextQ = stats?.nextQuestionId || 1; 

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 relative">
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Welcome back! 🇺🇸</h1>
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm transition-colors", streak > 0 ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-400")}>
            <Flame className={cn("w-5 h-5", streak > 0 ? "fill-orange-500" : "")} />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Dashboard Card */}
        <section className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-12">
          
          {/* Progress Ring */}
          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100" />
              <motion.circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={552.92} initial={{ strokeDashoffset: 552.92 }} animate={{ strokeDashoffset: 552.92 - (552.92 * masteryPercent) / 100 }} className="text-emerald-500" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800">{masteryPercent}%</span>
              <span className="text-[10px] font-bold uppercase text-slate-400">Mastered</span>
            </div>
          </div>

          {/* Action Buttons with increased spacing */}
          <div className="flex-1 w-full space-y-6">
            
            <Link href={`/study?startId=${nextQ}`}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3">
                <BookOpen className="w-6 h-6" />
                Continue Learning (Q{nextQ})
              </motion.button>
            </Link>

            <Link href="/study?mode=random">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-white hover:bg-slate-50 text-slate-600 border-2 border-slate-200 p-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 text-orange-500" />
                Random Practice
              </motion.button>
            </Link>

            {/* Jump Section */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <span className="text-xs font-bold uppercase text-slate-400">Jump to:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">#</span>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={jumpInput} 
                  onChange={handleInputChange}
                  placeholder="10" 
                  className="w-16 text-center p-2 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-700 bg-slate-50" 
                />
                <button 
                  onClick={handleJump}
                  disabled={!jumpInput}
                  className="bg-slate-800 text-white p-2 rounded-xl disabled:opacity-50 hover:bg-slate-700 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-6 px-2">Library</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/questions">
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-blue-100 cursor-pointer transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center"><BookOpen className="w-6 h-6" /></div>
                <div><h4 className="text-lg font-bold text-slate-800">Browse All</h4><p className="text-slate-500 text-sm">View all 100 questions</p></div>
              </div>
            </Link>
            <Link href="/vocabulary">
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-purple-100 cursor-pointer transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center"><Trophy className="w-6 h-6" /></div>
                <div><h4 className="text-lg font-bold text-slate-800">Vocabulary</h4><p className="text-slate-500 text-sm">Master 300+ core terms</p></div>
              </div>
            </Link>
          </div>
        </section>

        <section className="pt-10 border-t border-slate-100 flex justify-center">
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Study Progress
          </button>
        </section>
      </main>
      
      <Navigation />

      {/* Custom Modal Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Reset Progress?</h3>
                <p className="text-slate-500 leading-relaxed">
                  This will clear all your mastery data, streaks, and review schedules. This action cannot be undone.
                </p>
                <div className="flex flex-col w-full gap-3 pt-4">
                  <Button
                    onClick={handleReset}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl"
                  >
                    Yes, Reset Everything
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full text-slate-400 hover:text-slate-600 font-bold h-12 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}