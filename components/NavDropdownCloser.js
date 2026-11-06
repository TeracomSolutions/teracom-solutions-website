'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// The header's dropdown menus open on hover or keyboard focus (CSS). After
// a link in one is clicked, the link kept focus, so the menu stayed open
// over the next page (Robert, 2026-10-04). Clicking a menu link now drops
// that focus and hides the menu until the pointer leaves it.
//
// It also tightens the header once the page scrolls, and marks the top-level
// link for the section you are on (a link's data-match lists extra paths).
export default function NavDropdownCloser() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector('.site-header');
    if (!header) return undefined;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.querySelectorAll('.site-header .nav-link').forEach((link) => {
      const paths = (link.dataset.match || link.getAttribute('href')).split(' ');
      const on = paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, [pathname]);

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