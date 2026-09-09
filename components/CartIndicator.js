'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="cart-indicator" aria-label="View cart">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
        <path d="M3 4h2l2.2 11.2a2 2 0 002 1.8h7.6a2 2 0 002-1.8L20 8H6.2" />
      </svg>
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </Link>
  );
}
