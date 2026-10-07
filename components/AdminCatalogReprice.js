'use client';

import { useState } from 'react';

import { money, send } from '@/lib/catalogShared';

// Re-price from cost: RRP = Cost x (1 + markup) x 1.1 (GST), rounded. Applies
// to every product the filters match (their ids are fetched when you press
// Preview or Apply, not before) or to one supplier.

export default function AdminCatalogReprice({ suppliers, total, getIds, onDone }) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState('visible');
  const [supplierId, setSupplierId] = useState('');
  const [markup, setMarkup] = useState('30');
  const [rounding, setRounding] = useState('5');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function body(isPreview) {
    const payload = { markup_percent: Number(markup), round_to_cents: Number(rounding) || 5, preview: isPreview };
    if (scope === 'supplier') payload.supplier_id = supplierId || null;
    else payload.product_ids = await getIds();
    return payload;
  }

  async function run(isPreview) {
    if (scope === 'supplier' && !supplierId) {
      setError('Choose a supplier.');
      return;
    }
    if (!isPreview && !window.confirm(`Re-price ${preview ? preview.updated : 'the matching'} product(s) at ${markup}% markup on cost? This changes RRP now.`)) return;
    setBusy(true);
    setError('');
    try {
      const result = await send('/api/admin/catalog/reprice', 'POST', await body(isPreview));
      if (isPreview) {
        setPreview(result);
      } else {
        setPreview(null);
        setOpen(false);
        onDone();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(true)}>Re-price from cost…</button>;
  }

  return (
    <div className="admin-card admin-form" style={{ maxWidth: 'none' }}>
      <h3 style={{ margin: 0 }}>Re-price from cost</h3>
      <p className="admin-muted" style={{ margin: 0 }}>RRP = Cost × (1 + markup) × 1.1 GST, rounded. Products without a cost are skipped. Preview first.</p>
      <div className="admin-actions">
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="radio" name="scope" checked={scope === 'visible'} onChange={() => { setScope('visible'); setPreview(null); }} style={{ width: 'auto' }} />
          the {total.toLocaleString('en-AU')} product{total === 1 ? '' : 's'} matching the filters
        </label>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="radio" name="scope" checked={scope === 'supplier'} onChange={() => { setScope('supplier'); setPreview(null); }} style={{ width: 'auto' }} />
          one supplier
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} disabled={scope !== 'supplier'} style={{ width: 'auto' }}>
            <option value="">choose…</option>
            {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
          </select>
        </label>
      </div>
      <div className="admin-actions">
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>Markup on cost
          <input type="number" step="0.5" value={markup} onChange={(e) => { setMarkup(e.target.value); setPreview(null); }} style={{ width: '90px' }} /> %
        </label>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>Round to
          <select value={rounding} onChange={(e) => { setRounding(e.target.value); setPreview(null); }} style={{ width: 'auto' }}>
            <option value="1">the cent</option>
            <option value="5">5 cents</option>
            <option value="10">10 cents</option>
            <option value="50">50 cents</option>
            <option value="100">the dollar</option>
          </select>
        </label>
      </div>
      {preview && (
        <div className="admin-muted" style={{ fontSize: '13px' }}>
          {preview.matched} matched, <strong style={{ color: '#fff' }}>{preview.updated} would change</strong>, {preview.skipped_no_cost} skipped (no cost).
          {preview.examples.length > 0 && (
            <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
              {preview.examples.map((ex) => (
                <li key={ex.sku}>{ex.sku}: cost {money(ex.cost_cents)} → RRP {money(ex.before_cents)} becomes {money(ex.after_cents)}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => run(true)} disabled={busy}>Preview</button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => run(false)} disabled={busy || !preview || preview.updated === 0}>Apply</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setOpen(false); setPreview(null); }}>Close</button>
      </div>
    </div>
  );
}
