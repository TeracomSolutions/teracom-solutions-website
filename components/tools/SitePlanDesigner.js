'use client';

import { useMemo } from 'react';

import { useCart } from '@/lib/cart-context';
import SitePlanner from '@/siteplan/SitePlanner';

// The Site Plan Designer on the website: the planner (siteplan/, kept free of website
// imports so it can move into Teracom AI) with the store plugged in for its Parts and
// price list -- product suggestions with this customer's prices, the cart, and the
// installed-quote request to Sales.
export default function SitePlanDesigner() {
  const { addItem } = useCart();
  const shop = useMemo(() => ({
    cartHref: '/cart',
    // The cart and checkout take up to 20 of each product (lib/cart-context.js).
    maxQty: 20,
    async findParts(keys) {
      const response = await fetch('/api/tools/site-plan-parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys }),
      });
      if (!response.ok) throw new Error(`Parts lookup failed (${response.status})`);
      return response.json();
    },
    addToCart(items) {
      for (const item of items) addItem(item.id, item.qty);
    },
    async requestQuote(request) {
      const response = await fetch('/api/tools/site-plan-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const answer = await response.json().catch(() => ({}));
      return response.ok ? { ok: true } : { ok: false, error: answer.error };
    },
  }), [addItem]);
  return <SitePlanner shop={shop} />;
}
