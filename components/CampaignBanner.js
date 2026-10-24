'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// The specials banner across the top of the public website (Marketing, Robert 2026-10-25). It asks for
// the live specials after the page loads, so saved pages stay cacheable, and shows nothing when none are on.
// Several specials take turns every few seconds; the close button hides it for the rest of the visit.
export default function CampaignBanner() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('campaign-banner-hidden') === '1') setHidden(true);
    } catch {
      // Storage blocked: the banner just shows.
    }
    let cancelled = false;
    fetch('/api/marketing/banner')
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((data) => { if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (hidden || items.length === 0) return null;
  const item = items[index % items.length];
  const text = (
    <>
      <strong>{item.text}</strong>
      {item.coupon_code ? <span className="campaign-banner-code"> Use code {item.coupon_code}</span> : null}
    </>
  );

  function close() {
    setHidden(true);
    try {
      window.sessionStorage.setItem('campaign-banner-hidden', '1');
    } catch {
      // Nothing to remember it in.
    }
  }

  return (
    <div className="campaign-banner" role="region" aria-label="Current specials">
      <div className="container campaign-banner-inner">
        {item.link_url ? <Link href={item.link_url} className="campaign-banner-link">{text}</Link> : <span>{text}</span>}
        <button type="button" className="campaign-banner-close" aria-label="Hide the specials banner" onClick={close}>×</button>
      </div>
    </div>
  );
}
