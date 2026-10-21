'use client';

import { useEffect, useState } from 'react';

// AI Connections is split into two separate environments (Robert, 2026-10-22):
// the assistant on the website (Tera), and the assistant for staff in the
// console. Each has its own connections and its own governance rules.
const SIDES = [
  {
    key: 'website',
    hash: '#frontend',
    label: 'AI assistant for the front end',
    sub: 'Tera, on the website',
    rule: 'Answers visitors\' and customers\' questions about the products and the website, and nothing else. It has no way to reach the back end, the console, supplier or cost prices, staff or customer records, or to write code.',
  },
  {
    key: 'console',
    hash: '#backend',
    label: 'AI assistant for the back end',
    sub: 'the staff Assistant, Scout and drafting',
    rule: 'For staff only, behind the console sign-in: lookups, research, drafting and the other back-end work.',
  },
];

export default function AdminAiEnvironments({ website, console: consoleSide }) {
  const [active, setActive] = useState('website');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#backend') setActive('console');
  }, []);

  function choose(key) {
    setActive(key);
    if (typeof window !== 'undefined') {
      const side = SIDES.find((s) => s.key === key);
      window.history.replaceState(null, '', `${window.location.pathname}${side ? side.hash : ''}`);
    }
  }

  const current = SIDES.find((s) => s.key === active);

  return (
    <div>
      <div className="ai-env-switch" role="tablist" aria-label="Which AI assistant">
        {SIDES.map((side) => (
          <button
            key={side.key}
            type="button"
            role="tab"
            aria-selected={active === side.key}
            className={active === side.key ? 'ai-env active' : 'ai-env'}
            onClick={() => choose(side.key)}
          >
            <strong>{side.label}</strong>
            <span>{side.sub}</span>
          </button>
        ))}
      </div>
      <p className="form-note-banner" role="note">{current.rule}</p>
      <div hidden={active !== 'website'}>{website}</div>
      <div hidden={active !== 'console'}>{consoleSide}</div>
    </div>
  );
}
