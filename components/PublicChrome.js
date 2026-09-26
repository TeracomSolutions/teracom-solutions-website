'use client';

import { usePathname } from 'next/navigation';

// The public site's header and footer wrap every page except the admin
// console, which has its own brand bar and menu (Robert, 2026-09-26: the
// site navigation has no business inside the console; leaving it is done by
// signing out).
export default function PublicChrome({ children }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) return null;
  return children;
}
