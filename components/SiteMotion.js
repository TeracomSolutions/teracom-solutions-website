'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Content rises gently into place as it scrolls into view (Robert, 2026-11-06:
// "jazz up the website ... as professional as possible"). Only the blocks named
// below move, each once; siblings follow one another by a beat. Nothing is
// hidden until this has run, so without JavaScript, for search engines and for
// people who ask for less motion, everything is simply there.
const TARGETS = [
  'main .section-heading',
  'main .intro-grid > div',
  'main .showcase-image',
  'main .showcase-copy',
  'main .section-sticky',
  'main .feature-grid > *',
  'main .what-list > *',
  'main .tool-grid > *',
  'main .include-grid > *',
  'main .process-steps > *',
  'main .brand-grid > *',
  'main .contact-card',
  'main .about-layout > *',
  'main .store-strip .container > *',
].join(',');

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    const root = document.documentElement;
    root.classList.add('reveal-ready');
    const seen = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    const scan = () => {
      document.querySelectorAll(TARGETS).forEach((el) => {
        if (seen.has(el) || el.closest('.hero')) return;
        seen.add(el);
        const siblings = [...el.parentElement.children].filter((c) => c.matches(TARGETS));
        el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
        el.setAttribute('data-reveal', '');
        observer.observe(el);
      });
    };
    scan();
    // Lists that load later (store pages, paging) join in as they arrive.
    const mutations = new MutationObserver(() => scan());
    const main = document.querySelector('main');
    if (main) mutations.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
