'use client';

import { useEffect, useMemo, useState } from 'react';

// Cap at RRP (Robert, 28 November 2026): prices follow the markup even above the supplier's RRP, except for the
// brands and supplier feeds ticked here. Nothing is capped until something is ticked.
export default function AdminRrpCap() {
  const [data, setData] = useState(null);
  const [brands, setBrands] = useState(new Set());
  const [feeds, setFeeds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function take(d) {
    setData(d);
    setBrands(new Set(d.brands || []));
    setFeeds(new Set(d.supplier_ids || []));
  }

  useEffect(() => {
    fetch('/api/admin/pricing/rrp-cap').then((r) => r.json()).then(take).catch(() => setError('Could not load Cap at RRP.'));
  }, []);

  const shownBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.brand_choices || []).filter((b) => !q || b.key.includes(q) || brands.has(b.key));
  }, [data, search, brands]);

  const changed = data && (
    [...brands].sort().join('|') !== [...(data.brands || [])].sort().join('|')
    || [...feeds].sort().join('|') !== [...(data.supplier_ids || [])].sort().join('|')
  );

  function flip(set, setter, key) {
    const next = new Set(set);
    if (next.has(key)) next.delete(key); else next.add(key);
    setter(next);
    setNote('');
  }

  async function save() {
    setBusy(true);
    setNote('');
    setError('');
    try {
      const res = await fetch('/api/admin/pricing/rrp-cap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: [...brands], supplier_ids: [...feeds] }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || out.detail || 'Cap at RRP was not saved.');
      take(out);
      setNote('Saved. Press Make prices live now at the top of this page to put the capped prices on the website straight away.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!data) return error ? <section className="admin-card"><p className="form-error">{error}</p></section> : null;
  const count = brands.size + feeds.size;
  return (
    <section className="admin-card">
      <h2>Cap at RRP</h2>
      <p className="lead">Prices follow the markup, even when that is above the supplier&apos;s RRP. Tick a brand or a supplier feed to cap its prices at the RRP instead (never below cost plus GST). Nothing is capped until you tick it.</p>
      <p><span className={'admin-status admin-status-' + (count ? 'ok' : 'muted')}>{count ? `${brands.size} brand${brands.size === 1 ? '' : 's'} and ${feeds.size} feed${feeds.size === 1 ? '' : 's'} capped` : 'Nothing capped'}</span></p>

      <h3>Supplier feeds</h3>
      <div className="rrp-cap-list">
        {(data.supplier_choices || []).map((s) => (
          <label key={s.id} className="admin-check">
            <input type="checkbox" checked={feeds.has(s.id)} disabled={busy} onChange={() => flip(feeds, setFeeds, s.id)} />
            {s.name} <span className="admin-muted">({s.products} live)</span>
          </label>
        ))}
      </div>

      <h3>Brands</h3>
      <input type="search" placeholder="Find a brand" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Find a brand" style={{ maxWidth: '18rem' }} />
      <div className="rrp-cap-list">
        {shownBrands.map((b) => (
          <label key={b.key} className="admin-check">
            <input type="checkbox" checked={brands.has(b.key)} disabled={busy} onChange={() => flip(brands, setBrands, b.key)} />
            {b.name} <span className="admin-muted">({b.products} live)</span>
          </label>
        ))}
      </div>

      <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={busy || !changed}>{busy ? 'Saving…' : 'Save Cap at RRP'}</button>
      {note ? <p className="form-note-banner" role="status">{note}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </section>
  );
}
