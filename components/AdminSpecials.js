'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BadgePercent, Mail, Megaphone, Search, Trash2 } from 'lucide-react';

// Store > Specials (Robert, 2026-11-02): put a product on hot special or clearance
// with one price everybody pays, and optionally an end date. Clearance may go below
// cost; a hot special may not (the backend refuses it). Live within five minutes.
const money = (cents) => (cents == null ? '--' : '$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const toCents = (dollars) => Math.round(Number.parseFloat(String(dollars).replace(/[$,\s]/g, '')) * 100);
const STATUS = { live: 'On the website', ended: 'Ended', offline: 'Product offline' };

// The end of the chosen day in Melbourne time (daylight saving or not), as an ISO date-time.
function endOfDay(date) {
  if (!date) return null;
  const name = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne', timeZoneName: 'shortOffset' })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((part) => part.type === 'timeZoneName')?.value || 'GMT+10';
  const hours = Number.parseInt(name.replace('GMT', ''), 10) || 10;
  return `${date}T23:59:00+${String(hours).padStart(2, '0')}:00`;
}

function dayOf(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
}

export default function AdminSpecials({ initial }) {
  const [promos, setPromos] = useState(initial);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kind: 'special', price: '', ends: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const search = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/catalog/products?q=${encodeURIComponent(query.trim())}&limit=20&include_inactive=false`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The search failed.');
      setResults(data.products || []);
      if (!(data.products || []).length) setMessage('No products match that search.');
      else setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const startEdit = (product, existing) => {
    setEditing({
      id: existing ? existing.product_id : product.id,
      sku: existing ? existing.sku : product.sku,
      name: existing ? existing.name : product.name,
      normal: existing ? existing.normal_price_cents : product.price_cents,
      costIncGst: existing ? existing.cost_inc_gst_cents : product.cost_cents ? Math.round(product.cost_cents * 1.1) : null,
      published: existing ? existing.published : product.published,
    });
    setForm(
      existing
        ? { kind: existing.kind, price: (existing.price_cents / 100).toFixed(2), ends: dayOf(existing.ends_at) }
        : { kind: 'special', price: '', ends: '' },
    );
    setError('');
    setMessage('');
  };

  const priceCents = toCents(form.price);
  const belowCost = editing && editing.costIncGst && priceCents > 0 && priceCents < editing.costIncGst;

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/specials/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: form.kind, price_cents: priceCents, ends_at: endOfDay(form.ends) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The special could not be saved.');
      setPromos((current) => [data, ...current.filter((p) => p.product_id !== data.product_id)]);
      setMessage(`${data.name} is on ${data.kind_label.toLowerCase()} at ${money(data.price_cents)}.${data.published ? ' It shows on the website within five minutes.' : ' Put the product live on the Catalog page for it to show.'}`);
      setEditing(null);
      setResults([]);
      setQuery('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (promo) => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/specials/${promo.product_id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'The special could not be removed.');
      setPromos((current) => current.filter((p) => p.product_id !== promo.product_id));
      setMessage(`${promo.name} is back to its normal price.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-specials">
      {message ? <p className="form-note" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <section className="admin-card">
        <h2>Add a product</h2>
        <form className="admin-specials-search" onSubmit={search}>
          <label htmlFor="specials-search">Find a product by name, SKU or brand</label>
          <div>
            <input id="specials-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 65 inch screen, or a SKU" />
            <button type="submit" className="btn btn-secondary" disabled={searching}>
              <Search size={16} strokeWidth={2} aria-hidden="true" /> {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        {results.length ? (
          <ul className="admin-specials-results">
            {results.map((p) => (
              <li key={p.id}>
                <span>
                  <strong>{p.name}</strong> <span className="admin-muted">{p.sku} · {money(p.price_cents)} RRP{p.cost_cents ? ` · cost ${money(Math.round(p.cost_cents * 1.1))} inc GST` : ''}{p.published ? '' : ' · offline'}</span>
                </span>
                <button type="button" className="btn btn-secondary" onClick={() => startEdit(p, promos.find((x) => x.product_id === p.id))}>
                  <BadgePercent size={16} strokeWidth={2} aria-hidden="true" /> Put on special
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {editing ? (
        <section className="admin-card admin-specials-form">
          <h2>{editing.name}</h2>
          <p className="admin-muted">
            {editing.sku} · normal price {money(editing.normal)}
            {editing.costIncGst ? ` · cost ${money(editing.costIncGst)} inc GST` : ' · no cost recorded'}
          </p>
          <div className="admin-specials-fields">
            <div className="field">
              <label htmlFor="special-kind">Type</label>
              <select id="special-kind" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                <option value="special">Hot special</option>
                <option value="clearance">Clearance</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="special-price">Special price, inc GST ($)</label>
              <input id="special-price" type="text" inputMode="decimal" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 899.00" />
            </div>
            <div className="field">
              <label htmlFor="special-ends">Ends (optional)</label>
              <input id="special-ends" type="date" value={form.ends} onChange={(e) => setForm({ ...form, ends: e.target.value })} />
            </div>
          </div>
          {priceCents > 0 && editing.normal ? (
            <p className="admin-muted">
              {priceCents < editing.normal ? `Saving ${money(editing.normal - priceCents)} (${Math.round(((editing.normal - priceCents) / editing.normal) * 100)}% off).` : 'This is not lower than the normal price, so no saving will be shown.'}
            </p>
          ) : null}
          {belowCost ? (
            <p className={form.kind === 'clearance' ? 'form-note-banner' : 'form-error'} role="status">
              {form.kind === 'clearance'
                ? `Below cost: this loses ${money(editing.costIncGst - priceCents)} on each one sold. Fine for clearing old stock.`
                : 'A hot special cannot go below cost. Change the type to Clearance to sell it below cost.'}
            </p>
          ) : null}
          <p className="admin-muted">Every customer pays this price, members and trade tiers included, unless their own price is already lower. With an end date the product goes back to its normal price after that day.</p>
          <div className="admin-specials-actions">
            <button type="button" className="btn btn-primary" onClick={save} disabled={busy || !(priceCents > 0) || (belowCost && form.kind !== 'clearance')}>
              Save special
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </section>
      ) : null}

      <section className="admin-card">
        <h2>Specials and clearance ({promos.length})</h2>
        {promos.some((p) => p.status === 'live') ? (
          <p>
            <Link className="btn btn-secondary" href="/admin/social?specials=email" title="Write an email listing every special on the website, for trade customers">
              <Mail size={16} strokeWidth={2} aria-hidden="true" /> Email trade customers
            </Link>
          </p>
        ) : null}
        {promos.length ? (
          <div className="coupon-admin-table-wrap">
            <table className="coupon-admin-table">
              <thead>
                <tr><th>Product</th><th>Type</th><th>Special</th><th>Normal</th><th>Margin</th><th>Ends</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {promos.map((p) => (
                  <tr key={p.product_id}>
                    <td><strong>{p.name}</strong><br /><span className="admin-muted">{p.sku} · stock {p.stock}</span></td>
                    <td>{p.kind_label}</td>
                    <td>{money(p.price_cents)}</td>
                    <td>{money(p.normal_price_cents)}</td>
                    <td className={p.below_cost ? 'admin-specials-loss' : undefined}>{p.margin_percent == null ? '--' : `${p.margin_percent}%`}</td>
                    <td>{p.ends_at ? new Date(p.ends_at).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne' }) : 'No end date'}</td>
                    <td>{STATUS[p.status] || p.status}</td>
                    <td className="admin-specials-row-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => startEdit(null, p)}>Change</button>
                      {p.status === 'live' ? (
                        <Link className="btn btn-secondary" href={`/admin/social?special=${encodeURIComponent(p.product_id)}`} title="Write a social post and customer email for this special">
                          <Megaphone size={16} strokeWidth={2} aria-hidden="true" /> Post it
                        </Link>
                      ) : null}
                      <button type="button" className="btn btn-secondary" aria-label={`Remove the special on ${p.name}`} onClick={() => remove(p)} disabled={busy}>
                        <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-muted">Nothing on special yet. Find a product above to start.</p>
        )}
      </section>
    </div>
  );
}
