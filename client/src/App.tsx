import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import StudySession from "@/pages/StudySession";
import QuestionsList from "@/pages/QuestionsList";
import VocabularyList from "@/pages/VocabularyList";
import N400Practice from "@/pages/N400Practice";
import N400Vocabulary from "@/pages/N400Vocabulary";
import N400Interview from "@/pages/N400Interview";
import N400SentenceVocab from "@/pages/N400SentenceVocab";
import N400RestatePractice from "@/pages/N400RestatePractice";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/study" component={StudySession} />
      <Route path="/questions" component={QuestionsList} />
      <Route path="/vocabulary" component={VocabularyList} />
      <Route path="/n400" component={N400Practice} />
      <Route path="/n400-vocab" component={N400Vocabulary} />
      <Route path="/n400-interview" component={N400Interview} />
      <Route path="/n400-sentence-vocab" component={N400SentenceVocab} />
      <Route path="/n400-restate" component={N400RestatePractice} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
