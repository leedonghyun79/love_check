import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing, Text } from '@toss/tds-mobile';
import { Heart, Share as ShareIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dailyQuestions } from '../data/dailyQuestions';
import { share } from '@apps-in-toss/web-framework';
import { useTossExitTrap } from '../hooks/useTossExitTrap';

export default function Home() {
  useTossExitTrap('연애온도');
  const navigate = useNavigate();
  const { userName, partnerName, startDate, history } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 캐로셀 자동 스크롤
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const scrollAmount = container.clientWidth;

      // 약 5px 정도의 여유를 두고 비교
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const lastTest = history[0];
  const lastScore = lastTest?.score ?? 36.5;

  // 사귄 날짜 계산
  const calculateDDay = () => {
    if (!startDate) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - start.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch (e) {
      return 0;
    }
  };

  const dDay = calculateDDay();

  const getColorTheme = (score: number, isInitial: boolean) => {
    if (isInitial) return { text: 'text-rose-400', bg: 'bg-rose-50', border: 'border-rose-100', heart: 'text-rose-400' };
    if (score >= 80) return { text: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', heart: 'text-blue-500' };
    if (score >= 60) return { text: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100', heart: 'text-green-500' };
    if (score >= 40) return { text: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100', heart: 'text-yellow-500' };
    return { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', heart: 'text-red-500' };
  };

  const theme = getColorTheme(lastScore, !lastTest);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-10 max-w-lg mx-auto relative">
        {/* 인사말 및 상태 요약 */}
        <section className="relative">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border">
            <div className="flex-1 pr-4">
              <Text typography="t6" className="text-gray-600 mb-1 block">
                반가워요, {userName}님 👋
              </Text>
              <Text typography="t3" fontWeight="bold" className="text-gray-900 block break-keep">
                {partnerName}님과 함께한 지
              </Text>
            </div>
            <div className="flex-shrink-0 bg-red-50 px-4 py-2 rounded-2xl border border-red-100 min-w-fit shadow-sm">
              <Text typography="t3" fontWeight="bold" color="red600" className="whitespace-nowrap">D+{dDay}</Text>
            </div>
          </div>
        </section>

        {/* 현재 상태 카드 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 ${theme.bg} rounded-full flex items-center justify-center`}>
                <Heart className={`w-5 h-5 ${theme.heart}`} />
              </div>
              <Text typography="t5" fontWeight="bold" className="">관계 온도</Text>
            </div>
            {lastTest && (
              <Text typography="t6" className="text-gray-500">마지막 진단: {new Date(lastTest.date).toLocaleDateString()}</Text>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-100"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - lastScore / 100)}
                  strokeLinecap="round"
                  className={`${theme.text} transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{lastScore}</span>
                <span className="text-[10px] text-gray-400 font-medium">도</span>
              </div>
            </div>
            <div className="flex-1">
              <Text typography="t5" fontWeight="bold" className="block mb-1 break-keep">
                {!lastTest ? '건강한 시작 온도예요' : lastScore >= 80 ? '매우 따뜻한 상태예요' : lastScore >= 60 ? '안정적인 상태예요' : lastScore >= 40 ? '관리가 필요해요' : '주의가 필요해요'}
              </Text>
              <Text typography="t7" className="text-gray-500 leading-tight break-keep">
                {!lastTest ? '진단을 통해 두 사람의 현재 관계 온도를 확인해보세요.' : lastScore >= 80 ? '서로를 아끼는 마음이 충분히 전달되고 있어요.' : lastScore >= 60 ? '꾸준한 대화로 온기를 유지해 주세요.' : lastScore >= 40 ? '작은 오해가 쌓이지 않도록 대화가 필요해요.' : '솔직한 대화의 시간이 시급합니다.'}
              </Text>
            </div>
          </div>
        </section>


        {/* 오늘의 질문 💌 (캐로셀) */}
        {/* 오늘의 질문 💌 (텍스트만 캐로셀) */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💌</span>
            <Text typography="t6" fontWeight="bold" className="text-indigo-600">오늘의 커플 질문</Text>
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const today = new Date();
              const day = today.getDate();
              const index = (day - 1 + i) % dailyQuestions.length;
              const question = dailyQuestions[index];

              return (
                <div
                  key={index}
                  className="min-w-full snap-center flex flex-col"
                >
                  <Text
                    typography="t4"
                    fontWeight="bold"
                    className="text-gray-900 leading-relaxed break-keep"
                    style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                  >
                    "{question}"
                  </Text>
                  <Spacing size={12} />
                  <div className="flex justify-between items-end">
                    <Text typography="t7" className="text-gray-500">파트너와 함께 대화를 나누어보세요.</Text>
                    <button
                      onClick={() => share({ message: `[LoveCheck] 오늘의 질문\n\n"${question}"` })}
                      className="p-2 -mr-2 text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
                    >
                      <ShareIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 맞춤 진단 추천 (매일 랜덤) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Text typography="t5" fontWeight="bold" className="">오늘의 추천 진단 ✨</Text>
            <div className="bg-blue-100 px-2 py-1 rounded-lg">
              <Text typography="t7" fontWeight="bold" className="text-blue-600">NEW</Text>
            </div>
          </div>

          {(() => {
            // 오늘 날짜를 기준으로 추천 진단 선택 (시드 기반 랜덤)
            const today = new Date();
            const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
            const recommendationIndex = dateSeed % 3; // 0, 1, 2 중 하나 선택

            const categories = [
              {
                type: 'daily',
                title: '일일 체크',
                description: '오늘 우리의 관계를 30초 만에 돌아보세요',
                emoji: '☀️',
                iconBg: 'bg-amber-100',
                count: 5
              },
              {
                type: 'weekly',
                title: '주간 진단',
                description: '한 주간의 소통과 감정을 깊이 분석합니다',
                emoji: '🍀',
                iconBg: 'bg-green-100',
                count: 15
              },
              {
                type: 'monthly',
                title: '월간 종합진단',
                description: '관계 전반에 대한 전문적인 심리 분석',
                emoji: '🎁',
                iconBg: 'bg-pink-100',
                count: 30
              }
            ];

            const recommended = categories[recommendationIndex];
            const others = categories.filter((_, i) => i !== recommendationIndex);

            return (
              <div className="space-y-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] p-1 shadow-lg shadow-blue-100">
                  <button
                    onClick={() => navigate(`/diagnosis?type=${recommended.type}`)}
                    className="w-full bg-white rounded-[28px] p-6 text-left flex items-center gap-5 transition-transform active:scale-[0.98]"
                  >
                    <div className={`w-16 h-16 ${recommended.iconBg} rounded-2xl flex items-center justify-center text-4xl shadow-sm`}>
                      {recommended.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Text typography="t5" fontWeight="bold" className="text-gray-900">{recommended.title}</Text>
                        <Text typography="t7" color="blue500" fontWeight="bold">{recommended.count}문항</Text>
                      </div>
                      <Text typography="t7" color="gray500" className="leading-snug break-keep">
                        {recommended.description}
                      </Text>
                    </div>
                  </button>
                </div>

                <div className="space-y-3">
                  <Text typography="t6" fontWeight="bold" color="gray500" className="ml-1">다른 진단 보기</Text>
                  <div className="grid grid-cols-1 gap-3">
                    {others.map((cat) => (
                      <DiagnosisCard
                        key={cat.type}
                        title={cat.title}
                        description={cat.description}
                        emoji={cat.emoji}
                        iconBg={cat.iconBg}
                        count={cat.count}
                        onClick={() => navigate(`/diagnosis?type=${cat.type}`)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* 최근 조언 피드 (히스토리) */}
        {history.length > 0 && (
          <section className="space-y-4">
            <Text typography="t5" fontWeight="bold">최근 AI 조언</Text>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-sm">🤖</div>
                <div>
                  <Text typography="t6" fontWeight="bold" className="block mb-1">{lastTest.type === 'daily' ? '일일 체크' : lastTest.type === 'weekly' ? '주간 진단' : '월간 종합진단'} 피드백</Text>
                  <Text typography="t7" color="gray700" className="line-clamp-2">
                    {lastTest.advice}
                  </Text>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Spacing size={40} />
    </div>
  );
}


function DiagnosisCard({ title, description, emoji, iconBg, count, onClick }: { title: string, description: string, emoji: string, iconBg: string, count: number, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-2xl border transition-all text-left group"
    >
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-sm`}>
        {emoji}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-0.5">
          <Text typography="t6" fontWeight="bold">{title}</Text>
          <Text typography="t7" color="gray400">{count}문항</Text>
        </div>
        <Text typography="t7" color="gray500">{description}</Text>
      </div>
    </button>
  );
}
