import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Spacing } from '@toss/tds-mobile';
import { ArrowLeft, Trash2 } from 'lucide-react';

/**
 * 설정 페이지
 * - 앱 설정 및 관리 기능
 */
export default function Settings() {
  const navigate = useNavigate();
  const { resetApp } = useApp();

  const handleReset = () => {
    if (confirm('정말로 앱을 초기화하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      resetApp();
      // 초기화 후 페이지 새로고침
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            설정
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* 앱 정보 섹션 */}
          <section className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              앱 정보
            </h2>
            <div className="space-y-3">
              <InfoRow label="버전" value="0.0.0" />
              <InfoRow label="빌드" value="Development" />
            </div>
          </section>

          {/* 계정 섹션 */}
          <section className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              계정
            </h2>
            <div className="space-y-3">
              <SettingItem
                label="프로필 수정"
                onClick={() => alert('프로필 수정 기능은 준비 중입니다')}
              />
              <SettingItem
                label="알림 설정"
                onClick={() => alert('알림 설정 기능은 필요 시 구현 예정입니다')}
              />
            </div>
          </section>

          {/* 기타 섹션 */}
          <section className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              기타
            </h2>
            <div className="space-y-3">
              <SettingItem
                label="이용약관"
                onClick={() => alert('이용약관 페이지는 준비 중입니다')}
              />
              <SettingItem
                label="개인정보 처리방침"
                onClick={() => alert('개인정보 처리방침 페이지는 준비 중입니다')}
              />
              <SettingItem
                label="오픈소스 라이선스"
                onClick={() => alert('오픈소스 라이선스 페이지는 준비 중입니다')}
              />
            </div>
          </section>

          {/* 위험 영역 */}
          <section className="p-6 bg-red-50 dark:bg-red-900/10">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              위험 영역
            </h2>
            <Button
              onClick={handleReset}
              color="danger"
              variant="weak"
              className="w-full"
            >
              <Trash2 className="w-5 h-5 mr-2 inline" />
              앱 초기화
            </Button>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              모든 데이터가 삭제되며 복구할 수 없습니다
            </p>
          </section>
        </div>

        <Spacing size={24} />

        {/* 푸터 */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Made with ❤️ using Toss Apps-in-Toss Template
        </div>
      </main>
    </div>
  );
}

/**
 * 정보 행 컴포넌트
 */
interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-gray-900 dark:text-white font-medium">{value}</span>
    </div>
  );
}

/**
 * 설정 항목 컴포넌트
 */
interface SettingItemProps {
  label: string;
  onClick: () => void;
}

function SettingItem({ label, onClick }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <span className="text-gray-900 dark:text-white">{label}</span>
    </button>
  );
}
