'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { resourcesSections } from '@/lib/resourcesSections';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

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
        <nav className="mobile-nav-panel">
          <ul className="mobile-nav-links">
            <li><a href="/#what-we-do">What We Do</a></li>
            <li><a href="/securityos-ai">Teracom AI</a></li>
            <li><a href="/store">Store</a></li>
            <li>
              <a href="/resources">Resources</a>
              <ul className="mobile-nav-sublinks">
                {resourcesSections.map((s) => (
                  <li key={s.slug}><a href={`/resources/${s.slug}`}>{s.title}</a></li>
                ))}
              </ul>
            </li>
            <li><a href="/cart">Cart{totalItems > 0 ? ` (${totalItems})` : ''}</a></li>
          </ul>
        </nav>
      )}
    </>
  );
}