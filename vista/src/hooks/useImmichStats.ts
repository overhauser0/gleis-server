// src/hooks/useImmichStats.ts

import useSWR from 'swr';
import { atlasFetch } from '@/utils/api';
// import { ImmichStatsData } from '@/types/immich'; // 必要に応じて型をインポート（または共通定義）

// SWR用のフェッチャー
const immichFetcher = async (path: string) => {
  const res = await atlasFetch(path);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to fetch: ${res.status}`);
  }

  const json = await res.json();
  return json.data; // コントローラーが返している { success: true, data: stats } の data 部分を返す
};

export function useImmichStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/immich/stats',
    immichFetcher,
    {
      refreshInterval: 60000, // 1分おきに自動再検証
      revalidateOnFocus: true,
    },
  );

  // 手動で同期（Sync）を実行するための関数
  const triggerSync = async () => {
    try {
      const res = await atlasFetch('/immich/sync', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to synchronize Immich stats');
      }

      // 同期成功後、SWRのキャッシュを即座に再検証（再取得）する
      await mutate();
      return true;
    } catch (err) {
      console.error('❌ Sync Error:', err);
      throw err;
    }
  };

  return {
    stats: data, // 統計データ本体
    isLoading,
    isError: error,
    refresh: mutate, // キャッシュ再読み込み
    sync: triggerSync, // 手動Sync（POST）用トリガー
  };
}
