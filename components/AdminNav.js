'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import AdminSessionTimer from '@/components/AdminSessionTimer';
import { isAreaActive } from '@/lib/adminNavMatch';
import { areaVisible } from '../lib/permissionsView.js';

// The admin's own menu. Every area is listed here and nowhere else: the
// public site never links to /admin, only the footer's double-click does.
export const ADMIN_AREAS = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/account', label: 'Account' },
  { href: '/admin/activity', label: 'Audit log' },
  { href: '/admin/ai-connections', label: 'AI Connections' },
  { href: '/admin/assistant', label: 'Assistant' },
  { href: '/admin/connections', label: 'Connections' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/marketing', label: 'Marketing' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/sales', label: 'Sales', match: ['/admin/orders'] },
  { href: '/admin/scout', label: 'Scout' },
  { href: '/admin/social', label: 'Social' },
  { href: '/admin/support', label: 'Support' },
  { href: '/admin/suppliers', label: 'Store', match: ['/admin/catalog', '/admin/pricing', '/admin/brands', '/admin/freight', '/admin/review', '/admin/content', '/admin/marketplace'] },
  { href: '/admin/website-data', label: 'Website Data' },
  { href: '/admin/build-progress', label: 'Build progress' },
  { href: '/admin/about', label: 'About' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [permissions, setPermissions] = useState(null);

  // What this person may see: Administrators see everything; a Limited access user only the sections they were given.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && data.staff_role === 'operator') setPermissions(data.permissions || {});
      })
      .catch(() => {
        // No answer: the menu stays complete; the backend still refuses what is not allowed.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <nav className="admin-nav" aria-label="Administration">
      {ADMIN_AREAS.filter((area) => areaVisible(area.href, permissions) && !(area.href === '/admin/build-progress' && process.env.NEXT_PUBLIC_BUILD_PROGRESS === 'off')).map((area) => {
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
