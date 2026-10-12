'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The tabs along the top of the Website Data page (Robert, 2026-10-10).
const TABS = [
  { href: '/admin/website-data', label: 'Overview', exact: true },
  { href: '/admin/website-data/visitors', label: 'Visitors' },
  { href: '/admin/website-data/opportunities', label: 'Opportunities' },
  { href: '/admin/website-data/titles', label: 'Titles' },
  { href: '/admin/website-data/indexing', label: 'Indexing' },
  { href: '/admin/website-data/health', label: 'Health' },
  { href: '/admin/website-data/shopping', label: 'Shopping' },
  { href: '/admin/website-data/analytics', label: 'Analytics' },
  { href: '/admin/website-data/redirects', label: 'Redirects' },
];

export default function AdminSeoTabs() {
  const pathname = usePathname();
  return (
    <nav className="admin-tabs" aria-label="Website Data">
      {TABS.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link key={tab.href} href={tab.href} className={active ? 'admin-tab active' : 'admin-tab'} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
