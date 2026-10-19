'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isAreaActive } from '@/lib/adminNavMatch';

export default function AdminSalesTabs() {
  const pathname = usePathname();

  return (
    <nav className="admin-tabs" aria-label="Sales and orders">
      <Link
        href="/admin/orders"
        className={isAreaActive({ href: '/admin/orders' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/orders' }, pathname) ? 'page' : undefined}
      >
        Orders
      </Link>
      <Link
        href="/admin/sales"
        className={isAreaActive({ href: '/admin/sales' }, pathname) ? 'admin-tab active' : 'admin-tab'}
        aria-current={isAreaActive({ href: '/admin/sales' }, pathname) ? 'page' : undefined}
      >
        Sales
      </Link>
    </nav>
  );
}