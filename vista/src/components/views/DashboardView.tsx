'use client';

import React, { useState } from 'react';
import PhotoHeatmap from '../ui/PhotoHeatmap';
import { useImmichStats } from '@/hooks/useImmichStats';
import AssetGrid from '@/components/ui/AssetGrid';
import { useAssetSearch } from '@/hooks/useAssetSearch';

interface DashboardViewProps {
  onNavigate: (view: 'missing-dates') => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  // 統計データのフック
  const { stats, isLoading: isStatsLoading, isError, sync } = useImmichStats();
  const [isSyncing, setIsSyncing] = useState(false);

  // 選択された日付の状態
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 画像検索のフック（isLoading を isAssetsLoading にリネーム）
  const { assets, isLoading: isAssetsLoading } = useAssetSearch(
    selectedDate ? { date: selectedDate } : null,
  );

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await sync();
    } catch (e) {
      alert('同期に失敗しました');
    } finally {
      setIsSyncing(false);
    }
  };

  // 統計データ自体のローディング判定
  if (isStatsLoading) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading library stats...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center text-red-500">
        Failed to load statistics from Atlas.
      </div>
    );
  }

  // 各指標の最大値（バーグラフ計算用）
  const maxMakeCount = stats?.topMakes?.[0]?.count || 1;
  const maxModelCount = stats?.topModels?.[0]?.count || 1;
  const maxStateCount = stats?.topStates?.[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* 1. 同期コントロールバー */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-[20px] border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="text-sm text-slate-500 dark:text-zinc-400">
          Last Synced:{' '}
          {stats?.syncedAt
            ? new Date(stats.syncedAt).toLocaleString()
            : 'Never'}
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="soft-btn-primary flex items-center gap-2 text-sm py-2 px-5"
        >
          <svg
            className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isSyncing ? 'Analyzing Metadata...' : 'Sync & Analyze'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2. ライブラリサマリー (省略せずにそのまま残します) */}
        <div className="soft-card p-6 lg:p-8 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
          <h2 className="soft-label mb-6">Library Overview</h2>
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start justify-between">
            <div className="flex-1 w-full space-y-6">
              <div>
                <div className="text-4xl md:text-5xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                  {stats?.total?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Total Assets
                </div>
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="text-xl font-medium text-slate-700 dark:text-slate-200">
                    {stats?.images?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Images
                  </div>
                </div>
                <div>
                  <div className="text-xl font-medium text-slate-700 dark:text-slate-200">
                    {stats?.videos?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Videos
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-3xl min-w-[200px]">
              <div className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">
                Storage Used
              </div>
              <div className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
                {stats?.storage?.usedGb || 0}{' '}
                <span className="text-lg font-normal text-slate-500">GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. メンテナンス・データ品質 (Data Quality) */}
        <div className="soft-card p-6 lg:p-8 flex flex-col justify-between bg-orange-50/50 dark:bg-orange-950/10 border-orange-100 dark:border-orange-900/30 lg:col-span-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="soft-label !text-orange-600 dark:!text-orange-400">
                Data Quality
              </h2>
            </div>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mb-6">
              Items requiring metadata correction.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-end border-b border-orange-200/50 dark:border-orange-900/50 pb-2">
                <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  Missing GPS
                </span>
                <span className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                  {stats?.state?.missingGps || 0}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-orange-200/50 dark:border-orange-900/50 pb-2">
                <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  Missing Date
                </span>
                <span className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                  {stats?.state?.missingDate || 0}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('missing-dates')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-full transition-all active:scale-95 shadow-sm text-sm flex justify-center items-center gap-2"
          >
            Open Batch Operations
          </button>
        </div>

        {/* 3. Shooting Activity（撮影日の草） */}
        <PhotoHeatmap
          dailyCounts={stats?.dailyCounts}
          onDateClick={(date) => setSelectedDate(date)}
        />

        {/* --- 選択された日付の写真グリッド表示エリア --- */}
        {selectedDate && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-zinc-900 p-6 rounded-[24px] border border-slate-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Photos from{' '}
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedDate}
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Hover over images to see camera details.
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            <AssetGrid assets={assets || []} isLoading={isAssetsLoading} />
          </div>
        )}

        {/* 4. Top Makes（メーカー上位10件） */}
        <div className="soft-card p-6 lg:p-8 lg:col-span-1">
          <h2 className="soft-label mb-6">Top Camera Makes</h2>
          <div className="space-y-4 max-h-[320px] overflow-y-auto soft-scrollbar pr-2">
            {stats?.topMakes?.length > 0 ? (
              stats.topMakes.map((item: any, i: number) => {
                const percent = Math.round((item.count / maxMakeCount) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[160px]"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="text-slate-500">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 text-center py-8">
                No make data available.
              </div>
            )}
          </div>
        </div>

        {/* 5. Top Models（カメラ機種 上位10件） */}
        <div className="soft-card p-6 lg:p-8 lg:col-span-1">
          <h2 className="soft-label mb-6">Top Camera Models</h2>
          <div className="space-y-4 max-h-[320px] overflow-y-auto soft-scrollbar pr-2">
            {stats?.topModels?.length > 0 ? (
              stats.topModels.map((item: any, i: number) => {
                const percent = Math.round((item.count / maxModelCount) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[160px]"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="text-slate-500">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 text-center py-8">
                No model data available.
              </div>
            )}
          </div>
        </div>

        {/* 6. Top States（撮影された都道府県・州 上位10件） */}
        <div className="soft-card p-6 lg:p-8 lg:col-span-1">
          <h2 className="soft-label mb-6">Top Locations (State / Region)</h2>
          <div className="space-y-4 max-h-[320px] overflow-y-auto soft-scrollbar pr-2">
            {stats?.topStates?.length > 0 ? (
              stats.topStates.map((item: any, i: number) => {
                const percent = Math.round((item.count / maxStateCount) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[160px]"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="text-slate-500">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 text-center py-8">
                No location data available.
              </div>
            )}
          </div>
        </div>

        {/* 7. Top Focal Lengths（焦点距離 タイル表示） */}
        <div className="soft-card p-6 lg:p-8 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="soft-label mb-6">Top Focal Lengths (Top 10)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {stats?.topFocalLengths?.length > 0 ? (
              stats.topFocalLengths.map((focal: any, i: number) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-700/50 flex flex-col justify-between"
                >
                  <div className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    {focal.name}
                  </div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                    {focal.count.toLocaleString()} items
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 col-span-full text-center py-8">
                No focal length data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
