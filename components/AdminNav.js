'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import AdminSessionTimer from '@/components/AdminSessionTimer';
import { isAreaActive } from '@/lib/adminNavMatch';

// The admin's own menu. Every area is listed here and nowhere else: the
// public site never links to /admin, only the footer's double-click does.
export const ADMIN_AREAS = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/account', label: 'Account' },
  { href: '/admin/ai-connections', label: 'AI Connections' },
  { href: '/admin/assistant', label: 'Assistant' },
  { href: '/admin/connections', label: 'Connections' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/scout', label: 'Scout' },
  { href: '/admin/social', label: 'Social' },
  { href: '/admin/suppliers', label: 'Store', match: ['/admin/catalog', '/admin/pricing', '/admin/freight'] },
  { href: '/admin/website-data', label: 'Website Data' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <nav className="admin-nav" aria-label="Administration">
      {ADMIN_AREAS.map((area) => {
        const active = isAreaActive(area, pathname);
        return (
          <Link key={area.href} href={area.href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}>
            {area.label}
          </Link>
        );
      })}
      <AdminSessionTimer />
      <button type="button" className="admin-nav-signout" onClick={handleSignOut}>
        Sign out
      </button>
    </nav>
  );
}
