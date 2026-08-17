// PWA用の最小限のService Worker設定
self.addEventListener('install', (event) => {
  console.log('[Vista SW] Installing Service Worker...');
  // すぐにアクティベート
  (self as any).skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Vista SW] Service Worker Activated.');
});

self.addEventListener('fetch', (event) => {
  // 必要に応じてキャッシュ戦略（Stale-While-Revalidate等）を実装
  // 現時点ではリクエストをそのままパススルー
});

export {}; // TypeScriptにモジュールとして認識させるため
