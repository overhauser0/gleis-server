// src/hooks/useMissingDates.ts
import useSWR from 'swr';
import { atlasFetch } from '@/utils/api';

const fetcher = async (path: string) => {
  const res = await atlasFetch(path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch missing dates');
  }
  const json = await res.json();
  return json.data;
};

export function useMissingDates() {
  const { data, error, isLoading, mutate } = useSWR(
    '/immich/missing-dates',
    fetcher,
    {
      revalidateOnFocus: false, // 編集中に勝手にリロードされないようにする
    },
  );

  const batchUpdate = async (
    updates: { id: string; dateTimeOriginal: string }[],
  ) => {
    const res = await atlasFetch('/immich/batch/dates', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });

    if (!res.ok) {
      throw new Error('Failed to batch update dates');
    }

    // 成功したらリストを再取得
    await mutate();
    return res.json();
  };

  return {
    assets: data,
    isLoading,
    isError: error,
    batchUpdate,
    refresh: mutate,
  };
}
