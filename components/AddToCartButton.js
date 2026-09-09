'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

export default function AddToCartButton({ productId, label = 'Add to Cart' }) {
  const { items, addItem, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.find((i) => i.productId === productId);

  function handleAdd() {
    addItem(productId, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  if (inCart) {
    return (
      <div className="cart-qty-control">
        <button type="button" onClick={() => updateQuantity(productId, inCart.quantity - 1)} aria-label="Decrease quantity">
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
