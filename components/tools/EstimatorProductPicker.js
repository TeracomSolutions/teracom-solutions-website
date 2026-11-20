'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

import { exGst, money } from '@/lib/estimator';

// Pick materials for an estimate: only the store's own products, at the customer's price.
export default function EstimatorProductPicker({ sectionTitle, onAdd, onClose, onSignIn }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [qty, setQty] = useState({});
  const [added, setAdded] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      try {
        const params = new URLSearchParams({ q, category, page: String(page) });
        const res = await fetch(`/api/tools/estimator/products?${params}`, { signal: ctrl.signal });
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          onSignIn(data.error);
          return;
        }
        if (!res.ok) throw new Error(data.error || 'The search did not work.');
        setResult(data);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'The search did not work.');
      } finally {
        setBusy(false);
      }
    }, q ? 250 : 0);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q, category, page, onSignIn]);

  const add = (product) => {
    const n = Math.max(1, Math.min(99999, Math.round(Number(qty[product.id]) || 1)));
    onAdd(product, n);
    setAdded((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + n }));
  };

  return (
    <div className="est-modal" role="dialog" aria-modal="true" aria-label={`Add materials to ${sectionTitle || 'this section'}`}>
      <div className="est-modal-panel est-picker">
        <div className="est-modal-head">
          <h2>Add materials{sectionTitle ? <span> to {sectionTitle}</span> : null}</h2>
          <button type="button" className="est-icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <p className="est-hint">Materials come from our store only, at your price. Prices are shown ex GST.</p>
        <div className="est-picker-search">
          <label className="est-search">
            <Search size={18} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              placeholder="Search by name, brand or part number"
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Category"
          >
            <option value="">All categories</option>
            {(result?.categories || []).map((c) => (
              <option key={c.name || c.value || c.label} value={c.name || c.value || c.label}>
                {c.name || c.value || c.label}{c.count ? ` (${c.count})` : ''}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="form-note-banner">{error}</p> : null}
        <div className="est-picker-results" aria-busy={busy}>
          {result && !result.items.length ? <p className="est-hint">Nothing in the store matches that. Try fewer words or a part number.</p> : null}
          {(result?.items || []).map((p) => (
            <div className="est-pick" key={p.id}>
              {p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : <span className="est-pick-noimg" />}
              <div className="est-pick-info">
                <a href={p.href} target="_blank" rel="noreferrer">{p.name}</a>
                <small>{[p.brand, p.sku, p.category].filter(Boolean).join(' · ')}</small>
              </div>
              <div className="est-pick-price">
                {typeof p.unitCents === 'number' ? <strong>{money(exGst(p.unitCents))}</strong> : <small>Price on request</small>}
                {typeof p.stock === 'number' ? <small>{p.stock > 0 ? `${p.stock} in stock` : 'Order in'}</small> : null}
              </div>
              <input
                className="est-pick-qty"
                type="number"
                min="1"
                inputMode="numeric"
                aria-label={`Quantity of ${p.name}`}
                value={qty[p.id] ?? 1}
                onChange={(e) => setQty((prev) => ({ ...prev, [p.id]: e.target.value }))}
              />
              <button type="button" className="btn btn-primary est-pick-add" onClick={() => add(p)}>
                {added[p.id] ? `Added ${added[p.id]}` : 'Add'}
              </button>
            </div>
          ))}
        </div>
        {result && result.pages > 1 ? (
          <div className="est-pager">
            <button type="button" className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {result.page} of {result.pages} · {result.total} products</span>
            <button type="button" className="btn btn-secondary" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        ) : null}
        <div className="est-modal-foot">
          <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
