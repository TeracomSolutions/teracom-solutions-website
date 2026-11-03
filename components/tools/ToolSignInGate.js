'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { BadgePercent, Bot, Download, Lock, Wrench } from 'lucide-react';

import { hasCustomerMarker } from '@/lib/customerMarker';

// The free tools need a free account (Robert, 2026-11-03): every visitor sees the
// tool page, what it does and how it works (and so does Google), but using it takes
// a sign-in, so each person who uses the tools joins the customer list. Signed-in
// visitors get the tool straight away; it is checked in the browser, so the page
// itself stays one saved copy for everyone.
const subscribe = () => () => {};
const signedIn = () => hasCustomerMarker(document.cookie);
const onServer = () => null;

export default function ToolSignInGate({ path, title, children }) {
  const state = useSyncExternalStore(subscribe, signedIn, onServer);
  if (state === true) return children;
  const next = encodeURIComponent(path);
  return (
    <div className="tool-gate">
      <div className="tool-gate-preview" inert aria-hidden="true">
        {children}
      </div>
      {state === false ? (
        <div className="tool-gate-panel" role="region" aria-label="Sign in to use this tool">
          <span className="tool-gate-icon">
            <Lock size={26} strokeWidth={2} aria-hidden="true" />
          </span>
          <h2>Create a free account to use the {title}</h2>
          <p>
            All our design tools are free for Teracom members. It takes two minutes, and your account also gets you:
          </p>
          <ul>
            <li><Wrench size={16} aria-hidden="true" /> Every free tool, with saving, PDF reports and Excel exports</li>
            <li><Download size={16} aria-hidden="true" /> Manuals, datasheets and software downloads</li>
            <li><BadgePercent size={16} aria-hidden="true" /> Member pricing in the store</li>
            <li><Bot size={16} aria-hidden="true" /> Ask Tera, our AI support assistant</li>
          </ul>
          <div className="tool-gate-actions">
            <Link className="btn btn-primary" href={`/account/signup?next=${next}`}>Create a free account</Link>
            <Link className="btn btn-secondary" href={`/account/login?next=${next}`}>Sign in</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
