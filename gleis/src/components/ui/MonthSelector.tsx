// src/components/ui/MonthSelector.tsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (newDate: Date) => void;
}

export default function MonthSelector({
  currentDate,
  onChange,
}: MonthSelectorProps) {
  const handlePrev = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    onChange(newDate);
  };

  const handleToday = () => {
    onChange(new Date());
  };

  const monthYearStr = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const now = new Date();
  const isCurrentMonth =
    currentDate.getFullYear() === now.getFullYear() &&
    currentDate.getMonth() === now.getMonth();

  return (
    <div className="shrink-0 flex items-center justify-between px-2 mx-auto w-full">
      {/* タイトル ＆ Current バッジ */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-400 tracking-wide">
          {monthYearStr}
        </h2>

        {isCurrentMonth ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-neon/50 text-neon bg-neon/10 uppercase tracking-widest font-normal">
            Current
          </span>
        ) : (
          /* 過去・未来の月を見ているときだけ、くどくなくひっそり表示するボタン */
          <button
            onClick={handleToday}
            className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-gray-400 bg-white/5 hover:text-white hover:bg-white/10 transition-colors uppercase tracking-wider font-medium"
            title="Jump to current month"
          >
            Today
          </button>
        )}
      </div>

      {/* 左右のページネーションボタン */}
      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
