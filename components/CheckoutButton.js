'use client';

import { useState } from 'react';

export default function CheckoutButton({ productId, label }) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
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
