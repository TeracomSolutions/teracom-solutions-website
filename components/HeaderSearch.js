'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Submit handler shared by the header bar and the mobile menu. Navigates with
// the router before closing: closing first would unmount the form mid-submit,
// and the browser silently drops a submission from a detached form.
export function useSearchSubmit(onDone) {
  const router = useRouter();
  return (event) => {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get('q') || '').trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    onDone?.();
  };
}

// Magnifying-glass button in the header. Opens a search bar under the header
// that goes to /search?q=... (the form's action is a plain GET, so it still
// works before the page has hydrated).
export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const onSubmit = useSearchSubmit(() => setOpen(false));

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="header-search-toggle"
        aria-label={open ? 'Close search' : 'Search the site'}
        aria-expanded={open}
        aria-controls="header-search-panel"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} strokeWidth={2} aria-hidden="true" /> : <Search size={20} strokeWidth={2} aria-hidden="true" />}
      </button>
      {open && (
        <div className="header-search-panel" id="header-search-panel">
          <form className="container search-form" action="/search" role="search" onSubmit={onSubmit}>
            <Search size={22} strokeWidth={2} aria-hidden="true" />
            <label htmlFor="header-search-input" className="visually-hidden">Search Teracom Solutions</label>
            <input
              ref={inputRef}
              id="header-search-input"
              type="search"
              name="q"
              placeholder="Search products, services, brands, tools…"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      )}
    </>
  );
}
