// N-400 Interview Vocabulary List
// Each item: English word, Korean translation, English explanation
// Optional korean parenthetical note in some explanations.

export interface N400VocabItem {
  en: string;
  ko: string;
  explanation: string;
  note?: string;
}

export interface N400VocabSection {
  id: string;
  title: string;
  items: N400VocabItem[];
}

export const N400_VOCAB_SECTIONS: N400VocabSection[] = [
  {
    id: "1",
    title: "신청서 · 절차 단어",
    items: [
      {
        en: "permanent resident",
        ko: "영주권자",
        explanation: "A green card holder.",
        note: "영주권 소지자",
      },
      {
        en: "naturalization",
        ko: "귀화",
        explanation: "Becoming a U.S. citizen.",
        note: "미국 시민이 되는 것",
      },
      {
        en: "citizen",
        ko: "시민",
        explanation: "A member of a country with full rights.",
      },
      {
        en: "eligibility",
        ko: "자격",
        explanation: "The right to apply.",
        note: "신청할 자격",
      },
      {
        en: "self-employed",
        ko: "자영업",
        explanation: "I work for myself. I own my business.",
      },
      {
        en: "spouse",
        ko: "배우자",
        explanation: "My husband or wife.",
      },
      {
        en: "dependent",
        ko: "부양가족",
        explanation: "A person who depends on me for support.",
      },
      {
        en: "continuous residence",
        ko: "연속 거주",
        explanation: "Living in the U.S. without leaving for a long time.",
      },
      {
        en: "physical presence",
        ko: "물리적 체류",
        explanation: "Actually being inside the U.S.",
      },
      {
        en: "good moral character",
        ko: "선량한 품성",
        explanation: "Being a good and honest person.",
      },
      {
        en: "A-number",
        ko: "외국인 등록번호",
        explanation: "My alien registration number on my green card.",
      },
      {
        en: "class of admission",
        ko: "입국 분류 (영주권 코드)",
        explanation: "The category of my green card. Mine is EW9.",
      },
    ],
  },
  {
    id: "2",
    title: "세금 · 투표 관련 (Part 9 A)",
    items: [
      {
        en: "overdue taxes",
        ko: "체납 세금",
        explanation: "Taxes I did not pay on time.",
      },
      {
        en: "nonresident alien",
        ko: "비거주 외국인",
        explanation: "A person who lives outside the U.S. for taxes.",
        note: "나는 거주자이므로 해당 없음",
      },
      {
        en: "register to vote",
        ko: "투표 등록",
        explanation: "To sign up so you can vote.",
        note: "영주권자는 불가",
      },
      {
        en: "claim",
        ko: "주장하다",
        explanation: "To say that something is true.",
      },
    ],
  },
  {
    id: "3",
    title: "정치 · 극단주의 (Part 9 B·C·E)",
    items: [
      {
        en: "Communist party",
        ko: "공산당",
        explanation: "A political party that controls everything.",
      },
      {
        en: "totalitarian",
        ko: "전체주의의",
        explanation: "A government that controls everything.",
      },
      {
        en: "terrorist organization",
        ko: "테러 조직",
        explanation: "A group that uses violence for political goals.",
      },
      {
        en: "overthrow",
        ko: "전복",
        explanation: "To remove a government by force.",
      },
      {
        en: "sabotage",
        ko: "사보타주",
        explanation: "To secretly destroy or damage on purpose.",
      },
      {
        en: "militia / paramilitary",
        ko: "민병대 / 준군사",
        explanation: "An armed group that is not the official army.",
      },
      {
        en: "weapons training",
        ko: "무기 훈련",
        explanation: "Learning to use guns or weapons.",
      },
    ],
  },
  {
    id: "4",
    title: "박해 · 폭력 (Part 9 D)",
    items: [
      {
        en: "persecute",
        ko: "박해하다",
        explanation: "To hurt someone because of their religion or race.",
      },
      {
        en: "genocide",
        ko: "집단학살",
        explanation: "Killing a large group of people on purpose.",
      },
      {
        en: "torture",
        ko: "고문",
        explanation: "Causing severe pain to force someone.",
      },
      {
        en: "consent",
        ko: "동의",
        explanation: "To agree to something.",
      },
      {
        en: "national origin",
        ko: "출신 국가",
        explanation: "The country a person comes from.",
      },
    ],
  },
  {
    id: "5",
    title: "범죄 · 법 관련 (Part 9 F)",
    items: [
      {
        en: "arrested",
        ko: "체포된",
        explanation: "When police take you into custody.",
      },
      {
        en: "cited",
        ko: "소환된 (티켓)",
        explanation: "When you are given a ticket or official notice.",
      },
      {
        en: "detained",
        ko: "구금된",
        explanation: "When you are held and not free to leave.",
      },
      {
        en: "charged",
        ko: "기소된",
        explanation: "When you are officially accused of a crime.",
      },
      {
        en: "convicted",
        ko: "유죄판결",
        explanation: "When a court finds you guilty.",
      },
      {
        en: "controlled substance",
        ko: "규제 약물",
        explanation: "Illegal drugs.",
      },
      {
        en: "narcotics",
        ko: "마약",
        explanation: "Illegal drugs like heroin or cocaine.",
      },
      {
        en: "smuggle",
        ko: "밀수 · 밀입국",
        explanation: "To move people or goods secretly and illegally.",
      },
      {
        en: "prostitution",
        ko: "매춘",
        explanation: "Selling sex for money.",
      },
      {
        en: "polygamy / bigamy",
        ko: "일부다처 / 중혼",
        explanation: "Being married to more than one person at once.",
      },
      {
        en: "fraud",
        ko: "사기",
        explanation: "Lying to get something you want.",
      },
      {
        en: "misrepresent",
        ko: "허위 진술",
        explanation: "To give false information.",
      },
      {
        en: "alimony",
        ko: "위자료",
        explanation: "Money paid to an ex-spouse after divorce.",
      },
      {
        en: "child support",
        ko: "양육비",
        explanation: "Money paid to support your children.",
      },
      {
        en: "probation / parole",
        ko: "보호관찰 / 가석방",
        explanation: "Being supervised instead of, or after, jail.",
      },
      {
        en: "deportation / removal",
        ko: "추방 / 강제퇴거",
        explanation: "Being forced to leave the country.",
      },
    ],
  },
  {
    id: "6",
    title: "병역 (Part 9 H)",
    items: [
      {
        en: "Selective Service",
        ko: "병역 등록제",
        explanation: "The U.S. system for men to register for the draft.",
      },
      {
        en: "draft",
        ko: "징집",
        explanation: "When the government requires you to join the military.",
      },
      {
        en: "exemption",
        ko: "면제",
        explanation: "Permission not to do something.",
      },
      {
        en: "armed forces",
        ko: "군대",
        explanation: "The U.S. military.",
      },
      {
        en: "court-martial",
        ko: "군사재판",
        explanation: "A military trial for a soldier.",
      },
      {
        en: "desert",
        ko: "탈영",
        explanation: "To leave the military without permission.",
      },
    ],
  },
  {
    id: "7",
    title: "헌법 · 선서 단어 (Part 9 J & Oath)",
    items: [
      {
        en: "Constitution",
        ko: "헌법",
        explanation: "The supreme law of the United States.",
      },
      {
        en: "form of government",
        ko: "정부 형태",
        explanation: "The type of government. The U.S. is a republic.",
      },
      {
        en: "support and defend",
        ko: "지지하고 방어",
        explanation: "To agree with and protect.",
      },
      {
        en: "Oath of Allegiance",
        ko: "충성 선서",
        explanation: "A promise to be loyal to the United States.",
      },
      {
        en: "allegiance",
        ko: "충성",
        explanation: "Loyalty to a country.",
      },
      {
        en: "fidelity",
        ko: "충실, 신의",
        explanation: "Being faithful and loyal.",
      },
      {
        en: "renounce",
        ko: "포기하다",
        explanation: "To give up something completely.",
      },
      {
        en: "abjure",
        ko: "거부하다",
        explanation: "To formally reject or give up.",
      },
      {
        en: "foreign prince / potentate",
        ko: "외국 왕 / 통치자",
        explanation: "A king or a powerful ruler of another country.",
      },
      {
        en: "sovereignty",
        ko: "주권",
        explanation: "The power that rules a country.",
      },
      {
        en: "subject",
        ko: "신민",
        explanation: "A person ruled by a king.",
      },
      {
        en: "heretofore",
        ko: "지금까지",
        explanation: "Before now.",
      },
      {
        en: "bear arms",
        ko: "무기를 들다",
        explanation: "To use a weapon to defend the country.",
      },
      {
        en: "noncombatant service",
        ko: "비전투 복무",
        explanation: "Military work without fighting.",
      },
      {
        en: "civilian direction",
        ko: "민간 지휘",
        explanation: "Being led by non-military authority.",
      },
      {
        en: "mental reservation",
        ko: "마음의 유보",
        explanation: "A secret doubt.",
        note: "나는 의심 없이 선서함",
      },
      {
        en: "evasion",
        ko: "회피",
        explanation: "Avoiding something on purpose.",
      },
      {
        en: "obligation",
        ko: "의무",
        explanation: "Something you must do.",
      },
    ],
  },
];

export const N400_VOCAB_TIP =
  "연습 방법: 표의 영어 문장을 보고 가족이 한국어 단어를 말하면 영어로 답하는 식으로 연습하세요. 핵심 단어 20개만 입에 붙여도 대부분의 \"meaning\" 질문에 대응됩니다.";

export const TOTAL_VOCAB_COUNT = N400_VOCAB_SECTIONS.reduce(
  (sum, s) => sum + s.items.length,
  0,
);
