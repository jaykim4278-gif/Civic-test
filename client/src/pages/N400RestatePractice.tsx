// N-400 Part 9 — 재진술(Restate) 연습 페이지
// 오피서가 문항을 리퍼레이즈해서 물으면 → 듣고 → 취지를 한 줄로 다시 말하고 → 짧게 No/Yes로 답하는 연습.
// 3개 모드: 🎧 연습 / ⚡ 빠른 오피서 / 📚 둘러보기

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
  RotateCcw,
  Headphones,
  Zap,
  Ear,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Repeat,
  Eye,
  Shuffle,
  ArrowRight,
  BookOpen,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import {
  PART9_QUESTIONS,
  PART9_GROUPS,
  TOTAL_PART9_QUESTIONS,
  RESTATE_TIP,
  MOCK_NOTICE,
  type Part9Question,
  type RestatementTiers,
  type Rephrasing,
} from "@/data/n400_part9_restate";

// ── Female English voice picker (sentence_vocab 페이지와 동일 로직) ──────────
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

type Rate = "slow" | "normal" | "fast";
const RATE_VALUE: Record<Rate, number> = { slow: 0.72, normal: 0.95, fast: 1.2 };
const RATE_LABEL: Record<Rate, string> = { slow: "천천히", normal: "보통", fast: "빠르게" };

function useSpeak() {
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const tokenRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

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

  const makeUtterance = (text: string, rate: Rate) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = voiceRef.current || pickFemaleVoice();
    if (v) u.voice = v;
    u.lang = "en-US"; // 항상 미국 영어로 발음
    u.rate = RATE_VALUE[rate];
    u.pitch = 1;
    return u;
  };

  const stop = useCallback(() => {
    tokenRef.current++;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingKey(null);
  }, []);

  // 항상 처음부터 재생 (자동재생/다시듣기용)
  const play = useCallback((text: string, key: string, rate: Rate = "normal") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const myToken = ++tokenRef.current;
    window.speechSynthesis.cancel();
    const u = makeUtterance(text, rate);
    u.onend = () => {
      if (tokenRef.current === myToken) setSpeakingKey(null);
    };
    u.onerror = () => {
      if (tokenRef.current === myToken) setSpeakingKey(null);
    };
    window.speechSynthesis.speak(u);
    setSpeakingKey(key);
  }, []);

  // 토글 재생 (목록의 스피커 버튼용)
  const toggle = useCallback(
    (text: string, key: string, rate: Rate = "normal") => {
      if (!window.speechSynthesis) {
        alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
        return;
      }
      if (speakingKey === key) {
        stop();
        return;
      }
      play(text, key, rate);
    },
    [speakingKey, play, stop],
  );

  return { play, toggle, stop, speakingKey };
}

// ── 진도 (localStorage, 유저별 분리) ─────────────────────────────────────────
type Status = "known" | "review";

function progressStorageKey() {
  const uid =
    (typeof localStorage !== "undefined" && localStorage.getItem("civics_user_id")) ||
    "1";
  return `n400_restate_progress_${uid}`;
}
function loadProgress(): Record<string, Status> {
  try {
    return JSON.parse(localStorage.getItem(progressStorageKey()) || "{}");
  } catch {
    return {};
  }
}

function useProgress() {
  const [map, setMap] = useState<Record<string, Status>>(() => loadProgress());
  const write = (next: Record<string, Status>) => {
    try {
      localStorage.setItem(progressStorageKey(), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  const set = useCallback((id: string, status: Status) => {
    setMap((prev) => {
      const next = { ...prev, [id]: status };
      write(next);
      return next;
    });
  }, []);
  const clear = useCallback((id: string) => {
    setMap((prev) => {
      const next = { ...prev };
      delete next[id];
      write(next);
      return next;
    });
  }, []);
  const resetAll = useCallback(() => {
    setMap({});
    write({});
  }, []);
  return { map, set, clear, resetAll };
}

// ── 작은 UI 조각 ─────────────────────────────────────────────────────────────
function SpeakerButton({
  active,
  onClick,
  size = "md",
  variant = "violet",
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "violet" | "slate";
}) {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  }[size];
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-10 h-10",
  }[size];
  const colors =
    variant === "violet"
      ? {
          active: "bg-violet-500 text-white border-violet-500",
          idle: "bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100",
        }
      : {
          active: "bg-slate-700 text-white border-slate-700",
          idle: "bg-white text-slate-500 border-slate-200 hover:bg-slate-100",
        };
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full flex items-center justify-center transition-all border-2",
        sizeClasses,
        active
          ? `${colors.active} shadow-lg scale-105 animate-pulse`
          : `${colors.idle} hover:scale-105 active:scale-95`,
      )}
      aria-label={active ? "Stop" : "Play"}
    >
      {active ? <VolumeX className={iconSize} /> : <Volume2 className={iconSize} />}
    </button>
  );
}

function AnswerBadge({ answer, big = false }: { answer: string; big?: boolean }) {
  const style =
    answer === "Yes"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : answer === "No"
        ? "bg-rose-100 text-rose-700 border-rose-200"
        : "bg-amber-100 text-amber-700 border-amber-200";
  const label = answer === "해당시" ? "해당시 (Depends)" : answer;
  return (
    <span
      className={cn(
        "inline-flex items-center font-extrabold rounded-full border-2",
        big ? "text-2xl px-6 py-2" : "text-sm px-3 py-1",
        style,
      )}
    >
      {label}
    </span>
  );
}

function SpeedToggle({
  rate,
  setRate,
}: {
  rate: Rate;
  setRate: (r: Rate) => void;
}) {
  const order: Rate[] = ["slow", "normal", "fast"];
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      {order.map((r) => (
        <button
          key={r}
          onClick={() => setRate(r)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-bold transition-colors",
            rate === r
              ? "bg-white text-violet-600 shadow"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          {RATE_LABEL[r]}
        </button>
      ))}
    </div>
  );
}

// ── 상황별 3단 재진술 뷰 (short 기본 / medium 더 물으면 / long 참고용) ───────
function RestatementTiersView({
  tiers,
  idPrefix,
  sp,
  rate = "normal",
}: {
  tiers: RestatementTiers;
  idPrefix: string;
  sp: ReturnType<typeof useSpeak>;
  rate?: Rate;
}) {
  const [showLong, setShowLong] = useState(false);
  return (
    <div className="space-y-2">
      {/* short — 기본 (오피서가 이해 확인만 할 때) */}
      <div className="rounded-2xl bg-violet-50 border-2 border-violet-200 p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-500">
            <MessageSquare className="w-3.5 h-3.5" /> 기본 · 한 줄로 (이걸 말하세요)
          </span>
          <SpeakerButton
            active={sp.speakingKey === `${idPrefix}-s`}
            onClick={() => sp.toggle(tiers.short.en, `${idPrefix}-s`, rate)}
            size="sm"
          />
        </div>
        <p className="text-violet-900 font-bold text-lg leading-snug">{tiers.short.en}</p>
        <p className="text-sm text-violet-600/80 mt-1">{tiers.short.ko}</p>
      </div>

      {/* medium — 오피서가 "Anything else? / Can you say more?"로 더 물을 때 */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            <Repeat className="w-3.5 h-3.5" /> 더 물으면 (Anything else?)
          </span>
          <SpeakerButton
            active={sp.speakingKey === `${idPrefix}-m`}
            onClick={() => sp.toggle(tiers.medium.en, `${idPrefix}-m`, rate)}
            size="sm"
            variant="slate"
          />
        </div>
        <p className="text-slate-700 font-semibold leading-snug">{tiers.medium.en}</p>
        <p className="text-sm text-slate-400 mt-0.5">{tiers.medium.ko}</p>
      </div>

      {/* long — 완전판 (참고용, 외울 필요 없음) */}
      <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
        <button
          onClick={() => setShowLong((v) => !v)}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 text-left"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            완전한 의미 · 참고용
          </span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
            외울 필요 없음
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 ml-auto text-slate-300 transition-transform",
              showLong && "rotate-180",
            )}
          />
        </button>
        {showLong && (
          <div className="px-3.5 pb-3.5 flex items-start gap-2">
            <SpeakerButton
              active={sp.speakingKey === `${idPrefix}-l`}
              onClick={() => sp.toggle(tiers.long.en, `${idPrefix}-l`, rate)}
              size="sm"
              variant="slate"
            />
            <div className="flex-1">
              <p className="text-sm text-slate-600 leading-relaxed">{tiers.long.en}</p>
              <p className="text-sm text-slate-400 mt-1">{tiers.long.ko}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 연습 / 빠른 오피서 엔진 ──────────────────────────────────────────────────
function PracticeEngine({
  mode,
  sp,
  progress,
}: {
  mode: "practice" | "rapid";
  sp: ReturnType<typeof useSpeak>;
  progress: ReturnType<typeof useProgress>;
}) {
  const rapid = mode === "rapid";
  const [scope, setScope] = useState<"all" | "review">("all");
  const [groupId, setGroupId] = useState<string>("all");
  const [rate, setRate] = useState<Rate>(rapid ? "fast" : "normal");

  const [queue, setQueue] = useState<Part9Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [reph, setReph] = useState<Rephrasing>({ en: "", ko: "" });
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  // 출제 풀 = 공식 원문 + 모의 리퍼레이즈 (원문도 기본 포함). 각 항목은 {en, ko}.
  const variantsOf = (q: Part9Question): Rephrasing[] => [
    { en: q.official_en, ko: q.ko },
    ...q.rephrasings,
  ];
  const officialVariant = (q: Part9Question): Rephrasing => ({
    en: q.official_en,
    ko: q.ko,
  });

  const buildQueue = useCallback(() => {
    // PART9_QUESTIONS는 폼 순서(1 → 37)이므로 정렬·셔플 없이 그대로 출제한다.
    // 오피서가 보통 순서대로 묻는 흐름과 동일하게.
    let pool = PART9_QUESTIONS.slice();
    if (groupId !== "all") pool = pool.filter((q) => q.groupId === groupId);
    if (scope === "review") pool = pool.filter((q) => progress.map[q.id] !== "known");
    return pool;
  }, [groupId, scope, progress.map]);

  const start = useCallback(() => {
    const q = buildQueue();
    setQueue(q);
    setIdx(0);
    setRevealed(false);
    setDone(q.length === 0);
    setReph(q.length ? officialVariant(q[0]) : { en: "", ko: "" }); // 새 문제는 원문을 기본으로
  }, [buildQueue]);

  // 필터 변경 시 새로 시작
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    start();
  }, [groupId, scope]);

  const current = queue[idx];

  // 새 문제로 이동하면 자동으로 한 번 들려준다 (텍스트는 숨김).
  // current.id가 바뀔 때만 재생 — '다른 표현'으로 reph만 바뀔 땐 another()가 직접 재생.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (current && reph.en && !revealed) {
      const t = setTimeout(() => sp.play(reph.en, `q-${current.id}`, rate), 350);
      return () => clearTimeout(t);
    }
  }, [current?.id]);

  const reveal = () => {
    sp.stop();
    setRevealed(true);
  };
  const replay = () => {
    if (current) sp.play(reph.en, `q-${current.id}`, rate);
  };
  const another = () => {
    if (!current) return;
    const pool = variantsOf(current); // 원문 + 리퍼레이즈
    let r = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (pool.length > 1 && r.en === reph.en && guard < 8) {
      r = pool[Math.floor(Math.random() * pool.length)];
      guard++;
    }
    setReph(r);
    sp.play(r.en, `q-${current.id}`, rate);
  };
  // 특정 문항으로 이동 (이전/점프 공용)
  const goTo = (target: number) => {
    if (target < 0 || target >= queue.length || target === idx) return;
    sp.stop();
    setIdx(target);
    setReph(officialVariant(queue[target])); // 새 문제는 원문을 기본으로
    setRevealed(false);
  };
  const prev = () => goTo(idx - 1);
  const next = (status?: Status) => {
    if (status && current) progress.set(current.id, status);
    sp.stop();
    if (idx + 1 >= queue.length) {
      setDone(true);
      return;
    }
    const ni = idx + 1;
    setIdx(ni);
    setReph(officialVariant(queue[ni])); // 새 문제는 원문을 기본으로
    setRevealed(false);
  };

  const accent = rapid ? "amber" : "violet";

  // ── 완료 화면 ──
  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-10 text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-50 text-violet-500 flex items-center justify-center">
            <PartyPopper className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">세트 완료! 🎉</h3>
            <p className="text-slate-500 mt-2">
              {queue.length > 0
                ? `이번 세트 ${queue.length}문항을 모두 연습했어요.`
                : scope === "review"
                  ? "연습이 필요한 문항이 없습니다. 잘하고 있어요!"
                  : "출제할 문항이 없습니다."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={start}
              className="bg-violet-500 hover:bg-violet-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> 다시 시작
            </button>
            {scope === "all" && (
              <button
                onClick={() => setScope("review")}
                className="bg-white border-2 border-slate-200 text-slate-600 font-bold px-6 py-3 rounded-2xl hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Repeat className="w-5 h-5" /> 연습 필요만 다시
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
      {/* 출제 범위 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          <button
            onClick={() => setScope("all")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold transition-colors",
              scope === "all" ? "bg-white text-violet-600 shadow" : "text-slate-400",
            )}
          >
            전체
          </button>
          <button
            onClick={() => setScope("review")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold transition-colors",
              scope === "review" ? "bg-white text-violet-600 shadow" : "text-slate-400",
            )}
          >
            연습 필요만
          </button>
        </div>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="text-xs font-bold text-slate-600 bg-slate-100 border-0 rounded-full px-3 py-1.5 outline-none cursor-pointer"
        >
          <option value="all">모든 주제</option>
          {PART9_GROUPS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.title}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <SpeedToggle rate={rate} setRate={setRate} />
        </div>
      </div>

      {/* 진행 바 + 이전 버튼 + 문항 점프 */}
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          disabled={idx <= 0}
          className={cn(
            "shrink-0 inline-flex items-center gap-0.5 rounded-full pl-2 pr-3 py-1.5 text-xs font-bold border-2 transition-colors",
            idx <= 0
              ? "border-slate-100 text-slate-300 cursor-not-allowed"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95",
          )}
          title="이전 문항으로 돌아가기"
        >
          <ChevronLeft className="w-4 h-4" /> 이전
        </button>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500"
            initial={false}
            animate={{ width: `${((idx + 1) / Math.max(queue.length, 1)) * 100}%` }}
          />
        </div>
        {/* 점프: 원하는 문항으로 바로 이동 (현재 위치 표시 겸용) */}
        <div className="shrink-0 relative">
          <select
            value={idx}
            onChange={(e) => goTo(Number(e.target.value))}
            className="appearance-none text-xs font-bold text-slate-500 bg-slate-100 rounded-full pl-3 pr-7 py-1.5 outline-none cursor-pointer tabular-nums hover:bg-slate-200 transition-colors"
            title="문항 점프 — 원하는 번호로 바로 이동"
            aria-label="문항 점프"
          >
            {queue.map((q, i) => (
              <option key={q.id} value={i}>
                {i + 1} / {queue.length} · #{q.id}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {current && (
        <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg overflow-hidden">
          {/* 주제 힌트 */}
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
            <span className="text-lg">{current.emoji}</span>
            <span className="text-sm font-bold text-slate-500">
              {current.groupTitle}
            </span>
            <span className="ml-auto text-xs font-extrabold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              #{current.id}
            </span>
          </div>

          {!revealed ? (
            // ── 듣기 단계 (텍스트 숨김) ──
            <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-5">
              <div
                className={cn(
                  "inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full",
                  rapid
                    ? "bg-amber-50 text-amber-600"
                    : "bg-violet-50 text-violet-600",
                )}
              >
                {rapid ? <Zap className="w-3.5 h-3.5" /> : <Ear className="w-3.5 h-3.5" />}
                {rapid ? "한 번 듣고 바로 답하기" : "오피서의 질문을 들으세요"}
              </div>

              <SpeakerButton
                active={sp.speakingKey === `q-${current.id}`}
                onClick={replay}
                size="xl"
                variant="violet"
              />
              <p className="text-sm text-slate-400 -mt-2">탭하면 다시 들려줘요</p>

              {/* 듣는 영어 문장 — 연습 모드는 보고 확인, 빠른 오피서는 숨김(즉답) */}
              {!rapid ? (
                <div className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-extrabold text-violet-700 bg-white border border-violet-200 px-2.5 py-0.5 rounded-full">
                      Part 9 · 문항 {current.id}
                    </span>
                    <span
                      className={cn(
                        "inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                        reph.en === current.official_en
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-violet-100 text-violet-600",
                      )}
                    >
                      {reph.en === current.official_en
                        ? "📋 공식 원문 그대로"
                        : "🗣️ 모의 표현 (리퍼레이즈)"}
                    </span>
                  </div>
                  <p className="text-lg text-slate-800 font-semibold leading-relaxed whitespace-pre-line">
                    {reph.en}
                  </p>
                  {/* 한국어 뜻 — 영어 아래에 함께 표시 */}
                  <p className="text-sm text-slate-500 mt-2 pt-2 leading-relaxed border-t border-slate-200/70 whitespace-pre-line">
                    {reph.ko}
                  </p>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-amber-50/60 border border-amber-100 p-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-amber-700 bg-white border border-amber-200 px-2.5 py-0.5 rounded-full">
                    Part 9 · 문항 {current.id}
                  </span>
                  <span className="text-amber-600 text-xs font-bold">
                    텍스트 없이 듣고 바로 답하세요
                  </span>
                </div>
              )}

              {/* 사용자 행동 안내 */}
              <div className="w-full bg-violet-50/60 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <p className="text-sm text-slate-700 font-medium">
                    무슨 뜻인지 <b className="text-violet-700">한 줄로 다시 말해보세요</b>
                    <span className="text-slate-400">
                      {" "}— "You're asking if I…"
                    </span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <p className="text-sm text-slate-700 font-medium">
                    소리내어 <b className="text-violet-700">No / Yes</b>로 답해보세요
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-2">
                <button
                  onClick={another}
                  className="shrink-0 px-4 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 flex items-center gap-2"
                  title="같은 질문의 다른 표현 듣기"
                >
                  <Shuffle className="w-4 h-4" /> 다른 표현
                </button>
                <button
                  onClick={reveal}
                  className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
                >
                  <Eye className="w-5 h-5" /> 정답 보기
                </button>
              </div>
            </div>
          ) : (
            // ── 정답 공개 단계 ──
            <div className="p-5 sm:p-6 space-y-4">
              {/* 오피서가 한 말 */}
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    오피서가 한 말 · 문항 {current.id}
                  </span>
                  <SpeakerButton
                    active={sp.speakingKey === `r-${current.id}`}
                    onClick={() => sp.toggle(reph.en, `r-${current.id}`, rate)}
                    size="sm"
                  />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{reph.en}</p>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{reph.ko}</p>
              </div>

              {/* 모범 재진술 — 핵심 (상황별 3단) */}
              <RestatementTiersView
                tiers={current.restatement_tiers}
                idPrefix={`pm-${current.id}`}
                sp={sp}
                rate={rate}
              />

              {/* 모범 답변 */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="text-sm font-bold text-slate-400">짧은 답변:</span>
                <AnswerBadge answer={current.model_answer} big />
              </div>

              {/* note (정직 답변 주의) */}
              {current.note && (
                <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-4 flex gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">{current.note}</p>
                </div>
              )}

              {/* 이 질문의 모든 표현 + 뜻 — 표현은 달라도 답·재진술은 동일 */}
              <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-1.5">
                  <Repeat className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    오피서가 이렇게도 물어요 · 뜻은 모두 같아요
                  </span>
                </div>
                <div className="px-3.5 pb-3.5 space-y-1.5">
                  {variantsOf(current).map((v, i) => {
                    const asked = v.en === reph.en;
                    const isOfficial = v.en === current.official_en;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2 rounded-xl px-3 py-2 border",
                          asked
                            ? "bg-violet-50 border-violet-200"
                            : "bg-slate-50 border-transparent",
                        )}
                      >
                        <SpeakerButton
                          active={sp.speakingKey === `rv-${current.id}-${i}`}
                          onClick={() => sp.toggle(v.en, `rv-${current.id}-${i}`, rate)}
                          size="sm"
                          variant="slate"
                        />
                        <div className="flex-1 min-w-0">
                          {(isOfficial || asked) && (
                            <div className="flex flex-wrap items-center gap-1 mb-0.5">
                              {isOfficial && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                  📋 공식 원문
                                </span>
                              )}
                              {asked && (
                                <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full">
                                  방금 들은 표현
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-slate-700 leading-snug whitespace-pre-line">
                            {v.en}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                            {v.ko}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-[11px] text-slate-400 pt-1 px-1 leading-relaxed">
                    표현이 달라도{" "}
                    <b className="text-slate-500">
                      재진술과 짧은 답은 위와 동일
                    </b>
                    합니다.
                  </p>
                </div>
              </div>

              {/* 취지 · 원문 · 번역 */}
              <details className="group rounded-2xl border border-slate-100 bg-white">
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none text-sm font-bold text-slate-500">
                  <BookOpen className="w-4 h-4" />
                  원문 · 취지 · 번역 보기
                  <ChevronDown className="w-4 h-4 ml-auto transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <SpeakerButton
                      active={sp.speakingKey === `o-${current.id}`}
                      onClick={() =>
                        sp.toggle(current.official_en, `o-${current.id}`, rate)
                      }
                      size="sm"
                      variant="slate"
                    />
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed flex-1">
                      {current.official_en}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 flex gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    {current.gist_en}
                  </p>
                  <p className="text-sm text-slate-500 border-l-2 border-slate-200 pl-3">
                    {current.ko}
                  </p>
                </div>
              </details>

              {/* 평가 → 다음 */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => next("review")}
                  className="flex-1 bg-white border-2 border-rose-200 text-rose-600 font-bold py-3.5 rounded-2xl hover:bg-rose-50 flex items-center justify-center gap-2"
                >
                  <Repeat className="w-5 h-5" /> 연습 필요
                </button>
                <button
                  onClick={() => next("known")}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  <CheckCircle2 className="w-5 h-5" /> 익혔어요
                </button>
              </div>
              <button
                onClick={() => next()}
                className="w-full text-sm text-slate-400 hover:text-slate-600 font-medium py-1 flex items-center justify-center gap-1"
              >
                평가 없이 다음 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 둘러보기 (학습 모드) ─────────────────────────────────────────────────────
function BrowseCard({
  q,
  sp,
  progress,
}: {
  q: Part9Question;
  sp: ReturnType<typeof useSpeak>;
  progress: ReturnType<typeof useProgress>;
}) {
  const [open, setOpen] = useState(false);
  const [showReph, setShowReph] = useState(false);
  const status = progress.map[q.id];

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span className="text-base">{q.emoji}</span>
        <span className="text-xs font-bold text-slate-400">#{q.id}</span>
        <span className="text-xs font-medium text-slate-400 truncate">
          {q.groupTitle}
        </span>
        {status === "known" && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
        )}
        {status === "review" && (
          <Repeat className="w-4 h-4 text-rose-400 ml-auto" />
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* 원문 */}
        <div className="flex items-start gap-2.5">
          <SpeakerButton
            active={sp.speakingKey === `b-o-${q.id}`}
            onClick={() => sp.toggle(q.official_en, `b-o-${q.id}`)}
            size="sm"
          />
          <p className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed flex-1">
            {q.official_en}
          </p>
          <AnswerBadge answer={q.model_answer} />
        </div>

        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl py-2.5 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> 취지 · 재진술 보기
          </button>
        ) : (
          <div className="space-y-3">
            <RestatementTiersView
              tiers={q.restatement_tiers}
              idPrefix={`bm-${q.id}`}
              sp={sp}
            />
            <p className="text-sm text-slate-500 flex gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              {q.gist_en}
            </p>
            <p className="text-sm text-slate-500 border-l-2 border-slate-200 pl-3">
              {q.ko}
            </p>
            {q.note && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">{q.note}</p>
              </div>
            )}

            {/* 리퍼레이즈 목록 */}
            <button
              onClick={() => setShowReph((v) => !v)}
              className="w-full text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl py-2 flex items-center justify-center gap-1"
            >
              오피서가 쓸 표현 {q.rephrasings.length}개{" "}
              <ChevronDown
                className={cn("w-3.5 h-3.5 transition-transform", showReph && "rotate-180")}
              />
            </button>
            {showReph && (
              <div className="space-y-1.5">
                {q.rephrasings.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <SpeakerButton
                      active={sp.speakingKey === `b-r-${q.id}-${i}`}
                      onClick={() => sp.toggle(r.en, `b-r-${q.id}-${i}`)}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm text-slate-600 leading-snug">
                        {r.en}
                      </span>
                      <span className="block text-xs text-slate-400 mt-0.5 leading-snug">
                        {r.ko}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 상태 토글 */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() =>
                  status === "review" ? progress.clear(q.id) : progress.set(q.id, "review")
                }
                className={cn(
                  "flex-1 text-xs font-bold py-2 rounded-xl border-2 flex items-center justify-center gap-1",
                  status === "review"
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-slate-200 text-slate-400 hover:border-rose-200",
                )}
              >
                <Repeat className="w-3.5 h-3.5" /> 연습 필요
              </button>
              <button
                onClick={() =>
                  status === "known" ? progress.clear(q.id) : progress.set(q.id, "known")
                }
                className={cn(
                  "flex-1 text-xs font-bold py-2 rounded-xl border-2 flex items-center justify-center gap-1",
                  status === "known"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-white border-slate-200 text-slate-400 hover:border-emerald-200",
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> 익힘
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Browse({
  sp,
  progress,
}: {
  sp: ReturnType<typeof useSpeak>;
  progress: ReturnType<typeof useProgress>;
}) {
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState<string>("all");
  const [scope, setScope] = useState<"all" | "review" | "known">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PART9_QUESTIONS.filter((item) => {
      if (groupId !== "all" && item.groupId !== groupId) return false;
      const st = progress.map[item.id];
      if (scope === "review" && st === "known") return false;
      if (scope === "review" && st !== "review") return false;
      if (scope === "known" && st !== "known") return false;
      if (!q) return true;
      return (
        item.official_en.toLowerCase().includes(q) ||
        item.ko.toLowerCase().includes(q) ||
        item.gist_en.toLowerCase().includes(q) ||
        item.restatement_tiers.short.en.toLowerCase().includes(q) ||
        item.restatement_tiers.short.ko.includes(q) ||
        item.restatement_tiers.medium.en.toLowerCase().includes(q) ||
        item.restatement_tiers.long.en.toLowerCase().includes(q) ||
        item.rephrasings.some(
          (r) => r.en.toLowerCase().includes(q) || r.ko.includes(q),
        )
      );
    });
  }, [query, groupId, scope, progress.map]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="질문·단어·뜻으로 검색…"
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-violet-400 text-slate-700 font-medium"
        />
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          {(["all", "review", "known"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                scope === s ? "bg-white text-violet-600 shadow" : "text-slate-400",
              )}
            >
              {s === "all" ? "전체" : s === "review" ? "연습 필요" : "익힘"}
            </button>
          ))}
        </div>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="text-xs font-bold text-slate-600 bg-slate-100 border-0 rounded-full px-3 py-1.5 outline-none cursor-pointer"
        >
          <option value="all">모든 주제</option>
          {PART9_GROUPS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.title}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs font-bold text-slate-400">
          {filtered.length}개
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-12 text-sm">
          조건에 맞는 문항이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <BrowseCard key={q.id} q={q} sp={sp} progress={progress} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function N400RestatePractice() {
  const sp = useSpeak();
  const progress = useProgress();
  const [tab, setTab] = useState<"practice" | "rapid" | "browse">("practice");

  const knownCount = useMemo(
    () => PART9_QUESTIONS.filter((q) => progress.map[q.id] === "known").length,
    [progress.map],
  );
  const pct = Math.round((knownCount / TOTAL_PART9_QUESTIONS) * 100);

  const TABS = [
    { id: "practice" as const, label: "연습", icon: Headphones },
    { id: "rapid" as const, label: "빠른 오피서", icon: Zap },
    { id: "browse" as const, label: "둘러보기", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* 헤더 */}
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                Part 9 재진술 연습
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                듣고 → 한 줄로 다시 말하고 → 짧게 답하기
              </p>
            </div>
            {sp.speakingKey && (
              <button
                onClick={sp.stop}
                className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-500 text-xs font-bold flex items-center gap-1"
              >
                <VolumeX className="w-4 h-4" /> 정지
              </button>
            )}
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-violet-600 tabular-nums">
                {pct}%
              </span>
              <span className="text-[9px] font-bold uppercase text-slate-300">
                {knownCount}/{TOTAL_PART9_QUESTIONS}
              </span>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-1.5 mt-3 bg-slate-100 p-1 rounded-2xl">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    sp.stop();
                    setTab(t.id);
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold transition-all",
                    active
                      ? "bg-white text-violet-600 shadow"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 고정 안내문 */}
      <div className="max-w-2xl mx-auto px-4 pt-3">
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white px-4 py-3 flex gap-2.5 shadow-md shadow-violet-200">
          <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-violet-100" />
          <p className="text-sm leading-relaxed text-violet-50">
            답은 반드시 <b className="text-white">진실하게</b>. 못 알아들으면{" "}
            <b className="text-white">"Could you repeat that, please?"</b>. 단어를 다 나열할
            필요 없이 <b className="text-white">취지만 짧게</b> 다시 말하면 됩니다.
          </p>
        </div>
        {/* 정확성 고지 (실전 모의용 · 비녹취) */}
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400 flex gap-1.5">
          <span className="shrink-0">ℹ️</span>
          <span>{MOCK_NOTICE}</span>
        </p>
      </div>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "practice" && (
              <PracticeEngine mode="practice" sp={sp} progress={progress} />
            )}
            {tab === "rapid" && (
              <PracticeEngine mode="rapid" sp={sp} progress={progress} />
            )}
            {tab === "browse" && <Browse sp={sp} progress={progress} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation />
    </div>
  );
}
