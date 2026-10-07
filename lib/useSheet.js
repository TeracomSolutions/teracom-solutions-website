'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { sheetQueryString } from './sheetQuery.js';

// One page of the catalogue sheet for the filters given. The first page
// arrives with the page itself; after that each change of filters or page
// loads from /api/admin/catalog/sheet a moment after the last keystroke, and
// the rows already on screen stay until the new ones arrive.
export default function useSheet(filters, initial) {
  const query = sheetQueryString(filters);
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const skipFirst = useRef(true);

  useEffect(() => {
    // The page already holds the first page for the starting filters.
    if (skipFirst.current) {
      skipFirst.current = false;
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/admin/catalog/sheet?${query}`, { signal: controller.signal });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || 'Unable to load the catalogue.');
        setData(body);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, version]);

  // Load the current page again, after a save or a change elsewhere.
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  // Show a product just saved without waiting for the reload.
  const patchRow = useCallback((updated) => {
    setData((current) => ({
      ...current,
      products: current.products.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
    }));
  }, []);

  return { data, loading, error, reload, patchRow };
}