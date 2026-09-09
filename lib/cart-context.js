'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { findProduct } from '@/lib/products';

const CartContext = createContext(null);
const STORAGE_KEY = 'teracom-cart-v1';

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

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Cart starts empty during SSR/first paint, then hydrates from
  // localStorage client-side -- avoids a server/client markup mismatch.
  useEffect(() => {
    setItems(readStoredCart());
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

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const lines = items
      .map((i) => ({ ...i, product: findProduct(i.productId) }))
      .filter((line) => line.product);
    const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
    const totalCents = lines.reduce((sum, line) => sum + line.quantity * line.product.priceCents, 0);
    return { items, lines, totalItems, totalCents, addItem, updateQuantity, removeItem, clearCart };
  }, [items, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
