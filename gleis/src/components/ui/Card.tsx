// components/ui/Card.tsx

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'lg'; // sm: Weekly等のタスクカード(p-3.5 rounded-xl), lg: Stats等の大枠(p-6 rounded-2xl)
  hoverable?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

export default function Card({
  size = 'sm',
  hoverable = false,
  active = false,
  className = '',
  children,
  ...props
}: CardProps) {
  // ベーススタイル
  const baseStyle = 'noir-glass transition-all duration-200 relative';

  // パディング & 角丸サイズ
  const sizeStyle = size === 'sm' ? 'p-3.5 rounded-xl' : 'p-6 rounded-2xl';

  // アクティブ & ホバー効果
  const activeStyle = active
    ? 'border-neon/30 shadow-[0_0_20px_rgba(0,112,243,0.05)]'
    : '';
  const hoverStyle = hoverable
    ? 'border-neon/30 hover:shadow-[0_0_20px_rgba(0,112,243,0.05)] cursor-pointer'
    : '';

  return (
    <div
      className={`
        ${baseStyle}
        ${sizeStyle}
        ${activeStyle}
        ${hoverStyle}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
