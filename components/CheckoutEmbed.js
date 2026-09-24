'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { ArrowLeft, TriangleAlert } from 'lucide-react';

import { useCart } from '@/lib/cart-context';
import { getStripe } from '@/lib/stripeClient';
import { AUD, track, toGaItem } from '@/lib/gtag';

// Payment happens on this page rather than on Stripe's.
//
// The visitor stays on teracomsolutions.com.au, which is worth more than it
// sounds for a trade buyer deciding whether to put $3,000 on a card. It also
// removes the analytics blind spot the redirect created: with the payment
// step off-site, every sale looked to Google Analytics like it came from
// Stripe rather than from whatever actually brought the customer in.

export default function CheckoutEmbed() {
  const { lines, totalItems } = useCart();
  const [error, setError] = useState('');
  const stripePromise = getStripe();

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/checkout/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.clientSecret) {
      const message = data.error || 'We could not start checkout just now.';
      setError(message);
      throw new Error(message);
    }
    track('begin_checkout', {
      currency: AUD,
      items: lines.map((line) => toGaItem(line.product, line.quantity)),
    });
    return data.clientSecret;
  }, [lines]);

  if (totalItems === 0) {
    return (
      <div className="checkout-notice">
        <p>Your cart is empty.</p>
        <Link className="btn btn-primary" href="/store">
          Back to the store
        </Link>
      </div>
    );
  }

  if (!stripePromise) {
    // No publishable key configured. Say so rather than rendering an empty
    // frame the visitor will stare at.
    return (
      <div className="checkout-notice" role="alert">
        <p>
          <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" /> Online payment is not
          available right now.
        </p>
        <p>
          Email <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a> and we will take the order that way.
        </p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="checkout-notice" role="alert">
          <p>
            <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" /> {error}
          </p>
          <p>
            Your cart has not been touched. Email <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a> if it keeps happening.
          </p>
        </div>
      ) : (
        <div id="checkout" className="checkout-embed">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}

      <p className="form-note checkout-back">
        <ArrowLeft size={16} strokeWidth={1.9} aria-hidden="true" focusable="false" />{' '}
        <Link href="/cart">Back to cart</Link>
      </p>
    </>
  );
}
