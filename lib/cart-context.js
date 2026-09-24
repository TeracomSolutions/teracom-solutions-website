'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { findProduct } from '@/lib/products';

const CartContext = createContext(null);
const STORAGE_KEY = 'teracom-cart-v1';
// Separate key from the items: clearing a cart should drop the code with it,
// but an item change must not silently drop a code the customer applied.
const COUPON_KEY = 'teracom-cart-coupon-v1';

function readStoredCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredCoupon() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COUPON_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // The stored discount is a display hint only -- the checkout route
    // recomputes it from the catalogue before charging anything, so a stale
    // or hand-edited value here cannot become a real discount.
    return parsed && typeof parsed.code === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Cart starts empty during SSR/first paint, then hydrates from
  // localStorage client-side -- avoids a server/client markup mismatch.
  useEffect(() => {
    setItems(readStoredCart());
    setCoupon(readStoredCoupon());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private browsing / quota exceeded -- cart still works for this page load.
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (coupon) window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
      else window.localStorage.removeItem(COUPON_KEY);
    } catch {
      // As above -- the code still applies for this page load.
    }
  }, [coupon, hydrated]);

  const addItem = useCallback((productId, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => (i.productId === productId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const applyCoupon = useCallback((applied) => setCoupon(applied), []);
  const clearCoupon = useCallback(() => setCoupon(null), []);

  const clearCart = useCallback(() => {
    setItems([]);
    // A code applied to an order that no longer exists is not a discount, it
    // is a confusing line item on the next one.
    setCoupon(null);
  }, []);

  const value = useMemo(() => {
    const lines = items
      .map((i) => ({ ...i, product: findProduct(i.productId) }))
      .filter((line) => line.product);
    const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
    const totalCents = lines.reduce((sum, line) => sum + line.quantity * line.product.priceCents, 0);
    return {
      items, lines, totalItems, totalCents, coupon,
      addItem, updateQuantity, removeItem, clearCart, applyCoupon, clearCoupon,
    };
  }, [items, coupon, addItem, updateQuantity, removeItem, clearCart, applyCoupon, clearCoupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
