// src/components/layout/AppShell.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Lucideアイコンをインポート
import { LayoutDashboard, Wrench, Menu, X, Camera } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // サイドバーのメニューアイテム定義（iconにLucideコンポーネントを指定）
  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Batch Operations', href: '/batch', icon: Wrench },
    // 今後増やす場合はここに追加
    // { name: 'Grid Viewer', href: '/grid', icon: Camera },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950">
      {/* --- モバイル用バックドロップ（半透明背景） --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- 左側：サイドバー --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 
          transform transition-transform duration-300 ease-in-out flex flex-col
          /* スマホ向け: デフォルトは画面外、Open時にスライドイン */
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          /* タブレット(md)以上: 常に表示し、相対位置（relative）にする */
          md:relative md:translate-x-0
        `}
      >
        {/* サイドバーのヘッダー */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-zinc-800">
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <span>
              Vista <span className="text-blue-500">Lens</span>
            </span>
          </span>
          {/* モバイル用 閉じるボタン (Lucide X) */}
          <button
            className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto soft-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon; // Lucideコンポーネントを取り出す

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // クリック時にメニューを閉じる
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                  }
                `}
              >
                {/* 状態に合わせてアイコンの色やサイズを調整 */}
                <IconComponent
                  className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* --- 右側：メインコンテンツエリア --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* モバイル向け上部ヘッダー（ハンバーガーメニュー付き） */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* ハンバーガーメニューボタン (Lucide Menu) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Vista Lens
            </span>
          </div>
        </header>

        {/* ページコンテンツ本体 */}
        <main className="flex-1 overflow-y-auto soft-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  );
}
