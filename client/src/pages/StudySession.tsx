import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useStudySession, useSubmitReview } from "@/hooks/use-study";
import { Flashcard } from "@/components/Flashcard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";

export default function StudySession() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  const mode = params.get("mode") || undefined;
  // Parse startId safely
  const rawStartId = params.get("startId");
  const startId = rawStartId ? parseInt(rawStartId) : undefined;

  const { data: sessionItems, isLoading, error } = useStudySession({ mode, startId });
  const { mutate: submitReview, isPending: isSubmitting } = useSubmitReview();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const isFinished = sessionItems && currentIndex >= sessionItems.length;

  const handleResult = (quality: number) => {
    if (!sessionItems) return;
    const currentItem = sessionItems[currentIndex];
    setCompletedCount(prev => prev + 1);
    setCurrentIndex(prev => prev + 1);
    submitReview({ questionId: currentItem.id, quality });
  };

  const handleQuit = () => {
    if (window.confirm("Do you want to save progress and quit?")) {
      setLocation("/");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error loading session</div>;

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border-2 border-primary/10">
          <h2 className="text-3xl font-bold text-primary mb-4">Session Complete! 🎉</h2>
          <p className="text-muted-foreground mb-8">You reviewed {completedCount} cards.</p>
          <div className="space-y-3">
            <Button className="w-full h-12" onClick={() => window.location.reload()}>Restart Session</Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setLocation("/")}>Back to Home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentCard = sessionItems![currentIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <header className="px-4 py-4 flex items-center gap-4 max-w-4xl mx-auto w-full z-10">
        <button onClick={handleQuit} className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-full"><X className="w-6 h-6" /></button>
        <ProgressBar current={currentIndex + 1} total={sessionItems!.length} className="flex-1" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <Flashcard
              question={currentCard.question}
              answer={currentCard.answer}
              translation={currentCard.translation}
              keywords={currentCard.keywords}
              onResult={handleResult}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </AnimatePresence>
        
        <Button variant="ghost" onClick={handleQuit} className="mt-8 text-slate-400 hover:text-destructive">
          Stop Studying (Save & Quit)
        </Button>
      </main>
    </div>
  );
}