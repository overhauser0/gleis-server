'use client';

import React, { useState, useMemo } from 'react';
import { useMissingDates } from '@/hooks/useMissingDates';

interface BatchMissingDatesViewProps {
  onBack: () => void;
}

// ファイル名から日付を推測するヘルパー関数
const suggestDateFromFilename = (filename: string): string | null => {
  if (!filename) return null;
  // パターン: YYYYMMDD, YYYY-MM-DD, YYYY_MM_DD
  const match = filename.match(/(20\d{2})[-_]?(\d{2})[-_]?(\d{2})/);

  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];

    // 簡易的な日付妥当性チェック
    if (
      Number(month) >= 1 &&
      Number(month) <= 12 &&
      Number(day) >= 1 &&
      Number(day) <= 31
    ) {
      // タイムゾーンによる日付ズレを防ぐため、UTCの正午(12:00:00)をセットして返すのが安全です
      return `${year}-${month}-${day}T12:00:00.000Z`;
    }
  }
  return null;
};

export default function BatchMissingDatesView({
  onBack,
}: BatchMissingDatesViewProps) {
  const { assets, isLoading, isError, batchUpdate } = useMissingDates();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  // 取得したアセットにサジェスト日付を付与し、サジェスト可能なものだけを抽出
  const suggestableAssets = useMemo(() => {
    if (!assets) return [];
    return assets
      .map((asset: any) => ({
        ...asset,
        suggestedDate: suggestDateFromFilename(asset.originalFileName),
      }))
      .filter((asset: any) => asset.suggestedDate !== null);
  }, [assets]);

  // 全選択・全解除
  const toggleSelectAll = () => {
    if (selectedIds.size === suggestableAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(suggestableAssets.map((a: any) => a.id)));
    }
  };

  // 個別選択
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // 実行処理
  const handleBatchUpdate = async () => {
    if (selectedIds.size === 0) return;

    // 選択されたIDのアセットから、更新用ペイロードを作成
    const updates = suggestableAssets
      .filter((a: any) => selectedIds.has(a.id))
      .map((a: any) => ({
        id: a.id,
        dateTimeOriginal: a.suggestedDate,
      }));

    try {
      setIsUpdating(true);
      await batchUpdate(updates);
      setSelectedIds(new Set()); // 選択クリア
      alert(`${updates.length}件の撮影日時を更新しました！`);
    } catch (error) {
      alert('更新中にエラーが発生しました。');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return <div className="p-8 text-slate-500">Scanning missing dates...</div>;
  if (isError)
    return <div className="p-8 text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          {/* 戻るボタン */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Batch Fix: Missing Dates
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            ファイル名から撮影日を自動推測しました。正しいものを選択して一括承認できます。
          </p>
        </div>

        <button
          onClick={handleBatchUpdate}
          disabled={selectedIds.size === 0 || isUpdating}
          className="soft-btn-primary disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating
            ? 'Updating...'
            : `Approve Selected (${selectedIds.size})`}
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        {suggestableAssets.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            自動推測可能な欠損アセットはありません。🎉
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={
                      selectedIds.size === suggestableAssets.length &&
                      suggestableAssets.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 text-sm font-medium text-slate-500 dark:text-zinc-400">
                  File Name
                </th>
                <th className="p-4 text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Suggested Date
                </th>
              </tr>
            </thead>
            <tbody>
              {suggestableAssets.map((asset: any) => {
                const isSelected = selectedIds.has(asset.id);
                // "2024-05-10T12:00:00.000Z" のような文字列を "2024-05-10" だけ切り出して表示
                const displayDate = asset.suggestedDate.split('T')[0];

                return (
                  <tr
                    key={asset.id}
                    className={`border-b border-slate-50 dark:border-zinc-800/50 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/30 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={isSelected}
                        onChange={() => toggleSelect(asset.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div
                        className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[300px]"
                        title={asset.originalFileName}
                      >
                        {asset.originalFileName}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-medium">
                        {displayDate}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
