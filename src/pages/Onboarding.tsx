import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, TextField, Text } from '@toss/tds-mobile';

/**
 * 온보딩 페이지
 * - 앱 첫 실행 시 표시되는 페이지
 * - 사용자 정보 입력 및 초기 설정
 */
export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleComplete = () => {
    if (userName.trim() && partnerName.trim() && startDate) {
      completeOnboarding({ userName, partnerName, startDate });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pt-10">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="text-center mb-3">
          <Text typography="t2" fontWeight="bold" className="text-gray-900 block">
            환영합니다
          </Text>
          <Text typography="t2" className="block mt-1">
            ❤️
          </Text>
        </div>

        <div className="text-center mb-10 px-4">
          <Text typography="t6" color="gray600" className="block break-keep">
            두 분의 소중한 기록을 위해<br />몇 가지 정보를 알려주세요.
          </Text>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-8 p-6 border">
          <div className="space-y-2">
            <Text typography="t7" fontWeight="bold" color="gray700" className="ml-1">내 이름</Text>
            <TextField
              variant="box"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="본인의 이름을 입력하세요"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Text typography="t7" fontWeight="bold" color="gray700" className="ml-1">상대방 이름</Text>
            <TextField
              variant="box"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="파트너의 이름을 입력하세요"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Text typography="t7" fontWeight="bold" color="gray700" className="ml-1">우리 사귄 날</Text>
            <TextField
              variant="box"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={handleComplete}
              disabled={!userName.trim() || !partnerName.trim() || !startDate}
              display="full"
              style={{
                backgroundColor: (!userName.trim() || !partnerName.trim() || !startDate) ? '#e5e7eb' : '#d0ebff',
                color: (!userName.trim() || !partnerName.trim() || !startDate) ? '#9ca3af' : '#e5e7eb',
                border: 'none',
              }}
              className="rounded-2xl h-[56px] shadow-sm font-bold text-lg active:scale-[0.98] transition-all"
            >
              시작하기
            </Button>
          </div>
        </div>

        {/* 추가 정보 푸터 */}
        <div className="py-8 text-center mt-auto">
          <Text typography="t7" color="gray400">
            입력하신 정보는 기기에만 안전하게 저장됩니다.
          </Text>
        </div>
      </div>
    </div>
  );
}
