'use client';
import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a1a1a] border border-white/15 text-gray-200 text-[10px] font-mono rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] whitespace-nowrap z-50 pointer-events-none animate-scale-up">
          {content}
          {/* 下向きの小さな矢印 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[px] border-4 border-transparent border-t-[#1a1a1a]" />
        </div>
      )}
    </div>
  );
}
