// N-400 문장 속 단어 (Words in Context) — Part 9 전체 (1~37번, 폼 순서 그대로)
// 출처: Form N-400 (Edition 01/20/25) Part 9 원문 + Part 16 Oath of Allegiance
// ※ 모든 항목(하위 a/b/c 포함)을 번호 순서대로, 폼의 전체 질문 문구 그대로 수록.
//
//   stem    : (선택) 여러 하위 항목이 공유하는 도입문 (작게 표시, 음성에 포함)
//   en      : 영어 문장 (폼 원문 · 스피커로 읽어줌) — \n 은 줄바꿈
//   ko      : 한글 번역
//   answer  : (선택) 정답 Yes/No/해당시
//   words[] : 이 문장에 들어있는 핵심 단어 (등장 순서대로; 없으면 빈 배열)
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
  stem?: string;
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

// 자주 쓰는 단어 정의 (재사용)
const W = {
  totalitarian: { word: "totalitarian", ko: "전체주의의", explain: "A government that controls everything." },
  sabotage: { word: "sabotage", ko: "사보타주", explain: "To secretly destroy or damage on purpose." },
  paramilitary: { word: "paramilitary", ko: "준군사", explain: "An armed group that is not the official army." },
  detained: { word: "detained", ko: "구금된", explain: "When you are held and not free to leave." },
};

export const N400_SENTENCE_VOCAB: SentenceVocabSection[] = [
  {
    id: "1-4",
    emoji: "🗳️",
    title: "시민권 · 투표 · 세금",
    subtitle: "Citizenship · Voting · Taxes (1–4)",
    cards: [
      {
        id: "1",
        en: "Have you EVER claimed to be a U.S. citizen (in writing or any other way)?",
        ko: "미국 시민이라고 (서면이나 다른 어떤 방식으로든) 주장한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "claimed", word: "claim", ko: "주장하다", explain: "To say that something is true." },
        ],
      },
      {
        id: "2",
        en: "Have you EVER registered to vote or voted in any Federal, state, or local election in the United States? If you lawfully voted only in a local election where aliens are eligible to vote, you may answer “No.”",
        ko: "미국의 연방·주·지방 선거에 투표 등록을 하거나 투표한 적이 있습니까? 외국인이 투표할 수 있는 지방 선거에서만 합법적으로 투표했다면 “No”라고 답해도 됩니다.",
        answer: "No",
        words: [
          { match: "registered to vote", word: "register to vote", ko: "투표 등록", explain: "To sign up so you can vote." },
        ],
      },
      {
        id: "3",
        en: "Do you currently owe any overdue Federal, state, or local taxes in the United States?",
        ko: "현재 미국에 체납된 연방·주·지방 세금이 있습니까?",
        answer: "No",
        words: [
          { match: "overdue", word: "overdue taxes", ko: "체납 세금", explain: "Taxes I did not pay on time." },
        ],
      },
      {
        id: "4",
        en: "Since you became a lawful permanent resident, have you called yourself a “nonresident alien” on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?",
        ko: "합법 영주권자가 된 이후, 연방·주·지방 세금 신고에서 자신을 “비거주 외국인”이라고 하거나, 비거주자라고 여겨 세금 신고를 하지 않기로 한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "lawful permanent resident", word: "permanent resident", ko: "영주권자", explain: "A green card holder." },
          { match: "nonresident alien", word: "nonresident alien", ko: "비거주 외국인", explain: "A person who lives outside the U.S. for taxes." },
        ],
      },
    ],
  },
  {
    id: "5",
    emoji: "⚙️",
    title: "공산당 · 정부 전복",
    subtitle: "Communist / Totalitarian Party (5)",
    cards: [
      {
        id: "5.a",
        en: "Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?",
        ko: "전 세계 어디서든 공산당이나 전체주의 정당에 소속·관여·연관된 적이 있습니까?",
        answer: "No",
        words: [W.totalitarian],
      },
      {
        id: "5.b",
        en: "Have you EVER advocated (supported and promoted) any of the following, or been a member of, involved in, or in any way associated with any group anywhere in the world that advocated any of the following:\n• Opposition to all organized government;\n• World communism;\n• The establishment in the United States of a totalitarian dictatorship;\n• The overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law;\n• The unlawful assaulting or killing of any officer or officers of the Government of the United States or of any other organized government because of their official character;\n• The unlawful damage, injury, or destruction of property; or\n• Sabotage?",
        ko: "다음 중 어느 것이든 옹호(지지·조장)했거나, 다음을 옹호한 단체에 소속·관여·연관된 적이 있습니까: 모든 조직된 정부에 대한 반대; 세계 공산주의; 미국 내 전체주의 독재 수립; 무력·폭력 또는 위헌적 수단에 의한 미국 정부나 모든 법의 전복; 공무원에 대한 불법 폭행·살해; 불법 재산 손괴; 또는 사보타주?",
        answer: "No",
        words: [
          { match: "advocated", word: "advocate", ko: "옹호하다", explain: "To publicly support an idea." },
          W.totalitarian,
          { match: "dictatorship", word: "dictatorship", ko: "독재", explain: "Rule by one person with total power." },
          { match: "overthrow", word: "overthrow", ko: "전복", explain: "To remove a government by force." },
          { match: "Sabotage", ...W.sabotage },
        ],
      },
    ],
  },
  {
    id: "6",
    emoji: "💣",
    title: "무기 · 테러 단체",
    subtitle: "Weapons / Terrorism Groups (6)",
    cards: [
      {
        id: "6.a",
        stem: "Have you EVER been a member of, involved in, or in any way associated with, or have you EVER provided money, a thing of value, services or labor, or any other assistance or support to a group that:",
        en: "Used a weapon or explosive with intent to harm another person or cause damage to property?",
        ko: "(다음과 같은 단체에 소속·지원한 적이 있습니까 — 그 단체가:) 타인을 해치거나 재산을 파괴할 의도로 무기·폭발물을 사용했습니까?",
        answer: "No",
        words: [
          { match: "explosive", word: "explosive", ko: "폭발물", explain: "A bomb or something that can blow up." },
        ],
      },
      {
        id: "6.b",
        stem: "Have you EVER been a member of, involved in, or in any way associated with, or have you EVER provided money, a thing of value, services or labor, or any other assistance or support to a group that:",
        en: "Engaged (participated) in kidnapping, assassination, or hijacking or sabotage of an airplane, ship, vehicle, or other mode of transportation?",
        ko: "(그 단체가:) 납치, 암살, 또는 항공기·선박·차량 등 교통수단의 납치나 사보타주에 가담했습니까?",
        answer: "No",
        words: [
          { match: "assassination", word: "assassination", ko: "암살", explain: "Murder of an important person." },
          { match: "sabotage", ...W.sabotage },
        ],
      },
      {
        id: "6.c",
        stem: "Have you EVER been a member of, involved in, or in any way associated with, or have you EVER provided money, a thing of value, services or labor, or any other assistance or support to a group that:",
        en: "Threatened, attempted (tried), conspired (planned with others), prepared, planned, advocated for, or incited (encouraged) others to commit any of the acts listed in Item Numbers 6.a. or 6.b.?",
        ko: "(그 단체가:) 위 6.a·6.b의 행위를 위협·시도·공모·준비·계획·옹호하거나 다른 사람을 선동했습니까?",
        answer: "No",
        words: [
          { match: "conspired", word: "conspire", ko: "공모하다", explain: "To secretly plan a crime with others." },
          { match: "incited", word: "incite", ko: "선동하다", explain: "To encourage others to do something violent." },
        ],
      },
    ],
  },
  {
    id: "7",
    emoji: "🚫",
    title: "박해 · 고문 · 집단학살",
    subtitle: "Torture · Genocide · Persecution (7)",
    cards: [
      {
        id: "7.a",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Torture?",
        ko: "(다음에 가담한 적이 있습니까:) 고문?",
        answer: "No",
        words: [
          { match: "Torture", word: "torture", ko: "고문", explain: "Causing severe pain to force someone." },
        ],
      },
      {
        id: "7.b",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Genocide?",
        ko: "(다음에 가담한 적이 있습니까:) 집단학살?",
        answer: "No",
        words: [
          { match: "Genocide", word: "genocide", ko: "집단학살", explain: "Killing a large group of people on purpose." },
        ],
      },
      {
        id: "7.c",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Killing or trying to kill any person?",
        ko: "(다음에 가담한 적이 있습니까:) 사람을 죽이거나 죽이려 한 것?",
        answer: "No",
        words: [],
      },
      {
        id: "7.d",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Intentionally and severely injuring or trying to injure any person?",
        ko: "(다음에 가담한 적이 있습니까:) 고의로 사람을 심하게 다치게 하거나 시도한 것?",
        answer: "No",
        words: [],
      },
      {
        id: "7.e",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Any kind of sexual contact or activity with any person who did not consent (did not agree) or was unable to consent (could not agree), or was being forced or threatened by you or by someone else?",
        ko: "(다음에 가담한 적이 있습니까:) 동의하지 않았거나(동의할 수 없었거나) 강요·위협당한 사람과의 성적 접촉?",
        answer: "No",
        words: [
          { match: "consent", word: "consent", ko: "동의", explain: "To agree to something." },
        ],
      },
      {
        id: "7.f",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Not letting someone practice his or her religion?",
        ko: "(다음에 가담한 적이 있습니까:) 타인의 종교 활동을 막은 것?",
        answer: "No",
        words: [],
      },
      {
        id: "7.g",
        stem: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
        en: "Causing harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?",
        ko: "(다음에 가담한 적이 있습니까:) 인종·종교·출신·특정 사회집단 소속·정치적 견해를 이유로 누군가에게 해나 고통을 준 것?",
        answer: "No",
        words: [
          { match: "Causing harm or suffering", word: "persecute", ko: "박해하다", explain: "To hurt someone because of their religion or race." },
        ],
      },
    ],
  },
  {
    id: "8-14",
    emoji: "🎖️",
    title: "군대 · 무장단체 · 무기",
    subtitle: "Military · Armed Groups · Weapons (8–14)",
    cards: [
      {
        id: "8.a",
        en: "Have you EVER served in, been a member of, assisted (helped), or participated in any military or police unit?",
        ko: "군대나 경찰 부대에 복무·소속·참여한 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "8.b",
        en: "Have you EVER served in, been a member of, assisted (helped), or participated in any armed group (a group that carries weapons), for example: paramilitary unit (a group of people who act like a military group but are not part of the official military), self-defense unit, vigilante unit, rebel group, or guerrilla group?",
        ko: "무기를 소지한 무장단체에 복무·소속·참여한 적이 있습니까? 예: 준군사 부대, 자위대, 자경단, 반군, 게릴라 단체.",
        answer: "No",
        words: [W.paramilitary],
      },
      {
        id: "9",
        en: "Have you EVER worked, volunteered, or otherwise served in a place where people were detained (forced to stay), for example, a prison, jail, prison camp (a camp where prisoners of war or political prisoners are kept), detention facility, or labor camp, or have you EVER directed or participated in any other activity that involved detaining people?",
        ko: "사람을 구금하는 장소(교도소·구치소·포로수용소·구금시설·노동수용소 등)에서 일하거나, 사람을 구금하는 활동을 지시·참여한 적이 있습니까?",
        answer: "No",
        words: [W.detained],
      },
      {
        id: "10.a",
        en: "Were you EVER a part of any group, or did you EVER help any group, unit, or organization that used a weapon against any person, or threatened to do so?",
        ko: "사람에게 무기를 사용했거나 사용을 위협한 단체에 속하거나 도운 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "10.b",
        en: "If you answered “Yes” to Item Number 10.a., when you were part of this group, or when you helped this group, did you ever use a weapon against another person?",
        ko: "(10.a가 Yes면) 그 단체에 속해 있을 때 다른 사람에게 무기를 사용한 적이 있습니까?",
        answer: "해당시",
        words: [],
      },
      {
        id: "10.c",
        en: "If you answered “Yes” to Item Number 10.a., when you were part of this group, or when you helped this group, did you ever threaten another person that you would use a weapon against that person?",
        ko: "(10.a가 Yes면) 그 단체에 속해 있을 때 다른 사람에게 무기를 쓰겠다고 위협한 적이 있습니까?",
        answer: "해당시",
        words: [],
      },
      {
        id: "11",
        en: "Have you EVER sold, provided, or transported weapons, or assisted any person in selling, providing, or transporting weapons, which you knew or believed would be used against another person?",
        ko: "사람을 해칠 줄 알거나 믿으면서 무기를 팔거나 제공·운반하거나, 그렇게 하도록 도운 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "12",
        en: "Have you EVER received any weapons training, paramilitary training, or other military-type training?",
        ko: "무기 훈련, 준군사 훈련, 또는 기타 군사형 훈련을 받은 적이 있습니까?",
        answer: "No",
        words: [
          { match: "weapons training", word: "weapons training", ko: "무기 훈련", explain: "Learning to use guns or weapons." },
          W.paramilitary,
        ],
      },
      {
        id: "13",
        en: "Have you EVER recruited (asked), enlisted (signed up), conscripted (required to join), or used any person under 15 years of age to serve in or help an armed group, or attempted or worked with others to do so?",
        ko: "15세 미만을 무장단체에 모집·등록·징집하거나 이용한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "conscripted", word: "conscript", ko: "징집하다", explain: "To force someone to join the military." },
        ],
      },
      {
        id: "14",
        en: "Have you EVER used any person under 15 years of age to take part in hostilities or attempted or worked with others to do so? This could include participating in combat or providing services related to combat (such as serving as a messenger or transporting supplies).",
        ko: "15세 미만을 적대 행위(전투)에 이용한 적이 있습니까? 전투 참가나 전투 관련 활동(전령·보급 운반 등)도 포함됩니다.",
        answer: "No",
        words: [
          { match: "hostilities", word: "hostilities", ko: "적대 행위(전투)", explain: "Fighting in a war." },
        ],
      },
    ],
  },
  {
    id: "15-19",
    emoji: "⚖️",
    title: "범죄 기록",
    subtitle: "Criminal Record (15–19)",
    cards: [
      {
        id: "15.a",
        en: "Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?",
        ko: "체포되지 않은 범죄·위법을 저지르거나, 저지르기로 합의·요청·방조·시도한 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "15.b",
        en: "Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?",
        ko: "어떤 이유로든 사법·군·이민 당국에 의해 체포·소환·구금·억류된 적이 있거나, 범죄·위법으로 기소된 적이 있습니까?",
        answer: "No",
        words: [
          { match: "arrested", word: "arrested", ko: "체포된", explain: "When police take you into custody." },
          { match: "cited", word: "cited", ko: "소환된(티켓)", explain: "When you are given a ticket or official notice." },
          { match: "detained", word: "detained", ko: "구금된", explain: "When you are held and not free to leave." },
          { match: "charged", word: "charged", ko: "기소된", explain: "When you are officially accused of a crime." },
        ],
      },
      {
        id: "16",
        en: "If you received a suspended sentence, were placed on probation, or were paroled, have you completed your suspended sentence, probation, or parole?",
        ko: "집행유예·보호관찰·가석방을 받았다면, 그것을 완료했습니까?",
        answer: "해당시",
        words: [
          { match: "suspended sentence", word: "suspended sentence", ko: "집행유예", explain: "A jail sentence you do not serve unless you reoffend." },
          { match: "probation", word: "probation", ko: "보호관찰", explain: "Court supervision instead of jail." },
          { match: "paroled", word: "parole", ko: "가석방", explain: "Early release from prison with conditions." },
        ],
      },
      {
        id: "17.a",
        en: "Have you EVER engaged in prostitution, attempted to procure or import prostitutes or persons for the purpose of prostitution, or received any proceeds or money from prostitution?",
        ko: "매춘에 종사하거나, 매춘부를 알선·반입하려 하거나, 매춘으로 수익·금전을 받은 적이 있습니까?",
        answer: "No",
        words: [
          { match: "prostitution", word: "prostitution", ko: "매춘", explain: "Selling sex for money." },
        ],
      },
      {
        id: "17.b",
        en: "Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled (trafficked) any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law or regulation of a U.S. state, the United States, or a foreign country?",
        ko: "미국 주·연방 또는 외국의 법령을 위반하여 규제 약물·불법 마약·마약 도구를 제조·재배·생산·유통·판매하거나 밀수(거래)한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "smuggled", word: "smuggle", ko: "밀수·밀거래", explain: "To move people or goods secretly and illegally." },
          { match: "controlled substances", word: "controlled substance", ko: "규제 약물", explain: "Illegal drugs." },
        ],
      },
      {
        id: "17.c",
        en: "Have you EVER been married to more than one person at the same time?",
        ko: "동시에 두 명 이상과 결혼한 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "17.d",
        en: "Have you EVER married someone in order to obtain an immigration benefit?",
        ko: "이민 혜택을 얻기 위해 누군가와 결혼한 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "17.e",
        en: "Have you EVER helped anyone to enter, or try to enter, the United States illegally?",
        ko: "타인이 미국에 불법으로 입국하거나 입국하려는 것을 도운 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "17.f",
        en: "Have you EVER gambled illegally or received income from illegal gambling?",
        ko: "불법 도박을 하거나 불법 도박으로 수입을 받은 적이 있습니까?",
        answer: "No",
        words: [
          { match: "gambled", word: "gamble", ko: "도박하다", explain: "To play games for money." },
        ],
      },
      {
        id: "17.g",
        en: "Have you EVER failed to support your dependents (pay child support) or to pay alimony (court-ordered financial support after divorce or separation)?",
        ko: "부양가족을 부양하지 않거나(양육비 미지급), 위자료(이혼·별거 후 법원 명령 경제적 지원)를 내지 않은 적이 있습니까?",
        answer: "No",
        words: [
          { match: "child support", word: "child support", ko: "양육비", explain: "Money paid to support your children." },
          { match: "alimony", word: "alimony", ko: "위자료", explain: "Money paid to an ex-spouse after divorce." },
        ],
      },
      {
        id: "17.h",
        en: "Have you EVER made any misrepresentation to obtain any public benefit in the United States?",
        ko: "미국에서 공공 혜택을 받기 위해 허위 진술을 한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "misrepresentation", word: "misrepresentation", ko: "허위 진술", explain: "Giving false information to get something." },
        ],
      },
      {
        id: "18",
        en: "Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?",
        ko: "미국 정부 관리에게 허위·사기·오해를 부르는 정보나 서류를 준 적이 있습니까?",
        answer: "No",
        words: [
          { match: "fraudulent", word: "fraud", ko: "사기", explain: "Lying to get something you want." },
          { match: "misleading", word: "misleading", ko: "오해를 부르는", explain: "Information that makes someone believe a wrong thing." },
        ],
      },
      {
        id: "19",
        en: "Have you EVER lied to any U.S. Government officials to gain entry or admission into the United States or to gain immigration benefits while in the United States?",
        ko: "미국 입국·입장을 얻거나 미국 내에서 이민 혜택을 얻기 위해 미국 정부 관리에게 거짓말한 적이 있습니까?",
        answer: "No",
        words: [],
      },
    ],
  },
  {
    id: "20-21",
    emoji: "✈️",
    title: "추방",
    subtitle: "Removal / Deportation (20–21)",
    cards: [
      {
        id: "20",
        en: "Have you EVER been placed in removal, rescission, or deportation proceedings?",
        ko: "추방·취소·강제퇴거 절차에 회부된 적이 있습니까?",
        answer: "No",
        words: [
          { match: "deportation", word: "deportation", ko: "추방·강제퇴거", explain: "Being forced to leave the country." },
        ],
      },
      {
        id: "21",
        en: "Have you EVER been removed or deported from the United States?",
        ko: "미국에서 추방되거나 강제퇴거된 적이 있습니까?",
        answer: "No",
        words: [
          { match: "deported", word: "deported", ko: "추방된", explain: "Forced to leave the country by the government." },
        ],
      },
    ],
  },
  {
    id: "22-29",
    emoji: "🪖",
    title: "병역 등록 · 미군 복무",
    subtitle: "Selective Service · U.S. Military (22–29)",
    cards: [
      {
        id: "22.a",
        en: "Are you a male who lived in the United States at any time between your 18th and 26th birthdays? (Do not select “Yes” if you were a lawful nonimmigrant for all of that time period.)",
        ko: "18세부터 26세 사이에 미국에 거주한 적이 있는 남성입니까? (그 기간 내내 합법 비이민 신분이었다면 “Yes”를 선택하지 마세요.)",
        answer: "해당시",
        words: [],
      },
      {
        id: "22.b",
        en: "If you answered “Yes,” to Item Number 22.a., did you register for the Selective Service?",
        ko: "(22.a가 Yes면) Selective Service(병역 등록제)에 등록했습니까?",
        answer: "해당시",
        words: [
          { match: "Selective Service", word: "Selective Service", ko: "병역 등록제", explain: "The U.S. system for men to register for the draft." },
        ],
      },
      {
        id: "23",
        en: "Have you EVER left the United States to avoid being drafted in the U.S. armed forces?",
        ko: "미군 징집을 피하려고 미국을 떠난 적이 있습니까?",
        answer: "No",
        words: [
          { match: "drafted", word: "draft", ko: "징집", explain: "Being required by law to join the military." },
        ],
      },
      {
        id: "24",
        en: "Have you EVER applied for any kind of exemption from military service in the U.S. armed forces?",
        ko: "미군 복무에서 어떤 종류의 면제든 신청한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "exemption", word: "exemption", ko: "면제", explain: "Permission not to do something." },
        ],
      },
      {
        id: "25",
        en: "Have you EVER served in the U.S. armed forces?",
        ko: "미군에서 복무한 적이 있습니까?",
        answer: "No",
        words: [],
      },
      {
        id: "26.a",
        en: "Are you currently a member of the U.S. armed forces?",
        ko: "현재 미군 소속입니까?",
        answer: "No",
        words: [],
      },
      {
        id: "26.b",
        en: "If you answered “Yes” to Item Number 26.a., are you scheduled to deploy outside the United States, including to a vessel, within the next 3 months?",
        ko: "(26.a가 Yes면) 향후 3개월 내에 미국 밖(함정 포함)으로 파병될 예정입니까?",
        answer: "해당시",
        words: [
          { match: "deploy", word: "deploy", ko: "파병·배치", explain: "To send military forces to a location." },
        ],
      },
      {
        id: "26.c",
        en: "If you answered “Yes,” to Item Number 26.a., are you currently stationed outside the United States?",
        ko: "(26.a가 Yes면) 현재 미국 밖에 주둔 중입니까?",
        answer: "해당시",
        words: [],
      },
      {
        id: "26.d",
        en: "If you answered “No” to Item Number 26.a., are you a former U.S. military service member who is currently residing outside of the U.S.?",
        ko: "(26.a가 No면) 현재 미국 밖에 거주 중인 전직 미군 복무자입니까?",
        answer: "해당시",
        words: [],
      },
      {
        id: "27",
        en: "Have you EVER been court-martialed or have you received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces?",
        ko: "미군 복무 중 군사재판을 받거나, 명예제대가 아닌(불명예·품행불량 등) 전역을 한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "court-martialed", word: "court-martial", ko: "군사재판", explain: "A military trial." },
          { match: "discharge", word: "discharge", ko: "전역·제대", explain: "Release from military service." },
        ],
      },
      {
        id: "28",
        en: "Have you EVER been discharged from training or service in the U.S. armed forces because you were an alien?",
        ko: "외국인이라는 이유로 미군 훈련이나 복무에서 전역당한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "alien", word: "alien", ko: "외국인", explain: "A person who is not a U.S. citizen." },
        ],
      },
      {
        id: "29",
        en: "Have you EVER deserted from the U.S. armed forces?",
        ko: "미군에서 탈영한 적이 있습니까?",
        answer: "No",
        words: [
          { match: "deserted", word: "desert", ko: "탈영하다", explain: "To leave the military without permission." },
        ],
      },
    ],
  },
  {
    id: "30",
    emoji: "👑",
    title: "귀족 칭호",
    subtitle: "Hereditary Title / Nobility (30)",
    cards: [
      {
        id: "30.a",
        en: "Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?",
        ko: "외국의 세습 작위나 귀족 칭호를 지금 가지고 있거나 가진 적이 있습니까?",
        answer: "No",
        words: [
          { match: "hereditary title", word: "hereditary title", ko: "세습 작위", explain: "A noble rank passed down in a family." },
          { match: "order of nobility", word: "order of nobility", ko: "귀족 작위", explain: "A noble rank, like a duke or count." },
        ],
      },
      {
        id: "30.b",
        en: "If you answered “Yes,” to Item Number 30.a., are you willing to give up any inherited titles or orders of nobility that you have in a foreign country at your naturalization ceremony?",
        ko: "(30.a가 Yes면) 귀화식에서 외국의 세습 작위나 귀족 칭호를 포기할 의향이 있습니까?",
        answer: "해당시",
        words: [],
      },
    ],
  },
  {
    id: "31-37",
    emoji: "📜",
    title: "헌법 · 충성 선서",
    subtitle: "Constitution · Oath of Allegiance (31–37)",
    cards: [
      {
        id: "31",
        en: "Do you support the Constitution and form of Government of the United States?",
        ko: "미국 헌법과 정부 형태를 지지합니까?",
        answer: "Yes",
        words: [
          { match: "Constitution", word: "Constitution", ko: "헌법", explain: "The supreme law of the United States." },
        ],
      },
      {
        id: "32",
        en: "Do you understand the full Oath of Allegiance to the United States (see Part 16. Oath of Allegiance)?",
        ko: "미국에 대한 충성 선서 전문을 이해합니까? (Part 16. 충성 선서 참조)",
        answer: "Yes",
        words: [
          { match: "Oath of Allegiance", word: "Oath of Allegiance", ko: "충성 선서", explain: "A promise to be loyal to the United States." },
        ],
      },
      {
        id: "33",
        en: "Are you unable to take the Oath of Allegiance because of a physical or developmental disability or mental impairment?",
        ko: "신체적·발달적 장애나 정신적 손상 때문에 충성 선서를 할 수 없습니까?",
        answer: "No",
        words: [
          { match: "mental impairment", word: "mental impairment", ko: "정신적 손상", explain: "A condition that affects the mind." },
        ],
      },
      {
        id: "34",
        en: "Are you willing to take the full Oath of Allegiance to the United States?",
        ko: "미국에 대한 충성 선서 전문을 할 의향이 있습니까?",
        answer: "Yes",
        words: [
          { match: "Allegiance", word: "allegiance", ko: "충성", explain: "Loyalty to a country." },
        ],
      },
      {
        id: "35",
        en: "If the law requires it, are you willing to bear arms (carry weapons) on behalf of the United States?",
        ko: "법이 요구하면 미국을 위해 무기를 들(휴대할) 의향이 있습니까?",
        answer: "Yes",
        words: [
          { match: "bear arms", word: "bear arms", ko: "무기를 들다", explain: "To use a weapon to defend the country." },
        ],
      },
      {
        id: "36",
        en: "If the law requires it, are you willing to perform noncombatant services (do something that does not include fighting in a war) in the U.S. armed forces?",
        ko: "법이 요구하면 미군에서 비전투 복무(전쟁에서 싸우지 않는 일)를 할 의향이 있습니까?",
        answer: "Yes",
        words: [
          { match: "noncombatant", word: "noncombatant service", ko: "비전투 복무", explain: "Military work without fighting." },
        ],
      },
      {
        id: "37",
        en: "If the law requires it, are you willing to perform work of national importance under civilian direction (do non-military work that the U.S. Government says is important to the country)?",
        ko: "법이 요구하면 민간 지휘 하에 국가적으로 중요한 일(정부가 중요하다고 하는 비군사 업무)을 할 의향이 있습니까?",
        answer: "Yes",
        words: [
          { match: "civilian", word: "civilian", ko: "민간(인)", explain: "A person who is not in the military." },
        ],
      },
    ],
  },
  {
    id: "oath",
    emoji: "✍️",
    title: "충성 선서문",
    subtitle: "Oath of Allegiance (Part 16)",
    cards: [
      {
        id: "Oath 1",
        en: "I absolutely and entirely renounce and abjure all allegiance and fidelity to any foreign prince, potentate, state, or sovereignty, of whom or which I have heretofore been a subject or citizen.",
        ko: "저는 지금까지 신민 또는 시민이었던 어떤 외국의 군주·통치자·국가·주권에 대한 모든 충성과 충실을 절대적이고 완전히 포기하고 거부합니다.",
        words: [
          { match: "renounce", word: "renounce", ko: "포기하다", explain: "To give up something completely." },
          { match: "abjure", word: "abjure", ko: "거부하다", explain: "To formally reject or give up." },
          { match: "allegiance", word: "allegiance", ko: "충성", explain: "Loyalty to a country." },
          { match: "potentate", word: "potentate", ko: "통치자", explain: "A powerful ruler of a country." },
          { match: "sovereignty", word: "sovereignty", ko: "주권", explain: "The power that rules a country." },
        ],
      },
      {
        id: "Oath 2",
        en: "I take this obligation freely, without any mental reservation or purpose of evasion; so help me God.",
        ko: "저는 어떤 마음의 유보나 회피 목적 없이 이 의무를 자유롭게 받아들입니다. 신이여 도우소서.",
        words: [
          { match: "mental reservation", word: "mental reservation", ko: "마음의 유보", explain: "A secret doubt." },
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
  "Form N-400(Edition 01/20/25) Part 9의 모든 질문(1~37번)을 번호 순서대로, 원문 그대로 담았습니다. 노란색 단어가 실제 문장 안 어디에 들어있는지 보면서 문장과 단어를 한 번에 익히고, 스피커로 전체 문장을 들어보세요.";
