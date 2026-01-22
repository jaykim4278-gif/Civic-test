import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCw, ThumbsUp, HelpCircle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  question: string;
  answer: string;
  translation?: string | null;
  keywords?: string | null;
  onResult: (quality: number) => void;
  isSubmitting?: boolean;
}

export function Flashcard({ 
  question, 
  answer, 
  translation, 
  keywords,
  onResult, 
  isSubmitting = false 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  };

  const parsedKeywords = keywords ? JSON.parse(keywords) as { word: string, definition: string }[] : [];

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 flex flex-col items-center">
      {/* 3D CARD CONTAINER 
        Uses Grid Stacking (col-1 row-1) so the card grows to the tallest face 
      */}
      <div className="w-full cursor-pointer group" onClick={handleFlip}>
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-full grid grid-cols-1 transition-all duration-500"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ================= FRONT FACE ================= */}
          <div 
            className="col-start-1 row-start-1 bg-white rounded-[2rem] shadow-xl border-2 border-slate-100 p-8 md:p-12 flex flex-col items-center text-center h-auto min-h-[420px] relative z-10"
            style={{ backfaceVisibility: "hidden" }} 
          >
            {/* Header: Badge & Speaker */}
            <div className="w-full flex justify-between items-start mb-6">
              <span className="bg-blue-50 text-blue-600 text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                Question
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); speak(question); }}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-600 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            <div className="flex-1 flex items-center justify-center w-full my-4">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-800 leading-tight">
                {question}
              </h3>
            </div>

            {/* Footer Hint */}
            <div className="mt-auto pt-8 flex flex-col items-center gap-2 opacity-60">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tap card to flip</span>
              <div className="w-12 h-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div 
            className="col-start-1 row-start-1 bg-slate-900 rounded-[2rem] shadow-xl border-2 border-slate-800 p-8 md:p-12 flex flex-col items-center text-center h-auto min-h-[420px] relative z-10"
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)" 
            }}
          >
            {/* Header: Badge & Speaker */}
            <div className="w-full flex justify-between items-start mb-6">
              <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                Answer
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); speak(answer); }}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Answer Text */}
            <div className="w-full mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
                {answer}
              </h3>
              {translation && (
                <p className="text-lg text-slate-400 font-medium italic">
                  {translation}
                </p>
              )}
            </div>

            {/* Vocabulary Section (if exists) */}
            {parsedKeywords.length > 0 && (
              <div className="w-full mt-auto border-t border-white/10 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center justify-center gap-2">
                  <span className="w-8 h-px bg-white/10"></span>
                  Key Vocabulary
                  <span className="w-8 h-px bg-white/10"></span>
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {parsedKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); speak(kw.word); }}
                      className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-2 pl-3 pr-2 transition-all"
                    >
                      <span className="font-bold text-sm text-emerald-400">{kw.word}</span>
                      <span className="text-slate-400 text-xs">{kw.definition}</span>
                      <Volume2 className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      {/* Moved outside the card to prevent overlap. Only visible when flipped. */}
      <div className="w-full max-w-md mt-8 h-24">
        <AnimatePresence mode="wait">
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-3 gap-4"
            >
              <button
                disabled={isSubmitting}
                onClick={(e) => { e.stopPropagation(); onResult(1); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-100 hover:border-rose-200 hover:scale-105 active:scale-95 transition-all"
              >
                <X className="w-6 h-6 mb-1 stroke-[3px]" />
                <span className="font-extrabold text-xs tracking-wider">HARD</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={(e) => { e.stopPropagation(); onResult(3); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 text-blue-600 border-2 border-blue-100 hover:bg-blue-100 hover:border-blue-200 hover:scale-105 active:scale-95 transition-all"
              >
                <RotateCw className="w-6 h-6 mb-1 stroke-[3px]" />
                <span className="font-extrabold text-xs tracking-wider">GOOD</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={(e) => { e.stopPropagation(); onResult(5); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 hover:scale-105 active:scale-95 transition-all"
              >
                <ThumbsUp className="w-6 h-6 mb-1 stroke-[3px]" />
                <span className="font-extrabold text-xs tracking-wider">EASY</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
