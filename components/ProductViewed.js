'use client';

import { useEffect } from 'react';

import { AUD, track, toGaItem } from '@/lib/gtag';

// view_item on a product page. Reported from the client because the value
// depends on whether the visitor is signed in and seeing member pricing.

export default function ProductViewed({ product, priceCents }) {
  useEffect(() => {
    if (!product) return;
    track('view_item', {
      currency: AUD,
      value: priceCents == null ? undefined : Number((priceCents / 100).toFixed(2)),
      items: [toGaItem(product, 1, priceCents)],
    });
    // Once per product per mount: a re-render must not look like a second view.
  }, [product, priceCents]);

  return null;
}
