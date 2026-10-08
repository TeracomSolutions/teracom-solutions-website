'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { isAreaActive } from '@/lib/adminNavMatch';
import { tabLabel as contentTabLabel } from '@/lib/content';
import { tabLabel } from '@/lib/holds';

export default function AdminStoreTabs() {
  const pathname = usePathname();
  const [waiting, setWaiting] = useState(0);
  const [needsLook, setNeedsLook] = useState(0);

  // How many price list rows are held for review, for the Needs review tab.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/holds/count')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && data.counts) setWaiting(data.counts.pending || 0);
      })
      .catch(() => {
        // No count: the tab just has no number.
      });
    // How many products need a look on the Photos and text page.
    fetch('/api/admin/content/count')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && data.counts) setNeedsLook(data.counts.attention || 0);
      })
      .catch(() => {
        // No count: the tab just has no number.
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <nav className="admin-tabs" aria-label="Store">
      <Link
        href="/admin/suppliers"
        className={isAreaActive({ href: '/admin/suppliers' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/suppliers' }, pathname) ? 'page' : undefined}
      >
        Data Feeds
      </Link>
      <Link
        href="/admin/catalog"
        className={isAreaActive({ href: '/admin/catalog' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/catalog' }, pathname) ? 'page' : undefined}
      >
        Catalog
      </Link>
      <Link
        href="/admin/pricing"
        className={isAreaActive({ href: '/admin/pricing' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/pricing' }, pathname) ? 'page' : undefined}
      >
        Pricing
      </Link>
      <Link
        href="/admin/brands"
        className={isAreaActive({ href: '/admin/brands' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/brands' }, pathname) ? 'page' : undefined}
      >
        Brands
      </Link>
      <Link
        href="/admin/freight"
        className={isAreaActive({ href: '/admin/freight' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/freight' }, pathname) ? 'page' : undefined}
      >
        Freight
      </Link>
      <Link
        href="/admin/review"
        className={isAreaActive({ href: '/admin/review' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/review' }, pathname) ? 'page' : undefined}
      >
        {tabLabel(waiting)}
      </Link>
      <Link
        href="/admin/content"
        className={isAreaActive({ href: '/admin/content' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/content' }, pathname) ? 'page' : undefined}
      >
        {contentTabLabel(needsLook)}
      </Link>
    </nav>
  );
}