'use client';

import { useLayoutEffect, useRef } from 'react';

const KEY = 'admin-sidebar-scroll';

// The menu on the left scrolls on its own, and each page is a fresh render of it, so without this
// it jumped back to the top every time a page was opened (Robert, 2026-11-07). It remembers how far
// down it was and puts itself back there before the page paints. Remembered for this browser tab only.
export default function AdminSidebarKeeper() {
  const marker = useRef(null);

  useLayoutEffect(() => {
    const side = marker.current?.parentElement;
    if (!side) return undefined;
    try {
      const saved = Number(window.sessionStorage.getItem(KEY));
      if (saved > 0) side.scrollTop = saved;
    } catch {
      // No saved position: the menu simply starts at the top.
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        try {
          window.sessionStorage.setItem(KEY, String(side.scrollTop));
        } catch {
          // Not saved.
        }
      });
    };
    side.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      side.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <span ref={marker} hidden />;
}
