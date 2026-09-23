'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { findProduct } from '@/lib/products';
import { AUD, track, toGaItem } from '@/lib/gtag';

export default function AddToCartButton({ productId, label = 'Add to Cart' }) {
  const { items, addItem, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.find((i) => i.productId === productId);

  function handleAdd() {
    addItem(productId, 1);
    const product = findProduct(productId);
    if (product) {
      track('add_to_cart', {
        currency: AUD,
        value: product.priceCents == null ? undefined : Number((product.priceCents / 100).toFixed(2)),
        items: [toGaItem(product, 1)],
      });
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  function handleDecrease() {
    updateQuantity(productId, inCart.quantity - 1);
    const product = findProduct(productId);
    if (product) {
      track('remove_from_cart', {
        currency: AUD,
        value: product.priceCents == null ? undefined : Number((product.priceCents / 100).toFixed(2)),
        items: [toGaItem(product, 1)],
      });
    }
  }

  if (inCart) {
    return (
      <div className="cart-qty-control">
        <button type="button" onClick={() => handleDecrease()} aria-label="Decrease quantity">
          −
        </button>
        <span>{inCart.quantity} in cart</span>
        <button type="button" onClick={() => updateQuantity(productId, inCart.quantity + 1)} aria-label="Increase quantity">
          +
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="btn btn-primary" onClick={handleAdd}>
      {justAdded ? 'Added ✓' : label}
    </button>
  );
}
