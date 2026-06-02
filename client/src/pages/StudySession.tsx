import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useStudySession, useSubmitReview } from "@/hooks/use-study";
import { Flashcard } from "@/components/Flashcard";
import { Loader2, AlertTriangle, X, ChevronLeft } from "lucide-react";
import { api } from "@shared/routes";

export default function StudySession() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // 1. Get Mode & StartId
  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get("mode");
  const startId = searchParams.get("startId") ? parseInt(searchParams.get("startId")!) : undefined;

  const { data: questions, isLoading } = useStudySession({ mode: mode || "linear", startId });
  const submitReview = useSubmitReview();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const didInitRef = useRef(false);

  // 2. Custom Modal State
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // mode/startId가 바뀌면 시작 위치를 다시 잡도록 플래그 초기화
  useEffect(() => {
    didInitRef.current = false;
  }, [mode, startId]);

  // 카드 로드 후 startId에 해당하는 카드부터 시작 (최초 1회).
  // 이후 백그라운드 refetch가 일어나도 현재 보던 위치를 유지한다.
  useEffect(() => {
    if (!didInitRef.current && questions && questions.length > 0) {
      const idx = startId
        ? questions.findIndex((q: any) => q.id === startId)
        : 0;
      setCurrentIndex(idx >= 0 ? idx : 0);
      setIsFlipped(false);
      didInitRef.current = true;
    }
  }, [questions, startId]);

  const currentQuestion = questions?.[currentIndex];
  // progress calculation
  const progress = questions ? ((currentIndex) / questions.length) * 100 : 0;

  const handleNext = (quality: number) => {
    if (!currentQuestion) return;

    submitReview.mutate({
      questionId: currentQuestion.id,
      quality,
    });

    setIsFlipped(false);
    if (currentIndex < (questions?.length || 0) - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      // Session finished naturally
      setLocation("/");
    }
  };

  // 이전 카드로 되돌아가기 (평가 없이, 정순/역순 모두 "방금 본 카드"로 이동)
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleQuitRequest = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    queryClient.invalidateQueries({ queryKey: [api.study.stats.path] });
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">All caught up! 🎉</h2>
        <p className="text-slate-500">You've reviewed all due cards for now.</p>
        <button onClick={() => setLocation('/')} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Header - Fixed at top */}
      <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-1.5">
          <button onClick={handleQuitRequest} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            title="이전 카드로 돌아가기"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>
        </div>
        <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-400">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Card Area - Scrollable */}
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        {/* Removed fixed aspect-ratio so card can grow tall if needed */}
        <div className="w-full max-w-2xl relative perspective-1000 my-auto">
          <AnimatePresence mode="wait">
            <Flashcard 
              key={currentQuestion.id}
              question={currentQuestion.question} 
              answer={currentQuestion.answer}
              translation={currentQuestion.translation}
              keywords={currentQuestion.keywords}
              onResult={handleNext}
            />
          </AnimatePresence>
        </div>
        
        {/* Bottom Stop Button - Added margin-bottom */}
        <button 
          onClick={handleQuitRequest}
          className="mt-12 mb-8 text-sm font-bold text-slate-300 hover:text-red-400 transition-colors shrink-0"
        >
          Stop Studying (Save & Quit)
        </button>
      </div>

      {/* Custom Modal UI Overlay */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Stop Session?</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    Your progress for completed cards has been saved. <br/>
                    Do you want to return to home?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <button 
                    onClick={() => setShowQuitConfirm(false)}
                    className="p-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Keep Studying
                  </button>
                  <button 
                    onClick={confirmQuit}
                    className="p-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
                  >
                    Quit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
