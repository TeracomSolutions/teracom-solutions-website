'use client';

import { useEffect, useState } from 'react';

// A "?" beside a heading that opens the page's own explanation. Copied
// from the Global Platform's components/HelpIcon.js; the styling moved
// from inline to the .admin-help-* classes in globals.css.
export default function AdminHelpIcon({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <span className="admin-help">
      <button
        type="button"
        className="admin-help-btn"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Help"
        aria-expanded={isOpen}
      >
        ?
      </button>

      {isOpen && (
        <div
          className="admin-help-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="admin-help-modal" role="dialog" aria-label="Help">
            <button type="button" className="admin-help-close" onClick={() => setIsOpen(false)} aria-label="Close help">
              ×
            </button>
            {children}
          </div>
        </div>
      )}
    </span>
  );
}
