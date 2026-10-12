'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasCustomerMarker } from '@/lib/customerMarker.js';

export default function HeaderAccount() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (!hasCustomerMarker(document.cookie)) {
      return;
    }

    let cancelled = false;

    fetch('/api/customer/me', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => {
        if (!cancelled && data.customer) {
          setCustomer(data.customer);
        }
      })
      .catch(() => {
        // Ignore errors, greeting stays "Sign In"
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (customer) {
    return <Link href="/account" className="nav-signin-status">Hi, {customer.first_name || customer.email}</Link>;
  }

  return <Link href="/account/login" className="nav-signin-status">Sign In</Link>;
}