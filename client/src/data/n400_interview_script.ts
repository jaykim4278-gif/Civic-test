// N-400 모의 면접 대화 스크립트 (Mock Interview Conversation Script)
// 출처: N400_Final_Master_Guide_v2.docx (본인 제출 Form N-400, Edition 01/20/25 기반)
//
// 각 줄(line)은 한 번의 문답:
//   q_en : 심사관 영어 질문 (스피커로 읽어줌)
//   q_ko : 질문 한글 번역
//   a_en : 모범 영어 답변 (스피커로 읽어줌)
//   a_ko : 답변 한글 번역
//   tip  : (선택) 한글 팁/주의
//   alt  : (선택) 상황별 다른 답변 안내
//   personal : (선택) 본인 정보로 바꿔야 하는 답변 표시

export interface InterviewLine {
  q_en: string;
  q_ko: string;
  a_en: string;
  a_ko: string;
  tip?: string;
  alt?: string;
  personal?: boolean;
}

export interface InterviewScene {
  id: string;
  emoji: string;
  title: string; // 한글 제목
  subtitle: string; // 영어 부제
  lines: InterviewLine[];
}

export const N400_INTERVIEW_SCENES: InterviewScene[] = [
  {
    id: "1",
    emoji: "👋",
    title: "인사 & 스몰토크",
    subtitle: "Greeting & Small Talk",
    lines: [
      {
        q_en: "Good morning. How are you today?",
        q_ko: "안녕하세요. 오늘 기분 어떠세요?",
        a_en: "Good morning. I'm good, thank you. A little nervous, but okay. And you?",
        a_ko: "안녕하세요. 좋아요, 감사합니다. 조금 긴장되지만 괜찮습니다. 심사관님은요?",
        tip: "긴장된다고 솔직히 말해도 괜찮습니다. 짧고 긍정적으로.",
      },
      {
        q_en: "I'll be conducting your interview today.",
        q_ko: "오늘 제가 면접을 진행하겠습니다.",
        a_en: "Okay, thank you.",
        a_ko: "네, 감사합니다.",
        tip: "듣고 이해만 하면 됩니다.",
      },
      {
        q_en: "May I see your appointment notice and green card?",
        q_ko: "면접 통지서와 영주권을 보여주시겠어요?",
        a_en: "Yes, of course. Here you go.",
        a_ko: "네, 물론입니다. 여기 있습니다.",
      },
      {
        q_en: "How was traffic? Did it take long to get here?",
        q_ko: "오는 길 교통은 어땠나요? 오래 걸렸어요?",
        a_en: "It was fine. About 30 minutes.",
        a_ko: "괜찮았어요. 30분쯤 걸렸습니다.",
        tip: "길이 막혔어도 불평하지 마세요.",
      },
      {
        q_en: "How is the weather today?",
        q_ko: "오늘 날씨는 어떤가요?",
        a_en: "It's nice today.",
        a_ko: "오늘 날씨 좋네요.",
        alt: "비: \"It's raining today.\" / 더움: \"It's hot today.\" / 추움: \"It's cold today.\"",
      },
      {
        q_en: "Have you studied?",
        q_ko: "공부 많이 하셨어요?",
        a_en: "Yes, I studied a lot. I'm ready.",
        a_ko: "네, 많이 공부했어요. 준비됐습니다.",
      },
      {
        q_en: "Did anyone accompany you today?",
        q_ko: "오늘 동행한 분이 있나요?",
        a_en: "No, I came alone.",
        a_ko: "아니요, 혼자 왔습니다.",
        alt: "동행 시: \"My wife came with me, but she is waiting outside.\"",
      },
      {
        q_en: "Are you ready to begin?",
        q_ko: "시작할 준비 되셨나요?",
        a_en: "Yes, I'm ready.",
        a_ko: "네, 준비됐습니다.",
      },
    ],
  },
  {
    id: "2",
    emoji: "✋",
    title: "진실 선서 & 시민권 사유",
    subtitle: "Truth Oath & Why Citizenship",
    lines: [
      {
        q_en: "Please raise your right hand. Do you promise to tell the truth?",
        q_ko: "오른손을 들어주세요. 진실만 말할 것을 약속합니까?",
        a_en: "Yes, I do.",
        a_ko: "네, 약속합니다.",
        tip: "오른손을 들고 또렷하게 \"Yes, I do.\"",
      },
      {
        q_en: "What did you just swear?",
        q_ko: "방금 무엇을 맹세했나요?",
        a_en: "I swore to tell the truth.",
        a_ko: "진실을 말하겠다고 맹세했습니다.",
        alt: "또는: \"I promise to tell the truth.\"",
      },
      {
        q_en: "Why do you want to become a U.S. citizen?",
        q_ko: "왜 미국 시민이 되고 싶으신가요?",
        a_en: "My family is settled here. My brother's family and many of my church friends live here, and I really love this place now. Of course, I also want to vote and live as a U.S. citizen.",
        a_ko: "제 가족이 여기에 정착했습니다. 형의 가족과 교회 친구들이 여기 살고, 저는 이제 이곳을 정말 사랑합니다. 물론 투표도 하고 미국 시민으로 살고 싶습니다.",
        tip: "정치 의견·불평은 금지. 가족·정착·투표 위주로 긍정적으로.",
      },
    ],
  },
  {
    id: "3",
    emoji: "📋",
    title: "Part 1 — 자격",
    subtitle: "Information About Your Eligibility",
    lines: [
      {
        q_en: "What is your eligibility or basis for filing?",
        q_ko: "신청 자격(근거)은 무엇입니까?",
        a_en: "General Provision. I have been a permanent resident for more than 5 years.",
        a_ko: "일반 규정입니다. 저는 5년 넘게 영주권자였습니다.",
      },
      {
        q_en: "How long have you been a permanent resident?",
        q_ko: "영주권자가 된 지 얼마나 됐나요?",
        a_en: "For more than 5 years.",
        a_ko: "5년 넘었습니다.",
        tip: "영주권 카드의 'Resident Since' 날짜 기준.",
      },
      {
        q_en: "Have you lived in the U.S. continuously for the last 5 years?",
        q_ko: "지난 5년간 미국에 연속으로 거주했습니까?",
        a_en: "Yes, I have.",
        a_ko: "네, 그렇습니다.",
        tip: "짧은 여행은 연속 거주를 깨뜨리지 않습니다.",
      },
      {
        q_en: "Have you been physically present at least half of that time?",
        q_ko: "그 기간의 절반 이상을 실제로 미국에 있었습니까?",
        a_en: "Yes.",
        a_ko: "네.",
      },
    ],
  },
  {
    id: "4",
    emoji: "🪪",
    title: "Part 2 — 신상 정보",
    subtitle: "Information About You",
    lines: [
      {
        q_en: "Can you confirm your full name?",
        q_ko: "성함 전체를 확인해 주시겠어요?",
        a_en: "Yes. My full name is Jay Kim.",
        a_ko: "네. 제 전체 이름은 Jay Kim 입니다.",
        personal: true,
        tip: "← 본인 법적 이름 전체로 바꾸세요. 또박또박 발음.",
      },
      {
        q_en: "Do you go by any other names?",
        q_ko: "다른 이름(별명)을 쓰시나요?",
        a_en: "No.",
        a_ko: "아니요.",
        tip: "식당에서 쓰는 'Jay' 같은 건 단순 별명이라 No.",
      },
      {
        q_en: "What is your date of birth?",
        q_ko: "생년월일이 어떻게 되나요?",
        a_en: "My date of birth is October third, 1980.",
        a_ko: "제 생년월일은 1980년 10월 3일입니다.",
        personal: true,
        tip: "← 본인 생일로. 형식: 월 + 서수(third) + 연도.",
      },
      {
        q_en: "Where were you born? What is your country of citizenship?",
        q_ko: "어디서 태어났나요? 국적은 어디입니까?",
        a_en: "I was born in Seoul, South Korea. My country of citizenship is South Korea.",
        a_ko: "저는 대한민국 서울에서 태어났습니다. 국적은 대한민국입니다.",
        personal: true,
        tip: "← 출생 도시를 본인 것으로 (예: Seoul, Busan, Daegu).",
      },
      {
        q_en: "When did you become a permanent resident?",
        q_ko: "언제 영주권자가 되었나요?",
        a_en: "I became a permanent resident in 2018.",
        a_ko: "저는 2018년에 영주권자가 되었습니다.",
        personal: true,
        tip: "← 영주권 카드의 취득 연도로 바꾸세요.",
      },
      {
        q_en: "How did you become a permanent resident?",
        q_ko: "어떻게 영주권을 취득했나요?",
        a_en: "Through my wife's employment. She got her green card as a worker, and I received mine as her spouse.",
        a_ko: "아내의 취업을 통해서입니다. 아내가 근로자로 영주권을 받았고, 저는 배우자로 받았습니다.",
        tip: "영주권 카테고리 EW9 = 아내(EW3, 취업 영주권)의 배우자. 정상 경로입니다.",
      },
      {
        q_en: "What is your category of admission?",
        q_ko: "영주권 분류(카테고리)는 무엇인가요?",
        a_en: "EW9, as the spouse of my wife.",
        a_ko: "EW9, 제 아내의 배우자 자격입니다.",
        tip: "카드에 적힌 코드 그대로 답하세요.",
      },
      {
        q_en: "Was your mother or father a U.S. citizen before your 18th birthday?",
        q_ko: "18세 이전에 부모님 중 미국 시민이 있었나요?",
        a_en: "No. They live in South Korea.",
        a_ko: "아니요. 부모님은 한국에 사십니다.",
      },
      {
        q_en: "Do you have a disability or impairment that prevents you from meeting the English or civics requirements?",
        q_ko: "영어·시민학 요건을 못 갖추게 하는 장애나 손상이 있나요?",
        a_en: "No.",
        a_ko: "아니요.",
      },
      {
        q_en: "Do you want the SSA to update your status when you become a citizen?",
        q_ko: "시민이 되면 사회보장국(SSA)이 신분을 갱신하길 원하나요?",
        a_en: "Yes.",
        a_ko: "네.",
      },
      {
        q_en: "Is this your Social Security number? Do you consent to share it with the SSA?",
        q_ko: "이게 본인 사회보장번호 맞나요? SSA와 공유하는 데 동의하나요?",
        a_en: "Yes, it is. Yes, I do.",
        a_ko: "네, 맞습니다. 네, 동의합니다.",
        tip: "카드 보고 확인하면 됩니다. 번호를 외울 필요는 없습니다.",
      },
    ],
  },
  {
    id: "5",
    emoji: "🏠",
    title: "Part 3·4 — 인적 사항 & 거주지",
    subtitle: "Biographic & Residence",
    lines: [
      {
        q_en: "What is your race?",
        q_ko: "인종이 어떻게 되나요?",
        a_en: "Asian.",
        a_ko: "아시아인입니다.",
        tip: "한국인은 race = Asian.",
      },
      {
        q_en: "What is your current address?",
        q_ko: "현재 주소가 어떻게 되나요?",
        a_en: "I live in Katy, Texas.",
        a_ko: "저는 텍사스주 케이티에 삽니다.",
        personal: true,
        tip: "← 정확한 번지까지. 예) I live at 1234 Main Street, Katy, Texas.",
      },
      {
        q_en: "How long have you lived at your current address?",
        q_ko: "현재 주소에 산 지 얼마나 됐나요?",
        a_en: "I have lived here since 2022. About three years.",
        a_ko: "2022년부터 여기 살았습니다. 약 3년입니다.",
        personal: true,
        tip: "← 실제 입주 연도로 바꾸세요.",
      },
      {
        q_en: "Where did you live before that?",
        q_ko: "그 전에는 어디서 살았나요?",
        a_en: "Before that, I lived in Houston, Texas.",
        a_ko: "그 전에는 텍사스주 휴스턴에 살았습니다.",
        personal: true,
        tip: "← 5년 내 이전 주소를 신청서 목록대로 말하세요.",
      },
    ],
  },
  {
    id: "6",
    emoji: "💍",
    title: "Part 5·6 — 결혼 & 자녀",
    subtitle: "Marital History & Children",
    lines: [
      {
        q_en: "What is your current marital status?",
        q_ko: "현재 결혼 상태는 어떻게 되나요?",
        a_en: "I am married.",
        a_ko: "저는 기혼입니다.",
      },
      {
        q_en: "What is your spouse's name? When did you get married?",
        q_ko: "배우자 이름이 뭔가요? 언제 결혼했나요?",
        a_en: "My wife's name is Jane Kim. We got married in 2015.",
        a_ko: "제 아내 이름은 Jane Kim 입니다. 저희는 2015년에 결혼했습니다.",
        personal: true,
        tip: "← 배우자 전체 이름과 결혼 연도를 본인 것으로.",
      },
      {
        q_en: "Is your spouse a U.S. citizen?",
        q_ko: "배우자가 미국 시민인가요?",
        a_en: "No, she is a permanent resident.",
        a_ko: "아니요, 아내는 영주권자입니다.",
        tip: "← 사실대로. 시민권자면: \"Yes, she is a U.S. citizen.\"",
      },
      {
        q_en: "How many children do you have?",
        q_ko: "자녀가 몇 명인가요?",
        a_en: "I have one child.",
        a_ko: "저는 자녀가 한 명 있습니다.",
        personal: true,
        tip: "← 자녀 수를 본인 것으로.",
      },
      {
        q_en: "Where do your children live?",
        q_ko: "자녀는 어디에 사나요?",
        a_en: "He lives with me.",
        a_ko: "아이는 저와 함께 삽니다.",
        personal: true,
        tip: "← 사실대로. 딸이면 \"She lives with me.\"",
      },
    ],
  },
  {
    id: "7",
    emoji: "🍽️",
    title: "Part 7 — 직업",
    subtitle: "Employment (Hanz Diner & Frank's Grill)",
    lines: [
      {
        q_en: "Who do you work for? What do you do for work?",
        q_ko: "어디서 일하나요? 무슨 일을 하나요?",
        a_en: "I work for myself. I'm self-employed. I co-own two restaurants.",
        a_ko: "저는 제 사업을 합니다. 자영업자입니다. 식당 두 곳을 공동 소유하고 있습니다.",
      },
      {
        q_en: "What is the name of your business?",
        q_ko: "사업체 이름이 뭔가요?",
        a_en: "I co-own two restaurants, Hanz Diner and Frank's Grill.",
        a_ko: "저는 식당 두 곳, Hanz Diner와 Frank's Grill을 공동 소유합니다.",
      },
      {
        q_en: "Who owns them?",
        q_ko: "누가 소유하나요?",
        a_en: "Hanz Diner is co-owned with my wife. Frank's Grill is co-owned with my brother.",
        a_ko: "Hanz Diner는 아내와 공동 소유이고, Frank's Grill은 형과 공동 소유입니다.",
      },
      {
        q_en: "How long have you owned them?",
        q_ko: "소유한 지 얼마나 됐나요?",
        a_en: "Since 2020. About five years.",
        a_ko: "2020년부터입니다. 약 5년 됐습니다.",
      },
      {
        q_en: "What did you do before 2020?",
        q_ko: "2020년 전에는 무슨 일을 했나요?",
        a_en: "Before 2020, I focused on raising our child and helped my wife with the restaurant. After 2020, I focused more on running the business.",
        a_ko: "2020년 전에는 아이를 키우는 데 집중했고 아내의 식당 일을 도왔습니다. 2020년 이후로는 사업 운영에 더 집중했습니다.",
      },
      {
        q_en: "Did you have your own income before 2020?",
        q_ko: "2020년 전에 본인 수입이 있었나요?",
        a_en: "No, I was a homemaker at that time.",
        a_ko: "아니요, 그때는 가사를 돌봤습니다.",
        tip: "수입이 없었던 것은 전혀 문제가 아닙니다.",
      },
    ],
  },
  {
    id: "8",
    emoji: "✈️",
    title: "Part 8 — 해외 여행",
    subtitle: "Time Outside the United States",
    lines: [
      {
        q_en: "Have you traveled outside the U.S. in the last 5 years?",
        q_ko: "지난 5년간 미국 밖으로 여행한 적이 있나요?",
        a_en: "Yes, I visited South Korea.",
        a_ko: "네, 한국을 방문했습니다.",
      },
      {
        q_en: "You took one trip, is that correct?",
        q_ko: "한 번 여행하셨네요, 맞나요?",
        a_en: "Yes, that's correct. But after I filed my application, I took one more trip to South Korea, from October 21st to November 12th, 2025, to visit my elderly parents.",
        a_ko: "네, 맞습니다. 하지만 신청서 제출 후에 한 번 더 한국에 다녀왔습니다. 2025년 10월 21일부터 11월 12일까지, 연로하신 부모님을 뵈러 갔습니다.",
        tip: "접수 후 한 여행은 먼저 정직하게 밝히세요. 여권 스탬프 지참.",
      },
      {
        q_en: "When did you travel?",
        q_ko: "언제 여행했나요?",
        a_en: "First, from June 18th to July 11th. Second, from October 21st to November 12th, 2025.",
        a_ko: "첫 번째는 6월 18일부터 7월 11일까지, 두 번째는 2025년 10월 21일부터 11월 12일까지입니다.",
        personal: true,
        tip: "← 본인 여행 날짜로 바꾸세요.",
      },
      {
        q_en: "How long was each trip?",
        q_ko: "각 여행은 얼마나 길었나요?",
        a_en: "Each trip was about three weeks.",
        a_ko: "각 여행은 약 3주였습니다.",
      },
      {
        q_en: "Why did you travel?",
        q_ko: "왜 여행했나요?",
        a_en: "To visit my elderly parents.",
        a_ko: "연로하신 부모님을 뵈러 갔습니다.",
      },
      {
        q_en: "Did any trip last 6 months or longer?",
        q_ko: "6개월 이상 지속된 여행이 있었나요?",
        a_en: "No.",
        a_ko: "아니요.",
        tip: "두 여행 모두 약 3주(6개월 미만)라 연속 거주에 영향 없습니다.",
      },
    ],
  },
  {
    id: "9",
    emoji: "🆘",
    title: "막혔을 때 만능 표현",
    subtitle: "When You Get Stuck",
    lines: [
      {
        q_en: "I'm going to ask you some questions about your application.",
        q_ko: "신청서에 대해 몇 가지 질문하겠습니다. (못 알아들었을 때)",
        a_en: "I'm sorry. Could you repeat that, please?",
        a_ko: "죄송합니다. 다시 한 번 말씀해 주시겠어요?",
        tip: "추측해서 답하지 말고 되물으세요.",
      },
      {
        q_en: "Have you ever persecuted anyone?",
        q_ko: "(모르는 단어가 나왔을 때 — 예: persecute)",
        a_en: "Could you explain that word, please?",
        a_ko: "그 단어를 설명해 주시겠어요?",
      },
      {
        q_en: "Do you understand?",
        q_ko: "이해되셨나요? (확신이 안 설 때 안전하게)",
        a_en: "Yes, thank you.",
        a_ko: "네, 감사합니다.",
        alt: "부정 답이 맞으면: \"No, thank you.\"",
      },
    ],
  },
];

// 통계
export const TOTAL_INTERVIEW_LINES = N400_INTERVIEW_SCENES.reduce(
  (sum, s) => sum + s.lines.length,
  0,
);

export const INTERVIEW_TIP =
  "심사관 질문(영어)을 듣고, 한글 뜻을 확인한 뒤, 영어 모범답변을 따라 소리내어 말해보세요. '전체 대화 듣기'를 누르면 질문→답변이 순서대로 재생됩니다.";
