'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Resources in the console: the watched document websites, the Industry news publications,
// the articles drafted from the news, and the public home page's banner.
const TABS = [
  { href: '/admin/resources', label: 'Documents' },
  { href: '/admin/resources/industry-news', label: 'Industry news' },
  { href: '/admin/resources/articles', label: 'Articles' },
  { href: '/admin/resources/home-banner', label: 'Home banner' },
];

function activeTab(pathname) {
  if (pathname.startsWith('/admin/resources/industry-news')) return '/admin/resources/industry-news';
  if (pathname.startsWith('/admin/resources/articles')) return '/admin/resources/articles';
  if (pathname.startsWith('/admin/resources/home-banner')) return '/admin/resources/home-banner';
  return '/admin/resources';
}

export default function AdminResourcesTabs() {
  const current = activeTab(usePathname() || '');
  return (
    <nav className="admin-tabs" aria-label="Resources">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} className={tab.href === current ? 'admin-tab active' : 'admin-tab'} aria-current={tab.href === current ? 'page' : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
