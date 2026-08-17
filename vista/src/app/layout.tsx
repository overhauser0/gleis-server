// src/app/layout.tsx

import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'Vista Lens - Immich Power Tools',
  description: 'Advanced dashboard and tools for Immich',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-zinc-950">
        {/* AppShell で children を包む */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
