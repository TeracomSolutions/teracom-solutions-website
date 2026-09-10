'use client';

import { useRouter } from 'next/navigation';

// Teracom Solutions Website Admin, Phase 1 -- Robert asked for a
// discreet, non-obvious entry point: double-clicking the footer
// copyright text navigates to /admin/login. This is a convenience/
// discoverability feature only, NOT a security control -- the real
// security is the staff login behind it (teracom-platform-backend's
// existing auth system), not this hidden entry point, so this stays
// deliberately simple: no visual hint, no keyboard equivalent, just
// an onDoubleClick handler. A tiny client component wrapping just
// this span, not a conversion of the whole Footer to 'use client' --
// Footer.js is otherwise a plain server component.
export default function AdminEntryPoint() {
  const router = useRouter();

  return (
    <span onDoubleClick={() => router.push('/admin/login')}>
      © {new Date().getFullYear()} Teracom Solutions
    </span>
  );
}
