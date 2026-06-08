# DEV_LOG — Civic-Prep-Tool-V2

## 2026-06-06 — Part 9 재진술(Restate) 연습 탭 신규 + 상황별 3단 재진술

### 완료
- **Part 9 재진술 연습 페이지 신규** (`/n400-restate`)
  - 3개 모드: 🎧 연습(듣기→취지 재진술→No/Yes→정답 공개), ⚡ 빠른 오피서(빠른 속도 즉답), 📚 둘러보기(검색·필터)
  - 진도 추적(localStorage, 유저별 분리), '연습 필요' 우선 출제, 속도 3단(천천히/보통/빠르게), 모바일 반응형, 고정 안내문
  - 파일: `client/src/pages/N400RestatePractice.tsx` (신규), 홈 진입 카드 `Home.tsx`, 라우트 `App.tsx`
- **데이터 신규** `client/src/data/n400_part9_restate.ts` — Part 9 전 62개 세부문항
  - 원문(official_en)·번역(ko)은 `n400_sentence_vocab.ts`(Edition 01/20/25)에서 id로 가져옴 → 단일 출처, 의미 변경 없음
  - 항목별: gist_en / rephrasings(복합·추상 5개, 단순 2~3개) / model_answer / restatement_tiers / note
- **상황별 3단 재진술(restatement_tiers)** — 각 en·ko
  - `short`(≤12단어, 기본 — 이해 확인용) · `medium`(더 물으면 — Anything else?) · `long`(완전판 · 참고용 · 외울 필요 없음)
- **정확성 고지** — rephrasings는 USCIS가 공개한 검증 표현이 아니라 공식 원문 의미에 충실한 **'실전 모의용 · 비녹취'** 표현. 화면 상단 `MOCK_NOTICE` + 데이터 파일 주석에 명시
- **15.b 체포 문항** — 앱은 `No` 유지하되 note에 "기록 있으면 반드시 'Yes'로 정직하게 정정" 강한 경고 (개인정보는 코드 미포함, 사용자 결정)

### 검증
- tsc: 신규 2개 파일 타입 에러 0 / 런타임 콘솔 에러 0 (62개 id 매칭 성공)
- preview(:5000): 연습·둘러보기 모두 3단 영한 표시, long 펼침, 진도(0→2%), MOCK_NOTICE, 모바일 탭 라벨 확인

### 미완료/이슈
- 로컬 DB(Neon) TLS 인증서 오류로 `/api/study/stats` 500 — 이 기능과 무관(localStorage만 사용), 배포 무관
- 기존 `Study.tsx`/`QuestionsList.tsx` 사전존재 TS 에러 그대로 (Vite 빌드/배포 영향 없음)

### 후속 개선 (사용자 실전 피드백 반영)
- **듣기 단계에 영어 문장 표시** — 연습 모드는 재생 중인 리프레이즈의 영어를 화면에 노출(음성+자막). 빠른 오피서 모드는 즉답 챌린지라 숨김 유지. "다른 표현" 눌러도 영어 텍스트가 함께 갱신됨
- **리프레이즈 62항목 전면 재작성** — 원문(official_en)에 충실하게, 충분히 긴 문장으로, 항목당 3~4개. "실제 오피서는 원문을 거의 그대로 읽거나 약간만 리퍼레이즈하지 한 문장으로 압축하지 않는다"는 실전 피드백 반영 → 짧은 압축형 전부 제거(의미는 그대로 유지)
- **원문도 출제 풀에 포함** — 새 문제는 공식 원문을 기본으로 출제(📋 "공식 원문 그대로" 뱃지), "다른 표현"으로 모의 리퍼레이즈(🗣️ 뱃지)와 번갈아 연습. 듣기 화면에 원문/모의 구분 표시 + stem 포함 원문 줄바꿈 처리
- **항목 번호 표시** — 질문 화면에 "Part 9 · 문항 {id}" + 헤더 #{id}(violet 강조) 표시. 메인 1~37 + 하위항목(5.a/5.b, 7.a~g, 17.a~h 등) = **총 62개 세부문항 전부 수록** 확인
- **순서대로 출제** — `buildQueue`에서 셔플·'연습 필요 우선' 정렬 제거 → 폼 순서(1 → 37) 그대로 출제(오피서가 순서대로 묻는 흐름과 동일). `PART9_QUESTIONS`가 이미 폼 순서이므로 filter만 적용. (개발 중 HMR Fast Refresh가 reph state를 보존해 "모의 표현부터 시작"처럼 보였으나 fresh 로드/프로덕션은 1번·원문부터 정상)
- **TTS 미국 발음 강제** — `pickFemaleVoice`를 en-US 음성만 우선 풀로(영국 en-GB·호주 en-AU 등은 점수 −300으로 배제, en-US는 +200), `utterance.lang`을 항상 `"en-US"`로 고정. 같은 음성 로직을 쓰는 3개 페이지(재진술 연습·문장 속 단어·모의 면접) 모두 적용. 검증 환경에서 `Microsoft Zira (en-US)` 선택 확인

### 배포 상태 (세션 종료 시점)
- `b3a3fe1` 재진술 연습 탭 / `63518d8` TTS 미국 발음 → **main push 완료, Vercel 자동 배포됨**
- 사용자 휴대폰에서 발음 확인: **"잘 됩니다" ✓**

### 다음 세션 할 일
1. (선택) 재진술 데이터 다듬기 — 사용자 피드백 기반 표현·음성 추가 조정. 본인 해당 항목(특히 체포 15.b)은 인터뷰 전 **실제 기록과 대조** (체포 문항 결정 근거는 메모리 `n400-15b-answer-decision` 참조)
2. 기존 이슈 정리: 죽은 `Study.tsx` 삭제 + `QuestionsList.tsx` 사전존재 TS 에러
3. (인프라) `server/routes.ts` ↔ `api/index.ts` API 로직 중복 통합 — 이전 세션부터 미해결
4. (참고) 로컬 Neon DB TLS 인증서 오류는 이 기능과 무관, 배포 영향 없음

### 하네스 개선
- **HMR Fast Refresh 잔상 주의 (이번 세션 3회 반복)** — 큰 state(`reph` 등) 변경 Edit를 여러 번 한 뒤 `location.reload()`로 검증하면 Fast Refresh가 이전 state를 보존해 "잘못 보이는" 현상이 반복됨 (정답 단계부터 표시 / 모의 표현부터 시작 / 콘솔 누적 에러). 매번 멀쩡한데 화면만 이상해 디버깅 시간 낭비. → **큰 변경 후 검증은 dev 서버 재시작(`preview_stop` → `preview_start`, 새 serverId)으로 fresh 상태에서 할 것.** `location.href`(같은 URL)는 리로드조차 안 되니 주의.

---

## 2026-06-02 — 카드 역순 학습 기능 + 무한반복 버그 수정 (프로덕션 이중 서버 파일 이슈)

### 완료
- **역순 학습 모드 추가** — 홈 점프 영역에 "← 거꾸로" 버튼 신규
  - `reverse` 모드: 입력 번호부터 거꾸로 진행 (예: 100 → 99 → 98)
  - 기존 "순서대로 →" 버튼과 나란히 배치, 툴팁 포함
  - 파일: `client/src/pages/Home.tsx`
- **카드 학습 화면 "이전" 버튼 추가** — 헤더 좌측(✕ 옆)
  - 평가(HARD/GOOD/EASY) 없이 방금 본 카드로 되돌아감, 첫 카드에선 비활성
  - 파일: `client/src/pages/StudySession.tsx`
- **무한반복 버그 수정** — 점프 후 시작점보다 앞 카드로 못 가던 문제
  - 원인: 세션이 점프 지점부터 끝까지만 잘려 들어옴 (99 점프 시 `[99,100]` 2장만)
  - 해결: 전체 100장을 모드 방향대로 로드 + 점프 번호는 시작 위치(currentIndex)로만 사용
  - 이제 어느 점프 지점에서도 "이전"으로 앞 카드까지 자유 이동
- **🎯 근본 원인 발견 및 해결 — 프로덕션 서버 코드 이중화**
  - Vercel은 `api/index.ts`(서버리스 함수, API 로직 inline 중복 구현)를 실행하는데, 위 서버 변경을 `server/routes.ts`(로컬 dev 전용)에만 적용 → **3회 배포가 프로덕션에 전혀 반영 안 됨**
  - 증상: 거꾸로 버튼/이전 버튼(클라이언트)은 보이는데, 서버 동작(reverse 정렬·전체덱)은 그대로 → "배포해도 안 바뀜" 반복
  - 진단: `Invoke-RestMethod`로 라이브 API 직접 호출 → `jump&startId=99`가 2장 반환 확인 → 서버 코드가 옛 버전임을 확정
  - 해결: `api/index.ts`에 `reverse` 모드 + 전체덱 동일 적용 → 라이브 검증(jump=100장, reverse 첫 id=100 desc) 통과

### 커밋
- `35ca670` — Add reverse-order study mode to Jump To
- `bfb565b` — Add Previous Card button to study session
- `508559b` — Fix Previous button stuck at session start; full-deck sessions
- `1f3469a` — Fix production: mirror reverse mode + full-deck into api/index.ts ⭐(근본 해결)

### 미완료/이슈
- **`server/routes.ts` ↔ `api/index.ts` API 로직 중복** — 이번 혼란의 근본 원인. 둘을 공유 모듈로 통합 필요 (현재는 둘 다 수동 동기화해야 함)
- `api/index.ts`의 stats가 `currentStreak: 0` 하드코딩 → 홈 화면 "0 Day" 항상 표시 (`server/routes.ts`엔 streak 계산 로직 있으나 프로덕션 미반영)
- 죽은 파일 `Study.tsx` 여전히 존재 (라우팅 미등록, TS 에러 1건 원인) — 기존 이슈

### 다음 세션 할 일
1. **`server/routes.ts` + `api/index.ts` 중복 통합** — API 핸들러를 공유 모듈로 추출해 재발 방지 (최우선)
2. **streak 표시 복구** — `currentStreak` 계산 로직을 `api/index.ts` stats에도 반영
3. **죽은 `Study.tsx` 삭제** + 사전존재 TS 에러 정리 (`QuestionsList.tsx`)

### 하네스 개선
- **서버 변경을 `server/routes.ts`에만 적용하는 실수 3회 반복** → 프로덕션 미반영으로 배포 사이클 낭비
  - 제안: `CLAUDE.md`에 "API 로직 변경 시 `server/routes.ts` + `api/index.ts` 둘 다 수정" 규칙 추가
  - 조치: 메모리 `vercel_dual_server_files.md`에 기록 완료
- **배포 검증 패턴 표준화 권장** — 푸시 후 `Invoke-RestMethod`로 라이브 API를 직접 호출해 반영 여부 확인 (서버리스는 CDN 캐시 안 되므로 코드 반영을 정확히 반영). 이번에 결정적으로 유효했음

## 2026-05-23 — N-400 면접 듣기 & 단어장 페이지 추가

### 완료
- **`/n400` (N-400 면접 듣기 페이지)** 신규 구현
  - 데이터: 10개 섹션 A~J + 충성 선서 (총 56개 질문)
  - Web Speech API 기반 영어 TTS (자연스러운 음성 voice 자동 선택)
  - 섹션 아코디언 UI, 검색, [No]/[Yes]/[해당시] 노트 뱃지
  - 충성 선서 전체 듣기 1버튼
  - 파일: `client/src/data/n400_questions.ts`, `client/src/pages/N400Practice.tsx`
- **`/n400-vocab` (N-400 단어장 페이지)** 신규 구현
  - 7개 섹션 79개 단어 (사용자가 제공한 .docx 파싱)
  - 단어/설명 각각 별도 스피커 버튼 (초록=단어, 파랑=설명)
  - 심사관 "What does this mean?" 답변 문장 표시
  - 파일: `client/src/data/n400_vocabulary.ts`, `client/src/pages/N400Vocabulary.tsx`
- **SPA 라우팅 404 버그 수정** (사전 존재 버그)
  - `vercel.json`에 fallback rewrite 추가
  - 이전: `/study`, `/questions` 등 직접 URL 접근 시 404
  - 이후: 모든 클라이언트 라우트 정상 동작
- 홈 Library 섹션에 2개 카드 추가 (N-400 면접 듣기 / N-400 단어장)
- Vercel 자동 배포 완료 — https://civic-test-woad.vercel.app/

### 커밋
- `625725b` — Add N-400 interview listening page with TTS
- `a959875` — Fix SPA routing: add fallback rewrite to index.html
- `a38ccaf` — Add N-400 interview vocabulary page with TTS

### 미완료/이슈
- Vite 번들 크기 경고: index.js가 558KB (>500KB) — 코드 스플리팅 검토 필요
- `QuestionsList.tsx`, `Study.tsx`에 사전 존재 TypeScript 에러 8건 (이번 작업과 무관)
- `Study.tsx`는 라우팅에 등록되어 있지 않은 unused 파일

### 다음 세션 할 일
1. **단어장 학습 진도 추적** — N-400 vocab도 SM-2 알고리즘 적용 검토 (또는 단순 "외운 단어" 마킹)
2. **퀴즈 모드** — 한국어 보고 영어로 답하는 플래시카드 형식
3. **번들 코드 스플리팅** — `React.lazy` + `Suspense`로 라우트별 분리
4. **사전 존재 TS 에러 정리** — `QuestionsList.tsx` 타입 명시, unused `Study.tsx` 제거 검토

### 하네스 개선
- **Windows에서 `npm run check`/`tsc` PATH 문제 반복** (3회 발생)
  - 원인: PowerShell이 node.exe를 PATH에서 못 찾음 (npm script의 shebang 처리 한계)
  - 회피: `& "C:\Program Files\nodejs\node.exe" "node_modules\typescript\bin\tsc"` 직접 호출
  - 제안: 프로젝트에 `scripts/check.ps1` 또는 `package.json`에 `cross-env`로 절대 경로 지정
