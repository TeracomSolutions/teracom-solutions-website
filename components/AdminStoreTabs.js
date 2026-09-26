'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isAreaActive } from '@/lib/adminNavMatch';

export default function AdminStoreTabs() {
  const pathname = usePathname();

  return (
    <nav className="admin-tabs" aria-label="Store">
      <Link
        href="/admin/suppliers"
        className={isAreaActive({ href: '/admin/suppliers' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/suppliers' }, pathname) ? 'page' : undefined}
      >
        Businesses
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
    </nav>
  );
}