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
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  const parsedKeywords = keywords ? JSON.parse(keywords) as { word: string, definition: string }[] : [];

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 flex flex-col items-center">
      {/* Card Container */}
      <div className="w-full cursor-pointer group" onClick={handleFlip}>
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full preserve-3d grid grid-cols-1"
        >
          {/* FRONT FACE */}
          <div className="col-start-1 row-start-1 backface-hidden relative bg-white rounded-3xl shadow-xl border-2 border-border/50 p-8 md:p-12 flex flex-col items-center text-center h-auto min-h-[420px]">
             {/* Top Row: Category badge & Speaker */}
             <div className="w-full flex justify-between items-start mb-8">
               <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Question</span>
               <button 
                 onClick={(e) => { e.stopPropagation(); speak(question); }} 
                 className="p-3 hover:bg-muted rounded-full transition-colors"
                 data-testid="button-speak-question"
               >
                 <Volume2 className="w-6 h-6 text-primary" />
               </button>
             </div>
             
             {/* Main Question - Centered */}
             <div className="flex-1 flex items-center justify-center w-full my-4">
               <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-800 leading-tight">{question}</h3>
             </div>

             {/* Bottom Hint */}
             <p className="mt-auto text-muted-foreground/60 text-sm font-semibold uppercase tracking-widest pt-8">Tap to see answer</p>
          </div>

          {/* BACK FACE */}
          <div 
            className="col-start-1 row-start-1 backface-hidden relative bg-slate-50 rounded-3xl shadow-xl border-2 border-primary/20 p-8 md:p-12 flex flex-col items-center text-center h-auto min-h-[420px]" 
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
             {/* Top Row: Answer badge & Speaker */}
             <div className="w-full flex justify-between items-start mb-8">
               <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Answer</span>
               <button 
                 onClick={(e) => { e.stopPropagation(); speak(answer); }} 
                 className="p-3 hover:bg-primary/10 rounded-full transition-colors"
                 data-testid="button-speak-answer"
               >
                 <Volume2 className="w-6 h-6 text-primary" />
               </button>
             </div>

             <div className="flex-1 w-full flex flex-col items-center justify-center">
               <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 leading-tight">
                 {answer}
               </p>
               
               {translation && (
                 <div className="mt-4 pb-4 w-full px-4">
                   <p className="text-xl text-slate-600 italic font-medium">
                     {translation}
                   </p>
                 </div>
               )}
             </div>

             {parsedKeywords.length > 0 && (
               <div className="mt-8 border-t border-slate-200 pt-6 w-full px-4">
                 <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-center gap-2">
                   <span className="w-4 h-px bg-slate-200"></span>
                   Core Vocabulary
                   <span className="w-4 h-px bg-slate-200"></span>
                 </h4>
                 <div className="flex flex-wrap justify-center gap-2">
                   {parsedKeywords.map((kw, i) => (
                     <div 
                       key={i}
                       className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-2 pl-4 pr-3 shadow-sm hover:border-primary/30 transition-colors"
                     >
                       <span className="font-bold text-sm text-slate-700">{kw.word}</span>
                       <span className="text-slate-500 text-xs font-medium">{kw.definition}</span>
                       <button
                         onClick={(e) => { e.stopPropagation(); speak(kw.word); }}
                         className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center text-primary/60 hover:text-primary transition-colors ml-1"
                         data-testid={`button-speak-kw-${i}`}
                       >
                         <Volume2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons (Pushed down naturally) */}
      <div className="mt-8 w-full max-w-md">
        <AnimatePresence mode="wait">
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-3 gap-4"
            >
              <button
                disabled={isSubmitting}
                onClick={(e) => { e.stopPropagation(); onResult(1); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 active:scale-95 transition-all duration-200 group shadow-sm"
                data-testid="button-hard"
              >
                <X className="w-7 h-7 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-wider">Hard</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={(e) => { e.stopPropagation(); onResult(3); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:bg-secondary/10 hover:text-secondary hover:border-secondary/20 active:scale-95 transition-all duration-200 group shadow-sm"
                data-testid="button-good"
              >
                <RotateCw className="w-7 h-7 mb-1 group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-wider">Good</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={(e) => { e.stopPropagation(); onResult(5); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/20 active:scale-95 transition-all duration-200 group shadow-sm"
                data-testid="button-easy"
              >
                <ThumbsUp className="w-7 h-7 mb-1 group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-wider">Easy</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
