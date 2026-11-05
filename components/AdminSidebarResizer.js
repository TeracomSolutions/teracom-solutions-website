'use client';

import { useEffect, useRef } from 'react';

import { SIDEBAR_DEFAULT, SIDEBAR_KEY, clampSidebarWidth } from '@/lib/sidebarWidth';

// Drag the menu's right edge to widen it (Robert, 2026-11-05, the same as the
// Global platform's menu): the width goes in --sidebar-w on the page, is kept
// between 200 and 420 px, and is remembered in this browser. Double-click puts
// it back to the default.
function apply(width) {
  document.documentElement.style.setProperty('--sidebar-w', `${width}px`);
}

export default function AdminSidebarResizer() {
  const strip = useRef(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIDEBAR_KEY);
      if (saved) apply(clampSidebarWidth(saved));
    } catch {
      // No saved width in this browser: the default stands.
    }
  }, []);

  function start(event) {
    event.preventDefault();
    const menu = strip.current && strip.current.parentElement;
    if (!menu) return;
    const left = menu.getBoundingClientRect().left;
    let width = clampSidebarWidth(menu.getBoundingClientRect().width);
    document.body.classList.add('is-resizing-sidebar');
    strip.current.classList.add('is-dragging');

    function move(e) {
      width = clampSidebarWidth(e.clientX - left);
      apply(width);
    }
    function stop() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      document.body.classList.remove('is-resizing-sidebar');
      if (strip.current) strip.current.classList.remove('is-dragging');
      try {
        window.localStorage.setItem(SIDEBAR_KEY, String(width));
      } catch {
        // Not remembered, but still applied for this page.
      }
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  }

  function reset() {
    apply(SIDEBAR_DEFAULT);
    try {
      window.localStorage.removeItem(SIDEBAR_KEY);
    } catch {
      // Nothing saved to clear.
    }
  }

  return (
    <div
      ref={strip}
      className="admin-sidebar-resizer"
      role="separator"
      aria-orientation="vertical"
      title="Drag to widen the menu; double-click to reset"
      onPointerDown={start}
      onDoubleClick={reset}
    />
  );
}
