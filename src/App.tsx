import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import Result from './pages/Result';

/**
 * 앱 라우팅 컴포넌트
 * - 온보딩 완료 여부에 따라 다른 라우트 표시
 */
function AppRoutes() {
  const { isOnboardingComplete } = useApp();

  // 온보딩이 완료되지 않았으면 온보딩 페이지만 표시
  if (!isOnboardingComplete) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  // 온보딩 완료 후 전체 앱 라우트 표시
  return (
    <Routes>
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

/**
 * 메인 앱 컴포넌트
 * - SPA 라우팅 구현
 */
export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
