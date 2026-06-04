// N-400 문장 속 단어 (Words in Context)
// 출처: N400_Final_Master_Guide_v2.docx — Part 9 배경질문(A~J) + 선서문(Oath)
//
// 핵심 아이디어: Chapter 5의 단어 뜻을 "그 단어가 실제로 들어있는 문장" 안에
// 하이라이트해서, 문장과 단어를 한 번에 익히도록 함.
//
//   en      : 영어 문장 (스피커로 읽어줌)
//   ko      : 한글 번역
//   answer  : (선택) 정답 Yes/No/해당시
//   words[] : 이 문장에 들어있는 핵심 단어 (등장 순서대로)
//     match   : 문장에서 하이라이트할 정확한 부분 (없으면 word)
//     word    : 사전 표제어 (영어)
//     ko      : 뜻 (한글)
//     explain : "What does it mean?" 영어 설명

export interface SentenceVocabWord {
  match?: string;
  word: string;
  ko: string;
  explain: string;
}

export interface SentenceVocabCard {
  id: string;
  en: string;
  ko: string;
  answer?: string;
  words: SentenceVocabWord[];
}

export interface SentenceVocabSection {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  cards: SentenceVocabCard[];
}

export const N400_SENTENCE_VOCAB: SentenceVocabSection[] = [
  {
    id: "A",
    emoji: "🗳️",
    title: "시민권 · 투표 · 세금",
    subtitle: "Citizenship · Voting · Taxes (Q1–4)",
    cards: [
      {
        id: "1",
        en: "Have you EVER claimed to be a U.S. citizen, in writing or any other way?",
        ko: "미국 시민이라고 (서면이나 다른 어떤 방식으로든) 주장한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "claimed",
            word: "claim",
            ko: "주장하다",
            explain: "To say that something is true.",
          },
        ],
      },
      {
        id: "2",
        en: "Have you EVER registered to vote or voted in any Federal, state, or local election in the United States?",
        ko: "미국의 연방·주·지방 선거에 투표 등록을 하거나 투표한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "registered to vote",
            word: "register to vote",
            ko: "투표 등록",
            explain: "To sign up so you can vote.",
          },
        ],
      },
      {
        id: "3",
        en: "Do you currently owe any overdue Federal, state, or local taxes in the United States?",
        ko: "현재 미국에 체납된 연방·주·지방 세금이 있습니까?",
        answer: "No",
        words: [
          {
            match: "overdue",
            word: "overdue taxes",
            ko: "체납 세금",
            explain: "Taxes I did not pay on time.",
          },
        ],
      },
      {
        id: "4",
        en: "Since you became a lawful permanent resident, have you ever called yourself a nonresident alien on a tax return?",
        ko: "합법 영주권자가 된 이후, 세금 신고에서 자신을 '비거주 외국인'이라고 한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "lawful permanent resident",
            word: "permanent resident",
            ko: "영주권자",
            explain: "A green card holder.",
          },
          {
            match: "nonresident alien",
            word: "nonresident alien",
            ko: "비거주 외국인",
            explain: "A person who lives outside the U.S. for taxes.",
          },
        ],
      },
    ],
  },
  {
    id: "B",
    emoji: "⚙️",
    title: "정치 · 극단주의 · 군사",
    subtitle: "Politics · Extremism · Military (Q5–11)",
    cards: [
      {
        id: "5a",
        en: "Have you EVER been a member of, or associated with, any Communist or totalitarian party anywhere in the world?",
        ko: "전 세계 어디서든 공산당이나 전체주의 정당에 소속·연관된 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "totalitarian",
            word: "totalitarian",
            ko: "전체주의의",
            explain: "A government that controls everything.",
          },
        ],
      },
      {
        id: "5b",
        en: "Have you EVER advocated the overthrow of the Government by force, a totalitarian dictatorship, or sabotage?",
        ko: "정부의 무력 전복, 전체주의 독재, 또는 사보타주를 옹호한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "totalitarian",
            word: "totalitarian",
            ko: "전체주의의",
            explain: "A government that controls everything.",
          },
          {
            match: "sabotage",
            word: "sabotage",
            ko: "사보타주",
            explain: "To secretly destroy or damage on purpose.",
          },
        ],
      },
      {
        id: "8b",
        en: "Have you EVER served in any armed group, for example a paramilitary unit, vigilante unit, rebel group, or guerrilla group?",
        ko: "준군사·자경·반군·게릴라 같은 무장단체에 복무한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "paramilitary",
            word: "paramilitary",
            ko: "준군사",
            explain: "An armed group that is not the official army.",
          },
        ],
      },
      {
        id: "9",
        en: "Have you EVER worked or served in a place where people were detained, such as a prison, jail, or detention facility?",
        ko: "사람을 구금하는 장소(교도소·구치소·수용소 등)에서 일하거나 복무한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "detained",
            word: "detained",
            ko: "구금된",
            explain: "When you are held and not free to leave.",
          },
        ],
      },
      {
        id: "11",
        en: "Have you EVER received any weapons training, paramilitary training, or other military-type training?",
        ko: "무기 훈련, 준군사 훈련, 또는 기타 군사형 훈련을 받은 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "weapons training",
            word: "weapons training",
            ko: "무기 훈련",
            explain: "Learning to use guns or weapons.",
          },
          {
            match: "paramilitary",
            word: "paramilitary",
            ko: "준군사",
            explain: "An armed group that is not the official army.",
          },
        ],
      },
    ],
  },
  {
    id: "C",
    emoji: "⚖️",
    title: "박해 · 범죄 · 법",
    subtitle: "Persecution · Crime · Law (Q7–20)",
    cards: [
      {
        id: "7",
        en: "Have you EVER ordered, committed, assisted, or participated in torture or genocide?",
        ko: "고문이나 집단학살을 지시·실행·방조하거나 가담한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "torture",
            word: "torture",
            ko: "고문",
            explain: "Causing severe pain to force someone.",
          },
          {
            match: "genocide",
            word: "genocide",
            ko: "집단학살",
            explain: "Killing a large group of people on purpose.",
          },
        ],
      },
      {
        id: "7g",
        en: "Have you EVER persecuted anyone because of race, religion, national origin, social group, or political opinion?",
        ko: "인종·종교·출신·사회집단·정치적 견해를 이유로 누군가를 박해한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "persecuted",
            word: "persecute",
            ko: "박해하다",
            explain: "To hurt someone because of their religion or race.",
          },
        ],
      },
      {
        id: "15b",
        en: "Have you EVER been arrested, cited, detained, or charged with a crime by any law enforcement officer?",
        ko: "어떤 사법 당국에 의해 체포·소환·구금되거나 범죄로 기소된 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "arrested",
            word: "arrested",
            ko: "체포된",
            explain: "When police take you into custody.",
          },
          {
            match: "cited",
            word: "cited",
            ko: "소환된(티켓)",
            explain: "When you are given a ticket or official notice.",
          },
          {
            match: "detained",
            word: "detained",
            ko: "구금된",
            explain: "When you are held and not free to leave.",
          },
          {
            match: "charged",
            word: "charged",
            ko: "기소된",
            explain: "When you are officially accused of a crime.",
          },
        ],
      },
      {
        id: "17b",
        en: "Have you EVER manufactured, distributed, sold, or smuggled any controlled substances, illegal drugs, or narcotics?",
        ko: "규제 약물·불법 마약을 제조·유통·판매하거나 밀수한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "smuggled",
            word: "smuggle",
            ko: "밀수·밀입국",
            explain: "To move people or goods secretly and illegally.",
          },
          {
            match: "controlled substances",
            word: "controlled substance",
            ko: "규제 약물",
            explain: "Illegal drugs.",
          },
        ],
      },
      {
        id: "17g",
        en: "Have you EVER failed to support your dependents, pay child support, or pay alimony?",
        ko: "부양가족을 부양하지 않거나, 양육비나 위자료를 내지 않은 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "child support",
            word: "child support",
            ko: "양육비",
            explain: "Money paid to support your children.",
          },
          {
            match: "alimony",
            word: "alimony",
            ko: "위자료",
            explain: "Money paid to an ex-spouse after divorce.",
          },
        ],
      },
      {
        id: "18",
        en: "Have you EVER given any U.S. Government official information that was false, fraudulent, or misleading?",
        ko: "미국 정부 관리에게 허위·사기·오해를 부르는 정보를 준 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "fraudulent",
            word: "fraud",
            ko: "사기",
            explain: "Lying to get something you want.",
          },
          {
            match: "misleading",
            word: "misrepresent",
            ko: "허위 진술",
            explain: "To give false information.",
          },
        ],
      },
      {
        id: "20",
        en: "Have you EVER been removed or deported from the United States?",
        ko: "미국에서 추방되거나 강제퇴거된 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "deported",
            word: "deportation",
            ko: "추방",
            explain: "Being forced to leave the country.",
          },
        ],
      },
    ],
  },
  {
    id: "D",
    emoji: "🎖️",
    title: "병역 · 귀족 칭호",
    subtitle: "Military Service · Nobility (Q22–30)",
    cards: [
      {
        id: "22b",
        en: "If you lived in the U.S. as a man between ages 18 and 26, did you register for the Selective Service?",
        ko: "18~26세 사이 미국에 거주한 남성이라면, Selective Service에 등록했습니까?",
        answer: "해당시",
        words: [
          {
            match: "Selective Service",
            word: "Selective Service",
            ko: "병역 등록제",
            explain: "The U.S. system for men to register for the draft.",
          },
        ],
      },
      {
        id: "24",
        en: "Have you EVER applied for any kind of exemption from military service in the U.S. armed forces?",
        ko: "미군 복무 면제를 신청한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "exemption",
            word: "exemption",
            ko: "면제",
            explain: "Permission not to do something.",
          },
        ],
      },
      {
        id: "30a",
        en: "Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?",
        ko: "외국의 세습 작위나 귀족 칭호를 지금 가지고 있거나 가진 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "hereditary title",
            word: "hereditary title",
            ko: "세습 작위",
            explain: "A noble rank passed down in a family.",
          },
          {
            match: "order of nobility",
            word: "order of nobility",
            ko: "귀족 작위",
            explain: "A noble rank, like a duke or count.",
          },
        ],
      },
    ],
  },
  {
    id: "E",
    emoji: "📜",
    title: "헌법 · 충성 선서",
    subtitle: "Constitution · Oath of Allegiance (Q31–37 + Oath)",
    cards: [
      {
        id: "31",
        en: "Do you support the Constitution and form of Government of the United States?",
        ko: "미국 헌법과 정부 형태를 지지합니까?",
        answer: "Yes",
        words: [
          {
            match: "Constitution",
            word: "Constitution",
            ko: "헌법",
            explain: "The supreme law of the United States.",
          },
        ],
      },
      {
        id: "32",
        en: "Do you understand the full Oath of Allegiance to the United States?",
        ko: "미국에 대한 충성 선서 전문을 이해합니까?",
        answer: "Yes",
        words: [
          {
            match: "Oath of Allegiance",
            word: "Oath of Allegiance",
            ko: "충성 선서",
            explain: "A promise to be loyal to the United States.",
          },
        ],
      },
      {
        id: "35",
        en: "If the law requires it, are you willing to bear arms on behalf of the United States?",
        ko: "법이 요구하면 미국을 위해 무기를 들 의향이 있습니까?",
        answer: "Yes",
        words: [
          {
            match: "bear arms",
            word: "bear arms",
            ko: "무기를 들다",
            explain: "To use a weapon to defend the country.",
          },
        ],
      },
      {
        id: "36",
        en: "If the law requires it, are you willing to perform noncombatant services in the U.S. armed forces?",
        ko: "법이 요구하면 미군에서 비전투 복무를 할 의향이 있습니까?",
        answer: "Yes",
        words: [
          {
            match: "noncombatant",
            word: "noncombatant service",
            ko: "비전투 복무",
            explain: "Military work without fighting.",
          },
        ],
      },
      {
        id: "oath1",
        en: "I absolutely and entirely renounce and abjure all allegiance to any foreign prince, potentate, state, or sovereignty.",
        ko: "저는 어떤 외국의 군주·통치자·국가·주권에 대한 모든 충성을 절대적이고 완전히 포기하고 거부합니다.",
        words: [
          {
            match: "renounce",
            word: "renounce",
            ko: "포기하다",
            explain: "To give up something completely.",
          },
          {
            match: "abjure",
            word: "abjure",
            ko: "거부하다",
            explain: "To formally reject or give up.",
          },
          {
            match: "allegiance",
            word: "allegiance",
            ko: "충성",
            explain: "Loyalty to a country.",
          },
          {
            match: "potentate",
            word: "potentate",
            ko: "통치자",
            explain: "A powerful ruler of a country.",
          },
          {
            match: "sovereignty",
            word: "sovereignty",
            ko: "주권",
            explain: "The power that rules a country.",
          },
        ],
      },
      {
        id: "oath2",
        en: "I take this obligation freely, without any mental reservation or purpose of evasion.",
        ko: "저는 어떤 마음의 유보나 회피 목적 없이 이 의무를 자유롭게 받아들입니다.",
        words: [
          {
            match: "mental reservation",
            word: "mental reservation",
            ko: "마음의 유보",
            explain: "A secret doubt.",
          },
        ],
      },
    ],
  },
];

// 통계
export const TOTAL_SENTENCE_CARDS = N400_SENTENCE_VOCAB.reduce(
  (sum, s) => sum + s.cards.length,
  0,
);
export const TOTAL_SENTENCE_WORDS = N400_SENTENCE_VOCAB.reduce(
  (sum, s) => sum + s.cards.reduce((a, c) => a + c.words.length, 0),
  0,
);

export const SENTENCE_VOCAB_TIP =
  "노란색으로 표시된 단어가 실제 문장 안 어디에 들어있는지 보면서, 문장과 단어를 한 번에 익히세요. 스피커로 전체 문장을 듣고 따라 말해보세요.";
