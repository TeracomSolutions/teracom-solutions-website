'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// The admin's own menu. Every area is listed here and nowhere else: the
// public site never links to /admin, only the footer's double-click does.
export const ADMIN_AREAS = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/suppliers', label: 'Businesses & Suppliers' },
  { href: '/admin/catalog', label: 'Store Catalog' },
  { href: '/admin/pricing', label: 'Pricing' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/website-data', label: 'Website Data' },
  { href: '/admin/scout', label: 'Scout' },
  { href: '/admin/ai-connections', label: 'AI Connections' },
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
        const active = area.exact ? pathname === area.href : pathname === area.href || pathname.startsWith(`${area.href}/`);
        return (
          <Link key={area.href} href={area.href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}>
            {area.label}
          </Link>
        );
      })}
      <button type="button" className="admin-nav-signout" onClick={handleSignOut}>
        Sign out
      </button>
    </nav>
  );
}
