import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  Play,
  Pause,
  MessagesSquare,
  Lightbulb,
  UserRound,
  Stamp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import {
  N400_INTERVIEW_SCENES,
  TOTAL_INTERVIEW_LINES,
  INTERVIEW_TIP,
  type InterviewLine,
  type InterviewScene,
} from "@/data/n400_interview_script";

// 플랫폼별(Windows/Edge/Chrome/macOS) 알려진 여성 영어 음성 이름.
const FEMALE_VOICE_NAMES = [
  // Microsoft "Online (Natural)" — 사람과 가장 비슷, Edge 제공 (en-US 우선)
  "jenny", "aria", "michelle", "ana", "emma", "sonia", "libby", "natasha", "clara", "luna",
  // Apple / 기타 플랫폼
  "samantha", "victoria", "susan", "allison", "ava", "zoe", "serena", "karen", "moira", "tessa", "fiona", "kate",
  // Windows 로컬 음성
  "zira", "hazel", "catherine", "heera", "linda",
];
const MALE_VOICE_NAMES =
  /(david|mark|guy|eric|christopher|james|ryan|george|daniel|alex|fred|tom|paul|aaron|brian|matthew|justin|joey|william|liam|oliver)/i;

// 가장 자연스러운 미국식 여성 영어 음성을 점수로 선택.
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
    if (lang === "en-us") s += 200; // 미국식 최우선 (미국 심사관 억양)
    else if (/^en-(gb|au|in|ie|nz|za|ca|sg|hk|ph)/.test(lang)) s -= 300; // 비미국 영어 배제
    if (/(natural|neural|online|premium|enhanced)/.test(n)) s += 100; // 사람 같은 억양
    if (/female|woman/.test(n)) s += 60;
    const idx = FEMALE_VOICE_NAMES.findIndex((name) => n.includes(name));
    if (idx >= 0) s += 80 - idx; // 알려진 여성 이름, 앞쪽일수록 우선
    if (n.includes("google") && lang === "en-us") s += 60; // Chrome 기본(여성, 자연스러움)
    if (v.localService === false) s += 10; // 온라인 음성이 보통 더 자연스러움
    if (MALE_VOICE_NAMES.test(n)) s -= 150; // 남성 음성은 절대 선택 안 함
    return s;
  };

  return [...pool].sort((a, b) => score(b) - score(a))[0] || null;
}

// ── Web Speech API: 여성 음성 + 심사관 같은 발화 + 순차 재생 ────────────────
function useSpeak() {
  // speakingKey = the line-key currently being read (single OR within a sequence)
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  // sequenceKey = the scene whose "전체 대화 듣기" is currently running
  const [sequenceKey, setSequenceKey] = useState<string | null>(null);
  // slow = 학습용 느린 속도 / false = 실전(심사관) 속도
  const [slow, setSlow] = useState(false);
  // run-token: every new playback increments it; in-flight loops bail when stale
  const tokenRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const slowRef = useRef(false);

  useEffect(() => {
    slowRef.current = slow;
  }, [slow]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    // 음성 목록은 비동기 로드(특히 Edge 자연 음성) → 변경 시 다시 선택.
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
    // 심사관처럼: 또렷하고 차분하게, 음성 고유의 자연스러운 억양 유지.
    u.rate = slowRef.current ? 0.72 : 0.92;
    u.pitch = 1;
    return u;
  };

  const stop = () => {
    tokenRef.current++; // invalidate any running loop
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingKey(null);
    setSequenceKey(null);
  };

  // Play a single English line (toggle off if it's the one playing)
  const speak = (text: string, key: string) => {
    if (!window.speechSynthesis) {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }
    if (speakingKey === key && !sequenceKey) {
      stop();
      return;
    }
    const myToken = ++tokenRef.current;
    window.speechSynthesis.cancel();
    setSequenceKey(null);
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

  // Play a whole scene: [{text, key}, ...] read in order (Q → A → Q → A …)
  const speakSequence = (
    items: { text: string; key: string }[],
    seqKey: string,
  ) => {
    if (!window.speechSynthesis) {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }
    if (sequenceKey === seqKey) {
      stop();
      return;
    }
    const myToken = ++tokenRef.current;
    window.speechSynthesis.cancel();
    setSequenceKey(seqKey);

    let i = 0;
    const next = () => {
      if (tokenRef.current !== myToken || i >= items.length) {
        if (tokenRef.current === myToken) {
          setSequenceKey(null);
          setSpeakingKey(null);
        }
        return;
      }
      const item = items[i];
      setSpeakingKey(item.key);
      const u = makeUtterance(item.text);
      u.onend = () => {
        i++;
        next();
      };
      u.onerror = () => {
        i++;
        next();
      };
      window.speechSynthesis.speak(u);
    };
    next();
  };

  return { speak, speakSequence, stop, speakingKey, sequenceKey, slow, setSlow };
}

// ── Speaker button ─────────────────────────────────────────────────────────
function SpeakerButton({
  text,
  itemKey,
  speak,
  speakingKey,
  size = "md",
  variant = "slate",
}: {
  text: string;
  itemKey: string;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "slate" | "emerald";
}) {
  const isActive = speakingKey === itemKey;
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" }[size];
  const iconSize = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size];

  const colors =
    variant === "emerald"
      ? {
          active: "bg-emerald-500 text-white border-emerald-500",
          idle: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
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

// ── One Q&A exchange (officer bubble + applicant bubble) ───────────────────
function ExchangeBubbles({
  line,
  sceneId,
  index,
  speak,
  speakingKey,
}: {
  line: InterviewLine;
  sceneId: string;
  index: number;
  speak: (text: string, key: string) => void;
  speakingKey: string | null;
}) {
  const qKey = `${sceneId}-${index}-q`;
  const aKey = `${sceneId}-${index}-a`;
  const qActive = speakingKey === qKey;
  const aActive = speakingKey === aKey;

  return (
    <div className="space-y-2">
      {/* Officer question — left */}
      <div className="flex items-end gap-2 max-w-[92%]">
        <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Stamp className="w-4 h-4" />
        </div>
        <div
          className={cn(
            "flex-1 bg-white border-2 rounded-2xl rounded-bl-md p-3.5 shadow-sm transition-all",
            qActive ? "border-slate-400 ring-2 ring-slate-200" : "border-slate-100",
          )}
        >
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            심사관 · Officer
          </p>
          <div className="flex items-start gap-2">
            <p className="flex-1 text-base font-semibold text-slate-800 leading-relaxed">
              {line.q_en}
            </p>
            <SpeakerButton
              text={line.q_en}
              itemKey={qKey}
              speak={speak}
              speakingKey={speakingKey}
              size="sm"
              variant="slate"
            />
          </div>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            {line.q_ko}
          </p>
        </div>
      </div>

      {/* Applicant answer — right */}
      <div className="flex items-end gap-2 max-w-[92%] ml-auto flex-row-reverse">
        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <UserRound className="w-4 h-4" />
        </div>
        <div
          className={cn(
            "flex-1 bg-emerald-50 border-2 rounded-2xl rounded-br-md p-3.5 shadow-sm transition-all",
            aActive
              ? "border-emerald-400 ring-2 ring-emerald-200"
              : "border-emerald-100",
          )}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">
              나 · You
            </p>
            {line.personal && (
              <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                내 정보로 변경
              </span>
            )}
          </div>
          <div className="flex items-start gap-2">
            <p className="flex-1 text-base font-bold text-emerald-900 leading-relaxed">
              {line.a_en}
            </p>
            <SpeakerButton
              text={line.a_en}
              itemKey={aKey}
              speak={speak}
              speakingKey={speakingKey}
              size="sm"
              variant="emerald"
            />
          </div>
          <p className="text-sm text-emerald-700/80 mt-1.5 leading-relaxed">
            {line.a_ko}
          </p>
          {line.alt && (
            <p className="text-xs text-slate-500 mt-2 bg-white/60 border border-emerald-100 rounded-lg px-2 py-1.5 leading-relaxed">
              🔁 {line.alt}
            </p>
          )}
        </div>
      </div>

      {/* Tip */}
      {line.tip && (
        <div className="ml-11 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 max-w-[88%]">
          <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{line.tip}</span>
        </div>
      )}
    </div>
  );
}

// ── A scene (collapsible) with "play whole conversation" ───────────────────
function SceneCard({
  scene,
  speak,
  speakSequence,
  speakingKey,
  sequenceKey,
  isOpen,
  onToggle,
  search,
}: {
  scene: InterviewScene;
  speak: (text: string, key: string) => void;
  speakSequence: (items: { text: string; key: string }[], seqKey: string) => void;
  speakingKey: string | null;
  sequenceKey: string | null;
  isOpen: boolean;
  onToggle: () => void;
  search: string;
}) {
  const filteredLines = useMemo(() => {
    if (!search.trim()) return scene.lines.map((l, i) => ({ line: l, i }));
    const q = search.toLowerCase();
    return scene.lines
      .map((l, i) => ({ line: l, i }))
      .filter(
        ({ line }) =>
          line.q_en.toLowerCase().includes(q) ||
          line.q_ko.toLowerCase().includes(q) ||
          line.a_en.toLowerCase().includes(q) ||
          line.a_ko.toLowerCase().includes(q),
      );
  }, [scene.lines, search]);

  if (search.trim() && filteredLines.length === 0) return null;

  const seqKey = `scene-${scene.id}`;
  const isPlaying = sequenceKey === seqKey;

  // Build the play queue (Q → A → Q → A …) for the visible lines
  const queue = filteredLines.flatMap(({ line, i }) => [
    { text: line.q_en, key: `${scene.id}-${i}-q` },
    { text: line.a_en, key: `${scene.id}-${i}-a` },
  ]);

  return (
    <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 md:p-5 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md">
            {scene.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-lg font-bold text-slate-800 truncate">
              {scene.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {scene.subtitle} · {filteredLines.length}문답
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
          className="px-3 md:px-5 pb-5"
        >
          {/* Play whole conversation */}
          <button
            onClick={() => speakSequence(queue, seqKey)}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-sm mb-4 transition-all border-2",
              isPlaying
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300",
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> 재생 중지
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> 전체 대화 듣기 (질문 → 답변)
              </>
            )}
          </button>

          <div className="space-y-4">
            {filteredLines.map(({ line, i }) => (
              <div key={i} className="space-y-4">
                {line.group && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] font-extrabold text-slate-400 tracking-wide text-center">
                      {line.group}
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                )}
                <ExchangeBubbles
                  line={line}
                  sceneId={scene.id}
                  index={i}
                  speak={speak}
                  speakingKey={speakingKey}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function N400Interview() {
  const { speak, speakSequence, stop, speakingKey, sequenceKey, slow, setSlow } =
    useSpeak();
  const [search, setSearch] = useState("");
  const [openScenes, setOpenScenes] = useState<Set<string>>(new Set(["1"]));

  const toggleScene = (id: string) => {
    setOpenScenes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAll = () =>
    setOpenScenes(new Set(N400_INTERVIEW_SCENES.map((s) => s.id)));
  const closeAll = () => setOpenScenes(new Set());

  // Auto-open scenes that match the search
  useEffect(() => {
    if (!search.trim()) return;
    const q = search.toLowerCase();
    const ids = N400_INTERVIEW_SCENES.filter((s) =>
      s.lines.some(
        (l) =>
          l.q_en.toLowerCase().includes(q) ||
          l.q_ko.toLowerCase().includes(q) ||
          l.a_en.toLowerCase().includes(q) ||
          l.a_ko.toLowerCase().includes(q),
      ),
    ).map((s) => s.id);
    setOpenScenes(new Set(ids));
  }, [search]);

  const noResults =
    search.trim() &&
    N400_INTERVIEW_SCENES.every((s) =>
      s.lines.every(
        (l) =>
          !l.q_en.toLowerCase().includes(search.toLowerCase()) &&
          !l.q_ko.toLowerCase().includes(search.toLowerCase()) &&
          !l.a_en.toLowerCase().includes(search.toLowerCase()) &&
          !l.a_ko.toLowerCase().includes(search.toLowerCase()),
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
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <MessagesSquare className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                    N-400 모의 면접 대화
                  </h1>
                  <p className="text-xs text-slate-500">
                    Mock Interview · {TOTAL_INTERVIEW_LINES} exchanges
                  </p>
                </div>
              </div>
            </div>
            {(speakingKey || sequenceKey) && (
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
              placeholder="질문·답변 검색 (영어/한글)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openAll}
              className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              모두 펼치기
            </button>
            <button
              onClick={closeAll}
              className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              모두 접기
            </button>
            <div className="flex-1" />
            <span className="text-[10px] font-bold text-slate-400 hidden sm:flex items-center gap-1 mr-1">
              <Volume2 className="w-3 h-3 text-indigo-500" /> 여성 음성
            </span>
            {/* 속도: 실전(심사관) / 천천히(학습) */}
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setSlow(false)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-colors",
                  !slow
                    ? "bg-white text-indigo-600 shadow-sm"
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
                    ? "bg-white text-indigo-600 shadow-sm"
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
        {/* Tip card */}
        {!search.trim() && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest mb-1">
                연습 방법
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {INTERVIEW_TIP}
              </p>
            </div>
          </div>
        )}

        {N400_INTERVIEW_SCENES.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            speak={speak}
            speakSequence={speakSequence}
            speakingKey={speakingKey}
            sequenceKey={sequenceKey}
            isOpen={openScenes.has(scene.id)}
            onToggle={() => toggleScene(scene.id)}
            search={search}
          />
        ))}

        {noResults && (
          <div className="text-center py-16">
            <p className="text-slate-500 font-medium">
              "{search}"에 해당하는 대화를 찾을 수 없습니다.
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
