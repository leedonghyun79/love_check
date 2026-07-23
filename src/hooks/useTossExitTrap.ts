import { useEffect } from 'react';
import { closeView } from '@apps-in-toss/web-framework';

/**
 * 토스 미니앱 종료 트랩 훅
 * 메인 화면에서 뒤로가기 시 앱을 종료시키는 로직을 템플릿화했습니다.
 * 
 * @param title 페이지 타이틀 (선택사항)
 */
export const useTossExitTrap = (title?: string) => {
  useEffect(() => {
    if (title) document.title = title;

    // 히스토리 트랩 설치 (가짜 국면 추가)
    const setupExitTrap = () => {
      // @ts-ignore
      if (!window.history.state?.exitTrap) {
        window.history.pushState({ exitTrap: true }, '');
      }
    };

    setupExitTrap();

    const handlePopState = (event: PopStateEvent) => {
      // Home 경로 판단 (BrowserRouter & HashRouter 대응)
      const isHome = !window.location.hash ||
        ['#/', '#/home'].includes(window.location.hash) ||
        ['/', '/home'].includes(window.location.pathname);

      // Home에 도달했는데 state에 exitTrap이 없다면, 
      // 이는 'trap' 상태에서 'back'을 눌러 'original' 상태로 온 것이므로 앱 종료
      if (isHome && !event.state?.exitTrap) {
        closeView().catch(() => {
          // 종료 실패 시 다시 트랩 설치 (브라우저 등)
          setupExitTrap();
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [title]);
};
