// N-400 Part 9 — 재진술(Restate) 연습 데이터
// 흐름: 오피서가 문항을 리퍼레이즈해서 물으면 → 듣고 → 취지를 다시 말하고(restate) → 짧게 답(No/Yes).
//
// ⚠️ 데이터 정확성 (최우선):
//  - official_en(원문)과 ko(번역)는 여기서 새로 만들지 않습니다.
//    n400_sentence_vocab.ts (Form N-400, Edition 01/20/25 원문)에서 id로 그대로 가져옵니다. (단일 출처)
//  - rephrasings는 USCIS가 공개한 '검증된 실제 표현'이 아닙니다. official_en의 "의미를 그대로 유지"하여
//    만든 현실적 모의 표현입니다 → 화면에 "실전 모의용 · 비녹취"로 명시. (의미 변경 금지)
//
// 데이터 구조:
//   gist_en           : 한 줄 쉬운 영어 취지 ("This asks if ...")
//   rephrasings       : 오피서가 쓸 법한 모의 표현 — 복합/추상 항목 5개, 단순 항목 2~3개
//   model_answer      : 짧은 진실한 답 ("No" / "Yes" / "해당시")
//   restatement_tiers : 상황별 3단 재진술 (각 en/ko)
//       short  : 오피서가 이해 확인만 할 때. ≤12단어. "You're asking if I ever … because of/about …"
//       medium : 오피서가 "Anything else? / Can you say more?"로 더 캐물을 때 (요소 1~2개 추가)
//       long   : 질문의 모든 요소를 담은 완전판 — 참고용이며 외워서 말할 필요 없음
//   note              : 정직 답변 주의·정정 항목 표시 등

import {
  N400_SENTENCE_VOCAB,
  type SentenceVocabCard,
  type SentenceVocabSection,
} from "./n400_sentence_vocab";

export interface RestatementTier {
  en: string;
  ko: string;
}
export interface RestatementTiers {
  short: RestatementTier;
  medium: RestatementTier;
  long: RestatementTier;
}

// 오피서 표현(리퍼레이즈) — 영어 + 한국어 번역.
// 영어 원문은 RESTATE_ITEMS.rephrasings(string[])에 그대로 두고,
// 한국어는 REPHRASING_KO에서 같은 index로 병합한다(아래 PART9_QUESTIONS 조립부).
export interface Rephrasing {
  en: string;
  ko: string;
  restate: RestatementTier; // 이 표현의 단어에 맞춘 재진술(한 줄 답) en+ko
}

export interface RestateItem {
  id: string; // n400_sentence_vocab의 카드 id와 일치 (예: "1", "5.a")
  gist_en: string;
  rephrasings: string[]; // 영어 원문 (한국어는 REPHRASING_KO에서 index로 병합)
  model_answer: string; // "No" | "Yes" | "해당시"
  restatement_tiers: RestatementTiers;
  note?: string;
}

// Part9Question은 rephrasings를 {en, ko} 객체 배열로 합쳐서 제공한다.
export interface Part9Question extends Omit<RestateItem, "rephrasings"> {
  groupId: string; // 섹션 id
  groupTitle: string; // 섹션 한글 제목
  emoji: string; // 섹션 이모지
  official_en: string; // 폼 원문 (stem 포함)
  ko: string; // 한글 번역
  rephrasings: Rephrasing[]; // 영어 + 한국어 (REPHRASING_KO 병합 결과)
}

export const RESTATE_ITEMS: RestateItem[] = [
  // ── 1–4 · 시민권 · 투표 · 세금 ─────────────────────────────────────────────
  {
    id: "1",
    gist_en:
      "This asks if you have ever told anyone, in writing or any other way, that you are a U.S. citizen.",
    rephrasings: [
      "Have you ever claimed to be a U.S. citizen, in writing or in any other way?",
      "At any time, have you ever told anyone — or put down on a form — that you were a United States citizen when you actually were not?",
      "Have you ever, in writing or otherwise, represented or claimed that you are a U.S. citizen?",
      "Did you ever claim to be an American citizen to get a job, a benefit, or for any other reason?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever claimed to be a U.S. citizen.",
        ko: "제가 미국 시민이라고 주장한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever claimed to be a U.S. citizen, in writing or any other way.",
        ko: "제가 서면이든 다른 방식으로든 미국 시민이라고 주장한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever, in writing or in any other way, claimed or represented myself to be a U.S. citizen.",
        ko: "제가 지금까지 서면이나 다른 어떤 방식으로든 스스로를 미국 시민이라고 주장하거나 내세운 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "2",
    gist_en:
      "This asks if you have ever registered to vote, or voted, in any U.S. election — federal, state, or local.",
    rephrasings: [
      "Have you ever registered to vote, or voted, in any Federal, state, or local election in the United States?",
      "Have you ever signed up to vote, or actually cast a vote, in any election here — whether federal, state, or local?",
      "At any point since you've been here, have you registered to vote or voted in any U.S. election?",
      "Have you ever put your name on the voter registration, or taken part in voting, in any election in this country?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever registered to vote or voted in the U.S.",
        ko: "제가 미국에서 투표 등록을 하거나 투표한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever registered or voted in any U.S. election — federal, state, or local.",
        ko: "연방·주·지방 어떤 선거든 제가 투표 등록을 하거나 투표한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever registered to vote or voted in any federal, state, or local election in the United States.",
        ko: "제가 미국의 연방·주·지방 선거에서 투표 등록을 하거나 투표한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "3",
    gist_en:
      "This asks if you currently owe any overdue (late, unpaid) federal, state, or local taxes.",
    rephrasings: [
      "Do you currently owe any overdue Federal, state, or local taxes in the United States?",
      "Right now, do you owe any taxes — federal, state, or local — that are past due or unpaid?",
      "At this time, are there any overdue taxes that you still owe to the government?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I currently owe any overdue taxes.",
        ko: "제가 현재 체납된 세금이 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I currently owe any overdue federal, state, or local taxes.",
        ko: "제가 현재 연방·주·지방의 체납 세금이 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I currently owe any overdue federal, state, or local taxes in the United States.",
        ko: "제가 현재 미국에 체납된 연방·주·지방 세금이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "4",
    gist_en:
      "This asks if, since getting your green card, you ever called yourself a 'nonresident alien' on taxes or skipped filing because you thought you were a nonresident.",
    rephrasings: [
      "Since you became a lawful permanent resident, have you ever called yourself a 'nonresident alien' on a Federal, state, or local tax return?",
      "Since you got your green card, did you ever file your taxes as a nonresident, or skip filing because you considered yourself a nonresident?",
      "After becoming a permanent resident, did you ever claim to be a nonresident alien on any tax return?",
      "Did you ever decide not to file a tax return because you thought of yourself as a nonresident?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever filed as a nonresident since my green card.",
        ko: "영주권 받은 뒤 제가 비거주자로 신고한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if, since my green card, I called myself a nonresident alien or skipped filing for that reason.",
        ko: "영주권 이후 제가 스스로를 비거주 외국인이라 하거나 그 이유로 신고를 안 한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, since becoming a permanent resident, I ever called myself a nonresident alien on a tax return, or chose not to file a return because I considered myself a nonresident.",
        ko: "제가 영주권자가 된 이후 세금 신고에서 스스로를 비거주 외국인이라 하거나, 비거주자라고 여겨 신고하지 않기로 한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 5 · 공산당 · 정부 전복 ────────────────────────────────────────────────
  {
    id: "5.a",
    gist_en:
      "This asks if you have ever been a member of, or in any way associated with, any Communist or totalitarian party anywhere in the world.",
    rephrasings: [
      "Have you ever been a member of, involved in, or in any way associated with any Communist or totalitarian party, anywhere in the world?",
      "Have you ever belonged to, been involved in, or had any connection with a Communist or totalitarian party in any country?",
      "At any time, anywhere in the world, were you ever a member of or in any way associated with a Communist or totalitarian party?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever in a Communist or totalitarian party.",
        ko: "제가 공산당이나 전체주의 정당에 속한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever a member of, or associated with, any Communist or totalitarian party anywhere.",
        ko: "세계 어디서든 제가 공산당이나 전체주의 정당에 소속·연관된 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world.",
        ko: "제가 전 세계 어디서든 공산당이나 전체주의 정당에 소속·관여·연관된 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "5.b",
    gist_en:
      "This asks if you ever supported — or belonged to a group that supported — overthrowing the government, world communism, a U.S. dictatorship, harming officials, destroying property, or sabotage.",
    rephrasings: [
      "Have you ever advocated — that is, supported or promoted — the overthrow of the U.S. government by force or violence, world communism, or a totalitarian dictatorship in the United States?",
      "Have you ever supported, or belonged to a group that supported, opposition to all organized government, or overthrowing the government by force or other unconstitutional means?",
      "Have you ever advocated, or been associated with a group that advocated, harming government officials, unlawfully damaging property, or sabotage?",
      "Have you ever promoted, or been part of any group anywhere that promoted, the violent overthrow of the United States Government or of all forms of law?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever supported overthrowing the government or its laws.",
        ko: "제가 정부나 법을 전복하는 것을 지지한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever supported — or joined a group that supported — overthrowing the government, sabotage, or harming officials.",
        ko: "제가 정부 전복·사보타주·공무원 가해를 지지하거나 그런 단체에 속한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever advocated, or belonged to a group that advocated, things like opposing all government, world communism, a U.S. dictatorship, overthrowing the government by force, harming officials, destroying property, or sabotage.",
        ko: "제가 모든 정부에 대한 반대, 세계 공산주의, 미국 내 독재 수립, 무력에 의한 정부 전복, 공무원 가해, 재산 파괴, 사보타주 같은 것을 옹호하거나 그런 단체에 속한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 6 · 무기 · 테러 단체 (단체에 소속·지원한 적이 있는가) ──────────────────
  {
    id: "6.a",
    gist_en:
      "This asks if you were ever part of, or supported, a group that used weapons or explosives to hurt people or destroy property.",
    rephrasings: [
      "Have you ever been a member of, or given money, services, or any other support to, a group that used a weapon or explosive to harm a person or damage property?",
      "Were you ever associated with, or did you ever provide assistance to, any group that used weapons or explosives with intent to harm people or destroy property?",
      "Have you ever supported in any way — with money, labor, or services — a group that used a weapon or an explosive against another person or against property?",
      "Did you ever belong to, or help in any way, a group that used a weapon or explosive intending to hurt someone or cause damage?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever helped a group that used weapons.",
        ko: "무기를 쓴 단체를 제가 도운 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever part of, or supported, a group that used weapons or explosives to hurt people or property.",
        ko: "사람이나 재산을 해치려 무기·폭발물을 쓴 단체에 제가 속하거나 지원한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I was ever a member of, associated with, or gave money, services, or support to a group that used a weapon or explosive with intent to harm a person or damage property.",
        ko: "제가 사람을 해치거나 재산을 파괴할 의도로 무기·폭발물을 사용한 단체에 소속·연관되거나 돈·서비스·지원을 제공한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "6.b",
    gist_en:
      "This asks if you were ever part of, or supported, a group that did kidnapping, assassination, hijacking, or sabotage of transportation.",
    rephrasings: [
      "Have you ever been a member of, or provided any support to, a group that took part in kidnapping, assassination, or the hijacking or sabotage of a plane, ship, or other vehicle?",
      "Were you ever associated with, or did you ever give money, labor, or services to, a group that engaged in kidnapping, assassination, or hijacking?",
      "Have you ever supported in any way a group that participated in assassination, kidnapping, or the sabotage of an airplane, ship, vehicle, or other transportation?",
      "Did you ever help, or belong to, any group that carried out kidnappings, assassinations, or the hijacking of transportation?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever helped a group that kidnapped or hijacked.",
        ko: "납치나 하이재킹을 한 단체를 제가 도운 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever part of, or supported, a group that did kidnapping, assassination, hijacking, or sabotage.",
        ko: "납치·암살·하이재킹·사보타주를 한 단체에 제가 속하거나 지원한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I was ever a member of, associated with, or supported a group that engaged in kidnapping, assassination, or the hijacking or sabotage of an airplane, ship, vehicle, or other transportation.",
        ko: "제가 납치, 암살, 또는 항공기·선박·차량 등 교통수단의 납치나 사보타주에 가담한 단체에 소속·연관되거나 지원한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "6.c",
    gist_en:
      "This asks if you were ever part of, or supported, a group that threatened, planned, attempted, or encouraged others to do the acts in 6.a or 6.b.",
    rephrasings: [
      "Have you ever been a member of, or supported in any way, a group that threatened, attempted, conspired, planned, or encouraged others to commit any of the acts in 6.a or 6.b?",
      "Were you ever associated with, or did you provide support to, a group that prepared, planned, or advocated for those acts of violence?",
      "Have you ever helped, or belonged to, a group that incited or encouraged others to carry out the acts described in 6.a or 6.b?",
      "Did you ever give money, services, or support to a group that tried, conspired, or planned to commit any of those acts?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever helped a group that planned those attacks.",
        ko: "그런 공격을 계획한 단체를 제가 도운 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever part of, or supported, a group that threatened, tried, planned, or encouraged those acts.",
        ko: "그런 행위를 위협·시도·계획·선동한 단체에 제가 속하거나 지원한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I was ever associated with or supported a group that threatened, attempted, conspired, prepared, planned, advocated, or incited others to commit the acts in items 6.a or 6.b.",
        ko: "제가 6.a·6.b의 행위를 위협·시도·공모·준비·계획·옹호하거나 다른 사람을 선동한 단체에 연관·지원한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 7 · 박해 · 고문 · 집단학살 (직접 가담했는가) ──────────────────────────
  {
    id: "7.a",
    gist_en:
      "This asks if you have ever taken part in torture — ordering it, doing it, or helping with it.",
    rephrasings: [
      "Have you ever ordered, committed, assisted with, or in any way taken part in torture?",
      "Have you ever incited, called for, helped with, or otherwise participated in the torture of any person?",
      "In any way at all, were you ever involved in torturing someone — ordering it, doing it, or helping with it?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever took part in torture.",
        ko: "제가 고문에 가담한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever ordered, committed, or helped with torture in any way.",
        ko: "제가 고문을 지시·실행·방조한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, incited, called for, committed, assisted, or otherwise participated in torture.",
        ko: "제가 고문을 지시·선동·요구·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "7.b",
    gist_en:
      "This asks if you have ever taken part in genocide — the killing of a group of people because of their identity.",
    rephrasings: [
      "Have you ever ordered, committed, assisted with, or in any way taken part in genocide?",
      "Have you ever incited, called for, helped with, or otherwise participated in genocide?",
      "In any way at all, were you ever involved in an act of genocide — ordering it, carrying it out, or assisting?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever took part in genocide.",
        ko: "제가 집단학살에 가담한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever ordered, committed, or helped with genocide in any way.",
        ko: "제가 집단학살을 지시·실행·방조한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, incited, called for, committed, assisted, or otherwise participated in genocide.",
        ko: "제가 집단학살을 지시·선동·요구·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "7.c",
    gist_en: "This asks if you have ever killed, or tried to kill, any person.",
    rephrasings: [
      "Have you ever ordered, committed, assisted with, or otherwise taken part in killing, or trying to kill, any person?",
      "Have you ever incited, helped with, or in any way participated in the killing or attempted killing of someone?",
      "In any way, were you ever involved in killing a person, or in trying to kill a person?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever killed or tried to kill anyone.",
        ko: "제가 누군가를 죽이거나 죽이려 한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever killed, tried to kill, or helped kill any person.",
        ko: "제가 사람을 죽이거나, 죽이려 하거나, 그것을 도운 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, incited, committed, assisted, or otherwise participated in killing or trying to kill any person.",
        ko: "제가 사람을 죽이거나 죽이려 한 일을 지시·선동·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "7.d",
    gist_en:
      "This asks if you have ever intentionally and severely injured, or tried to injure, any person.",
    rephrasings: [
      "Have you ever ordered, committed, assisted with, or otherwise taken part in intentionally and severely injuring, or trying to injure, any person?",
      "Have you ever helped with, or in any way participated in, deliberately causing serious injury to another person?",
      "Did you ever take part, in any way, in intentionally and severely injuring someone, or attempting to?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever badly injured someone on purpose.",
        ko: "제가 고의로 누군가를 심하게 다치게 한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever intentionally and severely injured, or tried to injure, any person.",
        ko: "제가 고의로 사람을 심하게 다치게 하거나 시도한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, incited, committed, assisted, or otherwise participated in intentionally and severely injuring, or trying to injure, any person.",
        ko: "제가 고의로 사람을 심하게 다치게 하거나 시도한 일을 지시·선동·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "7.e",
    gist_en:
      "This asks if you have ever had any sexual contact with someone who did not or could not agree, or who was forced or threatened.",
    rephrasings: [
      "Have you ever taken part in any kind of sexual contact or activity with someone who did not consent, or who was unable to consent?",
      "Were you ever involved in any sexual contact with a person who did not agree, could not agree, or was being forced or threatened?",
      "Have you ever committed, assisted with, or otherwise participated in sexual activity with someone who was being forced or threatened — by you or by someone else?",
      "Did you ever engage in any sexual contact with a person who could not agree to it, or who was being coerced?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever had sexual contact without consent.",
        ko: "제가 동의 없는 성적 접촉을 한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever had sexual contact with someone who didn't or couldn't consent, or was forced.",
        ko: "동의하지 않았거나 할 수 없었거나 강요당한 사람과 제가 성적 접촉을 한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, committed, assisted, or otherwise participated in any sexual contact with a person who did not consent, could not consent, or was being forced or threatened.",
        ko: "제가 동의하지 않았거나 동의할 수 없었거나 강요·위협당한 사람과의 성적 접촉을 지시·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "7.f",
    gist_en: "This asks if you have ever stopped someone from practicing their religion.",
    rephrasings: [
      "Have you ever ordered, committed, assisted with, or otherwise taken part in not letting someone practice his or her religion?",
      "Were you ever involved, in any way, in preventing a person from practicing their religion?",
      "Did you ever help with, or in any way participate in, stopping someone from practicing their faith?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever stopped someone's religious practice.",
        ko: "제가 누군가의 종교 활동을 막은 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever prevented a person from practicing his or her religion.",
        ko: "제가 사람이 자기 종교를 실천하는 것을 막은 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, incited, committed, assisted, or otherwise participated in not letting someone practice his or her religion.",
        ko: "제가 타인의 종교 활동을 막는 일을 지시·선동·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "7.g",
    gist_en:
      "This asks if you ever caused harm or suffering to anyone because of their race, religion, national origin, social group, or political opinion.",
    rephrasings: [
      "Have you ever caused harm or suffering to any person because of their race, religion, national origin, membership in a social group, or political opinion?",
      "Were you ever involved, in any way, in hurting someone because of their religion, nationality, race, or political views?",
      "Have you ever ordered, committed, or assisted with causing harm to a person because of who they are — their race, religion, or political opinion?",
      "Did you ever take part in persecuting someone because of their membership in a particular social group or their beliefs?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever harmed someone because of who they are.",
        ko: "제가 누군가를 그 정체성 때문에 해친 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever harmed someone because of their race, religion, nationality, group, or politics.",
        ko: "인종·종교·국적·소속 집단·정치 견해 때문에 제가 누군가를 해친 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever ordered, incited, committed, assisted, or otherwise participated in causing harm or suffering to a person because of their race, religion, national origin, membership in a particular social group, or political opinion.",
        ko: "제가 인종·종교·출신 국가·특정 사회집단 소속·정치적 견해를 이유로 누군가에게 해나 고통을 주는 일을 지시·선동·실행·방조하거나 그 밖의 방식으로 가담한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 8–14 · 군대 · 무장단체 · 무기 ─────────────────────────────────────────
  {
    id: "8.a",
    gist_en:
      "This asks if you have ever served in, or been a member of, any military or police unit.",
    rephrasings: [
      "Have you ever served in, been a member of, assisted, or participated in any military or police unit?",
      "Have you ever served in, or been part of, any military or police unit — in any country?",
      "At any time, did you ever serve in, help, or take part in any military or police unit?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever served in a military or police unit.",
        ko: "제가 군대나 경찰 부대에 복무한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever served in, was a member of, or helped any military or police unit.",
        ko: "제가 군대나 경찰 부대에 복무·소속·참여한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever served in, was a member of, assisted, or participated in any military or police unit.",
        ko: "제가 어떤 군대나 경찰 부대에 복무·소속·지원·참여한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "8.b",
    gist_en:
      "This asks if you ever served in or were part of any armed group, such as a paramilitary, militia, rebel, or guerrilla group.",
    rephrasings: [
      "Have you ever served in, been a member of, assisted, or participated in any armed group that carries weapons — for example a paramilitary unit, self-defense unit, vigilante group, rebel group, or guerrilla group?",
      "Were you ever part of any armed group, such as a militia, paramilitary unit, rebel group, or guerrilla group?",
      "Have you ever served in, or helped, a group that carries weapons but is not part of the official military — like a self-defense or vigilante unit?",
      "Did you ever belong to, or take part in, any armed group like a rebel group, insurgents, or a paramilitary unit?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever in an armed group like a militia.",
        ko: "제가 민병대 같은 무장단체에 속한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever served in an armed group such as a paramilitary, rebel, or guerrilla group.",
        ko: "제가 준군사·반군·게릴라 같은 무장단체에 복무한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever served in, was a member of, assisted, or participated in any armed group that carries weapons — for example a paramilitary unit, self-defense unit, vigilante unit, rebel group, or guerrilla group.",
        ko: "제가 무기를 소지한 무장단체(준군사 부대, 자위대, 자경단, 반군, 게릴라 단체 등)에 복무·소속·지원·참여한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "9",
    gist_en:
      "This asks if you ever worked or served at a place where people were detained — like a prison or camp — or took part in detaining people.",
    rephrasings: [
      "Have you ever worked, volunteered, or served in a place where people were detained — such as a prison, jail, prison camp, detention facility, or labor camp?",
      "Have you ever worked in, or served at, any place where people were held and not free to leave, like a prison or a detention camp?",
      "Did you ever direct, or take part in, any activity that involved detaining people?",
      "Have you ever worked at, or helped run, a prison, jail, labor camp, or any facility where people were kept against their will?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever worked where people were detained.",
        ko: "사람을 가두는 곳에서 제가 일한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever worked at, or helped run, a place where people were detained, like a prison or camp.",
        ko: "교도소·수용소처럼 사람을 구금하는 곳에서 제가 일하거나 운영을 도운 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever worked, volunteered, or served in a place where people were detained — such as a prison, jail, prison camp, detention facility, or labor camp — or directed or took part in detaining people.",
        ko: "제가 사람을 구금하는 장소(교도소·구치소·포로수용소·구금시설·노동수용소 등)에서 일·자원봉사·복무하거나, 사람을 구금하는 일을 지시·참여한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "10.a",
    gist_en:
      "This asks if you were ever part of, or helped, any group that used a weapon against a person or threatened to.",
    rephrasings: [
      "Were you ever a part of, or did you ever help, any group, unit, or organization that used a weapon against any person, or threatened to do so?",
      "Have you ever belonged to, or assisted, any group that used a weapon against someone, or threatened to use one?",
      "At any time, were you part of any group that used — or threatened to use — a weapon against a person?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever helped a group that used weapons.",
        ko: "사람에게 무기를 쓴 단체를 제가 도운 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever part of, or helped, a group that used or threatened a weapon against a person.",
        ko: "사람에게 무기를 쓰거나 위협한 단체에 제가 속하거나 도운 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I was ever part of, or helped, any group, unit, or organization that used a weapon against a person or threatened to do so.",
        ko: "제가 사람에게 무기를 사용했거나 사용을 위협한 단체·부대·조직에 속하거나 도운 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "10.b",
    gist_en:
      "This is a follow-up: if you were in such a group, did you yourself ever use a weapon against another person?",
    rephrasings: [
      "When you were part of that group, or helping it, did you yourself ever use a weapon against another person?",
      "If that applied to you, did you personally use a weapon against someone while you were with that group?",
      "While you were part of, or helping, that group, did you ever use a weapon on another person?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I personally used a weapon on someone.",
        ko: "제가 직접 누군가에게 무기를 쓴 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I'd been in such a group, whether I personally used a weapon against a person.",
        ko: "그런 단체에 있었다면 제가 직접 사람에게 무기를 쓴 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, when I was part of or helping that group, I myself ever used a weapon against another person.",
        ko: "제가 그 단체에 속해 있거나 도울 때 직접 다른 사람에게 무기를 사용한 적이 있는지 묻는 것입니다.",
      },
    },
    note: "10.a가 'No'이므로 저에게는 해당되지 않는 후속 질문입니다.",
  },
  {
    id: "10.c",
    gist_en:
      "This is a follow-up: if you were in such a group, did you ever threaten another person with a weapon?",
    rephrasings: [
      "When you were part of that group, or helping it, did you ever threaten another person that you would use a weapon against them?",
      "If that applied to you, did you personally threaten someone with a weapon while you were with that group?",
      "While you were part of, or helping, that group, did you ever threaten to use a weapon against a person?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I personally threatened someone with a weapon.",
        ko: "제가 직접 누군가를 무기로 위협한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I'd been in such a group, whether I personally threatened a person with a weapon.",
        ko: "그런 단체에 있었다면 제가 직접 사람을 무기로 위협한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, when I was part of or helping that group, I myself ever threatened another person that I would use a weapon against them.",
        ko: "제가 그 단체에 속해 있거나 도울 때 직접 다른 사람에게 무기를 쓰겠다고 위협한 적이 있는지 묻는 것입니다.",
      },
    },
    note: "10.a가 'No'이므로 해당 없는 후속 질문입니다.",
  },
  {
    id: "11",
    gist_en:
      "This asks if you ever sold, provided, or transported weapons — or helped someone do so — knowing they'd be used against a person.",
    rephrasings: [
      "Have you ever sold, provided, or transported weapons that you knew or believed would be used against another person?",
      "Did you ever assist anyone in selling, providing, or transporting weapons, knowing they would be used to harm someone?",
      "Have you ever supplied or moved weapons that you believed would be used against another person?",
      "At any time, did you sell, transport, or help provide weapons that you knew would be used against someone?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever sold weapons meant to harm people.",
        ko: "사람을 해칠 무기를 제가 판 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever sold, provided, or moved weapons I knew would be used against a person.",
        ko: "사람에게 쓰일 줄 알면서 제가 무기를 팔거나 제공·운반한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever sold, provided, or transported weapons — or helped someone else do so — that I knew or believed would be used against another person.",
        ko: "제가 다른 사람을 해칠 줄 알거나 믿으면서 무기를 팔거나 제공·운반하거나, 누군가가 그렇게 하도록 도운 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "12",
    gist_en:
      "This asks if you have ever received any weapons training, paramilitary training, or other military-type training.",
    rephrasings: [
      "Have you ever received any weapons training, paramilitary training, or other military-type training?",
      "Have you ever had any kind of weapons or military-style training, including paramilitary training?",
      "At any time, did you receive training in weapons, or any paramilitary or military-type training?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever received weapons or military training.",
        ko: "제가 무기나 군사 훈련을 받은 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever received weapons training, paramilitary training, or other military-type training.",
        ko: "제가 무기 훈련, 준군사 훈련, 기타 군사형 훈련을 받은 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever received any weapons training, paramilitary training, or other military-type training.",
        ko: "제가 무기 훈련, 준군사 훈련, 또는 기타 군사형 훈련을 받은 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "13",
    gist_en:
      "This asks if you ever recruited, enlisted, forced, or used anyone under 15 years old to serve in or help an armed group.",
    rephrasings: [
      "Have you ever recruited, enlisted, forced to join, or used any person under 15 years of age to serve in or help an armed group?",
      "Did you ever ask, sign up, require, or use anyone under the age of 15 to serve in or assist an armed group?",
      "Have you ever recruited or used a child younger than 15 to serve in, or help, any armed group?",
      "At any time, did you enlist or conscript a person under 15 into an armed group, or try to?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever used under-15s in an armed group.",
        ko: "제가 15세 미만을 무장단체에 이용한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever recruited, enlisted, forced, or used anyone under 15 in an armed group.",
        ko: "제가 15세 미만을 무장단체에 모집·등록·징집·이용한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever recruited, enlisted, conscripted, or used any person under 15 years old to serve in or help an armed group, or tried or worked with others to do so.",
        ko: "제가 15세 미만을 무장단체에 복무·지원시키려 모집·등록·징집·이용하거나, 그렇게 하려 시도·협력한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "14",
    gist_en:
      "This asks if you ever used anyone under 15 to take part in hostilities — combat or combat-related work.",
    rephrasings: [
      "Have you ever used any person under 15 years of age to take part in hostilities, such as fighting in combat or providing combat-related services?",
      "Did you ever use someone under 15 to take part in fighting, or in combat support like carrying supplies or serving as a messenger?",
      "Have you ever used a child younger than 15 in hostilities, or worked with others to do so?",
      "At any time, did you use anyone under 15 to participate in combat or combat-related activities?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever used anyone under 15 in fighting.",
        ko: "제가 15세 미만을 전투에 이용한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever used anyone under 15 in hostilities, including combat or combat support.",
        ko: "제가 15세 미만을 전투나 전투 지원 등 적대 행위에 이용한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever used any person under 15 to take part in hostilities — including fighting in combat or providing combat-related services like being a messenger or transporting supplies — or tried or worked with others to do so.",
        ko: "제가 15세 미만을 적대 행위(전투 참가나 전령·보급 운반 등 전투 관련 활동)에 이용하거나, 그렇게 하려 시도·협력한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 15–19 · 범죄 기록 ─────────────────────────────────────────────────────
  {
    id: "15.a",
    gist_en:
      "This asks if you ever committed — or helped, agreed, or tried to commit — a crime that you were NOT arrested for.",
    rephrasings: [
      "Have you ever committed, agreed to commit, asked someone to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?",
      "Is there any crime or offense that you committed — or helped, agreed, or tried to commit — but were never arrested for?",
      "Have you ever done, helped with, or attempted any crime or offense that did not result in an arrest?",
      "At any time, did you commit or try to commit any offense for which you were never arrested?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever committed a crime without being arrested.",
        ko: "제가 체포되지 않은 범죄를 저지른 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever committed, helped, agreed, or tried to commit a crime I wasn't arrested for.",
        ko: "제가 체포되지 않은 범죄를 저지르거나 돕거나 합의·시도한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever committed, agreed to commit, asked someone to commit, helped commit, or tried to commit a crime or offense for which I was NOT arrested.",
        ko: "제가 체포되지 않은 범죄·위법을 저지르거나, 저지르기로 합의·요청·방조·시도한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "15.b",
    gist_en:
      "This asks if you have ever been arrested, cited, detained, or charged by any law enforcement, military, or immigration official — for any reason.",
    rephrasings: [
      "Have you ever been arrested, cited, detained, or confined by any law enforcement officer, military official, or immigration official — in the U.S. or anywhere else — for any reason?",
      "For any reason at all, have you ever been arrested, cited, detained, or charged with a crime or offense, here or in another country?",
      "Has any police officer, military official, or immigration official ever arrested, cited, detained, or confined you?",
      "Have you ever been charged with a crime or offense, or been stopped and cited or detained by any official, for any reason?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever arrested, cited, detained, or charged.",
        ko: "제가 체포·인용·구금·기소된 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if any officer — police, military, or immigration — ever arrested, cited, detained, or charged me.",
        ko: "사법·군·이민 당국이 저를 체포·인용·구금·기소한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been arrested, cited, detained, or confined by any law enforcement officer, military official, or immigration official, anywhere, for any reason, or been charged with a crime or offense.",
        ko: "제가 어디서든 어떤 이유로든 사법·군·이민 당국에 의해 체포·소환(인용)·구금·억류되거나, 범죄·위법으로 기소된 적이 있는지 묻는 것입니다.",
      },
    },
    note:
      "⚠️ 가장 주의할 문항. 교통 위반 티켓·인용(citation)·구금도 모두 포함됩니다. 본인 기록에 체포·인용·구금·기소 이력이 있으면 반드시 'Yes'로 정직하게 답하고 아주 짧게 설명하세요 (언제·무엇·결과: 예) 'Yes — a citation years ago; it was resolved and I paid it.'). 기록이 전혀 없을 때만 'No'.",
  },
  {
    id: "16",
    gist_en:
      "This asks: if you ever received a suspended sentence, probation, or parole, have you completed it?",
    rephrasings: [
      "If you received a suspended sentence, were placed on probation, or were paroled, have you completed that suspended sentence, probation, or parole?",
      "If you were ever given a suspended sentence, probation, or parole, have you finished it completely?",
      "Did you complete any probation, parole, or suspended sentence that you were given?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I completed any probation or parole I had.",
        ko: "제가 받은 보호관찰·가석방을 완료했는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I'd had a suspended sentence, probation, or parole, whether I completed it.",
        ko: "제가 집행유예·보호관찰·가석방을 받았다면 그걸 완료했는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if I received a suspended sentence, was placed on probation, or was paroled, I have completed that suspended sentence, probation, or parole.",
        ko: "제가 집행유예·보호관찰·가석방을 받았다면, 그 집행유예·보호관찰·가석방을 완료했는지 묻는 것입니다.",
      },
    },
    note: "해당 이력이 없으면 저에게는 해당되지 않습니다.",
  },
  {
    id: "17.a",
    gist_en:
      "This asks if you have ever been involved in prostitution — doing it, arranging it, or profiting from it.",
    rephrasings: [
      "Have you ever engaged in prostitution, tried to bring in or arrange people for prostitution, or received any money or proceeds from prostitution?",
      "Have you ever taken part in prostitution, or made any money from it, in any way?",
      "Did you ever procure, import, or arrange people for prostitution, or profit from prostitution?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever involved in prostitution.",
        ko: "제가 매춘에 관여한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever did, arranged, or profited from prostitution.",
        ko: "제가 매춘을 하거나 알선하거나 수익을 얻은 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever engaged in prostitution, tried to procure or import people for prostitution, or received any money or proceeds from prostitution.",
        ko: "제가 매춘에 종사하거나, 매춘부를 알선·반입하려 하거나, 매춘으로 금전·수익을 받은 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.b",
    gist_en:
      "This asks if you have ever made, grown, sold, distributed, or smuggled any illegal drugs or controlled substances.",
    rephrasings: [
      "Have you ever manufactured, grown, produced, distributed, sold, or smuggled any controlled substances, illegal drugs, narcotics, or drug paraphernalia, in violation of any law?",
      "Have you ever made, cultivated, dispensed, sold, or trafficked any illegal drugs or controlled substances?",
      "Did you ever produce, distribute, sell, or smuggle illegal drugs, narcotics, or drug paraphernalia, against the law of any U.S. state or country?",
      "Have you ever been involved in manufacturing, selling, or smuggling controlled substances or illegal drugs?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever sold or smuggled illegal drugs.",
        ko: "제가 불법 마약을 팔거나 밀수한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever made, sold, distributed, or smuggled illegal drugs or controlled substances.",
        ko: "제가 불법 마약·규제 약물을 제조·판매·유통·밀수한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I ever manufactured, cultivated, produced, distributed, sold, or smuggled any controlled substances, illegal drugs, narcotics, or drug paraphernalia, in violation of any law.",
        ko: "제가 어떤 법령을 위반하여 규제 약물·불법 마약·마약 도구를 제조·재배·생산·유통·판매하거나 밀수한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.c",
    gist_en:
      "This asks if you have ever been married to more than one person at the same time.",
    rephrasings: [
      "Have you ever been married to more than one person at the same time?",
      "At any time, were you legally married to two or more people at once?",
      "Have you ever had more than one spouse at the same time?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever married to two people at once.",
        ko: "제가 동시에 두 사람과 결혼한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever married to more than one person at the same time.",
        ko: "제가 동시에 두 명 이상과 결혼한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been married to more than one person at the same time.",
        ko: "제가 동시에 두 명 이상과 결혼한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.d",
    gist_en:
      "This asks if you ever married someone just to get an immigration benefit, like a green card.",
    rephrasings: [
      "Have you ever married someone in order to obtain an immigration benefit?",
      "Did you ever marry a person just to get an immigration benefit, such as a green card or visa?",
      "Have you ever entered into a marriage for the purpose of gaining an immigration benefit?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever married just to get immigration benefits.",
        ko: "제가 이민 혜택만을 위해 결혼한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever married someone only to obtain an immigration benefit, like a green card.",
        ko: "제가 영주권 같은 이민 혜택만을 위해 누군가와 결혼한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever married someone in order to obtain an immigration benefit.",
        ko: "제가 이민 혜택을 얻기 위해 누군가와 결혼한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.e",
    gist_en:
      "This asks if you have ever helped anyone enter, or try to enter, the United States illegally.",
    rephrasings: [
      "Have you ever helped anyone to enter, or try to enter, the United States illegally?",
      "Did you ever assist any person in entering, or attempting to enter, the U.S. unlawfully?",
      "Have you ever helped someone cross into the United States illegally, or try to?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever helped someone enter the U.S. illegally.",
        ko: "제가 누군가의 미국 불법 입국을 도운 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever helped anyone enter, or try to enter, the U.S. illegally.",
        ko: "제가 누군가가 미국에 불법 입국하거나 시도하는 것을 도운 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever helped anyone to enter, or try to enter, the United States illegally.",
        ko: "제가 타인이 미국에 불법으로 입국하거나 입국하려는 것을 도운 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.f",
    gist_en:
      "This asks if you have ever gambled illegally or made money from illegal gambling.",
    rephrasings: [
      "Have you ever gambled illegally, or received any income from illegal gambling?",
      "Did you ever take part in illegal gambling, or earn money from it?",
      "Have you ever made any income from unlawful gambling or betting?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever gambled illegally or profited from it.",
        ko: "제가 불법 도박을 하거나 그로 수익을 얻은 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever gambled illegally or received any income from illegal gambling.",
        ko: "제가 불법 도박을 하거나 불법 도박으로 수입을 받은 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever gambled illegally or received income from illegal gambling.",
        ko: "제가 불법 도박을 하거나 불법 도박으로 수입을 받은 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.g",
    gist_en:
      "This asks if you have ever failed to support your dependents — like not paying child support or alimony.",
    rephrasings: [
      "Have you ever failed to support your dependents — such as not paying child support — or failed to pay alimony ordered by a court?",
      "Did you ever fail to provide for your dependents, or to pay court-ordered child support or alimony?",
      "Have you ever not paid child support, or not paid alimony that a court ordered after a divorce or separation?",
      "At any time, did you fail to financially support your dependents or pay required alimony?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever failed to pay support I owed.",
        ko: "제가 내야 할 부양비를 안 낸 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever failed to support my dependents — like child support or alimony.",
        ko: "제가 부양가족 부양(양육비·위자료)을 하지 않은 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever failed to support my dependents, such as not paying child support, or failed to pay alimony ordered by a court after divorce or separation.",
        ko: "제가 부양가족을 부양하지 않거나(양육비 미지급), 이혼·별거 후 법원이 명령한 위자료를 내지 않은 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "17.h",
    gist_en:
      "This asks if you have ever given false information to get a public benefit in the U.S.",
    rephrasings: [
      "Have you ever made any misrepresentation — given any false information — to obtain a public benefit in the United States?",
      "Did you ever provide false or misleading information in order to get a public benefit?",
      "Have you ever lied or misrepresented something to receive any public benefit in the U.S.?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever lied to get a public benefit.",
        ko: "제가 공공 혜택을 받으려 거짓말한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever gave false information to obtain a public benefit in the U.S.",
        ko: "제가 미국에서 공공 혜택을 받으려 허위 정보를 준 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever made any misrepresentation to obtain any public benefit in the United States.",
        ko: "제가 미국에서 공공 혜택을 받기 위해 허위 진술을 한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "18",
    gist_en:
      "This asks if you have ever given any U.S. government official information or documents that were false, fraudulent, or misleading.",
    rephrasings: [
      "Have you ever given any U.S. Government officials any information or documents that were false, fraudulent, or misleading?",
      "Did you ever provide false, fraudulent, or misleading information or documentation to any U.S. Government official?",
      "Have you ever submitted information or papers to a U.S. official that were untrue, fake, or misleading?",
      "At any time, did you give a U.S. Government official anything false or misleading — information or documents?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever gave false information to U.S. officials.",
        ko: "제가 미국 관리에게 허위 정보를 준 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever gave U.S. officials information or documents that were false, fraudulent, or misleading.",
        ko: "제가 미국 관리에게 허위·사기·오해를 부르는 정보나 서류를 준 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading.",
        ko: "제가 미국 정부 관리에게 허위·사기·오해를 부르는 정보나 서류를 준 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "19",
    gist_en:
      "This asks if you ever lied to U.S. officials to enter the country or to get immigration benefits.",
    rephrasings: [
      "Have you ever lied to any U.S. Government officials to gain entry or admission into the United States, or to get immigration benefits while in the U.S.?",
      "Did you ever lie to a U.S. official in order to enter the country, or to obtain immigration benefits while here?",
      "Have you ever made false statements to U.S. officials to be admitted into the United States or to gain immigration benefits?",
      "At any time, did you lie to immigration or other U.S. officials to get into the country or to gain status?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever lied to enter or get immigration benefits.",
        ko: "제가 입국이나 이민 혜택을 위해 거짓말한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever lied to U.S. officials to gain entry or to get immigration benefits.",
        ko: "제가 입국하거나 이민 혜택을 얻으려 미국 관리에게 거짓말한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever lied to any U.S. Government officials to gain entry or admission into the United States, or to gain immigration benefits while in the United States.",
        ko: "제가 미국 입국·입장을 얻거나 미국 내에서 이민 혜택을 얻기 위해 미국 정부 관리에게 거짓말한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 20–21 · 추방 ──────────────────────────────────────────────────────────
  {
    id: "20",
    gist_en:
      "This asks if you have ever been placed in removal, rescission, or deportation proceedings.",
    rephrasings: [
      "Have you ever been placed in removal, rescission, or deportation proceedings?",
      "Were you ever put into removal or deportation proceedings by the government?",
      "Has the government ever started removal, rescission, or deportation proceedings against you?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever in removal proceedings.",
        ko: "제가 추방 절차에 회부된 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever placed in removal, rescission, or deportation proceedings.",
        ko: "제가 추방·취소·강제퇴거 절차에 회부된 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been placed in removal, rescission, or deportation proceedings.",
        ko: "제가 추방·취소·강제퇴거 절차에 회부된 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "21",
    gist_en:
      "This asks if you have ever actually been removed or deported from the United States.",
    rephrasings: [
      "Have you ever been removed or deported from the United States?",
      "Were you ever actually removed or deported from this country?",
      "Has the United States ever removed or deported you?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever removed or deported from the U.S.",
        ko: "제가 미국에서 추방된 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if the U.S. government ever removed or deported me from the country.",
        ko: "미국 정부가 저를 추방하거나 강제퇴거시킨 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been removed or deported from the United States.",
        ko: "제가 미국에서 추방되거나 강제퇴거된 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 22–29 · 병역 등록 · 미군 복무 ─────────────────────────────────────────
  {
    id: "22.a",
    gist_en:
      "This asks if you are a male who lived in the U.S. at any time between your 18th and 26th birthdays.",
    rephrasings: [
      "Are you a male who lived in the United States at any time between your 18th and 26th birthdays?",
      "Did you live in the United States as a man at any point between the ages of 18 and 26?",
      "Were you a male present in the U.S. at any time between your 18th and 26th birthdays?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I'm a male who lived here ages 18–26.",
        ko: "제가 18~26세에 미국에 산 남성인지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I'm a male who lived in the U.S. at any time between 18 and 26.",
        ko: "제가 18세에서 26세 사이에 미국에 거주한 남성인지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I am a male who lived in the United States at any time between my 18th and 26th birthdays (not counting time as a lawful nonimmigrant).",
        ko: "제가 18번째 생일부터 26번째 생일 사이에 미국에 거주한 적이 있는 남성인지 묻는 것입니다 (합법 비이민 신분이던 기간 제외).",
      },
    },
    note: "본인 상황에 따라 사실대로 답하세요 (해당하면 Yes).",
  },
  {
    id: "22.b",
    gist_en:
      "This is a follow-up: if 22.a is Yes, did you register for the Selective Service?",
    rephrasings: [
      "If that applies to you, did you register for the Selective Service?",
      "Did you sign up with the Selective Service — the U.S. system for the draft?",
      "Have you registered for the Selective Service?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I registered for the Selective Service.",
        ko: "제가 병역 등록(Selective Service)을 했는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if that applied to me, whether I registered for the Selective Service.",
        ko: "해당된다면 제가 병역 등록제에 등록했는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if I answered yes to 22.a, I registered for the Selective Service.",
        ko: "제가 22.a에 'Yes'라고 했다면 Selective Service(병역 등록제)에 등록했는지 묻는 것입니다.",
      },
    },
    note: "22.a가 Yes인 경우에만. 등록했으면 Yes.",
  },
  {
    id: "23",
    gist_en:
      "This asks if you have ever left the U.S. to avoid being drafted into the armed forces.",
    rephrasings: [
      "Have you ever left the United States in order to avoid being drafted into the U.S. armed forces?",
      "Did you ever leave the country to avoid being drafted into the military?",
      "Have you ever gone abroad specifically to escape being drafted into the U.S. armed forces?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever left the U.S. to avoid the draft.",
        ko: "제가 징집을 피하려 미국을 떠난 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever left the United States to avoid being drafted into the military.",
        ko: "제가 미군 징집을 피하려고 미국을 떠난 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever left the United States to avoid being drafted into the U.S. armed forces.",
        ko: "제가 미군 징집을 피하려고 미국을 떠난 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "24",
    gist_en:
      "This asks if you have ever applied for any kind of exemption from U.S. military service.",
    rephrasings: [
      "Have you ever applied for any kind of exemption from military service in the U.S. armed forces?",
      "Did you ever apply for any type of exemption from serving in the U.S. military?",
      "Have you ever requested to be exempted from military service in the armed forces?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever applied for a military service exemption.",
        ko: "제가 군 복무 면제를 신청한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I ever applied for any kind of exemption from U.S. military service.",
        ko: "제가 미군 복무에서 어떤 면제든 신청한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever applied for any kind of exemption from military service in the U.S. armed forces.",
        ko: "제가 미군 복무에서 어떤 종류의 면제든 신청한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "25",
    gist_en: "This asks if you have ever served in the U.S. armed forces.",
    rephrasings: [
      "Have you ever served in the U.S. armed forces?",
      "Were you ever a member of the United States military?",
      "At any time, did you serve in the U.S. armed forces?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever served in the U.S. military.",
        ko: "제가 미군에서 복무한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I have ever served in the U.S. armed forces.",
        ko: "제가 미군에서 복무한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever served in the U.S. armed forces.",
        ko: "제가 미군에서 복무한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "26.a",
    gist_en: "This asks if you are currently a member of the U.S. armed forces.",
    rephrasings: [
      "Are you currently a member of the U.S. armed forces?",
      "At this time, are you serving in the United States military?",
      "Right now, are you a member of the U.S. armed forces?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I'm currently in the U.S. military.",
        ko: "제가 현재 미군 소속인지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I am currently a member of the U.S. armed forces.",
        ko: "제가 현재 미군 소속인지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I am currently a member of the U.S. armed forces.",
        ko: "제가 현재 미군 소속인지 묻는 것입니다.",
      },
    },
  },
  {
    id: "26.b",
    gist_en:
      "This is a follow-up: if you're in the military, are you scheduled to deploy outside the U.S. within 3 months?",
    rephrasings: [
      "If that applies to you, are you scheduled to deploy outside the United States, including to a vessel, within the next 3 months?",
      "Are you set to be deployed outside the U.S. within the next three months?",
      "Is a deployment outside the country, including to a ship, scheduled for you within 3 months?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I'm deploying abroad within three months.",
        ko: "제가 3개월 내 해외 파병 예정인지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I were in the military, whether I'm scheduled to deploy abroad within 3 months.",
        ko: "제가 군인이라면 3개월 내에 해외로 파병될 예정인지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if I'm in the armed forces, I'm scheduled to deploy outside the United States, including to a vessel, within the next 3 months.",
        ko: "제가 미군 소속이라면 향후 3개월 내에 미국 밖(함정 포함)으로 파병될 예정인지 묻는 것입니다.",
      },
    },
    note: "26.a가 No이므로 해당 없음.",
  },
  {
    id: "26.c",
    gist_en:
      "This is a follow-up: if you're in the military, are you currently stationed outside the U.S.?",
    rephrasings: [
      "If that applies to you, are you currently stationed outside the United States?",
      "Right now, are you stationed outside the U.S.?",
      "Are you presently posted or stationed outside the United States?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I'm currently stationed outside the U.S.",
        ko: "제가 현재 미국 밖에 주둔 중인지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I were in the military, whether I'm currently stationed outside the U.S.",
        ko: "제가 군인이라면 현재 미국 밖에 주둔 중인지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if I'm in the armed forces, I am currently stationed outside the United States.",
        ko: "제가 미군 소속이라면 현재 미국 밖에 주둔 중인지 묻는 것입니다.",
      },
    },
    note: "26.a가 No이므로 해당 없음.",
  },
  {
    id: "26.d",
    gist_en:
      "This is a follow-up: if you're not currently serving, are you a former U.S. service member living outside the U.S.?",
    rephrasings: [
      "If you're not currently serving, are you a former U.S. military service member who now lives outside the United States?",
      "Are you a former member of the U.S. military who is currently residing outside the U.S.?",
      "Did you previously serve in the U.S. military and now live outside the country?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I'm a former service member living abroad.",
        ko: "제가 해외 거주 중인 전직 군인인지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I'm not serving now, whether I'm a former U.S. service member living abroad.",
        ko: "제가 현재 복무 중이 아니라면 해외 거주 전직 미군인지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if I answered no to 26.a, I am a former U.S. military service member who currently resides outside the United States.",
        ko: "제가 26.a에 'No'라고 했다면, 현재 미국 밖에 거주하는 전직 미군 복무자인지 묻는 것입니다.",
      },
    },
    note: "해당 없음.",
  },
  {
    id: "27",
    gist_en:
      "This asks if you were ever court-martialed or got a discharge that was other than honorable, bad conduct, or dishonorable.",
    rephrasings: [
      "While in the U.S. armed forces, have you ever been court-martialed, or received a discharge characterized as other than honorable, bad conduct, or dishonorable?",
      "Were you ever court-martialed, or given a discharge that was less than honorable — such as bad conduct or dishonorable — during your military service?",
      "Have you ever, while serving in the U.S. military, been tried by court-martial or discharged as other than honorable?",
      "Did you ever receive a bad-conduct, dishonorable, or other-than-honorable discharge from the U.S. armed forces?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was ever court-martialed or badly discharged.",
        ko: "제가 군사재판을 받거나 불명예 전역한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever court-martialed, or discharged as other than honorable, bad conduct, or dishonorable.",
        ko: "제가 군사재판을 받거나 명예제대가 아닌 전역(불명예·품행불량 등)을 한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been court-martialed, or received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces.",
        ko: "제가 미군 복무 중 군사재판을 받거나, 명예제대가 아닌(불명예·품행불량 등) 전역을 한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "28",
    gist_en:
      "This asks if you were ever discharged from U.S. military training or service because you were an alien (non-citizen).",
    rephrasings: [
      "Have you ever been discharged from training or service in the U.S. armed forces because you were an alien?",
      "Were you ever released from U.S. military training or service because you were not a citizen?",
      "Did the U.S. military ever discharge you because you were a foreign national?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I was discharged for being a non-citizen.",
        ko: "제가 외국인이라는 이유로 전역당한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I was ever discharged from U.S. military service because I was an alien.",
        ko: "제가 외국인이라는 이유로 미군 복무에서 전역당한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever been discharged from training or service in the U.S. armed forces because I was an alien.",
        ko: "제가 외국인이라는 이유로 미군 훈련이나 복무에서 전역당한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "29",
    gist_en: "This asks if you have ever deserted from the U.S. armed forces.",
    rephrasings: [
      "Have you ever deserted from the U.S. armed forces?",
      "Did you ever leave the U.S. military without permission — that is, desert?",
      "At any time, did you desert from the United States armed forces?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I ever deserted from the U.S. military.",
        ko: "제가 미군에서 탈영한 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I have ever deserted from the U.S. armed forces.",
        ko: "제가 미군에서 탈영한 적 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I have ever deserted from the U.S. armed forces.",
        ko: "제가 미군에서 탈영한 적이 있는지 묻는 것입니다.",
      },
    },
  },
  // ── 30 · 귀족 칭호 ────────────────────────────────────────────────────────
  {
    id: "30.a",
    gist_en:
      "This asks if you have now, or ever had, a hereditary title or order of nobility in a foreign country.",
    rephrasings: [
      "Do you now have, or did you ever have, a hereditary title or an order of nobility in any foreign country?",
      "Have you ever held a noble title or rank of nobility in another country?",
      "Do you currently hold, or have you ever held, a hereditary title or order of nobility abroad?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if I have, or ever had, a foreign noble title.",
        ko: "제가 외국의 귀족 칭호를 가졌거나 가진 적 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I now have, or ever had, a hereditary title or nobility in a foreign country.",
        ko: "제가 외국의 세습 작위나 귀족 칭호를 지금 또는 과거에 가졌는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I now have, or did I ever have, a hereditary title or an order of nobility in any foreign country.",
        ko: "제가 외국의 세습 작위나 귀족 칭호를 지금 가지고 있거나 가진 적이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "30.b",
    gist_en:
      "This is a follow-up: if you have a foreign title, are you willing to give it up at your naturalization ceremony?",
    rephrasings: [
      "If that applies to you, are you willing to give up any inherited titles or orders of nobility at your naturalization ceremony?",
      "Would you be willing to give up any foreign title or order of nobility at the naturalization ceremony?",
      "Are you willing to renounce any noble titles you hold in a foreign country at your ceremony?",
    ],
    model_answer: "해당시",
    restatement_tiers: {
      short: {
        en: "You're asking if I'd give up any foreign title at the ceremony.",
        ko: "제가 귀화식에서 외국 칭호를 포기할지 묻는 거죠.",
      },
      medium: {
        en: "You're asking, if I had a foreign title, whether I'd give it up at my naturalization ceremony.",
        ko: "제가 외국 칭호가 있다면 귀화식에서 그것을 포기할 의향이 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if I answered yes to 30.a, I am willing to give up any inherited titles or orders of nobility at my naturalization ceremony.",
        ko: "제가 30.a에 'Yes'라고 했다면, 귀화식에서 외국의 세습 작위나 귀족 칭호를 포기할 의향이 있는지 묻는 것입니다.",
      },
    },
    note: "30.a가 No이므로 해당 없음.",
  },
  // ── 31–37 · 헌법 · 충성 선서 ──────────────────────────────────────────────
  {
    id: "31",
    gist_en:
      "This asks if you support the Constitution and form of government of the United States.",
    rephrasings: [
      "Do you support the Constitution and form of Government of the United States?",
      "Do you support the Constitution and the system of government of the United States?",
      "Are you in support of the U.S. Constitution and its form of government?",
    ],
    model_answer: "Yes",
    restatement_tiers: {
      short: {
        en: "You're asking if I support the Constitution and U.S. government.",
        ko: "제가 헌법과 미국 정부 형태를 지지하는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I support the Constitution and the form of government of the U.S.",
        ko: "제가 미국 헌법과 정부 형태를 지지하는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I support the Constitution and form of Government of the United States.",
        ko: "제가 미국 헌법과 정부 형태를 지지하는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "32",
    gist_en: "This asks if you understand the full Oath of Allegiance to the United States.",
    rephrasings: [
      "Do you understand the full Oath of Allegiance to the United States?",
      "Do you understand the complete Oath of Allegiance that you will take?",
      "Do you understand everything in the full Oath of Allegiance to the U.S.?",
    ],
    model_answer: "Yes",
    restatement_tiers: {
      short: {
        en: "You're asking if I understand the full Oath of Allegiance.",
        ko: "제가 충성 선서 전문을 이해하는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I understand the full Oath of Allegiance to the United States.",
        ko: "제가 미국에 대한 충성 선서 전문을 이해하는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I understand the full Oath of Allegiance to the United States.",
        ko: "제가 미국에 대한 충성 선서 전문을 이해하는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "33",
    gist_en:
      "This asks if you are UNABLE to take the Oath because of a physical/developmental disability or mental impairment.",
    rephrasings: [
      "Are you unable to take the Oath of Allegiance because of a physical or developmental disability or a mental impairment?",
      "Is there any physical or mental disability that makes you unable to take the Oath of Allegiance?",
      "Are you prevented from taking the Oath because of a developmental disability or mental impairment?",
    ],
    model_answer: "No",
    restatement_tiers: {
      short: {
        en: "You're asking if a disability prevents me from taking the oath.",
        ko: "제가 장애로 선서를 못 하는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I'm unable to take the Oath because of a disability or mental impairment.",
        ko: "제가 장애나 정신적 손상 때문에 선서를 할 수 없는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I am unable to take the Oath of Allegiance because of a physical or developmental disability or mental impairment.",
        ko: "제가 신체적·발달적 장애나 정신적 손상 때문에 충성 선서를 할 수 없는지 묻는 것입니다.",
      },
    },
    note: "이 문항은 'No'가 정상 답변입니다 (선서 가능하다는 뜻).",
  },
  {
    id: "34",
    gist_en: "This asks if you are willing to take the full Oath of Allegiance.",
    rephrasings: [
      "Are you willing to take the full Oath of Allegiance to the United States?",
      "Are you willing to take the complete Oath of Allegiance to the U.S.?",
      "Will you take the entire Oath of Allegiance to the United States?",
    ],
    model_answer: "Yes",
    restatement_tiers: {
      short: {
        en: "You're asking if I'm willing to take the full oath.",
        ko: "제가 충성 선서 전문을 할 의향이 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I'm willing to take the full Oath of Allegiance to the U.S.",
        ko: "제가 미국에 대한 충성 선서 전문을 할 의향이 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether I am willing to take the full Oath of Allegiance to the United States.",
        ko: "제가 미국에 대한 충성 선서 전문을 할 의향이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "35",
    gist_en:
      "This asks if, when the law requires it, you are willing to bear arms (carry weapons) for the United States.",
    rephrasings: [
      "If the law requires it, are you willing to bear arms — carry weapons — on behalf of the United States?",
      "Should the law require it, would you be willing to carry weapons for the United States?",
      "If required by law, are you willing to bear arms on behalf of this country?",
    ],
    model_answer: "Yes",
    restatement_tiers: {
      short: {
        en: "You're asking if I'd bear arms for the U.S. if required.",
        ko: "법이 요구하면 미국을 위해 무기를 들 의향이 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I'm willing to bear arms for the U.S. when the law requires it.",
        ko: "법이 요구할 때 제가 미국을 위해 무기를 들 의향이 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if the law requires it, I am willing to bear arms (carry weapons) on behalf of the United States.",
        ko: "법이 요구하면 제가 미국을 위해 무기를 들(휴대할) 의향이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "36",
    gist_en:
      "This asks if, when the law requires it, you are willing to do noncombatant service in the armed forces.",
    rephrasings: [
      "If the law requires it, are you willing to perform noncombatant services — work that does not include fighting in a war — in the U.S. armed forces?",
      "Should the law require it, would you serve in the armed forces in a noncombatant role that does not involve fighting?",
      "If required by law, are you willing to do noncombatant service in the U.S. military?",
    ],
    model_answer: "Yes",
    restatement_tiers: {
      short: {
        en: "You're asking if I'd do noncombatant service if required.",
        ko: "법이 요구하면 비전투 복무를 할 의향이 있는지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I'm willing to do noncombatant service in the armed forces when required.",
        ko: "법이 요구할 때 제가 미군에서 비전투 복무를 할 의향이 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if the law requires it, I am willing to perform noncombatant services in the U.S. armed forces.",
        ko: "법이 요구하면 제가 미군에서 비전투 복무(전쟁에서 싸우지 않는 일)를 할 의향이 있는지 묻는 것입니다.",
      },
    },
  },
  {
    id: "37",
    gist_en:
      "This asks if, when the law requires it, you are willing to do work of national importance under civilian direction.",
    rephrasings: [
      "If the law requires it, are you willing to perform work of national importance under civilian direction — non-military work the government considers important?",
      "Should the law require it, would you do work of national importance under civilian direction?",
      "If required by law, are you willing to perform important non-military work for the country under civilian direction?",
    ],
    model_answer: "Yes",
    restatement_tiers: {
      short: {
        en: "You're asking if I'd do national-importance civilian work if required.",
        ko: "법이 요구하면 민간 지휘 하 국가 중요 업무를 할지 묻는 거죠.",
      },
      medium: {
        en: "You're asking if I'm willing to do work of national importance under civilian direction when required.",
        ko: "법이 요구할 때 제가 민간 지휘 하에 국가적으로 중요한 일을 할 의향이 있는지 묻는 거죠.",
      },
      long: {
        en: "You're asking whether, if the law requires it, I am willing to perform work of national importance under civilian direction.",
        ko: "법이 요구하면 제가 민간 지휘 하에 국가적으로 중요한 일을 할 의향이 있는지 묻는 것입니다.",
      },
    },
  },
];

// ── 리퍼레이즈 한국어 번역 (RESTATE_ITEMS.rephrasings와 id·순서 1:1 대응) ───────
//  영어 원문은 위 RESTATE_ITEMS에 그대로 두고, 의미를 충실히 옮긴 한국어를 같은
//  index로 여기서 병합한다. (오피서가 실제로 묻듯 자연스러운 존댓말 질문체)
export const REPHRASING_KO: Record<string, string[]> = {
  "1": [
    "서면이든 다른 어떤 방식으로든 미국 시민이라고 주장한 적이 있습니까?",
    "실제로는 아니면서, 언제든 누군가에게 말하거나 서류에 미국 시민이라고 기재한 적이 있습니까?",
    "서면이나 다른 방식으로 본인이 미국 시민이라고 내세우거나 주장한 적이 있습니까?",
    "일자리나 혜택을 얻기 위해, 혹은 다른 어떤 이유로든 미국 시민이라고 주장한 적이 있습니까?",
  ],
  "2": [
    "미국의 연방·주·지방 선거 어디서든 투표 등록을 하거나 투표한 적이 있습니까?",
    "연방이든 주든 지방이든, 이곳의 어떤 선거에서든 투표 신청을 하거나 실제로 투표한 적이 있습니까?",
    "이곳에 온 이후 언제든, 미국의 어떤 선거에서든 투표 등록을 하거나 투표한 적이 있습니까?",
    "이 나라의 어떤 선거에서든 유권자 등록에 이름을 올리거나 투표에 참여한 적이 있습니까?",
  ],
  "3": [
    "현재 미국에 체납된 연방·주·지방 세금이 있습니까?",
    "지금 기한이 지났거나 납부하지 않은 연방·주·지방 세금이 있습니까?",
    "현재 정부에 아직 내지 않은 체납 세금이 있습니까?",
  ],
  "4": [
    "합법적 영주권자가 된 이후, 연방·주·지방 세금 신고에서 본인을 '비거주 외국인'이라고 칭한 적이 있습니까?",
    "영주권을 받은 이후, 세금을 비거주자로 신고하거나, 본인을 비거주자라고 여겨 신고를 하지 않은 적이 있습니까?",
    "영주권자가 된 후, 어떤 세금 신고에서든 비거주 외국인이라고 주장한 적이 있습니까?",
    "본인을 비거주자라고 생각해서 세금 신고를 하지 않기로 한 적이 있습니까?",
  ],
  "5.a": [
    "전 세계 어디서든 공산당이나 전체주의 정당에 소속되거나 관여하거나 어떤 식으로든 연관된 적이 있습니까?",
    "어떤 나라에서든 공산당이나 전체주의 정당에 속하거나 관여하거나 연관된 적이 있습니까?",
    "언제든 전 세계 어디서든, 공산당이나 전체주의 정당의 일원이거나 어떤 식으로든 연관된 적이 있습니까?",
  ],
  "5.b": [
    "무력이나 폭력에 의한 미국 정부 전복, 세계 공산주의, 또는 미국 내 전체주의 독재를 옹호 — 즉 지지하거나 조장 — 한 적이 있습니까?",
    "모든 조직된 정부에 대한 반대, 또는 무력이나 기타 위헌적 수단에 의한 정부 전복을 지지하거나, 그것을 지지하는 단체에 속한 적이 있습니까?",
    "공무원 가해, 불법적 재산 손괴, 또는 사보타주를 옹호하거나, 그런 것을 옹호하는 단체와 연관된 적이 있습니까?",
    "미국 정부나 모든 형태의 법을 폭력으로 전복하는 것을 조장하거나, 그것을 조장하는 단체에 어디서든 속한 적이 있습니까?",
  ],
  "6.a": [
    "사람을 해치거나 재산을 손괴하기 위해 무기나 폭발물을 사용한 단체에 소속되거나, 그 단체에 돈·서비스·기타 지원을 제공한 적이 있습니까?",
    "사람을 해치거나 재산을 파괴할 의도로 무기나 폭발물을 사용한 단체와 연관되거나 그 단체에 도움을 제공한 적이 있습니까?",
    "다른 사람이나 재산에 무기나 폭발물을 사용한 단체를 돈·노동·서비스 등 어떤 식으로든 지원한 적이 있습니까?",
    "누군가를 다치게 하거나 피해를 입힐 의도로 무기나 폭발물을 사용한 단체에 속하거나 어떤 식으로든 도운 적이 있습니까?",
  ],
  "6.b": [
    "납치, 암살, 또는 항공기·선박·기타 차량의 하이재킹이나 사보타주에 가담한 단체에 소속되거나 그 단체를 지원한 적이 있습니까?",
    "납치·암살·하이재킹에 가담한 단체와 연관되거나, 그 단체에 돈·노동·서비스를 제공한 적이 있습니까?",
    "암살, 납치, 또는 항공기·선박·차량 등 교통수단의 사보타주에 가담한 단체를 어떤 식으로든 지원한 적이 있습니까?",
    "납치, 암살, 또는 교통수단 하이재킹을 저지른 단체를 돕거나 그 단체에 속한 적이 있습니까?",
  ],
  "6.c": [
    "6.a 또는 6.b의 행위를 위협·시도·공모·계획하거나 다른 사람에게 저지르도록 부추긴 단체에 소속되거나 어떤 식으로든 지원한 적이 있습니까?",
    "그러한 폭력 행위를 준비·계획하거나 옹호한 단체와 연관되거나 그 단체를 지원한 적이 있습니까?",
    "6.a나 6.b에 기술된 행위를 다른 사람이 실행하도록 선동하거나 부추긴 단체를 돕거나 그 단체에 속한 적이 있습니까?",
    "그러한 행위를 시도·공모·계획한 단체에 돈·서비스·지원을 제공한 적이 있습니까?",
  ],
  "7.a": [
    "고문을 지시·실행·방조하거나 어떤 식으로든 가담한 적이 있습니까?",
    "누군가에 대한 고문을 선동·요구·방조하거나 그 밖의 방식으로 가담한 적이 있습니까?",
    "지시하든 실행하든 돕든, 어떤 식으로든 누군가를 고문하는 데 관여한 적이 있습니까?",
  ],
  "7.b": [
    "집단학살을 지시·실행·방조하거나 어떤 식으로든 가담한 적이 있습니까?",
    "집단학살을 선동·요구·방조하거나 그 밖의 방식으로 가담한 적이 있습니까?",
    "지시하든 실행하든 돕든, 어떤 식으로든 집단학살 행위에 관여한 적이 있습니까?",
  ],
  "7.c": [
    "누군가를 죽이거나 죽이려 한 일을 지시·실행·방조하거나 그 밖의 방식으로 가담한 적이 있습니까?",
    "누군가를 죽이거나 죽이려 한 일을 선동·방조하거나 어떤 식으로든 가담한 적이 있습니까?",
    "어떤 식으로든 사람을 죽이거나 죽이려는 일에 관여한 적이 있습니까?",
  ],
  "7.d": [
    "고의로 사람을 심하게 다치게 하거나 다치게 하려 한 일을 지시·실행·방조하거나 그 밖의 방식으로 가담한 적이 있습니까?",
    "다른 사람에게 고의로 중상을 입히는 일을 돕거나 어떤 식으로든 가담한 적이 있습니까?",
    "고의로 누군가를 심하게 다치게 하거나 그러려고 시도하는 일에 어떤 식으로든 가담한 적이 있습니까?",
  ],
  "7.e": [
    "동의하지 않았거나 동의할 수 없는 사람과 어떤 형태로든 성적 접촉이나 행위에 가담한 적이 있습니까?",
    "동의하지 않았거나, 동의할 수 없었거나, 강요·위협당하던 사람과의 성적 접촉에 관여한 적이 있습니까?",
    "본인이든 다른 사람에 의해서든 강요·위협당하던 사람과의 성적 행위를 실행·방조하거나 그 밖의 방식으로 가담한 적이 있습니까?",
    "동의할 수 없었거나 강요당하던 사람과 성적 접촉을 한 적이 있습니까?",
  ],
  "7.f": [
    "누군가가 자신의 종교를 실천하지 못하게 하는 일을 지시·실행·방조하거나 그 밖의 방식으로 가담한 적이 있습니까?",
    "어떤 식으로든 사람이 자신의 종교를 실천하지 못하게 막는 일에 관여한 적이 있습니까?",
    "누군가가 자신의 신앙을 실천하는 것을 막는 일을 돕거나 어떤 식으로든 가담한 적이 있습니까?",
  ],
  "7.g": [
    "인종, 종교, 출신 국가, 특정 사회집단 소속, 또는 정치적 견해를 이유로 누군가에게 해나 고통을 가한 적이 있습니까?",
    "종교, 국적, 인종, 또는 정치적 견해를 이유로 누군가를 해치는 일에 어떤 식으로든 관여한 적이 있습니까?",
    "인종·종교·정치적 견해 등 그 사람의 정체성을 이유로 그에게 해를 가하는 일을 지시·실행·방조한 적이 있습니까?",
    "특정 사회집단 소속이나 신념을 이유로 누군가를 박해하는 일에 가담한 적이 있습니까?",
  ],
  "8.a": [
    "어떤 군대나 경찰 부대에서든 복무하거나, 소속되거나, 지원하거나, 참여한 적이 있습니까?",
    "어느 나라에서든 군대나 경찰 부대에 복무하거나 속한 적이 있습니까?",
    "언제든 어떤 군대나 경찰 부대에서 복무하거나 돕거나 참여한 적이 있습니까?",
  ],
  "8.b": [
    "무기를 소지하는 무장단체 — 예를 들어 준군사 부대, 자위대, 자경단, 반군, 게릴라 단체 등 — 에서 복무하거나, 소속되거나, 지원하거나, 참여한 적이 있습니까?",
    "민병대, 준군사 부대, 반군, 게릴라 단체 같은 무장단체에 속한 적이 있습니까?",
    "정규군은 아니지만 무기를 소지하는 단체 — 자위대나 자경단 같은 — 에서 복무하거나 그 단체를 도운 적이 있습니까?",
    "반군, 무장 반란 세력, 준군사 부대 같은 무장단체에 속하거나 참여한 적이 있습니까?",
  ],
  "9": [
    "사람들이 구금되던 장소 — 교도소, 구치소, 포로수용소, 구금시설, 노동수용소 등 — 에서 일하거나 자원봉사하거나 복무한 적이 있습니까?",
    "교도소나 구금 수용소처럼 사람들이 떠날 자유 없이 갇혀 있던 장소에서 일하거나 복무한 적이 있습니까?",
    "사람을 구금하는 활동을 지휘하거나 그에 가담한 적이 있습니까?",
    "교도소, 구치소, 노동수용소, 또는 사람들이 의사에 반해 갇혀 있던 시설에서 일하거나 운영을 도운 적이 있습니까?",
  ],
  "10.a": [
    "사람에게 무기를 사용하거나 사용하겠다고 위협한 단체·부대·조직에 속하거나 그것을 도운 적이 있습니까?",
    "누군가에게 무기를 사용했거나 사용하겠다고 위협한 단체에 속하거나 그 단체를 지원한 적이 있습니까?",
    "언제든 사람에게 무기를 사용했거나 사용하겠다고 위협한 단체에 속한 적이 있습니까?",
  ],
  "10.b": [
    "그 단체에 속해 있거나 그 단체를 도울 때, 본인이 직접 다른 사람에게 무기를 사용한 적이 있습니까?",
    "해당된다면, 그 단체에 있는 동안 본인이 직접 누군가에게 무기를 사용한 적이 있습니까?",
    "그 단체에 속해 있거나 돕는 동안 다른 사람에게 무기를 사용한 적이 있습니까?",
  ],
  "10.c": [
    "그 단체에 속해 있거나 그 단체를 도울 때, 다른 사람에게 무기를 쓰겠다고 위협한 적이 있습니까?",
    "해당된다면, 그 단체에 있는 동안 본인이 직접 누군가를 무기로 위협한 적이 있습니까?",
    "그 단체에 속해 있거나 돕는 동안 사람에게 무기를 쓰겠다고 위협한 적이 있습니까?",
  ],
  "11": [
    "다른 사람에게 사용될 것을 알았거나 그렇게 믿으면서 무기를 팔거나 제공하거나 운반한 적이 있습니까?",
    "누군가를 해치는 데 쓰일 것을 알면서 무기를 팔거나 제공하거나 운반하는 일을 도운 적이 있습니까?",
    "다른 사람에게 사용될 것이라고 믿으면서 무기를 공급하거나 옮긴 적이 있습니까?",
    "언제든 누군가에게 사용될 것을 알면서 무기를 팔거나 운반하거나 제공하는 것을 도운 적이 있습니까?",
  ],
  "12": [
    "무기 훈련, 준군사 훈련, 또는 기타 군사형 훈련을 받은 적이 있습니까?",
    "준군사 훈련을 포함해 어떤 형태의 무기 훈련이나 군사형 훈련을 받은 적이 있습니까?",
    "언제든 무기 훈련이나 준군사·군사형 훈련을 받은 적이 있습니까?",
  ],
  "13": [
    "15세 미만인 사람을 무장단체에 복무시키거나 돕게 하려고 모집·등록·강제 가입시키거나 이용한 적이 있습니까?",
    "15세 미만인 사람에게 무장단체에 복무하거나 지원하도록 요청·등록·요구하거나 그를 이용한 적이 있습니까?",
    "15세 미만 아동을 무장단체에 복무시키거나 돕게 하려고 모집하거나 이용한 적이 있습니까?",
    "언제든 15세 미만인 사람을 무장단체에 입대시키거나 징집했거나, 그러려고 시도한 적이 있습니까?",
  ],
  "14": [
    "전투에 참가하거나 전투 관련 활동을 제공하는 등, 15세 미만인 사람을 적대 행위에 이용한 적이 있습니까?",
    "15세 미만인 사람을 전투에 참가시키거나, 보급품 운반이나 전령 같은 전투 지원에 이용한 적이 있습니까?",
    "15세 미만 아동을 적대 행위에 이용하거나, 그렇게 하려고 다른 사람과 함께 한 적이 있습니까?",
    "언제든 15세 미만인 사람을 전투나 전투 관련 활동에 참여시키려고 이용한 적이 있습니까?",
  ],
  "15.a": [
    "체포되지 않은 범죄나 위법 행위를 저지르거나, 저지르기로 합의하거나, 누군가에게 저지르도록 요청하거나, 저지르는 것을 돕거나, 저지르려고 시도한 적이 있습니까?",
    "본인이 저질렀거나 돕거나 합의하거나 시도했지만 체포된 적은 없는 범죄나 위법 행위가 있습니까?",
    "체포로 이어지지 않은 범죄나 위법 행위를 하거나 돕거나 시도한 적이 있습니까?",
    "언제든 체포된 적 없는 위법 행위를 저지르거나 저지르려고 시도한 적이 있습니까?",
  ],
  "15.b": [
    "미국이든 다른 어디서든, 어떤 이유로든 사법·군·이민 당국 관리에 의해 체포·소환(인용)·구금·억류된 적이 있습니까?",
    "어떤 이유로든, 이곳에서든 다른 나라에서든 체포·인용·구금되거나 범죄·위법으로 기소된 적이 있습니까?",
    "경찰관, 군 관리, 또는 이민 당국 관리가 당신을 체포·인용·구금·억류한 적이 있습니까?",
    "어떤 이유로든 범죄·위법으로 기소되거나, 어떤 관리에게 제지당해 인용되거나 구금된 적이 있습니까?",
  ],
  "16": [
    "집행유예를 받았거나, 보호관찰에 처해졌거나, 가석방되었다면, 그 집행유예·보호관찰·가석방을 완료했습니까?",
    "집행유예·보호관찰·가석방을 받은 적이 있다면, 그것을 완전히 마쳤습니까?",
    "받은 보호관찰·가석방·집행유예를 모두 완료했습니까?",
  ],
  "17.a": [
    "매춘에 종사하거나, 매춘을 위해 사람을 들이거나 알선하려 하거나, 매춘으로 금전이나 수익을 받은 적이 있습니까?",
    "어떤 식으로든 매춘에 가담하거나 그로부터 돈을 번 적이 있습니까?",
    "매춘을 위해 사람을 알선·반입·주선하거나 매춘으로 이익을 얻은 적이 있습니까?",
  ],
  "17.b": [
    "어떤 법령을 위반하여 규제 약물, 불법 마약, 마약류, 또는 마약 도구를 제조·재배·생산·유통·판매하거나 밀수한 적이 있습니까?",
    "불법 마약이나 규제 약물을 만들거나 재배·조제·판매하거나 밀매한 적이 있습니까?",
    "미국의 어느 주나 어느 나라의 법을 어기고 불법 마약, 마약류, 또는 마약 도구를 생산·유통·판매하거나 밀수한 적이 있습니까?",
    "규제 약물이나 불법 마약을 제조·판매·밀수하는 일에 관여한 적이 있습니까?",
  ],
  "17.c": [
    "동시에 두 명 이상과 결혼한 적이 있습니까?",
    "언제든 동시에 두 명 이상과 법적으로 혼인 상태였던 적이 있습니까?",
    "동시에 배우자가 둘 이상이었던 적이 있습니까?",
  ],
  "17.d": [
    "이민 혜택을 얻기 위해 누군가와 결혼한 적이 있습니까?",
    "영주권이나 비자 같은 이민 혜택만을 얻으려고 누군가와 결혼한 적이 있습니까?",
    "이민 혜택을 얻을 목적으로 혼인한 적이 있습니까?",
  ],
  "17.e": [
    "누군가가 미국에 불법으로 입국하거나 입국하려는 것을 도운 적이 있습니까?",
    "누군가가 미국에 불법으로 입국하거나 입국을 시도하는 것을 도운 적이 있습니까?",
    "누군가가 미국으로 불법으로 넘어오거나 그러려고 시도하는 것을 도운 적이 있습니까?",
  ],
  "17.f": [
    "불법 도박을 하거나 불법 도박으로 수입을 받은 적이 있습니까?",
    "불법 도박에 가담하거나 그로부터 돈을 번 적이 있습니까?",
    "불법 도박이나 내기로 수입을 올린 적이 있습니까?",
  ],
  "17.g": [
    "부양가족을 부양하지 않거나(예: 양육비 미지급), 법원이 명령한 위자료를 내지 않은 적이 있습니까?",
    "부양가족을 부양하지 않거나, 법원이 명령한 양육비나 위자료를 내지 않은 적이 있습니까?",
    "양육비를 내지 않거나, 이혼·별거 후 법원이 명령한 위자료를 내지 않은 적이 있습니까?",
    "언제든 부양가족을 경제적으로 부양하지 않거나 정해진 위자료를 내지 않은 적이 있습니까?",
  ],
  "17.h": [
    "미국에서 공공 혜택을 받기 위해 허위 진술 — 거짓 정보 제공 — 을 한 적이 있습니까?",
    "공공 혜택을 받으려고 허위이거나 오해를 부르는 정보를 제공한 적이 있습니까?",
    "미국에서 공공 혜택을 받으려고 거짓말하거나 사실을 왜곡한 적이 있습니까?",
  ],
  "18": [
    "미국 정부 관리에게 허위이거나 기만적이거나 오해를 부르는 정보나 서류를 준 적이 있습니까?",
    "미국 정부 관리에게 허위·기만·오해를 부르는 정보나 서류를 제공한 적이 있습니까?",
    "미국 관리에게 사실이 아니거나 위조되었거나 오해를 부르는 정보나 서류를 제출한 적이 있습니까?",
    "언제든 미국 정부 관리에게 허위이거나 오해를 부르는 것 — 정보나 서류 — 을 준 적이 있습니까?",
  ],
  "19": [
    "미국에 입국·입장하기 위해, 또는 미국 체류 중 이민 혜택을 얻기 위해 미국 정부 관리에게 거짓말한 적이 있습니까?",
    "이 나라에 입국하기 위해, 또는 체류 중 이민 혜택을 얻기 위해 미국 관리에게 거짓말한 적이 있습니까?",
    "미국에 입국 허가를 받거나 이민 혜택을 얻기 위해 미국 관리에게 허위 진술을 한 적이 있습니까?",
    "언제든 이 나라에 들어오거나 신분을 얻기 위해 이민 당국이나 다른 미국 관리에게 거짓말한 적이 있습니까?",
  ],
  "20": [
    "추방, (영주권) 취소, 또는 강제퇴거 절차에 회부된 적이 있습니까?",
    "정부에 의해 추방이나 강제퇴거 절차에 회부된 적이 있습니까?",
    "정부가 당신을 상대로 추방·취소·강제퇴거 절차를 시작한 적이 있습니까?",
  ],
  "21": [
    "미국에서 추방되거나 강제퇴거된 적이 있습니까?",
    "이 나라에서 실제로 추방되거나 강제퇴거된 적이 있습니까?",
    "미국이 당신을 추방하거나 강제퇴거시킨 적이 있습니까?",
  ],
  "22.a": [
    "18번째 생일과 26번째 생일 사이 언제든 미국에 거주한 남성입니까?",
    "18세에서 26세 사이 어느 시점에든 남성으로서 미국에 거주한 적이 있습니까?",
    "18번째 생일과 26번째 생일 사이 언제든 미국에 있었던 남성입니까?",
  ],
  "22.b": [
    "해당된다면, 병역 등록(Selective Service)을 했습니까?",
    "미국의 징병 제도인 Selective Service에 등록했습니까?",
    "병역 등록제(Selective Service)에 등록했습니까?",
  ],
  "23": [
    "미군에 징집되는 것을 피하려고 미국을 떠난 적이 있습니까?",
    "군에 징집되는 것을 피하려고 이 나라를 떠난 적이 있습니까?",
    "미군 징집을 피할 목적으로 일부러 해외로 나간 적이 있습니까?",
  ],
  "24": [
    "미군 복무에서 어떤 종류든 면제를 신청한 적이 있습니까?",
    "미군 복무 면제를 어떤 형태로든 신청한 적이 있습니까?",
    "군 복무에서 면제해 달라고 요청한 적이 있습니까?",
  ],
  "25": [
    "미군에서 복무한 적이 있습니까?",
    "미국 군대의 일원이었던 적이 있습니까?",
    "언제든 미군에서 복무한 적이 있습니까?",
  ],
  "26.a": [
    "현재 미군 소속입니까?",
    "현재 미국 군대에서 복무 중입니까?",
    "지금 미군 소속입니까?",
  ],
  "26.b": [
    "해당된다면, 향후 3개월 이내에 미국 밖(함정 포함)으로 파병될 예정입니까?",
    "향후 3개월 이내에 미국 밖으로 파병될 예정입니까?",
    "3개월 이내에 함정을 포함해 이 나라 밖으로의 파병이 예정되어 있습니까?",
  ],
  "26.c": [
    "해당된다면, 현재 미국 밖에 주둔 중입니까?",
    "지금 미국 밖에 주둔 중입니까?",
    "현재 미국 밖에 배치되거나 주둔해 있습니까?",
  ],
  "26.d": [
    "현재 복무 중이 아니라면, 지금 미국 밖에 거주하는 전직 미군 복무자입니까?",
    "현재 미국 밖에 거주하고 있는 전직 미군 복무자입니까?",
    "이전에 미군에서 복무했고 지금은 이 나라 밖에 거주합니까?",
  ],
  "27": [
    "미군 복무 중 군사재판을 받거나, 명예제대가 아닌(불명예·품행불량 등) 전역을 받은 적이 있습니까?",
    "군 복무 중 군사재판을 받거나, 명예제대에 못 미치는 전역 — 품행불량이나 불명예 같은 — 을 받은 적이 있습니까?",
    "미군에서 복무하는 동안 군사재판에 회부되거나 명예제대가 아닌 형태로 전역한 적이 있습니까?",
    "미군에서 품행불량·불명예·기타 비명예 전역을 받은 적이 있습니까?",
  ],
  "28": [
    "외국인이라는 이유로 미군 훈련이나 복무에서 전역당한 적이 있습니까?",
    "시민이 아니라는 이유로 미군 훈련이나 복무에서 면제·해제된 적이 있습니까?",
    "외국 국적자라는 이유로 미군이 당신을 전역시킨 적이 있습니까?",
  ],
  "29": [
    "미군에서 탈영한 적이 있습니까?",
    "허가 없이 미군을 이탈한 적 — 즉 탈영한 적 — 이 있습니까?",
    "언제든 미군에서 탈영한 적이 있습니까?",
  ],
  "30.a": [
    "어떤 외국에서든 세습 작위나 귀족 칭호를 지금 가지고 있거나 가진 적이 있습니까?",
    "다른 나라에서 귀족 칭호나 귀족 지위를 가진 적이 있습니까?",
    "해외에서 세습 작위나 귀족 칭호를 현재 보유하고 있거나 보유한 적이 있습니까?",
  ],
  "30.b": [
    "해당된다면, 귀화식에서 물려받은 작위나 귀족 칭호를 포기할 의향이 있습니까?",
    "귀화식에서 외국의 작위나 귀족 칭호를 포기할 의향이 있습니까?",
    "귀화식에서 외국에 보유한 귀족 칭호를 포기할 의향이 있습니까?",
  ],
  "31": [
    "미국의 헌법과 정부 형태를 지지합니까?",
    "미국의 헌법과 정부 체제를 지지합니까?",
    "미국 헌법과 그 정부 형태를 지지하는 입장입니까?",
  ],
  "32": [
    "미국에 대한 충성 선서 전문을 이해합니까?",
    "당신이 하게 될 충성 선서 전문을 이해합니까?",
    "미국에 대한 충성 선서 전문의 모든 내용을 이해합니까?",
  ],
  "33": [
    "신체적·발달적 장애나 정신적 손상 때문에 충성 선서를 할 수 없습니까?",
    "충성 선서를 할 수 없게 만드는 신체적·정신적 장애가 있습니까?",
    "발달 장애나 정신적 손상 때문에 선서를 하지 못합니까?",
  ],
  "34": [
    "미국에 대한 충성 선서 전문을 할 의향이 있습니까?",
    "미국에 대한 충성 선서 전문을 할 의향이 있습니까?",
    "미국에 대한 충성 선서 전체를 하겠습니까?",
  ],
  "35": [
    "법이 요구한다면, 미국을 위해 무기를 들 — 무기를 휴대할 — 의향이 있습니까?",
    "법이 요구한다면, 미국을 위해 무기를 휴대할 의향이 있습니까?",
    "법으로 요구된다면, 이 나라를 위해 무기를 들 의향이 있습니까?",
  ],
  "36": [
    "법이 요구한다면, 미군에서 비전투 복무 — 전쟁에서 싸우는 것을 포함하지 않는 일 — 를 할 의향이 있습니까?",
    "법이 요구한다면, 싸움을 수반하지 않는 비전투 역할로 군에서 복무하겠습니까?",
    "법으로 요구된다면, 미군에서 비전투 복무를 할 의향이 있습니까?",
  ],
  "37": [
    "법이 요구한다면, 민간 지휘 하에 국가적으로 중요한 일 — 정부가 중요하다고 여기는 비군사 업무 — 을 할 의향이 있습니까?",
    "법이 요구한다면, 민간 지휘 하에 국가적으로 중요한 일을 하겠습니까?",
    "법으로 요구된다면, 민간 지휘 하에 이 나라를 위한 중요한 비군사 업무를 할 의향이 있습니까?",
  ],
};

// ── 표현별 맞춤 재진술 (RESTATE_ITEMS.rephrasings와 id·순서 1:1 대응) ──────────
//  각 리퍼레이즈의 단어에 맞춰 "You're asking if I …" 한 줄 답을 살짝 바꾼 것.
//  의미는 동일(짧은 답 No/Yes도 동일)하고 표현만 그 질문에 맞춤. en+ko.
export const REPHRASING_RESTATE: Record<string, RestatementTier[]> = {
  "1": [
    { en: "You're asking if I ever claimed to be a U.S. citizen, in writing or any other way.", ko: "제가 서면이든 다른 방식으로든 미국 시민이라고 주장한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever told someone, or wrote on a form, that I was a U.S. citizen when I wasn't.", ko: "제가 사실이 아닌데 누군가에게 말하거나 서류에 미국 시민이라고 적은 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever represented or claimed, in writing or otherwise, that I'm a U.S. citizen.", ko: "제가 서면이나 다른 방식으로 미국 시민이라고 내세우거나 주장한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever claimed to be a U.S. citizen to get a job, a benefit, or for any reason.", ko: "제가 일자리나 혜택 등 어떤 이유로든 미국 시민이라고 주장한 적 있는지 묻는 거죠." },
  ],
  "2": [
    { en: "You're asking if I ever registered to vote or voted in any federal, state, or local U.S. election.", ko: "제가 연방·주·지방 어떤 미국 선거에서든 투표 등록을 하거나 투표한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever signed up to vote or cast a vote in any election here — federal, state, or local.", ko: "제가 연방·주·지방 어떤 선거에서든 투표 신청을 하거나 표를 던진 적 있는지 묻는 거죠." },
    { en: "You're asking if, since I've been here, I ever registered to vote or voted in any U.S. election.", ko: "제가 이곳에 온 이후 미국 선거에서 투표 등록을 하거나 투표한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever put my name on voter registration or took part in voting in any election here.", ko: "제가 이 나라 선거에서 유권자 등록에 이름을 올리거나 투표에 참여한 적 있는지 묻는 거죠." },
  ],
  "3": [
    { en: "You're asking if I currently owe any overdue federal, state, or local taxes.", ko: "제가 현재 연방·주·지방의 체납 세금이 있는지 묻는 거죠." },
    { en: "You're asking if, right now, I owe any past-due or unpaid federal, state, or local taxes.", ko: "제가 지금 기한이 지났거나 미납된 연방·주·지방 세금이 있는지 묻는 거죠." },
    { en: "You're asking if, at this time, I still owe any overdue taxes to the government.", ko: "제가 현재 정부에 아직 내지 않은 체납 세금이 있는지 묻는 거죠." },
  ],
  "4": [
    { en: "You're asking if, since my green card, I ever called myself a nonresident alien on a tax return.", ko: "제가 영주권 이후 세금 신고에서 스스로를 비거주 외국인이라 한 적 있는지 묻는 거죠." },
    { en: "You're asking if, since my green card, I filed as a nonresident or skipped filing for that reason.", ko: "제가 영주권 이후 비거주자로 신고하거나 그 이유로 신고를 안 한 적 있는지 묻는 거죠." },
    { en: "You're asking if, after becoming a resident, I ever claimed to be a nonresident alien on a tax return.", ko: "제가 영주권자가 된 후 세금 신고에서 비거주 외국인이라 주장한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever chose not to file a tax return because I thought I was a nonresident.", ko: "제가 비거주자라고 생각해 세금 신고를 안 하기로 한 적 있는지 묻는 거죠." },
  ],
  "5.a": [
    { en: "You're asking if I was ever a member of, involved in, or associated with a Communist or totalitarian party anywhere.", ko: "제가 세계 어디서든 공산당·전체주의 정당에 소속·관여·연관된 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever belonged to or had any connection with a Communist or totalitarian party in any country.", ko: "제가 어느 나라에서든 공산당·전체주의 정당에 속하거나 연관된 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever, anywhere, a member of or associated with a Communist or totalitarian party.", ko: "제가 언제 어디서든 공산당·전체주의 정당에 소속·연관된 적 있는지 묻는 거죠." },
  ],
  "5.b": [
    { en: "You're asking if I ever advocated overthrowing the U.S. government by force, world communism, or a U.S. dictatorship.", ko: "제가 무력에 의한 미국 정부 전복·세계 공산주의·미국 내 독재를 옹호한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever supported, or joined a group supporting, opposing all government or overthrowing it unlawfully.", ko: "제가 모든 정부 반대나 위헌적 정부 전복을 지지하거나 그런 단체에 속한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever advocated, or joined a group advocating, harming officials, damaging property, or sabotage.", ko: "제가 공무원 가해·재산 손괴·사보타주를 옹호하거나 그런 단체에 연관된 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever promoted, or joined a group promoting, the violent overthrow of the U.S. government or all law.", ko: "제가 미국 정부나 모든 법의 폭력적 전복을 조장하거나 그런 단체에 속한 적 있는지 묻는 거죠." },
  ],
  "6.a": [
    { en: "You're asking if I was ever a member of, or gave support to, a group that used weapons or explosives to harm people or property.", ko: "제가 사람·재산을 해치려 무기·폭발물을 쓴 단체에 속하거나 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever associated with, or assisted, a group that used weapons or explosives to harm people or destroy property.", ko: "제가 사람·재산을 해칠 의도로 무기·폭발물을 쓴 단체에 연관·지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever supported, with money, labor, or services, a group that used a weapon or explosive against a person or property.", ko: "제가 사람·재산에 무기·폭발물을 쓴 단체를 돈·노동·서비스로 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever belonged to, or helped, a group that used a weapon or explosive to hurt someone or cause damage.", ko: "제가 누군가를 해치려 무기·폭발물을 쓴 단체에 속하거나 도운 적 있는지 묻는 거죠." },
  ],
  "6.b": [
    { en: "You're asking if I was ever a member of, or supported, a group that did kidnapping, assassination, or hijacking of a plane, ship, or vehicle.", ko: "제가 납치·암살·항공기·선박·차량 하이재킹을 한 단체에 속하거나 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever associated with, or gave money, labor, or services to, a group that did kidnapping, assassination, or hijacking.", ko: "제가 납치·암살·하이재킹을 한 단체에 연관되거나 돈·노동·서비스를 준 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever supported a group that did assassination, kidnapping, or sabotage of a plane, ship, or vehicle.", ko: "제가 암살·납치·교통수단 사보타주를 한 단체를 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever helped, or belonged to, a group that carried out kidnappings, assassinations, or hijackings.", ko: "제가 납치·암살·하이재킹을 저지른 단체를 돕거나 거기 속한 적 있는지 묻는 거죠." },
  ],
  "6.c": [
    { en: "You're asking if I was ever in, or supported, a group that threatened, tried, planned, or encouraged the acts in 6.a or 6.b.", ko: "제가 6.a·6.b의 행위를 위협·시도·계획·선동한 단체에 속하거나 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever associated with, or supported, a group that prepared, planned, or advocated those violent acts.", ko: "제가 그런 폭력 행위를 준비·계획·옹호한 단체에 연관·지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever helped, or belonged to, a group that incited others to carry out the acts in 6.a or 6.b.", ko: "제가 6.a·6.b의 행위를 선동한 단체를 돕거나 거기 속한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever gave money, services, or support to a group that tried, conspired, or planned those acts.", ko: "제가 그런 행위를 시도·공모·계획한 단체에 돈·서비스·지원을 준 적 있는지 묻는 거죠." },
  ],
  "7.a": [
    { en: "You're asking if I ever ordered, committed, assisted with, or took part in torture.", ko: "제가 고문을 지시·실행·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever incited, called for, helped with, or otherwise took part in torturing someone.", ko: "제가 고문을 선동·요구·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in torturing someone — ordering, doing, or helping with it.", ko: "제가 고문을 지시·실행·방조하는 식으로든 관여한 적 있는지 묻는 거죠." },
  ],
  "7.b": [
    { en: "You're asking if I ever ordered, committed, assisted with, or took part in genocide.", ko: "제가 집단학살을 지시·실행·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever incited, called for, helped with, or took part in genocide.", ko: "제가 집단학살을 선동·요구·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in genocide — ordering, carrying it out, or assisting.", ko: "제가 집단학살을 지시·실행·방조하는 식으로든 관여한 적 있는지 묻는 거죠." },
  ],
  "7.c": [
    { en: "You're asking if I ever ordered, committed, assisted with, or took part in killing or trying to kill anyone.", ko: "제가 사람을 죽이거나 죽이려 한 일을 지시·실행·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever incited, helped with, or took part in killing or trying to kill someone.", ko: "제가 사람을 죽이거나 죽이려 한 일을 선동·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in killing, or trying to kill, a person.", ko: "제가 사람을 죽이거나 죽이려는 일에 관여한 적 있는지 묻는 거죠." },
  ],
  "7.d": [
    { en: "You're asking if I ever ordered, committed, assisted with, or took part in intentionally injuring, or trying to injure, someone.", ko: "제가 고의로 사람을 심하게 다치게 하거나 시도한 일을 지시·실행·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever helped with, or took part in, deliberately causing serious injury to someone.", ko: "제가 고의로 사람에게 중상을 입히는 일을 돕거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever took part in intentionally and severely injuring someone, or attempting to.", ko: "제가 고의로 사람을 심하게 다치게 하거나 시도하는 일에 가담한 적 있는지 묻는 거죠." },
  ],
  "7.e": [
    { en: "You're asking if I ever had any sexual contact with someone who didn't or couldn't consent.", ko: "제가 동의하지 않았거나 할 수 없는 사람과 성적 접촉을 한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in sexual contact with someone who didn't agree, couldn't agree, or was forced or threatened.", ko: "제가 동의 안 했거나 못 했거나 강요·위협당한 사람과 성적 접촉에 관여한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever committed, assisted with, or took part in sexual activity with someone being forced or threatened.", ko: "제가 강요·위협당한 사람과의 성적 행위를 실행·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever had sexual contact with someone who couldn't agree or was being coerced.", ko: "제가 동의할 수 없거나 강요당한 사람과 성적 접촉을 한 적 있는지 묻는 거죠." },
  ],
  "7.f": [
    { en: "You're asking if I ever ordered, committed, assisted with, or took part in stopping someone from practicing their religion.", ko: "제가 누군가의 종교 활동을 막는 일을 지시·실행·방조하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in preventing someone from practicing their religion.", ko: "제가 사람의 종교 활동을 막는 일에 관여한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever helped with, or took part in, stopping someone from practicing their faith.", ko: "제가 누군가의 신앙 실천을 막는 일을 돕거나 가담한 적 있는지 묻는 거죠." },
  ],
  "7.g": [
    { en: "You're asking if I ever harmed someone because of their race, religion, national origin, social group, or politics.", ko: "제가 인종·종교·국적·소속 집단·정치 견해 때문에 누군가에게 해를 가한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in hurting someone because of their religion, nationality, race, or political views.", ko: "제가 종교·국적·인종·정치 견해 때문에 누군가를 해치는 일에 관여한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever ordered, committed, or assisted with harming someone for their race, religion, or political opinion.", ko: "제가 인종·종교·정치 견해 때문에 누군가를 해치는 일을 지시·실행·방조한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever took part in persecuting someone for their social group or beliefs.", ko: "제가 특정 사회집단 소속이나 신념 때문에 누군가를 박해하는 데 가담한 적 있는지 묻는 거죠." },
  ],
  "8.a": [
    { en: "You're asking if I ever served in, was a member of, assisted, or took part in any military or police unit.", ko: "제가 군대·경찰 부대에 복무·소속·지원·참여한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever served in or was part of any military or police unit, in any country.", ko: "제가 어느 나라에서든 군대·경찰 부대에 복무하거나 속한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever served in, helped, or took part in any military or police unit.", ko: "제가 군대·경찰 부대에 복무·지원·참여한 적 있는지 묻는 거죠." },
  ],
  "8.b": [
    { en: "You're asking if I ever served in or supported an armed group like a paramilitary, self-defense, vigilante, rebel, or guerrilla group.", ko: "제가 준군사·자위대·자경단·반군·게릴라 같은 무장단체에 복무·지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever part of an armed group such as a militia, paramilitary, rebel, or guerrilla group.", ko: "제가 민병대·준군사·반군·게릴라 같은 무장단체에 속한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever served in or helped a non-official armed group, like a self-defense or vigilante unit.", ko: "제가 정규군이 아닌 무장단체(자위대·자경단 등)에 복무하거나 도운 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever belonged to or took part in an armed group like rebels, insurgents, or a paramilitary unit.", ko: "제가 반군·반란세력·준군사 같은 무장단체에 속하거나 참여한 적 있는지 묻는 거죠." },
  ],
  "9": [
    { en: "You're asking if I ever worked, volunteered, or served where people were detained, like a prison or camp.", ko: "제가 교도소·수용소처럼 사람을 구금하는 곳에서 일·자원봉사·복무한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever worked at a place where people were held and not free to leave, like a prison or detention camp.", ko: "제가 사람들이 떠날 수 없이 갇힌 곳(교도소·구금 수용소)에서 일한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever directed or took part in any activity that involved detaining people.", ko: "제가 사람을 구금하는 활동을 지휘하거나 가담한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever worked at or helped run a prison, jail, labor camp, or any place where people were held against their will.", ko: "제가 교도소·노동수용소 등 사람을 강제로 가둔 시설에서 일하거나 운영을 도운 적 있는지 묻는 거죠." },
  ],
  "10.a": [
    { en: "You're asking if I was ever part of, or helped, a group that used a weapon against a person or threatened to.", ko: "제가 사람에게 무기를 쓰거나 위협한 단체에 속하거나 도운 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever belonged to or assisted a group that used a weapon on someone or threatened to.", ko: "제가 누군가에게 무기를 쓰거나 위협한 단체에 속하거나 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever part of a group that used, or threatened to use, a weapon against a person.", ko: "제가 사람에게 무기를 쓰거나 쓰겠다고 위협한 단체에 속한 적 있는지 묻는 거죠." },
  ],
  "10.b": [
    { en: "You're asking if, while in that group, I myself ever used a weapon against another person.", ko: "제가 그 단체에 있을 때 직접 다른 사람에게 무기를 쓴 적 있는지 묻는 거죠." },
    { en: "You're asking if, had that applied to me, I personally used a weapon against someone in that group.", ko: "해당됐다면 제가 그 단체에 있을 때 직접 누군가에게 무기를 쓴 적 있는지 묻는 거죠." },
    { en: "You're asking if, while part of or helping that group, I ever used a weapon on another person.", ko: "제가 그 단체에 속하거나 돕는 동안 다른 사람에게 무기를 쓴 적 있는지 묻는 거죠." },
  ],
  "10.c": [
    { en: "You're asking if, while in that group, I ever threatened someone that I'd use a weapon on them.", ko: "제가 그 단체에 있을 때 누군가에게 무기를 쓰겠다고 위협한 적 있는지 묻는 거죠." },
    { en: "You're asking if, had that applied to me, I personally threatened someone with a weapon in that group.", ko: "해당됐다면 제가 그 단체에 있을 때 직접 누군가를 무기로 위협한 적 있는지 묻는 거죠." },
    { en: "You're asking if, while part of or helping that group, I ever threatened to use a weapon against a person.", ko: "제가 그 단체에 속하거나 돕는 동안 사람에게 무기를 쓰겠다고 위협한 적 있는지 묻는 거죠." },
  ],
  "11": [
    { en: "You're asking if I ever sold, provided, or transported weapons I knew would be used against someone.", ko: "제가 사람에게 쓰일 줄 알면서 무기를 팔거나 제공·운반한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever helped anyone sell, provide, or transport weapons knowing they'd harm someone.", ko: "제가 사람을 해칠 줄 알면서 무기 판매·제공·운반을 도운 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever supplied or moved weapons I believed would be used against someone.", ko: "제가 사람에게 쓰일 거라 믿으며 무기를 공급·운반한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever sold, transported, or helped provide weapons I knew would be used against someone.", ko: "제가 사람에게 쓰일 줄 알면서 무기를 팔거나 운반·제공을 도운 적 있는지 묻는 거죠." },
  ],
  "12": [
    { en: "You're asking if I ever received weapons, paramilitary, or other military-type training.", ko: "제가 무기·준군사·기타 군사형 훈련을 받은 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever had any weapons or military-style training, including paramilitary.", ko: "제가 준군사를 포함해 무기·군사형 훈련을 받은 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever received training in weapons, or any paramilitary or military-type training.", ko: "제가 무기 훈련이나 준군사·군사형 훈련을 받은 적 있는지 묻는 거죠." },
  ],
  "13": [
    { en: "You're asking if I ever recruited, enlisted, forced, or used anyone under 15 to serve in or help an armed group.", ko: "제가 15세 미만을 무장단체에 복무·지원시키려 모집·등록·강제·이용한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever asked, signed up, required, or used anyone under 15 to serve in or assist an armed group.", ko: "제가 15세 미만에게 무장단체 복무·지원을 요청·등록·요구하거나 이용한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever recruited or used a child under 15 to serve in or help an armed group.", ko: "제가 15세 미만 아동을 무장단체에 복무·지원시키려 모집·이용한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever enlisted or conscripted someone under 15 into an armed group, or tried to.", ko: "제가 15세 미만을 무장단체에 입대·징집했거나 시도한 적 있는지 묻는 거죠." },
  ],
  "14": [
    { en: "You're asking if I ever used anyone under 15 in hostilities, like combat or combat-related services.", ko: "제가 15세 미만을 전투나 전투 관련 활동 등 적대 행위에 이용한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever used someone under 15 in fighting or combat support, like carrying supplies or being a messenger.", ko: "제가 15세 미만을 전투나 보급·전령 같은 전투 지원에 이용한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever used a child under 15 in hostilities, or worked with others to do so.", ko: "제가 15세 미만 아동을 적대 행위에 이용하거나 그러려 협력한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever used anyone under 15 in combat or combat-related activities.", ko: "제가 15세 미만을 전투나 전투 관련 활동에 이용한 적 있는지 묻는 거죠." },
  ],
  "15.a": [
    { en: "You're asking if I ever committed, agreed to, asked for, helped, or tried to commit a crime I wasn't arrested for.", ko: "제가 체포되지 않은 범죄를 저지르거나 합의·요청·방조·시도한 적 있는지 묻는 거죠." },
    { en: "You're asking if there's any crime I committed, helped, agreed, or tried to commit but was never arrested for.", ko: "제가 저지르거나 돕거나 합의·시도했지만 체포된 적 없는 범죄가 있는지 묻는 거죠." },
    { en: "You're asking if I ever did, helped with, or attempted a crime that didn't lead to an arrest.", ko: "제가 체포로 이어지지 않은 범죄를 하거나 돕거나 시도한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever committed or tried to commit any offense I was never arrested for.", ko: "제가 체포된 적 없는 위법을 저지르거나 시도한 적 있는지 묻는 거죠." },
  ],
  "15.b": [
    { en: "You're asking if I was ever arrested, cited, detained, or confined by any official, anywhere, for any reason.", ko: "제가 어디서든 어떤 이유로든 당국에 체포·인용·구금·억류된 적 있는지 묻는 거죠." },
    { en: "You're asking if, for any reason, I was ever arrested, cited, detained, or charged, here or abroad.", ko: "제가 어떤 이유로든 국내외에서 체포·인용·구금·기소된 적 있는지 묻는 거죠." },
    { en: "You're asking if any police, military, or immigration official ever arrested, cited, detained, or confined me.", ko: "경찰·군·이민 당국이 저를 체포·인용·구금·억류한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever charged with a crime, or stopped and cited or detained by any official, for any reason.", ko: "제가 어떤 이유로든 범죄로 기소되거나 관리에게 제지·인용·구금된 적 있는지 묻는 거죠." },
  ],
  "16": [
    { en: "You're asking if, had I gotten a suspended sentence, probation, or parole, I completed it.", ko: "제가 집행유예·보호관찰·가석방을 받았다면 그걸 완료했는지 묻는 거죠." },
    { en: "You're asking if, had I been given a suspended sentence, probation, or parole, I fully finished it.", ko: "제가 집행유예·보호관찰·가석방을 받았다면 완전히 마쳤는지 묻는 거죠." },
    { en: "You're asking if I completed any probation, parole, or suspended sentence I was given.", ko: "제가 받은 보호관찰·가석방·집행유예를 완료했는지 묻는 거죠." },
  ],
  "17.a": [
    { en: "You're asking if I ever did prostitution, arranged people for it, or took money from it.", ko: "제가 매춘을 하거나 사람을 알선하거나 그 수익을 받은 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever took part in prostitution or made money from it.", ko: "제가 매춘에 가담하거나 그로 돈을 번 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever procured, imported, or arranged people for prostitution, or profited from it.", ko: "제가 매춘을 위해 사람을 알선·반입·주선하거나 이익을 얻은 적 있는지 묻는 거죠." },
  ],
  "17.b": [
    { en: "You're asking if I ever made, grew, distributed, sold, or smuggled illegal drugs or drug paraphernalia.", ko: "제가 불법 마약·마약 도구를 제조·재배·유통·판매·밀수한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever made, cultivated, dispensed, sold, or trafficked illegal drugs.", ko: "제가 불법 마약·규제 약물을 만들거나 재배·조제·판매·밀매한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever produced, distributed, sold, or smuggled illegal drugs or paraphernalia against any law.", ko: "제가 법을 어기고 불법 마약·마약 도구를 생산·유통·판매·밀수한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever involved in manufacturing, selling, or smuggling illegal drugs.", ko: "제가 규제 약물·불법 마약 제조·판매·밀수에 관여한 적 있는지 묻는 거죠." },
  ],
  "17.c": [
    { en: "You're asking if I was ever married to more than one person at the same time.", ko: "제가 동시에 두 명 이상과 결혼한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever legally married to two or more people at once.", ko: "제가 동시에 두 명 이상과 법적으로 혼인한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever had more than one spouse at the same time.", ko: "제가 동시에 배우자가 둘 이상이었던 적 있는지 묻는 거죠." },
  ],
  "17.d": [
    { en: "You're asking if I ever married someone to obtain an immigration benefit.", ko: "제가 이민 혜택을 얻으려 누군가와 결혼한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever married just to get an immigration benefit, like a green card or visa.", ko: "제가 영주권·비자 같은 이민 혜택만을 위해 결혼한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever entered a marriage to gain an immigration benefit.", ko: "제가 이민 혜택을 얻을 목적으로 혼인한 적 있는지 묻는 거죠." },
  ],
  "17.e": [
    { en: "You're asking if I ever helped anyone enter, or try to enter, the U.S. illegally.", ko: "제가 누군가의 미국 불법 입국이나 시도를 도운 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever assisted anyone entering, or trying to enter, the U.S. unlawfully.", ko: "제가 누군가의 미국 불법 입국이나 시도를 지원한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever helped someone cross into the U.S. illegally, or try to.", ko: "제가 누군가가 미국으로 불법으로 넘어오거나 시도하는 것을 도운 적 있는지 묻는 거죠." },
  ],
  "17.f": [
    { en: "You're asking if I ever gambled illegally or received income from illegal gambling.", ko: "제가 불법 도박을 하거나 그 수입을 받은 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever took part in illegal gambling or earned money from it.", ko: "제가 불법 도박에 가담하거나 그로 돈을 번 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever made income from unlawful gambling or betting.", ko: "제가 불법 도박이나 내기로 수입을 올린 적 있는지 묻는 거죠." },
  ],
  "17.g": [
    { en: "You're asking if I ever failed to support my dependents, like child support, or to pay court-ordered alimony.", ko: "제가 부양가족 부양(양육비)이나 법원 명령 위자료를 안 낸 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever failed to provide for my dependents or pay court-ordered child support or alimony.", ko: "제가 부양가족을 부양하지 않거나 법원 명령 양육비·위자료를 안 낸 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever failed to pay child support or court-ordered alimony after a divorce or separation.", ko: "제가 양육비나 이혼·별거 후 법원 명령 위자료를 안 낸 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever failed to financially support my dependents or pay required alimony.", ko: "제가 부양가족을 경제적으로 부양하지 않거나 위자료를 안 낸 적 있는지 묻는 거죠." },
  ],
  "17.h": [
    { en: "You're asking if I ever gave false information to obtain a public benefit in the U.S.", ko: "제가 미국에서 공공 혜택을 받으려 허위 정보를 준 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever provided false or misleading information to get a public benefit.", ko: "제가 공공 혜택을 받으려 허위·오해를 부르는 정보를 준 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever lied or misrepresented something to receive a public benefit.", ko: "제가 공공 혜택을 받으려 거짓말하거나 사실을 왜곡한 적 있는지 묻는 거죠." },
  ],
  "18": [
    { en: "You're asking if I ever gave U.S. officials information or documents that were false, fraudulent, or misleading.", ko: "제가 미국 관리에게 허위·사기·오해를 부르는 정보나 서류를 준 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever provided false, fraudulent, or misleading information or documents to a U.S. official.", ko: "제가 미국 관리에게 허위·사기·오해를 부르는 정보나 서류를 제공한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever submitted untrue, fake, or misleading information or papers to a U.S. official.", ko: "제가 미국 관리에게 사실이 아니거나 위조·오해를 부르는 정보·서류를 제출한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever gave a U.S. official anything false or misleading — information or documents.", ko: "제가 미국 관리에게 허위·오해를 부르는 정보나 서류를 준 적 있는지 묻는 거죠." },
  ],
  "19": [
    { en: "You're asking if I ever lied to U.S. officials to enter the U.S. or to get immigration benefits here.", ko: "제가 미국 입국이나 체류 중 이민 혜택을 얻으려 관리에게 거짓말한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever lied to a U.S. official to enter the country or get immigration benefits while here.", ko: "제가 입국하거나 체류 중 이민 혜택을 얻으려 관리에게 거짓말한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever made false statements to U.S. officials to be admitted or to gain immigration benefits.", ko: "제가 입국 허가나 이민 혜택을 얻으려 관리에게 허위 진술한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever lied to immigration or other U.S. officials to get into the country or gain status.", ko: "제가 입국하거나 신분을 얻으려 이민 당국 등 관리에게 거짓말한 적 있는지 묻는 거죠." },
  ],
  "20": [
    { en: "You're asking if I was ever placed in removal, rescission, or deportation proceedings.", ko: "제가 추방·취소·강제퇴거 절차에 회부된 적 있는지 묻는 거죠." },
    { en: "You're asking if the government ever put me in removal or deportation proceedings.", ko: "정부가 저를 추방·강제퇴거 절차에 회부한 적 있는지 묻는 거죠." },
    { en: "You're asking if the government ever started removal, rescission, or deportation proceedings against me.", ko: "정부가 저를 상대로 추방·취소·강제퇴거 절차를 시작한 적 있는지 묻는 거죠." },
  ],
  "21": [
    { en: "You're asking if I was ever removed or deported from the United States.", ko: "제가 미국에서 추방되거나 강제퇴거된 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever actually removed or deported from this country.", ko: "제가 이 나라에서 실제로 추방·강제퇴거된 적 있는지 묻는 거죠." },
    { en: "You're asking if the United States ever removed or deported me.", ko: "미국이 저를 추방하거나 강제퇴거시킨 적 있는지 묻는 거죠." },
  ],
  "22.a": [
    { en: "You're asking if I'm a male who lived in the U.S. anytime between my 18th and 26th birthdays.", ko: "제가 18~26세 사이에 미국에 산 남성인지 묻는 거죠." },
    { en: "You're asking if I lived in the U.S. as a man at any point between ages 18 and 26.", ko: "제가 18세에서 26세 사이에 남성으로서 미국에 산 적 있는지 묻는 거죠." },
    { en: "You're asking if I was a male present in the U.S. anytime between my 18th and 26th birthdays.", ko: "제가 18~26세 사이에 미국에 있던 남성인지 묻는 거죠." },
  ],
  "22.b": [
    { en: "You're asking if, if that applies to me, I registered for the Selective Service.", ko: "해당된다면 제가 병역 등록(Selective Service)을 했는지 묻는 거죠." },
    { en: "You're asking if I signed up with the Selective Service, the U.S. draft system.", ko: "제가 미국 징병 제도인 Selective Service에 등록했는지 묻는 거죠." },
    { en: "You're asking if I registered for the Selective Service.", ko: "제가 병역 등록제(Selective Service)에 등록했는지 묻는 거죠." },
  ],
  "23": [
    { en: "You're asking if I ever left the U.S. to avoid being drafted into the armed forces.", ko: "제가 미군 징집을 피하려 미국을 떠난 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever left the country to avoid being drafted into the military.", ko: "제가 군 징집을 피하려 이 나라를 떠난 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever went abroad specifically to escape the U.S. draft.", ko: "제가 미군 징집을 피할 목적으로 해외에 나간 적 있는지 묻는 거죠." },
  ],
  "24": [
    { en: "You're asking if I ever applied for any exemption from U.S. military service.", ko: "제가 미군 복무에서 어떤 면제든 신청한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever applied for any type of exemption from serving in the U.S. military.", ko: "제가 미군 복무 면제를 어떤 형태로든 신청한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever requested to be exempted from military service.", ko: "제가 군 복무 면제를 요청한 적 있는지 묻는 거죠." },
  ],
  "25": [
    { en: "You're asking if I ever served in the U.S. armed forces.", ko: "제가 미군에서 복무한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever a member of the U.S. military.", ko: "제가 미국 군대의 일원이었던 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever served in the U.S. armed forces.", ko: "제가 미군에서 복무한 적 있는지 묻는 거죠." },
  ],
  "26.a": [
    { en: "You're asking if I'm currently a member of the U.S. armed forces.", ko: "제가 현재 미군 소속인지 묻는 거죠." },
    { en: "You're asking if I'm currently serving in the U.S. military.", ko: "제가 현재 미국 군대에서 복무 중인지 묻는 거죠." },
    { en: "You're asking if, right now, I'm a member of the U.S. armed forces.", ko: "제가 지금 미군 소속인지 묻는 거죠." },
  ],
  "26.b": [
    { en: "You're asking if, if that applies to me, I'm scheduled to deploy outside the U.S., including to a vessel, within 3 months.", ko: "해당된다면 제가 3개월 내 미국 밖(함정 포함)으로 파병 예정인지 묻는 거죠." },
    { en: "You're asking if I'm set to deploy outside the U.S. within the next three months.", ko: "제가 향후 3개월 내 미국 밖으로 파병 예정인지 묻는 거죠." },
    { en: "You're asking if a deployment outside the country, including to a ship, is scheduled for me within 3 months.", ko: "제가 3개월 내 함정 포함 국외 파병이 예정돼 있는지 묻는 거죠." },
  ],
  "26.c": [
    { en: "You're asking if, if that applies to me, I'm currently stationed outside the U.S.", ko: "해당된다면 제가 현재 미국 밖에 주둔 중인지 묻는 거죠." },
    { en: "You're asking if, right now, I'm stationed outside the U.S.", ko: "제가 지금 미국 밖에 주둔 중인지 묻는 거죠." },
    { en: "You're asking if I'm presently posted or stationed outside the U.S.", ko: "제가 현재 미국 밖에 배치·주둔해 있는지 묻는 거죠." },
  ],
  "26.d": [
    { en: "You're asking if, since I'm not serving now, I'm a former U.S. service member living outside the U.S.", ko: "현재 복무 중이 아니라면 제가 미국 밖에 사는 전직 미군인지 묻는 거죠." },
    { en: "You're asking if I'm a former U.S. military member currently residing outside the U.S.", ko: "제가 현재 미국 밖에 거주하는 전직 미군인지 묻는 거죠." },
    { en: "You're asking if I previously served in the U.S. military and now live outside the country.", ko: "제가 전에 미군에 복무했고 지금은 국외에 사는지 묻는 거죠." },
  ],
  "27": [
    { en: "You're asking if, in the U.S. military, I was ever court-martialed or given an other-than-honorable, bad-conduct, or dishonorable discharge.", ko: "제가 미군 복무 중 군사재판을 받거나 명예제대가 아닌 전역을 한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever court-martialed or given a less-than-honorable discharge during my service.", ko: "제가 군 복무 중 군사재판을 받거나 명예제대 못 미치는 전역을 한 적 있는지 묻는 거죠." },
    { en: "You're asking if, while serving, I was ever tried by court-martial or discharged as other than honorable.", ko: "제가 미군 복무 중 군사재판에 회부되거나 명예제대가 아닌 전역을 한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever got a bad-conduct, dishonorable, or other-than-honorable discharge from the U.S. military.", ko: "제가 미군에서 품행불량·불명예·기타 비명예 전역을 받은 적 있는지 묻는 거죠." },
  ],
  "28": [
    { en: "You're asking if I was ever discharged from U.S. military training or service because I was an alien.", ko: "제가 외국인이라는 이유로 미군 훈련·복무에서 전역당한 적 있는지 묻는 거죠." },
    { en: "You're asking if I was ever released from U.S. military training or service because I wasn't a citizen.", ko: "제가 시민이 아니라는 이유로 미군 훈련·복무에서 해제된 적 있는지 묻는 거죠." },
    { en: "You're asking if the U.S. military ever discharged me because I was a foreign national.", ko: "미군이 외국 국적자라는 이유로 저를 전역시킨 적 있는지 묻는 거죠." },
  ],
  "29": [
    { en: "You're asking if I ever deserted from the U.S. armed forces.", ko: "제가 미군에서 탈영한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever left the U.S. military without permission — that is, deserted.", ko: "제가 허가 없이 미군을 이탈, 즉 탈영한 적 있는지 묻는 거죠." },
    { en: "You're asking if I ever deserted from the U.S. armed forces.", ko: "제가 미군에서 탈영한 적 있는지 묻는 거죠." },
  ],
  "30.a": [
    { en: "You're asking if I now have, or ever had, a hereditary title or order of nobility in a foreign country.", ko: "제가 외국의 세습 작위나 귀족 칭호를 지금 또는 과거에 가졌는지 묻는 거죠." },
    { en: "You're asking if I ever held a noble title or rank in another country.", ko: "제가 다른 나라에서 귀족 칭호나 지위를 가진 적 있는지 묻는 거죠." },
    { en: "You're asking if I currently hold, or ever held, a hereditary title or order of nobility abroad.", ko: "제가 해외에서 세습 작위나 귀족 칭호를 지금 또는 과거에 보유했는지 묻는 거죠." },
  ],
  "30.b": [
    { en: "You're asking if, if that applies to me, I'm willing to give up inherited titles or nobility at my ceremony.", ko: "해당된다면 제가 귀화식에서 물려받은 작위·귀족 칭호를 포기할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if I'd be willing to give up any foreign title or nobility at the ceremony.", ko: "제가 귀화식에서 외국 작위·귀족 칭호를 포기할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if I'm willing to renounce any foreign noble titles at my ceremony.", ko: "제가 귀화식에서 외국 귀족 칭호를 포기할 의향이 있는지 묻는 거죠." },
  ],
  "31": [
    { en: "You're asking if I support the Constitution and form of government of the U.S.", ko: "제가 미국 헌법과 정부 형태를 지지하는지 묻는 거죠." },
    { en: "You're asking if I support the Constitution and system of government of the U.S.", ko: "제가 미국 헌법과 정부 체제를 지지하는지 묻는 거죠." },
    { en: "You're asking if I support the U.S. Constitution and its form of government.", ko: "제가 미국 헌법과 그 정부 형태를 지지하는지 묻는 거죠." },
  ],
  "32": [
    { en: "You're asking if I understand the full Oath of Allegiance to the U.S.", ko: "제가 미국 충성 선서 전문을 이해하는지 묻는 거죠." },
    { en: "You're asking if I understand the complete Oath of Allegiance I'll take.", ko: "제가 하게 될 충성 선서 전문을 이해하는지 묻는 거죠." },
    { en: "You're asking if I understand everything in the full Oath of Allegiance.", ko: "제가 충성 선서 전문의 모든 내용을 이해하는지 묻는 거죠." },
  ],
  "33": [
    { en: "You're asking if I'm unable to take the Oath because of a physical/developmental disability or mental impairment.", ko: "제가 신체·발달 장애나 정신적 손상으로 선서를 못 하는지 묻는 거죠." },
    { en: "You're asking if any physical or mental disability makes me unable to take the Oath.", ko: "제가 선서를 할 수 없게 만드는 신체·정신 장애가 있는지 묻는 거죠." },
    { en: "You're asking if a developmental disability or mental impairment prevents me from taking the Oath.", ko: "제가 발달 장애나 정신적 손상으로 선서를 하지 못하는지 묻는 거죠." },
  ],
  "34": [
    { en: "You're asking if I'm willing to take the full Oath of Allegiance to the U.S.", ko: "제가 미국 충성 선서 전문을 할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if I'm willing to take the complete Oath of Allegiance to the U.S.", ko: "제가 미국 충성 선서 전문을 할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if I'll take the entire Oath of Allegiance to the U.S.", ko: "제가 미국 충성 선서 전체를 할지 묻는 거죠." },
  ],
  "35": [
    { en: "You're asking if, when the law requires it, I'm willing to bear arms for the U.S.", ko: "법이 요구하면 제가 미국을 위해 무기를 들 의향이 있는지 묻는 거죠." },
    { en: "You're asking if, should the law require it, I'd carry weapons for the U.S.", ko: "법이 요구하면 제가 미국을 위해 무기를 휴대할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if, if required by law, I'm willing to bear arms for this country.", ko: "법으로 요구되면 제가 이 나라를 위해 무기를 들 의향이 있는지 묻는 거죠." },
  ],
  "36": [
    { en: "You're asking if, when the law requires it, I'm willing to do noncombatant service in the armed forces.", ko: "법이 요구하면 제가 미군에서 비전투 복무를 할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if, should the law require it, I'd serve in a noncombatant role without fighting.", ko: "법이 요구하면 제가 싸움 없는 비전투 역할로 복무할지 묻는 거죠." },
    { en: "You're asking if, if required by law, I'm willing to do noncombatant service in the U.S. military.", ko: "법으로 요구되면 제가 미군에서 비전투 복무를 할 의향이 있는지 묻는 거죠." },
  ],
  "37": [
    { en: "You're asking if, when the law requires it, I'm willing to do work of national importance under civilian direction.", ko: "법이 요구하면 제가 민간 지휘 하 국가 중요 업무를 할 의향이 있는지 묻는 거죠." },
    { en: "You're asking if, should the law require it, I'd do work of national importance under civilian direction.", ko: "법이 요구하면 제가 민간 지휘 하 국가 중요 업무를 할지 묻는 거죠." },
    { en: "You're asking if, if required by law, I'm willing to do important non-military work under civilian direction.", ko: "법으로 요구되면 제가 민간 지휘 하 중요 비군사 업무를 할 의향이 있는지 묻는 거죠." },
  ],
};

// ── 원문(official_en)·번역(ko)을 n400_sentence_vocab에서 가져와 병합 ───────────
const cardIndex = new Map<
  string,
  { card: SentenceVocabCard; section: SentenceVocabSection }
>();
for (const section of N400_SENTENCE_VOCAB) {
  for (const card of section.cards) {
    cardIndex.set(card.id, { card, section });
  }
}

function officialOf(card: SentenceVocabCard): string {
  // stem(여러 하위 항목이 공유하는 도입문)이 있으면 합쳐서 완전한 질문으로 만든다.
  return card.stem ? `${card.stem}\n${card.en}` : card.en;
}

export const PART9_QUESTIONS: Part9Question[] = RESTATE_ITEMS.map((item) => {
  const found = cardIndex.get(item.id);
  if (!found) {
    throw new Error(
      `[n400_part9_restate] No sentence_vocab card found for id "${item.id}"`,
    );
  }
  const rephKo = REPHRASING_KO[item.id] ?? [];
  const rephRestate = REPHRASING_RESTATE[item.id] ?? [];
  return {
    ...item,
    // 영어 rephrasings에 같은 index의 한국어·맞춤 재진술을 병합.
    // 누락 시 각각 공식 번역 / 기본 재진술(short)로 안전 대체.
    rephrasings: item.rephrasings.map((en, i) => ({
      en,
      ko: rephKo[i] ?? found.card.ko,
      restate: rephRestate[i] ?? item.restatement_tiers.short,
    })),
    groupId: found.section.id,
    groupTitle: found.section.title,
    emoji: found.section.emoji,
    official_en: officialOf(found.card),
    ko: found.card.ko,
  };
});

// 그룹(섹션) 메타 — 필터 UI용 (Oath 섹션은 질문이 아니므로 제외)
export interface Part9Group {
  id: string;
  title: string;
  emoji: string;
  count: number;
}
export const PART9_GROUPS: Part9Group[] = N400_SENTENCE_VOCAB.filter(
  (s) => s.id !== "oath",
).map((s) => ({
  id: s.id,
  title: s.title,
  emoji: s.emoji,
  count: PART9_QUESTIONS.filter((q) => q.groupId === s.id).length,
}));

export const TOTAL_PART9_QUESTIONS = PART9_QUESTIONS.length;

export const RESTATE_TIP =
  "오피서가 질문을 다양하게 바꿔 물어도, 취지만 한 줄로 다시 말하고(restate) 짧게 No/Yes로 답하면 됩니다. 단어를 다 나열할 필요는 없습니다. 못 알아들으면 'Could you repeat that, please?'";

// 화면에 표시할 정확성 고지 (실전 모의용 · 비녹취)
export const MOCK_NOTICE =
  "USCIS는 오피서의 실제 질문 표현 목록을 공개하지 않습니다. 아래 표현들은 공식 원문(N-400)의 의미에 충실하게 만든 '실전 모의용 · 비녹취' 표현입니다. 실제 인터뷰 표현은 다를 수 있습니다.";
