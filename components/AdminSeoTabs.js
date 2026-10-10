'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The tabs along the top of the Search page (Robert, 2026-10-10).
const TABS = [
  { href: '/admin/seo', label: 'Overview', exact: true },
  { href: '/admin/seo/opportunities', label: 'Opportunities' },
  { href: '/admin/seo/titles', label: 'Titles' },
  { href: '/admin/seo/indexing', label: 'Indexing' },
  { href: '/admin/seo/redirects', label: 'Redirects' },
];

export default function AdminSeoTabs() {
  const pathname = usePathname();
  return (
    <nav className="admin-tabs" aria-label="Search">
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
