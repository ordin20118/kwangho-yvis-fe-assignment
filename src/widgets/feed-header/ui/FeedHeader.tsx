'use client';

import { useScrollDirection } from '@/shared/lib';

export function FeedHeader() {
  const isHidden = useScrollDirection();

  return (
    <header
      className={`sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 transition-transform duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <h1 className="text-center text-lg font-semibold">연봉인상</h1>
    </header>
  );
}
