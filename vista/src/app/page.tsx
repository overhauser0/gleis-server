'use client';

import React, { useState } from 'react';
import DashboardView from '@/components/views/DashboardView';
import BatchMissingDatesView from '@/components/views/BatchMissingDatesView';

type ViewState = 'dashboard' | 'missing-dates';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-1 text-slate-900 dark:text-slate-50">
            {currentView === 'dashboard'
              ? 'Storage Dashboard'
              : 'Batch Operations'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Managed via Atlas Server
          </p>
        </div>
      </header>

      {/* 状態に応じてビューを切り替え */}
      {currentView === 'dashboard' ? (
        <DashboardView onNavigate={(view) => setCurrentView(view)} />
      ) : (
        <BatchMissingDatesView onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
}
