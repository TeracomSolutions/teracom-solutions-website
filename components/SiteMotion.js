'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Content rises gently into place as it scrolls into view (Robert, 2026-11-06:
// "jazz up the website ... as professional as possible"). Only the blocks named
// below move, each once; siblings follow one another by a beat. Nothing is
// hidden until this has run, so without JavaScript, for search engines and for
// people who ask for less motion, everything is simply there.
// Cards that glow where the pointer is (the --mx / --my the CSS reads).
const SPOT = 'main .feature-grid > *, main .tool-grid > *, main .what-list > *, main .include-grid > *, main .brand-grid > *, main .process-steps > *, main .contact-card';

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
    let spotFrame = 0;
    const onSpot = (event) => {
      const card = event.target instanceof Element ? event.target.closest(SPOT) : null;
      if (!card || event.pointerType === 'touch') return;
      cancelAnimationFrame(spotFrame);
      spotFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    };
    document.addEventListener('pointermove', onSpot, { passive: true });

    // A thin red bar across the top shows how far down the page you are, and the big pictures beside
    // the copy drift a little slower than the page (the depth effect on Stripe, Linear and Vercel).
    // Both are written straight to CSS variables, so scrolling never re-renders anything.
    let scrollFrame = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty('--scroll-progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
        document.querySelectorAll('main .showcase-image').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
          el.style.setProperty('--drift', `${(offset * -24).toFixed(1)}px`);
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
      document.removeEventListener('pointermove', onSpot);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(spotFrame);
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
