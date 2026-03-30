'use client';

import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 5;

export function useScrollDirection() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      if (Math.abs(diff) < SCROLL_THRESHOLD) return;

      setIsHidden(diff > 0 && currentScrollY > 0);
      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isHidden;
}
