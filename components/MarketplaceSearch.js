"use client";

import { useState } from 'react';
import { marketplaceRequest } from '../lib/marketplaceClient.js';
import { priceSummary, originNote } from '../lib/marketplaceView.js';
import { cents } from '../lib/orderView.js';

export default function MarketplaceSearch({ status, suppliers, selected, defaultMarkup, onImported }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});

  if (!status || status.mode === 'off') {
    return (
      <div className="admin-card">
        <p className="admin-muted">Marketplace connections are switched off, so there is nothing to search yet.</p>
      </div>
    );
  }

  const card = (suppliers || []).find((s) => s.name === selected) || null;

  if (!card || card.can_search !== true) {
    return (
      <div className="admin-card">
        <p className="admin-muted">{(card ? card.label : 'That supplier') + ' cannot be searched. Pick a supplier marked Connected, or import a spreadsheet below.'}</p>
      </div>
    );
  }

  function draftFor(row) {
    return drafts[row.provider_product_id] || { markup: String(defaultMarkup || 40), shipping: '0', price: null };
  }

  function updateDraft(id, patch) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...draftFor({ provider_product_id: id }), ...patch }
    }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await marketplaceRequest('search', { query: { provider: selected, q: query } });
      if (res.ok) {
        setResults(res.data.products || []);
        setSearched(true);
      } else {
        setError(res.error);
      }
    } finally {
      setBusy(false);
    }
  }

  async function workOutPrice(row) {
    const d = draftFor(row);
    setBusy(true);
    setError('');
    try {
      const res = await marketplaceRequest('price-check', {
        query: {
          cost_cents: row.cost_cents,
          markup_percent: d.markup,
          shipping_cents: d.shipping
        }
      });
      if (res.ok) {
        updateDraft(row.provider_product_id, { price: res.data });
      } else {
        setError(res.error);
      }
    } finally {
      setBusy(false);
    }
  }

  async function importDraft(row) {
    const d = draftFor(row);
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await marketplaceRequest('import', {
        method: 'POST',
        body: {
          provider: provider,
          provider_product_id: row.provider_product_id,
          markup_percent: Number(d.markup),
          shipping_cents: Number(d.shipping)
        }
      });
      if (res.ok) {
        setMessage(
          res.data.status === 'created'
            ? 'Imported as an unpublished draft. Approve it below before it can go live.'
            : 'That product was already imported.'
        );
        if (typeof onImported === 'function') onImported();
      } else {
        setError(res.error);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="admin-card">
        <h2>Search {card.label}</h2>
        <form onSubmit={handleSearch} className="admin-form">
          <div className="mb-3">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="admin-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
              Search
            </button>
          </div>
        </form>
      </section>

      {searched && results.length === 0 && (
        <p className="admin-muted">No products found.</p>
      )}

      {results.map((row) => {
        const d = draftFor(row);
        const summary = priceSummary(d.price);
        const origin = originNote(row.origin_country);
        return (
          <div key={row.provider_product_id} className="admin-card">
            <strong>{row.title}</strong>
            {row.category ? <div className="admin-muted">{row.category}</div> : null}
            <div className="admin-muted">
              Supplier price {cents(row.cost_cents)}, stock {row.stock}
            </div>
            {origin ? <div className="admin-muted">{origin}</div> : null}

            <div className="mb-3">
              <label className="form-label">Markup %</label>
              <input
                type="number"
                className="form-control"
                value={d.markup}
                onChange={(e) => updateDraft(row.provider_product_id, { markup: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Shipping cents</label>
              <input
                type="number"
                className="form-control"
                value={d.shipping}
                onChange={(e) => updateDraft(row.provider_product_id, { shipping: e.target.value })}
              />
            </div>

            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => workOutPrice(row)}
                disabled={busy}
              >
                Work out price
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => importDraft(row)}
                disabled={busy || (d.price && d.price.blocked)}
              >
                Import as a draft
              </button>
            </div>

            {d.price && (
              <div className={summary.blocked ? 'form-error' : 'admin-muted'}>
                {summary.text}
              </div>
            )}
          </div>
        );
      })}

      {message && (
        <p className="admin-muted" role="status">{message}</p>
      )}
      {error && (
        <p className="form-error" role="alert">{error}</p>
      )}
    </>
  );
}
