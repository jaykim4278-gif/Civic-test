import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  BookMarked,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import {
  N400_VOCAB_SECTIONS,
  N400_VOCAB_TIP,
  TOTAL_VOCAB_COUNT,
  type N400VocabItem,
  type N400VocabSection,
} from "@/data/n400_vocabulary";

function useSpeak() {
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string, key: string) => {
    if (!window.speechSynthesis) {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }

    if (speakingKey === key) {
      window.speechSynthesis.cancel();
      setSpeakingKey(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          /(natural|neural|premium|enhanced|google|samantha|aaron)/i.test(
            v.name,
          ),
      ) || voices.find((v) => v.lang === "en-US");
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setSpeakingKey(null);
    utterance.onerror = () => setSpeakingKey(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingKey(key);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingKey(null);
  };

  return { speak, stop, speakingKey };
}

function SpeakerButton({
  text,
  itemKey,
  speak,
  speakingKey,
  size = "md",
  variant = "emerald",
}: {
  text: string;
  itemKey: string;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "emerald" | "blue";
}) {
  const isActive = speakingKey === itemKey;
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const colors =
    variant === "emerald"
      ? {
          active: "bg-emerald-500 text-white border-emerald-500",
          idle: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
        }
      : {
          active: "bg-blue-500 text-white border-blue-500",
          idle: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
        };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak(text, itemKey);
      }}
      className={cn(
        "shrink-0 rounded-full flex items-center justify-center transition-all border-2",
        sizeClasses,
        isActive
          ? `${colors.active} shadow-lg scale-110 animate-pulse`
          : `${colors.idle} hover:scale-105 active:scale-95`,
      )}
      aria-label={isActive ? "Stop reading" : "Read aloud"}
    >
      {isActive ? (
        <VolumeX className={iconSize} />
      ) : (
        <Volume2 className={iconSize} />
      )}
    </button>
  );
}

function VocabCard({
  item,
  sectionId,
  index,
  speak,
  speakingKey,
}: {
  item: N400VocabItem;
  sectionId: string;
  index: number;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
}) {
  const wordKey = `${sectionId}-${index}-word`;
  const explainKey = `${sectionId}-${index}-explain`;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-emerald-200 transition-all overflow-hidden">
      {/* Top: English word + Korean translation + Speaker */}
      <div className="p-4 md:p-5 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 break-words">
              {item.en}
            </h3>
          </div>
          <p className="text-sm md:text-base font-bold text-emerald-600 mt-1">
            {item.ko}
          </p>
        </div>
        <SpeakerButton
          text={item.en}
          itemKey={wordKey}
          speak={speak}
          speakingKey={speakingKey}
          size="lg"
          variant="emerald"
        />
      </div>

      {/* Bottom: English explanation (sentence to memorize for "What does this mean?") */}
      <div className="bg-slate-50 border-t border-slate-100 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              "What does this mean?" answer
            </p>
            <p className="text-base text-slate-800 font-medium leading-relaxed italic">
              "{item.explanation}"
            </p>
            {item.note && (
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 inline-block">
                💡 {item.note}
              </p>
            )}
          </div>
          <SpeakerButton
            text={item.explanation}
            itemKey={explainKey}
            speak={speak}
            speakingKey={speakingKey}
            size="md"
            variant="blue"
          />
        </div>
      </div>
    </div>
  );
}

function VocabSection({
  section,
  speak,
  speakingKey,
  isOpen,
  onToggle,
  search,
}: {
  section: N400VocabSection;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
  isOpen: boolean;
  onToggle: () => void;
  search: string;
}) {
  const filteredItems = useMemo(() => {
    if (!search.trim()) return section.items;
    const q = search.toLowerCase();
    return section.items.filter(
      (it) =>
        it.en.toLowerCase().includes(q) ||
        it.ko.toLowerCase().includes(q) ||
        it.explanation.toLowerCase().includes(q),
    );
  }, [section.items, search]);

  if (search.trim() && filteredItems.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-display font-black text-xl shrink-0 shadow-md">
            {section.id}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-bold text-slate-800 truncate">
              {section.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredItems.length} word
              {filteredItems.length !== 1 ? "s" : ""}
              {search.trim() &&
                filteredItems.length !== section.items.length &&
                ` (of ${section.items.length})`}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-6 h-6 text-slate-400 transition-transform shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 md:px-6 pb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map((item, idx) => (
              <VocabCard
                key={`${section.id}-${idx}`}
                item={item}
                sectionId={section.id}
                index={idx}
                speak={speak}
                speakingKey={speakingKey}
              />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default function N400Vocabulary() {
  const { speak, stop, speakingKey } = useSpeak();
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["1"]),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAll = () =>
    setOpenSections(new Set(N400_VOCAB_SECTIONS.map((s) => s.id)));
  const closeAll = () => setOpenSections(new Set());

  // Auto-open sections that have search matches
  useEffect(() => {
    if (!search.trim()) return;
    const q = search.toLowerCase();
    const matchingIds = N400_VOCAB_SECTIONS.filter((s) =>
      s.items.some(
        (it) =>
          it.en.toLowerCase().includes(q) ||
          it.ko.toLowerCase().includes(q) ||
          it.explanation.toLowerCase().includes(q),
      ),
    ).map((s) => s.id);
    setOpenSections(new Set(matchingIds));
  }, [search]);

  const noResults =
    search.trim() &&
    N400_VOCAB_SECTIONS.every((s) =>
      s.items.every(
        (it) =>
          !it.en.toLowerCase().includes(search.toLowerCase()) &&
          !it.ko.toLowerCase().includes(search.toLowerCase()) &&
          !it.explanation.toLowerCase().includes(search.toLowerCase()),
      ),
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                    N-400 단어장
                  </h1>
                  <p className="text-xs text-slate-500">
                    Interview Vocabulary · {TOTAL_VOCAB_COUNT} words
                  </p>
                </div>
              </div>
            </div>
            {speakingKey && (
              <button
                onClick={stop}
                className="flex items-center gap-2 px-3 py-2 bg-rose-500 text-white rounded-xl font-bold text-xs hover:bg-rose-600 transition-colors"
              >
                <VolumeX className="w-4 h-4" />
                Stop
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search English, Korean, or meaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openAll}
              className="text-xs font-bold text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              모두 펼치기
            </button>
            <button
              onClick={closeAll}
              className="text-xs font-bold text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              모두 접기
            </button>
            <div className="flex-1" />
            <p className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-emerald-500" /> 단어
              <Volume2 className="w-3 h-3 text-blue-500 ml-1" /> 설명문
            </p>
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Tip card (only when not searching) */}
        {!search.trim() && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-extrabold text-amber-700 uppercase tracking-widest mb-1">
                연습 방법
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {N400_VOCAB_TIP}
              </p>
            </div>
          </div>
        )}

        {N400_VOCAB_SECTIONS.map((section) => (
          <VocabSection
            key={section.id}
            section={section}
            speak={speak}
            speakingKey={speakingKey}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            search={search}
          />
        ))}

        {noResults && (
          <div className="text-center py-16">
            <p className="text-slate-500 font-medium">
              "{search}"에 해당하는 단어를 찾을 수 없습니다.
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
