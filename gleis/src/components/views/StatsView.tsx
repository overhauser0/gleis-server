'use client';
import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Grid,
  Trophy,
  Zap,
  CheckCircle2,
  SportShoe,
} from 'lucide-react';
import SimpleList from '@/components/ui/SimpleList';
import MonthSelector from '@/components/ui/MonthSelector';
import Tooltip from '@/components/ui/Tooltip';
import { Task } from '@/types';

interface StatsViewProps {
  completedTasks: Task[];
  loading: boolean;
  openTaskModal: (task?: Partial<Task>) => void;
}

export default function StatsView({
  completedTasks,
  loading,
  openTaskModal,
}: StatsViewProps) {
  // 表示中の月を管理（初期値は現在）
  const [targetDate, setTargetDate] = useState(new Date());

  const taskDateStr = (dateStr: string) => dateStr.substring(0, 10);

  // データの集計ロジック
  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = targetDate.getFullYear();
    const currentMonth = targetDate.getMonth(); // 0-11

    // 現在の実際の月かどうかを判定
    const isCurrentMonth =
      currentYear === now.getFullYear() && currentMonth === now.getMonth();

    const todayDate = now.getDate();
    const daysInThisMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
    ).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    // 前月の情報
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();
    const daysInLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();

    const thisMonthDaily = new Array(daysInThisMonth).fill(0);
    const lastMonthDaily = new Array(daysInLastMonth).fill(0);
    const thisMonthTasks: Task[] = [];

    completedTasks.forEach((task) => {
      if (!task.date) return;
      const taskDate = new Date(taskDateStr(task.date));
      const tYear = taskDate.getFullYear();
      const tMonth = taskDate.getMonth();
      const tDate = taskDate.getDate();

      if (tYear === currentYear && tMonth === currentMonth) {
        thisMonthDaily[tDate - 1]++;
        thisMonthTasks.push(task);
      } else if (tYear === lastMonthYear && tMonth === lastMonth) {
        lastMonthDaily[tDate - 1]++;
      }
    });

    thisMonthTasks.sort(
      (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
    );

    // 累積グラフ用のデータ生成
    let thisMonthCumulative = 0;
    const thisMonthTrend = thisMonthDaily.map((count, i) => {
      // 現在の月の場合、未来の日付は計算しない。過去の月なら全日数計算する。
      if (isCurrentMonth && i + 1 > todayDate) return null;
      thisMonthCumulative += count;
      return thisMonthCumulative;
    });

    let lastMonthCumulative = 0;
    const lastMonthTrend = lastMonthDaily.map((count) => {
      lastMonthCumulative += count;
      return lastMonthCumulative;
    });

    // 比較対象：現在の月なら「前月の同日まで」、過去の月なら「前月の末日まで」
    const lastMonthComparisonTotal = isCurrentMonth
      ? lastMonthTrend[Math.min(todayDate - 1, daysInLastMonth - 1)] || 0
      : lastMonthTrend[lastMonthTrend.length - 1] || 0;

    const thisMonthTotal = thisMonthCumulative;
    const diff = thisMonthTotal - lastMonthComparisonTotal;

    const maxVal = Math.max(
      thisMonthTotal,
      lastMonthTrend[lastMonthTrend.length - 1] || 0,
      10,
    );

    // Insights
    // ペース計算の分母：現在の月なら「今日まで」、過去の月なら「その月の日数」
    const paceDivider = isCurrentMonth
      ? Math.max(1, todayDate)
      : daysInThisMonth;
    const averagePace = (thisMonthTotal / paceDivider).toFixed(1);

    const peakCount = Math.max(...thisMonthDaily, 0);
    const peakDateNum = thisMonthDaily.indexOf(peakCount) + 1;

    return {
      isCurrentMonth,
      currentMonthName: targetDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      currentMonthNum: currentMonth + 1,
      thisMonthTotal,
      diff,
      thisMonthTrend,
      lastMonthTrend,
      daysInThisMonth,
      maxVal,
      todayDate,
      firstDayOfWeek,
      thisMonthDaily,
      thisMonthTasks,
      averagePace,
      peakCount,
      peakDateNum,
    };
  }, [completedTasks, targetDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-400 animate-pulse">
        Loading Dashboard...
      </div>
    );
  }

  const blanks = Array.from({ length: stats.firstDayOfWeek });

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-white/5 border border-white/10';
    if (count <= 2) return 'bg-neon/30 border border-neon/40';
    if (count <= 5) return 'bg-neon/60 border border-neon/70';
    return 'bg-neon shadow-[0_0_8px_rgba(0,112,243,0.6)] border-neon';
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto noir-scrollbar gap-6 pb-24">
      {/* ページネーション（月選択） */}
      <div className="shrink-0 mb-2">
        <MonthSelector currentDate={targetDate} onChange={setTargetDate} />
      </div>

      {/* KPI & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 shrink-0">
        <div className="md:col-span-2 bg-white/5 border border-neon/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,112,243,0.05)] flex flex-col justify-center">
          <div className="relative z-10 flex flex-col gap-2">
            <span className="text-xs text-neon font-bold tracking-widest uppercase flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {stats.currentMonthName}
            </span>
            <div className="flex items-end gap-4 flex-wrap">
              <span className="text-6xl font-black text-white leading-none">
                {stats.thisMonthTotal}
              </span>
              <div className="flex flex-col gap-1 pb-1">
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border w-max ${
                    stats.diff > 0
                      ? 'text-green-400 bg-green-400/10 border-green-400/20'
                      : stats.diff < 0
                        ? 'text-red-400 bg-red-400/10 border-red-400/20'
                        : 'text-gray-400 bg-gray-400/10 border-gray-400/20'
                  }`}
                >
                  {stats.diff > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" /> +{stats.diff}
                    </>
                  ) : stats.diff < 0 ? (
                    <>
                      <TrendingDown className="w-3 h-3" /> {stats.diff}
                    </>
                  ) : (
                    <>±0</>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-medium tracking-wide">
                  {stats.isCurrentMonth
                    ? 'vs last month same day'
                    : 'vs prev month total'}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-neon/20 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="md:col-span-3 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                Average Pace
              </span>
              <div className="text-2xl font-bold text-gray-200">
                {stats.averagePace}{' '}
                <span className="text-sm font-normal text-gray-500 tracking-wide">
                  / day
                </span>
              </div>
            </div>
          </div>
          <hr className="border-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-neon" />
                Peak Day
              </span>
              <div className="text-2xl font-bold text-gray-200">
                {stats.peakCount}{' '}
                <span className="text-sm font-normal text-gray-500 tracking-wide">
                  tasks
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                {stats.currentMonthNum}/{stats.peakDateNum}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* グラフ関連 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 shrink-0">
        <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm text-gray-300 font-bold tracking-widest uppercase flex items-center gap-2">
            <Grid className="w-4 h-4 text-neon" />
            Activity
          </h3>

          <div className="mt-2 flex-1 flex flex-col max-w-sm w-full mx-auto">
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div
                  key={`head-${i}`}
                  className="text-center text-[10px] text-gray-500 font-bold"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="w-full aspect-square" />
              ))}
              {stats.thisMonthDaily.map((count, i) => {
                const dateNum = i + 1;
                // 「今日」のハイライトは、現在の月を表示している時だけ有効にする
                const isToday =
                  stats.isCurrentMonth && dateNum === stats.todayDate;
                const tooltipText = `${stats.currentMonthNum}/${dateNum}: ${count} tasks`;
                return (
                  <Tooltip key={dateNum} content={tooltipText}>
                    <div
                      key={dateNum}
                      className={`w-full aspect-square rounded-[3px] transition-all hover:scale-110 relative group ${getContributionColor(count)} ${isToday ? 'ring-1 ring-white/50 ring-offset-1 ring-offset-[#111]' : ''}`}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
          <h3 className="text-sm text-gray-300 font-bold tracking-widest uppercase flex items-center gap-2">
            <SportShoe className="w-3.5 h-3.5 text-neon" />
            <span>Pace Comparison</span>
          </h3>

          <div className="relative w-full h-48">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {[0, 0.5, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  y1={100 - ratio * 100}
                  x2="100"
                  y2={100 - ratio * 100}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <polyline
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
                points={stats.lastMonthTrend
                  .map((val, i) => {
                    const x = (i / (stats.lastMonthTrend.length - 1)) * 100;
                    const y = 100 - (val / stats.maxVal) * 100;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              <polyline
                fill="none"
                stroke="var(--neon-color, #0070f3)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                style={{
                  filter: 'drop-shadow(0px 0px 4px rgba(0,112,243,0.6))',
                }}
                points={stats.thisMonthTrend
                  .map((val, i) => {
                    if (val === null) return '';
                    const x = (i / (stats.daysInThisMonth - 1)) * 100;
                    const y = 100 - (val / stats.maxVal) * 100;
                    return `${x},${y}`;
                  })
                  .filter(Boolean)
                  .join(' ')}
              />
            </svg>

            {/* 現在月の時だけ「現在地」のドットを表示 */}
            {stats.isCurrentMonth &&
              stats.thisMonthTrend[stats.todayDate - 1] !== null && (
                <div
                  className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(0,112,243,1)] z-10 pointer-events-none"
                  style={{
                    left: `${((stats.todayDate - 1) / (stats.daysInThisMonth - 1)) * 100}%`,
                    bottom: `${(stats.thisMonthTrend[stats.todayDate - 1]! / stats.maxVal) * 100}%`,
                    transform: 'translate(-50%, 50%)',
                  }}
                />
              )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shrink-0">
        <h3 className="text-sm text-gray-300 font-bold tracking-widest uppercase flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
            Cleared in {stats.currentMonthName}
          </span>
          <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-500">
            {stats.thisMonthTasks.length} items
          </span>
        </h3>

        <SimpleList tasks={stats.thisMonthTasks} onTaskClick={openTaskModal} />
      </div>
    </div>
  );
}
