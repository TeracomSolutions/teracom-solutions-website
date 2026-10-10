'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchSubmit } from './HeaderSearch';
import { useCart } from '@/lib/cart-context';
import { resourcesSections } from '@/lib/resourcesSections';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  // Links navigate client-side, so the panel has to close itself on click.
  const close = () => setOpen(false);
  const onSearch = useSearchSubmit(close);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // The header is sticky, so a panel taller than the screen cannot be
  // scrolled into view. Fit the panel between the header and the bottom of
  // the screen, let it scroll inside, and hold the page still while it is open.
  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const header = document.querySelector('.site-header');
    if (panel && header) {
      const top = Math.ceil(header.getBoundingClientRect().bottom);
      panel.style.maxHeight = `calc(100dvh - ${top}px)`;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        className="mobile-nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="hamburger-icon">
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </span>
      </button>

      {open && (
        <nav className="mobile-nav-panel" ref={panelRef}>
          <form className="search-form mobile-nav-search" action="/search" role="search" onSubmit={onSearch}>
            <label htmlFor="mobile-search-input" className="visually-hidden">Search Teracom Solutions</label>
            <input id="mobile-search-input" type="search" name="q" placeholder="Search the site…" autoComplete="off" />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <ul className="mobile-nav-links">
            <li><Link href="/services" onClick={close}>What We Do</Link></li>
            <li><Link href="/monitoring" onClick={close}>Monitoring</Link></li>
            <li><Link href="/teracom-ai" onClick={close}>Teracom AI</Link></li>
            <li><Link href="/brands" onClick={close}>Brands</Link></li>
            <li><Link href="/store" onClick={close}>Store</Link></li>
            <li>
              <Link href="/resources" onClick={close}>Resources</Link>
              <ul className="mobile-nav-sublinks">
                {resourcesSections.map((s) => (
                  <li key={s.slug}><Link href={`/resources/${s.slug}`} onClick={close}>{s.title}</Link></li>
                ))}
                <li><Link href="/tools" onClick={close}>Free Tools</Link></li>
              </ul>
            </li>
            <li><Link href="/contact" onClick={close}>Contact</Link></li>
            <li><Link href="/cart" onClick={close}>Cart{totalItems > 0 ? ` (${totalItems})` : ''}</Link></li>
          </ul>
        </nav>
      )}
    </>
  );
}
