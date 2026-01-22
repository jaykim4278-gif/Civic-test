import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Question } from "@shared/schema";
import { ArrowLeft, Volume2, Search } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";

interface Keyword {
  word: string;
  definition: string;
}

export default function VocabularyList() {
  const [search, setSearch] = useState("");
  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: [api.questions.list.path],
  });

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const vocabulary = useMemo(() => {
    if (!questions) return [];
    
    const vocabMap = new Map<string, string>();
    
    questions.forEach(q => {
      if (q.keywords) {
        try {
          const keywords: Keyword[] = JSON.parse(q.keywords);
          keywords.forEach(kw => {
            vocabMap.set(kw.word, kw.definition);
          });
        } catch (e) {
          console.error("Error parsing keywords", e);
        }
      }
    });

    return Array.from(vocabMap.entries())
      .map(([word, definition]) => ({ word, definition }))
      .sort((a, b) => a.word.localeCompare(b.word));
  }, [questions]);

  const filteredVocab = vocabulary.filter(v => 
    v.word.toLowerCase().includes(search.toLowerCase()) || 
    v.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <button className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <h1 className="text-2xl font-display font-bold">Vocabulary List</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search words or meanings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-muted/50 border-2 border-transparent rounded-2xl focus:border-primary/50 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredVocab.map((item, i) => (
              <div 
                key={i}
                className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-lg font-bold text-foreground block">{item.word}</span>
                  <span className="text-muted-foreground text-sm">{item.definition}</span>
                </div>
                <button
                  onClick={() => speak(item.word)}
                  className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all group-active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {filteredVocab.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No vocabulary words found.
              </div>
            )}
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
}
