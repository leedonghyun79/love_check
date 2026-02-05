import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'breakuptest',
  brand: {
    displayName: '이별 위험도 진단하기', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#3182F6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: 'https://static.toss.im/appsintoss/13599/d755fb6b-f63b-4408-9605-5f94e3c6f74b.png', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: '192.168.0.201',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
