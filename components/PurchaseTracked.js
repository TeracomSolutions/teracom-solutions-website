'use client';

import { useEffect } from 'react';

import { AUD, trackOnce } from '@/lib/gtag';

// Reports a completed purchase, once.
//
// Only rendered after the server has confirmed the payment, so this can
// never fire for a session that was abandoned or for a bookmarked URL. The
// transaction id is the payment intent, which maps one-to-one to the money
// and to any later refund -- and trackOnce keys on it, because trade
// customers refresh a confirmation page to re-read an order number and a
// duplicated purchase is a wrong revenue figure rather than a missing one.

export default function PurchaseTracked({ transactionId, value, shipping, items = [] }) {
  useEffect(() => {
    if (!transactionId) return;
    trackOnce(`purchase:${transactionId}`, 'purchase', {
      transaction_id: transactionId,
      currency: AUD,
      value,
      shipping,
      // GST is one eleventh of a GST-inclusive Australian total.
      tax: value == null ? undefined : Number((value / 11).toFixed(2)),
      items,
    });
  }, [transactionId, value, shipping, items]);

  return null;
}
