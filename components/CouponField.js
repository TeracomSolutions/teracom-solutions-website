'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';

import { useCart } from '@/lib/cart-context';

// The discount code box in the cart.
//
// What it shows is a preview. The checkout route revalidates the code and
// recomputes the amount from the catalogue before anything is charged, so a
// code that expires between here and payment is caught there rather than
// quietly honoured.

export default function CouponField({ onApplied }) {
  const { lines, coupon, applyCoupon, clearCoupon } = useCart();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleApply(event) {
    event.preventDefault();
    setError('');
    const entered = code.trim();
    if (!entered) return;

    setStatus('checking');
    try {
      const res = await fetch('/api/cart/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: entered,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!data.valid) {
        setError(data.reason || 'That code is not valid.');
        setStatus('idle');
        return;
      }

      applyCoupon({ code: data.code, label: data.label, discountCents: data.discount_cents });
      onApplied?.(data);
      setCode('');
      setStatus('idle');
    } catch {
      setError('We could not check that code just now. Please try again in a moment.');
      setStatus('idle');
    }
  }

  if (coupon) {
    return (
      <div className="coupon-applied">
        <Tag size={16} strokeWidth={1.9} aria-hidden="true" focusable="false" />
        <span className="coupon-applied-text">
          <strong>{coupon.code}</strong> applied — {coupon.label}
        </span>
        <button
          type="button"
          className="coupon-remove"
          onClick={clearCoupon}
          aria-label={`Remove discount code ${coupon.code}`}
        >
          <X size={15} strokeWidth={2.2} aria-hidden="true" focusable="false" />
        </button>
      </div>
    );
  }

  return (
    <form className="coupon-form" onSubmit={handleApply}>
      <label htmlFor="coupon-code">Discount code</label>
      <div className="coupon-row">
        <input
          id="coupon-code"
          name="coupon-code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck="false"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-secondary coupon-apply"
          disabled={status === 'checking' || !code.trim()}
        >
          {status === 'checking' ? 'Checking…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="coupon-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
