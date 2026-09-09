'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

// Rendered on the checkout success page. Safe to call for every successful
// checkout, not just cart ones -- a Subscribe/Buy Now purchase never added
// anything to the cart in the first place, so clearCart() is a no-op there.
export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
