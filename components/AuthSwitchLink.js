'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { safeNextPath } from '@/lib/safeNext';

// "Sign in" from the sign-up page and "Create a free account" from the sign-in page
// keep where the visitor was going (a tool, a download), so they land back there.
const subscribe = () => () => {};
const nextOnClient = () => new URLSearchParams(window.location.search).get('next') || '';
const nextOnServer = () => '';

export default function AuthSwitchLink({ href, children, className }) {
  const next = useSyncExternalStore(subscribe, nextOnClient, nextOnServer);
  const target = next ? `${href}?next=${encodeURIComponent(safeNextPath(next))}` : href;
  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}
