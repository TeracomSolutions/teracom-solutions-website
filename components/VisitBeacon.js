'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Tells our own backend a page was viewed -- the path and the referrer,
// nothing else; the server turns that into an anonymous daily visitor
// hash. Fires once per page, including client-side navigations. Admin and
// API paths are dropped server-side as well as here.
export default function VisitBeacon() {
  const pathname = usePathname();
  const lastPath = useRef(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    if (pathname.startsWith('/admin')) return;
    lastPath.current = pathname;

    // document.referrer is the page that brought the visitor to the site;
    // it stays put through client-side navigation, which is what we want.
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer || '' });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
      }
    } catch {
      // never let analytics surface to the visitor
    }
  }, [pathname]);

  return null;
}
