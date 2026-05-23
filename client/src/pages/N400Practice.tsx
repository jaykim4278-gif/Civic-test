import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  Gavel,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import {
  N400_SECTIONS,
  OATH_INTRO,
  OATH_OPENING,
  OATH_CLAUSES,
  OATH_CLOSING,
  FULL_OATH_EN,
  type N400Item,
  type N400Section,
} from "@/data/n400_questions";

// Web Speech API helper
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

    // Toggle: if same key already playing, stop
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

    // Prefer a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          /(natural|neural|premium|enhanced|google|samantha|aaron)/i.test(v.name),
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
}: {
  text: string;
  itemKey: string;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
  size?: "sm" | "md" | "lg";
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
          ? "bg-emerald-500 text-white border-emerald-500 shadow-lg scale-110 animate-pulse"
          : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:scale-105 active:scale-95",
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

function NoteBadge({ note }: { note: string }) {
  const lower = note.toLowerCase();
  const isYes = lower.startsWith("yes");
  const isNo = lower.startsWith("no");
  const isConditional = note.includes("해당시");

  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider",
        isYes && "bg-emerald-50 text-emerald-700 border border-emerald-200",
        isNo && "bg-rose-50 text-rose-700 border border-rose-200",
        isConditional && "bg-amber-50 text-amber-700 border border-amber-200",
        !isYes &&
          !isNo &&
          !isConditional &&
          "bg-slate-100 text-slate-600 border border-slate-200",
      )}
    >
      {note}
    </span>
  );
}

function ItemCard({
  item,
  sectionId,
  speak,
  speakingKey,
}: {
  item: N400Item;
  sectionId: string;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
}) {
  const itemKey = `${sectionId}-${item.id}`;

  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm hover:border-emerald-100 transition-colors">
      {/* Header: ID + Note */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center justify-center min-w-[2.5rem] h-6 px-2 bg-slate-900 text-white rounded-md text-xs font-extrabold">
          {item.id}
        </span>
        {item.note && <NoteBadge note={item.note} />}
      </div>

      {/* English Question + Speaker */}
      <div className="flex items-start gap-3 mb-3">
        <p className="flex-1 text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
          {item.en}
        </p>
        <SpeakerButton
          text={item.en}
          itemKey={itemKey}
          speak={speak}
          speakingKey={speakingKey}
          size="md"
        />
      </div>

      {/* Korean Translation */}
      <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-slate-100 pl-3">
        → {item.ko}
      </p>

      {/* Sub-bullets (for 5.b) */}
      {item.bullets && item.bullets.length > 0 && (
        <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
          {item.bullets.map((bullet, idx) => {
            const bulletKey = `${itemKey}-bullet-${idx}`;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-3 flex items-start gap-3"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 bg-white border border-slate-200 rounded-full text-[10px] font-extrabold text-slate-600 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 leading-snug">
                    {bullet.en}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">→ {bullet.ko}</p>
                </div>
                <SpeakerButton
                  text={bullet.en}
                  itemKey={bulletKey}
                  speak={speak}
                  speakingKey={speakingKey}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  section,
  speak,
  speakingKey,
  isOpen,
  onToggle,
  search,
}: {
  section: N400Section;
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
        it.id.toLowerCase().includes(q) ||
        it.bullets?.some(
          (b) =>
            b.en.toLowerCase().includes(q) || b.ko.toLowerCase().includes(q),
        ),
    );
  }, [section.items, search]);

  if (search.trim() && filteredItems.length === 0) {
    return null;
  }

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
            <h2 className="text-lg md:text-xl font-bold text-slate-800 truncate">
              {section.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredItems.length} question
              {filteredItems.length !== 1 ? "s" : ""}
              {search.trim() &&
                filteredItems.length !== section.items.length &&
                ` (filtered from ${section.items.length})`}
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
          {/* Intro (for section D) */}
          {section.intro && (
            <div className="mb-4 bg-amber-50 border-2 border-amber-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100 px-2 py-1 rounded-md">
                  공통 도입문
                </span>
                <SpeakerButton
                  text={section.intro.en}
                  itemKey={`${section.id}-intro`}
                  speak={speak}
                  speakingKey={speakingKey}
                  size="sm"
                />
              </div>
              <p className="mt-3 font-semibold text-slate-800 leading-relaxed">
                {section.intro.en}
              </p>
              <p className="text-sm text-slate-600 mt-2 italic">
                → {section.intro.ko}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                sectionId={section.id}
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

function OathSection({
  speak,
  speakingKey,
}: {
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-2 border-slate-700 shadow-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
            <Gavel className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
              N-400 Part 16
            </p>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Oath of Allegiance · 충성 선서
            </h2>
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
          transition={{ duration: 0.2 }}
          className="px-4 md:px-6 pb-6 space-y-4"
        >
          {/* Read entire oath button */}
          <button
            onClick={() => speak(FULL_OATH_EN, "oath-full")}
            className={cn(
              "w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-bold transition-all",
              speakingKey === "oath-full"
                ? "bg-amber-500 text-slate-900 shadow-lg"
                : "bg-amber-500/10 text-amber-400 border-2 border-amber-500/30 hover:bg-amber-500/20",
            )}
          >
            {speakingKey === "oath-full" ? (
              <>
                <Pause className="w-5 h-5" />
                선서문 전체 듣기 중...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                선서문 전체 듣기 (Read entire Oath)
              </>
            )}
          </button>

          {/* Intro */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                도입 안내
              </span>
              <SpeakerButton
                text={OATH_INTRO.en}
                itemKey="oath-intro"
                speak={speak}
                speakingKey={speakingKey}
                size="sm"
              />
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {OATH_INTRO.en}
            </p>
            <p className="text-xs text-slate-400 mt-2 italic">
              → {OATH_INTRO.ko}
            </p>
          </div>

          {/* Opening */}
          <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                도입
              </span>
              <div className="flex-1" />
              <SpeakerButton
                text={OATH_OPENING.en}
                itemKey="oath-opening"
                speak={speak}
                speakingKey={speakingKey}
                size="sm"
              />
            </div>
            <p className="text-lg font-bold text-white italic leading-relaxed">
              "{OATH_OPENING.en}"
            </p>
            <p className="text-sm text-slate-300 mt-2">→ {OATH_OPENING.ko}</p>
          </div>

          {/* Clauses */}
          {OATH_CLAUSES.map((clause) => {
            const key = `oath-clause-${clause.id}`;
            return (
              <div
                key={clause.id}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center text-xs font-extrabold">
                      {clause.id}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {clause.label}
                    </span>
                  </div>
                  <SpeakerButton
                    text={clause.en}
                    itemKey={key}
                    speak={speak}
                    speakingKey={speakingKey}
                    size="sm"
                  />
                </div>
                <p className="text-sm text-white leading-relaxed font-medium italic">
                  {clause.en}
                </p>
                <p className="text-xs text-slate-400 mt-2">→ {clause.ko}</p>
              </div>
            );
          })}

          {/* Closing */}
          <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                마무리
              </span>
              <div className="flex-1" />
              <SpeakerButton
                text={OATH_CLOSING.en}
                itemKey="oath-closing"
                speak={speak}
                speakingKey={speakingKey}
                size="sm"
              />
            </div>
            <p className="text-lg font-bold text-white italic">
              "{OATH_CLOSING.en}"
            </p>
            <p className="text-sm text-slate-300 mt-2">→ {OATH_CLOSING.ko}</p>
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default function N400Practice() {
  const { speak, stop, speakingKey } = useSpeak();
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["A"]), // Section A open by default
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAll = () => {
    setOpenSections(new Set(N400_SECTIONS.map((s) => s.id)));
  };

  const closeAll = () => {
    setOpenSections(new Set());
  };

  // Auto-open sections that have search matches
  useEffect(() => {
    if (!search.trim()) return;
    const q = search.toLowerCase();
    const matchingIds = N400_SECTIONS.filter((s) =>
      s.items.some(
        (it) =>
          it.en.toLowerCase().includes(q) ||
          it.ko.toLowerCase().includes(q) ||
          it.id.toLowerCase().includes(q),
      ),
    ).map((s) => s.id);
    setOpenSections(new Set(matchingIds));
  }, [search]);

  const totalQuestions = N400_SECTIONS.reduce(
    (sum, s) => sum + s.items.length,
    0,
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
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                  N-400 면접 듣기
                </h1>
                <p className="text-xs text-slate-500">
                  Listen & Practice · {totalQuestions} questions
                </p>
              </div>
            </div>
            {speakingKey && (
              <button
                onClick={stop}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors"
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
              placeholder="Search English or Korean..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2">
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
            <p className="text-[10px] text-slate-400 hidden sm:block">
              스피커 버튼을 누르면 영어로 읽어드립니다
            </p>
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {N400_SECTIONS.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            speak={speak}
            speakingKey={speakingKey}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            search={search}
          />
        ))}

        {/* Oath of Allegiance */}
        {!search.trim() && (
          <OathSection speak={speak} speakingKey={speakingKey} />
        )}

        {/* Empty state */}
        {search.trim() &&
          N400_SECTIONS.every((s) =>
            s.items.every(
              (it) =>
                !it.en.toLowerCase().includes(search.toLowerCase()) &&
                !it.ko.toLowerCase().includes(search.toLowerCase()) &&
                !it.id.toLowerCase().includes(search.toLowerCase()),
            ),
          ) && (
            <div className="text-center py-16">
              <p className="text-slate-500 font-medium">
                "{search}"에 해당하는 질문을 찾을 수 없습니다.
              </p>
            </div>
          )}
      </main>

      <Navigation />
    </div>
  );
}
