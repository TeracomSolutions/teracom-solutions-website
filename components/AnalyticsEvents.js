'use client';

import { useEffect } from 'react';

import { track } from '@/lib/gtag';

// Site-wide event listeners, mounted once in the layout.
//
// Phone and email clicks. GA4's enhanced measurement records file downloads
// and outbound links for free, but a tel: or mailto: link produces nothing at
// all -- so for a trade business the highest-value action on the site is the
// one action analytics cannot see by default.
//
// One delegated listener covers every page and survives client-side
// navigation, which a per-link handler would not.
//
// The address itself is never reported. It is personal information and there
// is no reason to collect it: the useful facts are that someone wanted to
// make contact and which page convinced them.

export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const method = link.getAttribute('href').startsWith('tel:') ? 'phone' : 'email';
      track('contact_click', {
        contact_method: method,
        // Which page earned the call, not who was called.
        page_path: window.location.pathname,
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
