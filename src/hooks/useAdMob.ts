import { useState, useCallback } from 'react';
import { GoogleAdMob } from '@apps-in-toss/web-framework';

// 광고 ID 설정
const AD_GROUP_IDS = {
  REWARDED: 'ait.v2.live.1bbe4d0273b74498',
  INTERSTITIAL: 'ait.v2.live.1bbe4d0273b74498',
} as const;

export type AdType = 'INTERSTITIAL' | 'REWARDED';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('Ready');

  /**
   * 광고 표시 (전면 또는 보상형)
   */
  const showAd = useCallback((type: AdType = 'INTERSTITIAL') => {
    return new Promise<boolean>((resolve) => {
      setIsLoading(true);
      const adTypeName = type === 'INTERSTITIAL' ? '전면 광고' : '보상형 광고';
      setStatus(`${adTypeName} 로딩 중...`);

      const handleError = (error: unknown) => {
        console.error(`${type} AdMob error:`, error);
        setStatus(`Error: ${JSON.stringify(error)}`);
        setIsLoading(false);
        // 에러가 나더라도 진행은 가능하도록 false 반환
        resolve(false);
      };

      try {
        if (GoogleAdMob.loadAppsInTossAdMob?.isSupported?.()) {
          const adGroupId = type === 'INTERSTITIAL' ? AD_GROUP_IDS.INTERSTITIAL : AD_GROUP_IDS.REWARDED;

          GoogleAdMob.loadAppsInTossAdMob({
            options: { adGroupId },
            onEvent: (loadEvent) => {
              if (loadEvent.type === 'loaded') {
                setStatus(`${adTypeName} 로드 완료. 표시 중...`);

                GoogleAdMob.showAppsInTossAdMob({
                  options: { adGroupId },
                  onEvent: (showEvent) => {
                    if (showEvent.type === 'dismissed') {
                      setStatus(`${adTypeName} 닫힘`);
                      setIsLoading(false);
                      resolve(true);
                    } else if (showEvent.type === 'userEarnedReward') {
                      setStatus('보상 획득!');
                      // 보상형 광고인 경우 여기서 추가 로직 처리 가능
                    } else if (showEvent.type === 'failedToShow') {
                      handleError('failedToShow');
                    }
                  },
                  onError: handleError,
                });
              }
            },
            onError: handleError,
          });
        } else {
          setStatus('현재 환경에서 광고를 지원하지 않습니다 (시뮬레이터 등)');
          setIsLoading(false);
          console.warn('AdMob not supported');
          resolve(true); // 미지원 환경에서도 진행은 되도록 true 반환
        }
      } catch (err) {
        handleError(err);
      }
    });
  }, []);

  const showInterstitial = useCallback(() => showAd('INTERSTITIAL'), [showAd]);
  const showRewarded = useCallback(() => showAd('REWARDED'), [showAd]);

  return {
    isLoading,
    status,
    showInterstitial,
    showRewarded,
  };
}

