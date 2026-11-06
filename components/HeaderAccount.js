'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
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

  // An icon with its words; the words drop away on narrower screens, where the
  // aria-label still says what the icon is.
  const icon = <UserRound size={19} strokeWidth={1.8} aria-hidden="true" />;
  if (customer) {
    const name = customer.first_name || customer.email;
    return (
      <Link href="/account" className="nav-signin-status" aria-label={`Your account (${name})`}>
        {icon}
        <span className="nav-signin-label">Hi, {name}</span>
      </Link>
    );
  }

  return (
    <Link href="/account/login" className="nav-signin-status" aria-label="Sign in">
      {icon}
      <span className="nav-signin-label">Sign In</span>
    </Link>
  );
}