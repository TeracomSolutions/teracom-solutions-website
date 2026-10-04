'use client';

import { useEffect } from 'react';

// The header's dropdown menus open on hover or keyboard focus (CSS). After
// a link in one is clicked, the link kept focus, so the menu stayed open
// over the next page (Robert, 2026-10-04). Clicking a menu link now drops
// that focus and hides the menu until the pointer leaves it.
export default function NavDropdownCloser() {
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest('.nav-dropdown a') : null;
      if (!link) return;
      const dropdown = link.closest('.nav-dropdown');
      link.blur();
      dropdown.classList.add('is-closed');
      dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('is-closed'), { once: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}