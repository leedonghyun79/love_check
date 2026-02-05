export interface Question {
  id: number;
  text: string;
  category: 'communication' | 'intimacy' | 'vision' | 'satisfaction';
}

export const DAILY_QUESTIONS: Question[] = [
  { id: 1, text: "오늘 파트너와 충분한 대화를 나누었나요?", category: 'communication' },
  { id: 2, text: "오늘 파트너에게 애정 표현(말, 행동 등)을 했나요?", category: 'intimacy' },
  { id: 3, text: "상대방의 기분이나 상태를 잘 파악하고 공감해 주었나요?", category: 'intimacy' },
  { id: 4, text: "오늘 함께한 시간의 만족도는 어떠했나요?", category: 'satisfaction' },
  { id: 5, text: "사소한 갈등이 있었더라도 잘 해결되었나요?", category: 'communication' },
];

export const WEEKLY_QUESTIONS: Question[] = [
  // 15 questions as per PRD
  { id: 1, text: "이번 주, 서로의 일상을 얼마나 공유했나요?", category: 'communication' },
  { id: 2, text: "갈등이 생겼을 때 서로의 감정을 해치지 않고 대화했나요?", category: 'communication' },
  { id: 3, text: "상대방의 의견을 존중하며 경청했나요?", category: 'communication' },
  { id: 4, text: "함께 있을 때 스마트폰 사용보다 대화에 집중했나요?", category: 'communication' },
  { id: 5, text: "손을 잡거나 안아주는 등 신체적 접촉이 충분했나요?", category: 'intimacy' },
  { id: 6, text: "진심이 담긴 칭찬이나 응원의 말을 건넸나요?", category: 'intimacy' },
  { id: 7, text: "서로에 대한 신뢰가 굳건하다고 느꼈나요?", category: 'intimacy' },
  { id: 8, text: "상대방이 나를 소중하게 여기고 있다는 것을 느꼈나요?", category: 'intimacy' },
  { id: 9, text: "미래에 대한 계획이나 꿈을 함께 이야기했나요?", category: 'vision' },
  { id: 10, text: "가치관이나 중요하게 생각하는 것에 대해 공감했나요?", category: 'vision' },
  { id: 11, text: "함께하고 싶은 버킷리스트나 목표가 있나요?", category: 'vision' },
  { id: 12, text: "데이트 코스나 활동에 대해 만족했나요?", category: 'satisfaction' },
  { id: 13, text: "개인적인 시간과 커플로서의 시간의 균형이 좋았나요?", category: 'satisfaction' },
  { id: 14, text: "서로의 취향이나 루틴을 존중해 주었나요?", category: 'satisfaction' },
  { id: 15, text: "관계 전반에 걸쳐 행복감을 느꼈나요?", category: 'satisfaction' },
];

export const MONTHLY_QUESTIONS: Question[] = [
  // 30 questions would be long, I'll add a few more and placeholders or just expand some.
  ...WEEKLY_QUESTIONS,
  { id: 16, text: "한 달 동안 우리가 함께 성장했다고 느끼나요?", category: 'vision' },
  { id: 17, text: "서로의 성격 차이를 긍정적으로 받아들이고 있나요?", category: 'communication' },
  { id: 18, text: "상대방의 가족이나 친구 관계를 존중하고 있나요?", category: 'satisfaction' },
  { id: 19, text: "경제적인 부분이나 현실적인 고민을 솔직하게 나누나요?", category: 'vision' },
  { id: 20, text: "서로의 단점까지 보듬어줄 수 있는 여유가 있나요?", category: 'intimacy' },
  { id: 21, text: "우리의 성적인 친밀감에 만족하시나요?", category: 'intimacy' },
  { id: 22, text: "함께 있으면 마음이 편안하고 안정이 되나요?", category: 'satisfaction' },
  { id: 23, text: "상대방이 변하길 바라기보다 있는 그대로를 사랑하나요?", category: 'intimacy' },
  { id: 24, text: "기념일이나 특별한 날을 의미 있게 보냈나요?", category: 'satisfaction' },
  { id: 25, text: "서로에게 비밀 없이 투명하게 소통하고 있나요?", category: 'communication' },
  { id: 26, text: "힘든 일이 생겼을 때 가장 먼저 떠오르는 사람이 파트너인가요?", category: 'intimacy' },
  { id: 27, text: "우리의 미래가 기대되고 설레나요?", category: 'vision' },
  { id: 28, text: "상대방의 작은 배려에 감사함을 느끼나요?", category: 'intimacy' },
  { id: 29, text: "갈등 상황에서 회피하지 않고 마주 보려고 노력하나요?", category: 'communication' },
  { id: 30, text: "전반적으로 이 관계를 지속하고 싶은 의지가 강한가요?", category: 'vision' },
];
