// N-400 문장 속 단어 (Words in Context)
// 출처: Form N-400 (Edition 01/20/25) Part 9 원문 + Part 16 Oath of Allegiance
// ※ 문장은 실제 폼의 "전체 질문 문구"를 그대로 사용 (축약하지 않음).
//
// 핵심 아이디어: 단어 뜻을 "그 단어가 실제로 들어있는 문장" 안에 하이라이트해서,
// 문장과 단어를 한 번에 익히도록 함.
//
//   en      : 영어 문장 (폼 원문 그대로 · 스피커로 읽어줌)  — \n 은 줄바꿈
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
        en: "Have you EVER claimed to be a U.S. citizen (in writing or any other way)?",
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
        en: "Have you EVER registered to vote or voted in any Federal, state, or local election in the United States? If you lawfully voted only in a local election where aliens are eligible to vote, you may answer “No.”",
        ko: "미국의 연방·주·지방 선거에 투표 등록을 하거나 투표한 적이 있습니까? 외국인이 투표할 수 있는 지방 선거에서만 합법적으로 투표했다면 “No”라고 답해도 됩니다.",
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
        en: "Since you became a lawful permanent resident, have you called yourself a “nonresident alien” on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?",
        ko: "합법 영주권자가 된 이후, 연방·주·지방 세금 신고에서 자신을 “비거주 외국인”이라고 하거나, 비거주자라고 여겨 세금 신고를 하지 않기로 한 적이 있습니까?",
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
    subtitle: "Politics · Extremism · Military (Q5–12)",
    cards: [
      {
        id: "5.a",
        en: "Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?",
        ko: "전 세계 어디서든 공산당이나 전체주의 정당에 소속·관여·연관된 적이 있습니까?",
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
        id: "5.b",
        en: "Have you EVER advocated (supported and promoted) any of the following, or been a member of, involved in, or in any way associated with any group anywhere in the world that advocated any of the following:\n• Opposition to all organized government;\n• World communism;\n• The establishment in the United States of a totalitarian dictatorship;\n• The overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law;\n• The unlawful assaulting or killing of any officer or officers of the Government of the United States or of any other organized government because of their official character;\n• The unlawful damage, injury, or destruction of property; or\n• Sabotage?",
        ko: "다음 중 어느 것이든 옹호(지지·조장)했거나, 다음을 옹호한 단체에 소속·관여·연관된 적이 있습니까: 모든 조직된 정부에 대한 반대; 세계 공산주의; 미국 내 전체주의 독재 수립; 무력·폭력 또는 위헌적 수단에 의한 미국 정부나 모든 법체계의 전복; 공무원에 대한 불법적 폭행·살해; 불법적 재산 손괴; 또는 사보타주?",
        answer: "No",
        words: [
          {
            match: "totalitarian",
            word: "totalitarian",
            ko: "전체주의의",
            explain: "A government that controls everything.",
          },
          {
            match: "Sabotage",
            word: "sabotage",
            ko: "사보타주",
            explain: "To secretly destroy or damage on purpose.",
          },
        ],
      },
      {
        id: "8.b",
        en: "Have you EVER served in, been a member of, assisted (helped), or participated in any armed group (a group that carries weapons), for example: paramilitary unit (a group of people who act like a military group but are not part of the official military), self-defense unit, vigilante unit, rebel group, or guerrilla group?",
        ko: "무기를 소지한 무장단체에 복무·소속·참여한 적이 있습니까? 예: 준군사 부대(군대처럼 행동하지만 공식 군대가 아닌 집단), 자위대, 자경단, 반군, 게릴라 단체.",
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
        en: "Have you EVER worked, volunteered, or otherwise served in a place where people were detained (forced to stay), for example, a prison, jail, prison camp (a camp where prisoners of war or political prisoners are kept), detention facility, or labor camp, or have you EVER directed or participated in any other activity that involved detaining people?",
        ko: "사람을 구금하는 장소(교도소·구치소·포로수용소·구금시설·노동수용소 등)에서 일하거나 복무한 적이 있거나, 사람을 구금하는 활동을 지시·참여한 적이 있습니까?",
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
        id: "12",
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
        id: "7.a–b",
        en: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:\n• Torture?\n• Genocide?",
        ko: "다음 중 어느 것이든 지시·선동·요구·실행·방조·조력하거나 그 외의 방식으로 가담한 적이 있습니까: 고문? 집단학살?",
        answer: "No",
        words: [
          {
            match: "Torture",
            word: "torture",
            ko: "고문",
            explain: "Causing severe pain to force someone.",
          },
          {
            match: "Genocide",
            word: "genocide",
            ko: "집단학살",
            explain: "Killing a large group of people on purpose.",
          },
        ],
      },
      {
        id: "7.g",
        en: "Have you EVER ordered, incited, committed, assisted, or otherwise participated in causing harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?",
        ko: "인종·종교·출신·특정 사회집단 소속·정치적 견해를 이유로 누군가에게 해를 끼치거나 고통을 준 일을 지시·선동·실행·방조하거나 가담한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "causing harm or suffering",
            word: "persecute",
            ko: "박해하다",
            explain: "To hurt someone because of their religion or race.",
          },
        ],
      },
      {
        id: "15.b",
        en: "Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?",
        ko: "어떤 이유로든 사법·군·이민 당국에 의해 체포·소환·구금·억류된 적이 있거나, 범죄·위법으로 기소된 적이 있습니까?",
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
        id: "17.b",
        en: "Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled (trafficked) any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law or regulation of a U.S. state, the United States, or a foreign country?",
        ko: "미국 주·연방 또는 외국의 법령을 위반하여 규제 약물·불법 마약·마약 도구를 제조·재배·생산·유통·판매하거나 밀수(거래)한 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "smuggled",
            word: "smuggle",
            ko: "밀수·밀거래",
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
        id: "17.g",
        en: "Have you EVER failed to support your dependents (pay child support) or to pay alimony (court-ordered financial support after divorce or separation)?",
        ko: "부양가족을 부양하지 않거나(양육비 미지급), 위자료(이혼·별거 후 법원이 명령한 경제적 지원)를 내지 않은 적이 있습니까?",
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
        en: "Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?",
        ko: "미국 정부 관리에게 허위·사기·오해를 부르는 정보나 서류를 준 적이 있습니까?",
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
        en: "Have you EVER been placed in removal, rescission, or deportation proceedings?",
        ko: "추방·취소·강제퇴거 절차에 회부된 적이 있습니까?",
        answer: "No",
        words: [
          {
            match: "deportation",
            word: "deportation",
            ko: "추방·강제퇴거",
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
        id: "22",
        en: "Are you a male who lived in the United States at any time between your 18th and 26th birthdays?\nIf you answered “Yes,” did you register for the Selective Service?",
        ko: "18세부터 26세 사이에 미국에 거주한 적이 있는 남성입니까?\n“Yes”라면, Selective Service(병역 등록제)에 등록했습니까?",
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
        ko: "미군 복무에서 어떤 종류의 면제든 신청한 적이 있습니까?",
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
        id: "30.a",
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
        en: "Do you understand the full Oath of Allegiance to the United States (see Part 16. Oath of Allegiance)?",
        ko: "미국에 대한 충성 선서 전문을 이해합니까? (Part 16. 충성 선서 참조)",
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
        en: "If the law requires it, are you willing to bear arms (carry weapons) on behalf of the United States?",
        ko: "법이 요구하면 미국을 위해 무기를 들(휴대할) 의향이 있습니까?",
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
        en: "If the law requires it, are you willing to perform noncombatant services (do something that does not include fighting in a war) in the U.S. armed forces?",
        ko: "법이 요구하면 미군에서 비전투 복무(전쟁에서 싸우지 않는 일)를 할 의향이 있습니까?",
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
        id: "Oath 1",
        en: "I absolutely and entirely renounce and abjure all allegiance and fidelity to any foreign prince, potentate, state, or sovereignty, of whom or which I have heretofore been a subject or citizen.",
        ko: "저는 지금까지 신민 또는 시민이었던 어떤 외국의 군주·통치자·국가·주권에 대한 모든 충성과 충실을 절대적이고 완전히 포기하고 거부합니다.",
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
        id: "Oath 2",
        en: "I take this obligation freely, without any mental reservation or purpose of evasion; so help me God.",
        ko: "저는 어떤 마음의 유보나 회피 목적 없이 이 의무를 자유롭게 받아들입니다. 신이여 도우소서.",
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
  "문장은 Form N-400(Edition 01/20/25) 원문 그대로입니다. 노란색 단어가 실제 문장 안 어디에 들어있는지 보면서, 문장과 단어를 한 번에 익히세요. 스피커로 전체 문장을 듣고 따라 말해보세요.";
