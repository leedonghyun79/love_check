import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Text } from '@toss/tds-mobile';
import { DAILY_QUESTIONS, WEEKLY_QUESTIONS, MONTHLY_QUESTIONS, Question } from '../data/questions';

import { useAdMob } from '../hooks/useAdMob';

export default function Diagnosis() {
  const navigate = useNavigate();
  const { showInterstitial, isLoading: isAdLoading } = useAdMob();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || 'daily';

  let questions: Question[] = DAILY_QUESTIONS;
  if (type === 'weekly') questions = WEEKLY_QUESTIONS;
  if (type === 'monthly') questions = MONTHLY_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    document.title = '연애온도';
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (score: number) => {
    if (selectedScore !== null || isFinished) return;

    setSelectedScore(score);

    // 선택 후 다음 질문으로 넘어가기 전 시각적 피드백을 위해 약간의 지연 시간을 둡니다.
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);

      if (nextIndex < questions.length) {
        setSelectedScore(null);
        setCurrentIndex(nextIndex);
        // 질문 이동 시 히스토리 추가 (뒤로가기 대응)
        window.history.pushState({ questionIndex: nextIndex }, '');
      } else {
        setIsFinished(true);
        // 완료 상태 히스토리 추가
        window.history.pushState({ finished: true }, '');
      }
    }, 300);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.finished) {
        setIsFinished(true); // 혹시 모르니 보정
        return;
      }

      if (event.state && typeof event.state.questionIndex === 'number') {
        const newIndex = event.state.questionIndex;
        setIsFinished(false);
        setCurrentIndex(newIndex);
        setAnswers(prev => prev.slice(0, newIndex)); // 이전 답들까지만 유지
        setSelectedScore(null);
      } else {
        // 첫 진입 시점(state 없음)으로 돌아오면 질문 인덱스 초기화
        setIsFinished(false);
        setCurrentIndex(0);
        setAnswers([]);
        setSelectedScore(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [questions.length]);

  const handleShowResult = async () => {
    // 광고 표시 후 결과 페이지로 이동
    await showInterstitial();
    navigate('/result', { state: { type, answers, questions } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 p-6 flex flex-col justify-center">
        {isFinished ? (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <Text typography="t3" fontWeight="bold" className="text-gray-900 block">
                모든 질문이 끝났습니다!
              </Text>
              <Text typography="t6" color="gray600" className="block break-keep">
                AI가 분석한 두 분의 관계 온도와<br />맞춤형 조언을 확인해보세요.
              </Text>
            </div>

            <button
              onClick={handleShowResult}
              disabled={isAdLoading}
              className={`w-full py-5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center ${isAdLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isAdLoading ? '광고 로딩 중...' : '광고보고 결과확인하기'}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <Text typography="t6" color="blue500" className="mb-2 block">
                Q{currentIndex + 1} / {questions.length}
              </Text>
              <Text typography="t3" fontWeight="bold" className="text-gray-900 break-keep">
                {currentQuestion.text}
              </Text>
            </div>

            <div className="space-y-3">
              <ScoreButton
                score={5}
                label="매우 그렇다"
                isSelected={selectedScore === 100}
                onClick={() => handleAnswer(100)}
              />
              <ScoreButton
                score={4}
                label="그렇다"
                isSelected={selectedScore === 75}
                onClick={() => handleAnswer(75)}
              />
              <ScoreButton
                score={3}
                label="보통이다"
                isSelected={selectedScore === 50}
                onClick={() => handleAnswer(50)}
              />
              <ScoreButton
                score={2}
                label="그렇지 않다"
                isSelected={selectedScore === 25}
                onClick={() => handleAnswer(25)}
              />
              <ScoreButton
                score={1}
                label="전혀 그렇지 않다"
                isSelected={selectedScore === 0}
                onClick={() => handleAnswer(0)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ScoreButton({ score, label, isSelected, onClick }: { score: number, label: string, isSelected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 px-6 rounded-2xl transition-all text-left flex justify-between items-center border-[1.5px] ${isSelected ? 'shadow-md' : 'hover:border-blue-300'
        } focus:outline-none`}
      style={{
        backgroundColor: isSelected ? '#74c0fc' : '#d0ebff',
        borderColor: isSelected ? '#74c0fc' : '#b6dfff',
      }}
    >
      <Text
        typography="t5"
        fontWeight={isSelected ? "bold" : "medium"}
        style={{ color: isSelected ? '#ffffff' : '#004a80' }}
      >
        {label}
      </Text>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: i < score
                ? (isSelected ? '#ffffff' : '#1971c2')
                : (isSelected ? '#a5d8ff' : '#e7f5ff')
            }}
          />
        ))}
      </div>
    </button>
  );
}
