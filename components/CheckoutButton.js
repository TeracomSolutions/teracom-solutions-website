'use client';

import { useState } from 'react';

import { findProduct } from '@/lib/products';
import { AUD, track, toGaItem } from '@/lib/gtag';

export default function CheckoutButton({ productId, label }) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const product = findProduct(productId);
    if (product) {
      track('begin_checkout', {
        currency: AUD,
        value: product.priceCents == null ? undefined : Number((product.priceCents / 100).toFixed(2)),
        items: [toGaItem(product, 1)],
      });
    }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      // A non-JSON response (e.g. a platform-level 502/504 HTML error page)
      // must not crash this with a confusing "Unexpected end of JSON
      // input" -- fall back to a generic message instead.
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert(e.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-primary" onClick={checkout} disabled={loading}>
      {loading ? 'Opening...' : label}
    </button>
  );
}
