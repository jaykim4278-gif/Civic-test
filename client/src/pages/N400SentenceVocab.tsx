import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  Lightbulb,
  Highlighter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import {
  N400_SENTENCE_VOCAB,
  TOTAL_SENTENCE_CARDS,
  TOTAL_SENTENCE_WORDS,
  SENTENCE_VOCAB_TIP,
  type SentenceVocabWord,
  type SentenceVocabCard,
  type SentenceVocabSection,
} from "@/data/n400_sentence_vocab";

// ── Female English voice picker (shared logic with the interview page) ──────
const FEMALE_VOICE_NAMES = [
  "jenny", "aria", "michelle", "ana", "emma", "sonia", "libby", "natasha", "clara", "luna",
  "samantha", "victoria", "susan", "allison", "ava", "zoe", "serena", "karen", "moira", "tessa", "fiona", "kate",
  "zira", "hazel", "catherine", "heera", "linda",
];
const MALE_VOICE_NAMES =
  /(david|mark|guy|eric|christopher|james|ryan|george|daniel|alex|fred|tom|paul|aaron|brian|matthew|justin|joey|william|liam|oliver)/i;

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // 미국 영어(en-US)만 우선 — 영국/호주 발음 배제. 없으면 일반 영어, 그것도 없으면 전체.
  const enUS = voices.filter((v) => (v.lang || "").toLowerCase() === "en-us");
  const en = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
  const pool = enUS.length ? enUS : en.length ? en : voices;
  const score = (v: SpeechSynthesisVoice) => {
    const n = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase();
    let s = 0;
    if (lang === "en-us") s += 200; // 미국식 최우선
    else if (/^en-(gb|au|in|ie|nz|za|ca|sg|hk|ph)/.test(lang)) s -= 300; // 비미국 영어 배제
    if (/(natural|neural|online|premium|enhanced)/.test(n)) s += 100;
    if (/female|woman/.test(n)) s += 60;
    const idx = FEMALE_VOICE_NAMES.findIndex((name) => n.includes(name));
    if (idx >= 0) s += 80 - idx;
    if (n.includes("google") && lang === "en-us") s += 60;
    if (v.localService === false) s += 10;
    if (MALE_VOICE_NAMES.test(n)) s -= 150;
    return s;
  };
  return [...pool].sort((a, b) => score(b) - score(a))[0] || null;
}

function useSpeak() {
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const tokenRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const slowRef = useRef(false);

  useEffect(() => {
    slowRef.current = slow;
  }, [slow]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const refresh = () => {
      voiceRef.current = pickFemaleVoice();
    };
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
      window.speechSynthesis.cancel();
    };
  }, []);

  const makeUtterance = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = voiceRef.current || pickFemaleVoice();
    if (v) u.voice = v;
    u.lang = "en-US"; // 항상 미국 영어로 발음
    u.rate = slowRef.current ? 0.72 : 0.9;
    u.pitch = 1;
    return u;
  };

  const stop = () => {
    tokenRef.current++;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingKey(null);
  };

  const speak = (text: string, key: string) => {
    if (!window.speechSynthesis) {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }
    if (speakingKey === key) {
      stop();
      return;
    }
    const myToken = ++tokenRef.current;
    window.speechSynthesis.cancel();
    const u = makeUtterance(text);
    u.onend = () => {
      if (tokenRef.current === myToken) setSpeakingKey(null);
    };
    u.onerror = () => {
      if (tokenRef.current === myToken) setSpeakingKey(null);
    };
    window.speechSynthesis.speak(u);
    setSpeakingKey(key);
  };

  return { speak, stop, speakingKey, slow, setSlow };
}

// ── Speaker button ─────────────────────────────────────────────────────────
function SpeakerButton({
  text,
  itemKey,
  speak,
  speakingKey,
  size = "md",
  variant = "amber",
}: {
  text: string;
  itemKey: string;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "amber" | "slate";
}) {
  const isActive = speakingKey === itemKey;
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" }[size];
  const iconSize = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size];
  const colors =
    variant === "amber"
      ? {
          active: "bg-amber-500 text-white border-amber-500",
          idle: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
        }
      : {
          active: "bg-slate-700 text-white border-slate-700",
          idle: "bg-white text-slate-500 border-slate-200 hover:bg-slate-100",
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

// ── Highlight vocab words inside the sentence (appearance-order numbers) ─────
// Returns rendered nodes + a map (word-array-index -> highlight number).
// Words whose `match` isn't found stay unnumbered (shown as "관련어" in the panel).
function highlightInfo(en: string, words: SentenceVocabWord[]) {
  const lower = en.toLowerCase();
  const found = words
    .map((w, idx) => {
      const m = (w.match || w.word).toLowerCase();
      const start = lower.indexOf(m);
      return start === -1 ? null : { start, end: start + m.length, idx };
    })
    .filter((r): r is { start: number; end: number; idx: number } => r !== null)
    .sort((a, b) => a.start - b.start);

  // drop overlaps (keep the earlier match)
  const clean: { start: number; end: number; idx: number }[] = [];
  let lastEnd = -1;
  for (const r of found) {
    if (r.start >= lastEnd) {
      clean.push(r);
      lastEnd = r.end;
    }
  }

  // appearance-order number for each matched word index
  const numByIndex: Record<number, number> = {};
  clean.forEach((r, i) => {
    numByIndex[r.idx] = i + 1;
  });

  const nodes: ReactNode[] = [];
  let cursor = 0;
  clean.forEach((r, i) => {
    if (r.start > cursor) nodes.push(en.slice(cursor, r.start));
    nodes.push(
      <mark
        key={`m${i}`}
        className="bg-amber-200/80 text-amber-900 font-bold rounded px-1 mx-0.5 ring-1 ring-amber-300/70 whitespace-nowrap"
      >
        {en.slice(r.start, r.end)}
        <sup className="text-[9px] font-black text-amber-700 ml-0.5 align-super">
          {i + 1}
        </sup>
      </mark>,
    );
    cursor = r.end;
  });
  if (cursor < en.length) nodes.push(en.slice(cursor));

  return { nodes, numByIndex };
}

function AnswerBadge({ answer }: { answer: string }) {
  const isYes = answer === "Yes";
  const isNo = answer === "No";
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0",
        isYes && "bg-emerald-50 text-emerald-700 border border-emerald-200",
        isNo && "bg-rose-50 text-rose-700 border border-rose-200",
        !isYes && !isNo && "bg-amber-50 text-amber-700 border border-amber-200",
      )}
    >
      {answer}
    </span>
  );
}

// ── One sentence card ──────────────────────────────────────────────────────
function SentenceCard({
  card,
  sectionId,
  speak,
  speakingKey,
}: {
  card: SentenceVocabCard;
  sectionId: string;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
}) {
  const sentKey = `${sectionId}-${card.id}-sent`;
  const speakText = card.stem ? `${card.stem} ${card.en}` : card.en;
  const highlighted = highlightInfo(card.en, card.words);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
      {/* Sentence with highlighted words */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 bg-slate-900 text-white rounded-md text-xs font-extrabold">
            {card.id}
          </span>
          <div className="flex items-center gap-2">
            {card.answer && <AnswerBadge answer={card.answer} />}
            <SpeakerButton
              text={speakText}
              itemKey={sentKey}
              speak={speak}
              speakingKey={speakingKey}
              size="md"
              variant="amber"
            />
          </div>
        </div>

        {card.stem && (
          <p className="text-xs text-slate-500 mb-1.5 leading-relaxed">
            {card.stem}
          </p>
        )}
        <p className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
          {highlighted.nodes}
        </p>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed border-l-2 border-slate-100 pl-3">
          {card.ko}
        </p>
      </div>

      {/* Word meanings (numbered to match highlights) */}
      {card.words.length > 0 && (
        <div className="bg-amber-50/50 border-t border-amber-100 p-3 md:p-4 space-y-2">
        {card.words.map((w, idx) => {
          const wKey = `${sectionId}-${card.id}-w${idx}`;
          const num = highlighted.numByIndex[idx];
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 bg-white rounded-xl border border-amber-100 p-2.5"
            >
              <span
                className={cn(
                  "w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5",
                  num
                    ? "bg-amber-400 text-white"
                    : "bg-slate-200 text-slate-500",
                )}
              >
                {num ?? "•"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{w.word}</span>
                  <span className="text-sm font-bold text-amber-600">
                    {w.ko}
                  </span>
                  {!num && (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      관련어
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 italic mt-0.5">
                  "{w.explain}"
                </p>
              </div>
              <SpeakerButton
                text={w.word}
                itemKey={wKey}
                speak={speak}
                speakingKey={speakingKey}
                size="sm"
                variant="slate"
              />
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}

// ── Section (collapsible) ──────────────────────────────────────────────────
function Section({
  section,
  speak,
  speakingKey,
  isOpen,
  onToggle,
  search,
}: {
  section: SentenceVocabSection;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
  isOpen: boolean;
  onToggle: () => void;
  search: string;
}) {
  const filtered = useMemo(() => {
    if (!search.trim()) return section.cards;
    const q = search.toLowerCase();
    return section.cards.filter(
      (c) =>
        c.en.toLowerCase().includes(q) ||
        c.ko.toLowerCase().includes(q) ||
        c.words.some(
          (w) =>
            w.word.toLowerCase().includes(q) ||
            w.ko.toLowerCase().includes(q) ||
            w.explain.toLowerCase().includes(q),
        ),
    );
  }, [section.cards, search]);

  if (search.trim() && filtered.length === 0) return null;

  const wordCount = filtered.reduce((a, c) => a + c.words.length, 0);

  return (
    <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 md:p-5 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md">
            {section.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-lg font-bold text-slate-800 truncate">
              {section.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {section.subtitle} · 문장 {filtered.length} · 단어 {wordCount}
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
          transition={{ duration: 0.2 }}
          className="px-3 md:px-5 pb-5 space-y-3"
        >
          {filtered.map((card) => (
            <SentenceCard
              key={card.id}
              card={card}
              sectionId={section.id}
              speak={speak}
              speakingKey={speakingKey}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function N400SentenceVocab() {
  const { speak, stop, speakingKey, slow, setSlow } = useSpeak();
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["1-4"]),
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
    setOpenSections(new Set(N400_SENTENCE_VOCAB.map((s) => s.id)));
  const closeAll = () => setOpenSections(new Set());

  useEffect(() => {
    if (!search.trim()) return;
    const q = search.toLowerCase();
    const ids = N400_SENTENCE_VOCAB.filter((s) =>
      s.cards.some(
        (c) =>
          c.en.toLowerCase().includes(q) ||
          c.ko.toLowerCase().includes(q) ||
          c.words.some(
            (w) =>
              w.word.toLowerCase().includes(q) ||
              w.ko.toLowerCase().includes(q) ||
              w.explain.toLowerCase().includes(q),
          ),
      ),
    ).map((s) => s.id);
    setOpenSections(new Set(ids));
  }, [search]);

  const noResults =
    search.trim() &&
    N400_SENTENCE_VOCAB.every((s) =>
      s.cards.every(
        (c) =>
          !c.en.toLowerCase().includes(search.toLowerCase()) &&
          !c.ko.toLowerCase().includes(search.toLowerCase()) &&
          !c.words.some(
            (w) =>
              w.word.toLowerCase().includes(search.toLowerCase()) ||
              w.ko.toLowerCase().includes(search.toLowerCase()) ||
              w.explain.toLowerCase().includes(search.toLowerCase()),
          ),
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
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <Highlighter className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                    문장 속 단어
                  </h1>
                  <p className="text-xs text-slate-500">
                    Words in Context · 문장 {TOTAL_SENTENCE_CARDS} · 단어{" "}
                    {TOTAL_SENTENCE_WORDS}
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
              placeholder="문장·단어 검색 (영어/한글)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-2xl focus:border-amber-500 focus:bg-white outline-none font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openAll}
              className="text-xs font-bold text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              모두 펼치기
            </button>
            <button
              onClick={closeAll}
              className="text-xs font-bold text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              모두 접기
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setSlow(false)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-colors",
                  !slow
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                실전 속도
              </button>
              <button
                onClick={() => setSlow(true)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-colors",
                  slow
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                천천히
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
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
                {SENTENCE_VOCAB_TIP}
              </p>
            </div>
          </div>
        )}

        {N400_SENTENCE_VOCAB.map((section) => (
          <Section
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
              "{search}"에 해당하는 문장·단어를 찾을 수 없습니다.
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
