import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Text } from '@toss/tds-mobile';
import { Home, Share2, RefreshCw } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { share } from '@apps-in-toss/web-framework';
import { analyzeRelationship } from '../services/aiService';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addHistory } = useApp();
  const { type, answers } = location.state || { type: 'daily', answers: [] };

  const [isLoading, setIsLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    document.title = '진단 결과';
  }, []);

  const averageScore = answers.length > 0
    ? Math.round(answers.reduce((a: number, b: number) => a + b, 0) / answers.length)
    : 0;

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchAI = async () => {
      setIsLoading(true);
      try {
        const analysis = await analyzeRelationship(averageScore, answers);

        const advice = analysis
          ? `${analysis.summary}\n\n${analysis.analysis}\n\n💡 조언: ${analysis.advice}\n\n✨ 실천 팁: ${analysis.action_tip}`
          : generateMockAdvice(averageScore);

        setAiAdvice(advice);
        if (analysis) setAiSummary(analysis.summary);

        addHistory({ type, score: averageScore, advice });
        hasFetched.current = true;
      } catch (error) {
        console.error('Failed to fetch AI advice:', error);
        setAiAdvice(generateMockAdvice(averageScore));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAI();
  }, [averageScore, type, addHistory, answers]);

  const generateMockAdvice = (score: number) => {
    if (score >= 80) {
      return "축하합니다! 현재 두 분의 관계는 매우 건강하고 따뜻합니다. 서로에 대한 신뢰와 애정이 질문 답변 전반에서 느껴지네요. 현재의 소통 방식을 잘 유지하시면서, 가끔은 평소에 하지 않았던 새로운 활동을 함께 시도해 보는 것도 관계에 활력을 주는 좋은 방법입니다.";
    } else if (score >= 60) {
      return "안정적인 관계를 유지하고 계시군요. 다만 몇 가지 영역에서 미묘한 온도 차이가 느껴집니다. 특히 소통이나 공감 부문에서 조금 더 적극적으로 다가간다면 더 깊은 유대감을 형성할 수 있을 거예요. 오늘 저녁에는 서로의 고마웠던 점 한 가지씩 말해보는 건 어떨까요?";
    } else if (score >= 40) {
      return "현재 관계에 약간의 정체기가 오거나 작은 갈등들이 쌓여 있는 상태일 수 있습니다. '말하지 않아도 알겠지'라는 생각보다는 구체적인 표현이 필요한 시기입니다. 상대방의 입장에서 한 번 더 생각해보는 노력이 관계 회복의 시작이 될 수 있습니다.";
    } else {
      return "관계의 경고등이 켜진 상태입니다. 서로에 대한 피로도가 높거나 소통 단절이 우려되는 상황이네요. 전문가의 상담이나 깊이 있는 대화의 시간이 절실해 보입니다. 감정적으로 대응하기보다는 잠시 냉각기를 가지고 각자의 마음을 정리해본 뒤 진솔하게 마주할 필요가 있습니다.";
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-blue-500';
    if (score >= 60) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return '매우 맑음 ☀️';
    if (score >= 60) return '맑음 🌤️';
    if (score >= 40) return '구름 조금 ☁️';
    return '비 내림 🌧️';
  };

  const statusText = getStatusText(averageScore);

  const handleShare = async () => {
    let shareLink = '';
    try {
      const { getTossShareLink } = await import('@apps-in-toss/web-framework');
      shareLink = await getTossShareLink('intoss://breakuptest');
    } catch (e) {
      console.log('Toss framework link generation failed', e);
    }

    const message = `[LoveCheck] 관계 온도 진단 결과: ${averageScore}점 ${statusText}\n\nAI 조언:\n${aiAdvice}\n\n나도 테스트하러 가기 👉 ${shareLink}`;

    share({ message });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6 space-y-6 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
          <Text typography="t5" color="gray600" className="mb-4">
            관계 온도 진단 결과
          </Text>
          <div className="flex items-baseline justify-center mb-4">
            <span className={`text-6xl font-bold ${getStatusColor(averageScore)}`}>
              {averageScore}
            </span>
            <span className="text-2xl font-semibold text-gray-400 ml-1">점</span>
          </div>
          <Text typography="t3" fontWeight="bold" className="text-gray-900">
            {statusText}
          </Text>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <Text typography="t5" fontWeight="bold" className="text-gray-900">AI 맞춤 분석 및 조언</Text>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <Text typography="t6" color="gray500">분석 중입니다...</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {aiSummary && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-xl inline-block font-bold mb-2">
                  {aiSummary}
                </div>
              )}
              <div className="bg-blue-50 p-5 rounded-2xl">
                <Text typography="t6" className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {aiAdvice.replace(aiSummary + '\n\n', '')}
                </Text>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            size="large"
            variant="weak"
            className="flex-1 rounded-2xl"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center justify-center gap-2">
              <Home size={18} />
              홈으로
            </div>
          </Button>
          <Button
            size="large"
            color="primary"
            className="flex-1 rounded-2xl"
            disabled={isLoading}
            onClick={handleShare}
          >
            <div className="flex items-center justify-center gap-2">
              <Share2 size={18} />
              공유하기
            </div>
          </Button>
        </div>
      </main>
    </div>
  );
}
