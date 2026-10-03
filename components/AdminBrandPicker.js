'use client';

import { useEffect, useMemo, useState } from 'react';

// Choose which brands to import from one price list (Robert, 2026-10-03):
// a distributor file can hold fifty brands when we sell four. The ticked
// brands are imported and, with Remember ticked, become the supplier's
// rule for every later import, by hand or from an automatic feed.
export default function AdminBrandPicker({ uploadId, supplierName, onCancel, onDone }) {
  const [data, setData] = useState(null);
  const [chosen, setChosen] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/uploads/${uploadId}/brands`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || 'Could not read the brands in this file.');
        return body;
      })
      .then((body) => {
        if (cancelled) return;
        setData(body);
        // Start from the saved rule, matching names without case.
        const ruleKeys = new Set((body.rule || []).map((r) => r.toLowerCase()));
        setChosen(new Set((body.brands || []).filter((b) => ruleKeys.has(b.brand.toLowerCase())).map((b) => b.brand)));
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [uploadId]);

  const brands = useMemo(() => data?.brands || [], [data]);
  const shown = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return needle ? brands.filter((b) => b.brand.toLowerCase().includes(needle)) : brands;
  }, [brands, filter]);
  const chosenProducts = brands.filter((b) => chosen.has(b.brand)).reduce((sum, b) => sum + b.products, 0);

  function toggle(brand) {
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }

  function setAll(on) {
    setChosen((current) => {
      const next = new Set(current);
      shown.forEach((b) => (on ? next.add(b.brand) : next.delete(b.brand)));
      return next;
    });
  }

  async function importChosen() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/uploads/${uploadId}/import-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: [...chosen], saveRule: remember }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The import failed.');
      onDone(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card admin-brand-picker">
      <h3>Choose the brands to import</h3>
      {!data && !error && <p className="admin-muted">Reading the file…</p>}
      {data && (
        <>
          <p className="admin-muted">
            This file has {data.total} products from {brands.length} brand{brands.length === 1 ? '' : 's'}. Tick the ones to bring into the store.
          </p>
          {brands.length > 8 && (
            <input
              type="search"
              className="admin-brand-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Find a brand"
            />
          )}
          <div className="admin-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAll(true)}>Tick all shown</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAll(false)}>Untick all shown</button>
          </div>
          <ul className="admin-brand-list">
            {shown.map((b) => (
              <li key={b.brand}>
                <label>
                  <input type="checkbox" checked={chosen.has(b.brand)} onChange={() => toggle(b.brand)} />
                  <span>{b.brand}</span>
                  <span className="admin-muted">{b.products}</span>
                  {b.hasPage === false && b.brand !== '(no brand)' ? (
                    <span className="admin-muted" style={{ fontSize: '12px', color: '#ffcc66' }}>no brand page yet</span>
                  ) : null}
                </label>
              </li>
            ))}
          </ul>
          {brands.some((b) => b.hasPage === false && b.brand !== '(no brand)') && (
            <p className="admin-muted" style={{ fontSize: '13px' }}>
              Brands marked <em>no brand page yet</em> are not in the website&apos;s Brands section. Their products still sell; ask for a brand page to be made for any you import.
            </p>
          )}
          <label className="admin-brand-remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember these brands: every later import from {supplierName || 'this supplier'} takes only these
          </label>
        </>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={importChosen} disabled={busy || !data || chosen.size === 0}>
          {busy ? 'Importing…' : `Import ${chosen.size} brand${chosen.size === 1 ? '' : 's'} (${chosenProducts} products)`}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </div>
  );
}