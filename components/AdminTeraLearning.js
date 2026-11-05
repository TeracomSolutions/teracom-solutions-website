'use client';

import { useEffect, useMemo, useState } from 'react';

// Admin -> Support -> What Tera learns (Robert, 2026-11-05): besides what
// staff teach it, whether Tera's library takes in the store's products and
// the suppliers' price lists, and of which brands. Saved with Tera's other
// settings; the next library rebuild (tonight, or Rebuild library) uses it.
export default function AdminTeraLearning({ initial }) {
  const [storeProducts, setStoreProducts] = useState(initial?.learn_store_products !== false);
  const [priceLists, setPriceLists] = useState(initial?.learn_price_lists !== false);
  const [chosen, setChosen] = useState(initial?.learn_brands || []);
  const [everyBrand, setEveryBrand] = useState(!(initial?.learn_brands || []).length);
  const [brands, setBrands] = useState(null);
  const [filter, setFilter] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let stopped = false;
    fetch('/api/admin/support/brands', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (!stopped) setBrands(Array.isArray(data) ? data : []); })
      .catch(() => { if (!stopped) setBrands([]); });
    return () => { stopped = true; };
  }, []);

  const lowerChosen = useMemo(() => new Set(chosen.map((b) => b.toLowerCase())), [chosen]);
  const shown = (brands || []).filter((b) => !filter.trim() || b.brand.toLowerCase().includes(filter.trim().toLowerCase()));

  function flip(brand) {
    setChosen((current) => (current.some((b) => b.toLowerCase() === brand.toLowerCase())
      ? current.filter((b) => b.toLowerCase() !== brand.toLowerCase())
      : [...current, brand]));
  }

  async function save(event) {
    event.preventDefault();
    if (!everyBrand && chosen.length === 0) {
      setError('Tick at least one brand, or choose Every brand.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/support/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learn_store_products: storeProducts,
          learn_price_lists: priceLists,
          learn_brands: everyBrand ? [] : chosen,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'That did not work.');
      setMessage('Saved. The next library rebuild (tonight, or Rebuild library above) uses it.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-card tera-learning" onSubmit={save}>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Tera always knows the help centre, the website&apos;s pages, the manuals and datasheets, and what staff teach it. Choose what else it learns.
      </p>
      <label className="admin-check">
        <input type="checkbox" checked={storeProducts} onChange={(e) => setStoreProducts(e.target.checked)} />
        Every product in the store
      </label>
      <label className="admin-check">
        <input type="checkbox" checked={priceLists} onChange={(e) => setPriceLists(e.target.checked)} />
        Products in the suppliers&apos; price lists that are not in the store (as ones we can order in, never with prices)
      </label>

      <fieldset className="tera-learning-brands">
        <legend>Brands</legend>
        <label className="admin-check">
          <input type="radio" name="tera-brands" checked={everyBrand} onChange={() => setEveryBrand(true)} />
          Every brand
        </label>
        <label className="admin-check">
          <input type="radio" name="tera-brands" checked={!everyBrand} onChange={() => setEveryBrand(false)} />
          Only the brands I tick{!everyBrand ? ` (${chosen.length} ticked)` : ''}
        </label>
        {!everyBrand ? (
          <>
            <input type="search" className="tera-learning-filter" placeholder="Find a brand" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Find a brand" />
            {brands === null ? <p className="admin-muted">Loading the brands…</p> : null}
            <div className="tera-learning-grid">
              {shown.map((b) => (
                <label key={b.brand} className="admin-check">
                  <input type="checkbox" checked={lowerChosen.has(b.brand.toLowerCase())} onChange={() => flip(b.brand)} />
                  {b.brand} <span className="admin-muted">({b.products})</span>
                </label>
              ))}
            </div>
          </>
        ) : null}
      </fieldset>

      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save what Tera learns'}</button>
      </div>
    </form>
  );
}
