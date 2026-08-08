import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-neon rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,112,243,0.5)] hover:scale-105 transition-transform z-40 border border-white/20"
    >
      <Plus className="w-8 h-8" />
    </button>
  );
}
