// N-400 Naturalization Application — Practice Listening Data
// English questions with Korean translations.
// "speak" only English text via Web Speech API.

export interface N400Bullet {
  en: string;
  ko: string;
}

export interface N400Item {
  id: string;
  en: string;
  ko: string;
  note?: string;
  bullets?: N400Bullet[];
}

export interface N400Section {
  id: string;
  title: string;
  intro?: { en: string; ko: string };
  items: N400Item[];
}

export interface OathClause {
  id: string;
  label: string;
  en: string;
  ko: string;
}

export const N400_SECTIONS: N400Section[] = [
  {
    id: "A",
    title: "시민권 · 투표 · 세금",
    items: [
      {
        id: "1",
        en: "Have you EVER claimed to be a U.S. citizen (in writing or any other way)?",
        ko: "미국 시민이라고 (서면이나 다른 어떤 방식으로든) 주장한 적이 있습니까?",
        note: "No",
      },
      {
        id: "2",
        en: "Have you EVER registered to vote or voted in any Federal, state, or local election in the United States?",
        ko: "연방·주·지방 선거에 투표 등록을 하거나 투표한 적이 있습니까?",
        note: "No",
      },
      {
        id: "3",
        en: "Do you currently owe any overdue Federal, state, or local taxes in the United States?",
        ko: "현재 체납된 연방·주·지방 세금이 있습니까?",
        note: "No",
      },
      {
        id: "4",
        en: "Since you became a lawful permanent resident, have you called yourself a \"nonresident alien\" on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?",
        ko: "영주권자가 된 후, 세금 신고에서 자신을 \"비거주 외국인\"이라 하거나, 비거주자라 여겨 신고를 하지 않은 적이 있습니까?",
        note: "No",
      },
    ],
  },
  {
    id: "B",
    title: "공산당 · 정부 전복",
    items: [
      {
        id: "5.a",
        en: "Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?",
        ko: "전 세계 어디서든 공산당이나 전체주의 정당에 소속·관여·연관된 적이 있습니까?",
        note: "No",
      },
      {
        id: "5.b",
        en: "Advocated (supported and promoted) any of the following, or been a member of, involved in, or in any way associated with any group anywhere in the world that advocated any of the following:",
        ko: "다음을 옹호하거나, 다음을 옹호하는 단체에 소속·관여·연관된 적이 있습니까:",
        note: "No",
        bullets: [
          {
            en: "The overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law.",
            ko: "미국 정부나 모든 법의 무력·위헌적 전복",
          },
          {
            en: "Opposition to all organized government.",
            ko: "모든 조직된 정부에 대한 반대",
          },
          {
            en: "World communism.",
            ko: "세계 공산주의",
          },
          {
            en: "The establishment in the United States of a totalitarian dictatorship.",
            ko: "미국 내 전체주의 독재 수립",
          },
          {
            en: "The unlawful assaulting or killing of any officer of the Government because of their official character.",
            ko: "공무원에 대한 불법 폭행·살해",
          },
          {
            en: "The unlawful damage, injury, or destruction of property.",
            ko: "불법적 재산 손괴",
          },
          {
            en: "Sabotage.",
            ko: "사보타주",
          },
        ],
      },
    ],
  },
  {
    id: "C",
    title: "무기 · 테러 행위",
    items: [
      {
        id: "6.a",
        en: "Have you EVER used a weapon or explosive with intent to harm another person or cause damage to property?",
        ko: "타인을 해치거나 재산을 파괴할 의도로 무기·폭발물을 사용한 적이 있습니까?",
        note: "No",
      },
      {
        id: "6.b",
        en: "Have you EVER engaged (participated) in kidnapping, assassination, or hijacking or sabotage of an airplane, ship, vehicle, or other mode of transportation?",
        ko: "납치, 암살, 항공기·선박·차량 납치나 사보타주에 가담한 적이 있습니까?",
        note: "No",
      },
      {
        id: "6.c",
        en: "Have you EVER threatened, attempted, conspired, prepared, planned, advocated for, or incited others to commit any of the acts listed in Item Numbers 6.a. or 6.b.?",
        ko: "위 6.a·6.b 행위를 위협·시도·공모·준비·계획·옹호·선동한 적이 있습니까?",
        note: "No",
      },
    ],
  },
  {
    id: "D",
    title: "박해 · 집단학살 · 고문",
    intro: {
      en: "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any of the following:",
      ko: "다음을 명령·선동·요구·실행·방조·참여한 적이 있습니까:",
    },
    items: [
      { id: "7.a", en: "Torture?", ko: "고문?", note: "No" },
      { id: "7.b", en: "Genocide?", ko: "집단학살?", note: "No" },
      {
        id: "7.c",
        en: "Killing or trying to kill any person?",
        ko: "사람을 죽이거나 죽이려 한 것?",
        note: "No",
      },
      {
        id: "7.d",
        en: "Intentionally and severely injuring or trying to injure any person?",
        ko: "고의로 사람을 심하게 다치게 하거나 시도한 것?",
        note: "No",
      },
      {
        id: "7.e",
        en: "Any kind of sexual contact or activity with any person who did not consent, or was unable to consent, or was being forced or threatened by you or by someone else?",
        ko: "동의하지 못했거나 강요·위협당한 사람과의 어떤 성적 접촉?",
        note: "No",
      },
      {
        id: "7.f",
        en: "Not letting someone practice his or her religion?",
        ko: "타인의 종교 활동을 막은 것?",
        note: "No",
      },
      {
        id: "7.g",
        en: "Causing harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?",
        ko: "인종·종교·출신·사회집단·정치적 견해를 이유로 타인에게 해·고통을 끼친 것?",
        note: "No",
      },
    ],
  },
  {
    id: "E",
    title: "군대 · 무장단체 · 무기 훈련",
    items: [
      {
        id: "8.a",
        en: "Have you EVER served in, been a member of, assisted, or participated in any military or police unit?",
        ko: "군대나 경찰 부대에 복무·소속·방조·참여한 적이 있습니까?",
        note: "No (한국 병역 질병 면제로 복무 안 함)",
      },
      {
        id: "8.b",
        en: "Have you EVER served in, been a member of, assisted, or participated in any armed group, for example: paramilitary unit, self-defense unit, vigilante unit, rebel group, or guerrilla group?",
        ko: "준군사·자위·자경·반군·게릴라 등 무장단체에 복무·소속·방조·참여한 적이 있습니까?",
        note: "No",
      },
      {
        id: "9",
        en: "Have you EVER worked, volunteered, or otherwise served in a place where people were detained, for example, a prison, jail, prison camp, detention facility, or labor camp, or have you EVER directed or participated in any other activity that involved detaining people?",
        ko: "사람을 구금하는 장소(교도소·수용소 등)에서 일·자원봉사·복무했거나, 사람을 구금하는 활동에 가담한 적이 있습니까?",
        note: "No",
      },
      {
        id: "10.a",
        en: "Were you EVER a part of any group, or did you EVER help any group, unit, or organization that used a weapon against any person, or threatened to do so?",
        ko: "사람에게 무기를 사용했거나 위협한 단체에 속하거나 도운 적이 있습니까?",
        note: "No",
      },
      {
        id: "10.b",
        en: "When you were part of this group, or when you helped this group, did you ever use a weapon against another person?",
        ko: "(10.a가 Yes면) 그 단체에 있을 때 사람에게 무기를 사용한 적이 있습니까?",
        note: "No",
      },
      {
        id: "10.c",
        en: "When you were part of this group, or when you helped this group, did you ever threaten another person that you would use a weapon against that person?",
        ko: "(10.a가 Yes면) 무기 사용을 위협한 적이 있습니까?",
        note: "No",
      },
      {
        id: "11",
        en: "Have you EVER received any weapons training, paramilitary training, or other military-type training?",
        ko: "무기 훈련·준군사 훈련·기타 군사형 훈련을 받은 적이 있습니까?",
        note: "No (면제로 훈련 안 받음)",
      },
      {
        id: "12",
        en: "Have you EVER sold, provided, or transported weapons, or assisted any person in selling, providing, or transporting weapons, which you knew or believed would be used against another person?",
        ko: "사람을 해칠 줄 알면서 무기를 팔거나 제공·운반하거나 도운 적이 있습니까?",
        note: "No",
      },
      {
        id: "13",
        en: "Have you EVER recruited, enlisted, conscripted, or used any person under 15 years of age to serve in or help an armed group, or attempted or worked with others to do so?",
        ko: "15세 미만을 무장단체에 모집·등록·징집·이용했거나 시도한 적이 있습니까?",
        note: "No",
      },
      {
        id: "14",
        en: "Have you EVER used any person under 15 years of age to take part in hostilities, or attempted or worked with others to do so?",
        ko: "15세 미만을 전투에 이용했거나 시도한 적이 있습니까?",
        note: "No",
      },
    ],
  },
  {
    id: "F",
    title: "범죄 기록",
    items: [
      {
        id: "15.a",
        en: "Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?",
        ko: "체포되지 않은 범죄·위법을 저지르거나 합의·요청·방조·시도한 적이 있습니까?",
        note: "No",
      },
      {
        id: "15.b",
        en: "Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official, or immigration official for any reason, or been charged with a crime or offense?",
        ko: "어떤 이유로든 사법·군·이민 당국에 체포·소환·구금된 적이 있거나 범죄로 기소된 적이 있습니까? (음주운전·교통위반 포함)",
        note: "No",
      },
      {
        id: "16",
        en: "If you received a suspended sentence, were placed on probation, or were paroled, have you completed your suspended sentence, probation, or parole?",
        ko: "집행유예·보호관찰·가석방을 받았다면, 그것을 완료했습니까?",
        note: "해당시",
      },
      {
        id: "17.a",
        en: "Have you EVER engaged in prostitution, attempted to procure or import prostitutes or persons for the purpose of prostitution, or received any proceeds or money from prostitution?",
        ko: "매춘에 종사하거나, 매춘부를 알선·반입하려 했거나, 매춘 수익을 받은 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.b",
        en: "Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law?",
        ko: "규제 약물·불법 마약·마약 도구를 제조·재배·생산·유통·판매·밀수한 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.c",
        en: "Have you EVER been married to more than one person at the same time?",
        ko: "동시에 두 명 이상과 결혼한 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.d",
        en: "Have you EVER married someone in order to obtain an immigration benefit?",
        ko: "이민 혜택을 얻으려 누군가와 결혼한 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.e",
        en: "Have you EVER helped anyone to enter, or try to enter, the United States illegally?",
        ko: "누군가의 미국 불법 입국을 도운 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.f",
        en: "Have you EVER gambled illegally or received income from illegal gambling?",
        ko: "불법 도박을 하거나 그 수입을 받은 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.g",
        en: "Have you EVER failed to support your dependents or to pay alimony?",
        ko: "부양가족 양육비나 위자료 지급을 하지 않은 적이 있습니까?",
        note: "No",
      },
      {
        id: "17.h",
        en: "Have you EVER made any misrepresentation to obtain any public benefit in the United States?",
        ko: "미국 내 공공 혜택을 받으려 허위 진술을 한 적이 있습니까?",
        note: "No",
      },
      {
        id: "18",
        en: "Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?",
        ko: "미국 정부 관리에게 허위·사기·오해를 부르는 정보·서류를 제출한 적이 있습니까?",
        note: "No",
      },
      {
        id: "19",
        en: "Have you EVER lied to any U.S. Government officials to gain entry or admission into the United States or to gain immigration benefits while in the United States?",
        ko: "입국·입국허가나 이민 혜택을 얻으려 미국 정부 관리에게 거짓말한 적이 있습니까?",
        note: "No",
      },
    ],
  },
  {
    id: "G",
    title: "추방",
    items: [
      {
        id: "20",
        en: "Have you EVER been removed or deported from the United States?",
        ko: "미국에서 추방·강제퇴거된 적이 있습니까?",
        note: "No",
      },
      {
        id: "21",
        en: "Have you EVER been placed in removal, rescission, or deportation proceedings?",
        ko: "추방·취소·강제퇴거 절차에 회부된 적이 있습니까?",
        note: "No",
      },
    ],
  },
  {
    id: "H",
    title: "병역 등록 · 미군 복무",
    items: [
      {
        id: "22.a",
        en: "Are you a male who lived in the United States at any time between your 18th and 26th birthdays?",
        ko: "18~26세 사이에 미국에 거주한 남성입니까? (그 기간 내내 합법 비이민 신분이었으면 No)",
        note: "해당시",
      },
      {
        id: "22.b",
        en: "If you answered Yes to 22.a., did you register for the Selective Service?",
        ko: "(22.a가 Yes면) Selective Service에 등록했습니까?",
        note: "해당시",
      },
      {
        id: "22.c",
        en: "If you answered Yes to 22.b., provide information about your registration: Date Registered and Selective Service Number.",
        ko: "(22.b가 Yes면) 등록 날짜와 번호를 제공하십시오.",
        note: "해당시",
      },
      {
        id: "23",
        en: "Have you EVER left the United States to avoid being drafted in the U.S. armed forces?",
        ko: "미군 징집을 피하려 미국을 떠난 적이 있습니까?",
        note: "No",
      },
      {
        id: "24",
        en: "Have you EVER applied for any kind of exemption from military service in the U.S. armed forces?",
        ko: "미군 복무 면제를 신청한 적이 있습니까? (미군 관련 — 한국 면제와 무관)",
        note: "No",
      },
      {
        id: "25",
        en: "Have you EVER served in the U.S. armed forces?",
        ko: "미군에서 복무한 적이 있습니까?",
        note: "No",
      },
      {
        id: "26.a",
        en: "Are you currently a member of the U.S. armed forces?",
        ko: "현재 미군 소속입니까?",
        note: "No",
      },
      {
        id: "26.b",
        en: "Are you scheduled to deploy outside the United States within the next 3 months?",
        ko: "(26.a가 Yes면) 향후 3개월 내 해외 파병 예정입니까?",
        note: "해당시",
      },
      {
        id: "26.c",
        en: "Are you currently stationed outside the United States?",
        ko: "(26.a가 Yes면) 현재 해외 주둔 중입니까?",
        note: "해당시",
      },
      {
        id: "26.d",
        en: "Are you a former U.S. military service member who is currently residing outside of the United States?",
        ko: "(26.a가 No면) 현재 해외 거주 중인 미군 전역자입니까?",
        note: "No",
      },
      {
        id: "27",
        en: "Have you EVER been discharged from training or service in the U.S. armed forces because you were an alien?",
        ko: "외국인이라는 이유로 미군 훈련·복무에서 전역당한 적이 있습니까?",
        note: "No",
      },
      {
        id: "28",
        en: "Have you EVER been court-martialed or have you received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces?",
        ko: "미군 복무 중 군사재판을 받거나 불명예·비행·명예롭지 못한 전역을 한 적이 있습니까?",
        note: "No",
      },
      {
        id: "29",
        en: "Have you EVER deserted from the U.S. armed forces?",
        ko: "미군에서 탈영한 적이 있습니까?",
        note: "No",
      },
    ],
  },
  {
    id: "I",
    title: "귀족 작위",
    items: [
      {
        id: "30.a",
        en: "Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?",
        ko: "외국에서 세습 작위나 귀족 칭호를 지금 가지고 있거나 가진 적이 있습니까?",
        note: "No",
      },
      {
        id: "30.b",
        en: "If you answered Yes to 30.a., are you willing to give up any inherited titles or orders of nobility that you have in a foreign country at your naturalization ceremony?",
        ko: "(30.a가 Yes면) 선서식에서 그 작위를 포기하겠습니까?",
        note: "해당시",
      },
    ],
  },
  {
    id: "J",
    title: "헌법 지지 · 선서 의향",
    items: [
      {
        id: "31",
        en: "Do you support the Constitution and form of Government of the United States?",
        ko: "미국 헌법과 정부 형태를 지지합니까?",
        note: "Yes",
      },
      {
        id: "32",
        en: "Do you understand the full Oath of Allegiance to the United States?",
        ko: "미국 충성 선서 전문을 이해합니까?",
        note: "Yes",
      },
      {
        id: "33",
        en: "Are you unable to take the Oath of Allegiance because of a physical or developmental disability or mental impairment?",
        ko: "신체·발달 장애나 정신적 손상으로 충성 선서를 할 수 없습니까?",
        note: "No",
      },
      {
        id: "34",
        en: "Are you willing to take the full Oath of Allegiance to the United States?",
        ko: "미국 충성 선서 전문을 할 의향이 있습니까?",
        note: "Yes",
      },
      {
        id: "35",
        en: "If the law requires it, are you willing to bear arms on behalf of the United States?",
        ko: "법이 요구하면 미국을 위해 무기를 들 의향이 있습니까?",
        note: "Yes",
      },
      {
        id: "36",
        en: "If the law requires it, are you willing to perform noncombatant services in the U.S. armed forces?",
        ko: "법이 요구하면 미군에서 비전투 복무를 할 의향이 있습니까?",
        note: "Yes",
      },
      {
        id: "37",
        en: "If the law requires it, are you willing to perform work of national importance under civilian direction?",
        ko: "법이 요구하면 민간 지휘 하에 국가적으로 중요한 (비군사) 업무를 할 의향이 있습니까?",
        note: "Yes",
      },
    ],
  },
];

// Oath of Allegiance (Part 16)
export const OATH_INTRO = {
  en: "If your application is approved, you will be scheduled for a naturalization ceremony at which time you will be required to take the following Oath of Allegiance immediately prior to becoming a naturalized citizen. By signing below you acknowledge your willingness to take this Oath.",
  ko: "신청이 승인되면 선서식이 잡히고, 귀화 시민이 되기 직전에 아래 충성 선서를 하게 됩니다. 서명함으로써 이 선서를 할 의향이 있음을 인정하는 것입니다.",
};

export const OATH_OPENING = {
  en: "I hereby declare on oath,",
  ko: "나는 이에 선서로써 선언합니다,",
};

export const OATH_CLAUSES: OathClause[] = [
  {
    id: "1",
    label: "외국에 대한 충성 포기",
    en: "that I absolutely and entirely renounce and abjure all allegiance and fidelity to any foreign prince, potentate, state, or sovereignty, of whom or which I have heretofore been a subject or citizen;",
    ko: "내가 지금까지 신민이나 시민이었던 어떤 외국의 군주, 통치자, 국가, 주권에 대한 모든 충성과 신의를 절대적이고 완전히 포기하고 단념하며;",
  },
  {
    id: "2",
    label: "헌법 수호",
    en: "that I will support and defend the Constitution and laws of the United States of America against all enemies, foreign, and domestic;",
    ko: "국내외의 모든 적에 맞서 미국의 헌법과 법률을 지지하고 방어할 것이며;",
  },
  {
    id: "3",
    label: "진정한 충성",
    en: "that I will bear true faith and allegiance to the same;",
    ko: "그것(헌법과 법률)에 진정한 신의와 충성을 바칠 것이며;",
  },
  {
    id: "4",
    label: "무기를 들 의무",
    en: "that I will bear arms on behalf of the United States when required by the law;",
    ko: "법이 요구할 때 미국을 위해 무기를 들 것이며;",
  },
  {
    id: "5",
    label: "비전투 복무",
    en: "that I will perform noncombatant service in the armed forces of the United States when required by the law;",
    ko: "법이 요구할 때 미군에서 비전투 복무를 수행할 것이며;",
  },
  {
    id: "6",
    label: "국가 중요 업무",
    en: "that I will perform work of national importance under civilian direction when required by the law;",
    ko: "법이 요구할 때 민간 지휘 하에 국가적으로 중요한 업무를 수행할 것이며;",
  },
  {
    id: "7",
    label: "자유 의지로 선서",
    en: "and that I take this obligation freely, without any mental reservation or purpose of evasion;",
    ko: "그리고 이 의무를 어떤 마음의 유보나 회피의 목적 없이 자유롭게 받아들이며;",
  },
];

export const OATH_CLOSING = {
  en: "so help me God.",
  ko: "하느님이여 나를 도우소서. (종교가 없으면 이 부분은 생략 가능)",
};

// Full oath text for "Read entire oath" button
export const FULL_OATH_EN = [
  OATH_OPENING.en,
  ...OATH_CLAUSES.map((c) => c.en),
  OATH_CLOSING.en,
].join(" ");
