'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatMoney } from '@/lib/products';

export default function CartPage() {
  const { lines, totalCents, updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      });
      // A non-JSON response (e.g. a platform-level 502/504 HTML error page)
      // must not crash this with a confusing "Unexpected end of JSON
      // input" -- fall back to a generic message instead.
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <main className="section">
        <div className="container">
          <span className="eyebrow">Your Cart</span>
          <h1>Your cart is empty.</h1>
          <p className="lead">Browse the store and add some products.</p>
          <Link className="btn btn-primary" href="/store">
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Your Cart</span>
        <h1>Review your order.</h1>

        <div className="cart-lines">
          {lines.map((l) => (
            <div className="cart-line" key={l.productId}>
              <div className="cart-line-info">
                <h3>{l.product.name}</h3>
                <p className="muted">{formatMoney(l.product.priceCents)} each</p>
              </div>
              <div className="cart-qty-control">
                <button type="button" onClick={() => updateQuantity(l.productId, l.quantity - 1)} aria-label="Decrease quantity">
                  −
                </button>
                <span>{l.quantity}</span>
                <button type="button" onClick={() => updateQuantity(l.productId, l.quantity + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <p className="cart-line-total">{formatMoney(l.product.priceCents * l.quantity)}</p>
              <button type="button" className="cart-remove" onClick={() => removeItem(l.productId)} aria-label={`Remove ${l.product.name}`}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <span>Subtotal <span className="price-gst-note">(inc. GST)</span></span>
          <span className="cart-total-amount">{formatMoney(totalCents)}</span>
        </div>
        <p className="form-note">A flat shipping fee applies to orders containing physical products, added at checkout.</p>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="button" className="btn btn-primary" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Opening...' : 'Checkout'}
        </button>
      </div>
    </main>
  );
}
