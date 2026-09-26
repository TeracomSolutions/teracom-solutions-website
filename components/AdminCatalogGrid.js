'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime } from '@/lib/adminFormat';

// The Store Catalog as a sheet: every product, every column, edited in
// place. Money is shown in dollars; the backend keeps cents.

const GST = 1.1;

function money(cents) {
  if (cents == null || Number.isNaN(cents)) return '—';
  return `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function dollars(cents) {
  return cents == null ? '' : (cents / 100).toFixed(2);
}

function marginOf(rrpCents, costCents) {
  if (rrpCents == null || costCents == null) return { cents: null, pct: null };
  const exGst = rrpCents / GST;
  const cents = exGst - costCents;
  return { cents, pct: exGst > 0 ? (cents / exGst) * 100 : null };
}

function marginClass(pct) {
  if (pct == null) return 'admin-muted';
  if (pct < 0) return 'admin-margin bad';
  if (pct < 15) return 'admin-margin thin';
  return 'admin-margin good';
}

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const inputStyle = { padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff', font: 'inherit', fontSize: '13px' };

function AddProductForm({ suppliers, onDone }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sku: '', name: '', category: '', brand: '', supplier_id: '', price: '', cost: '', stock: '0', description: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await send('/api/admin/catalog/products', 'POST', {
        sku: form.sku,
        name: form.name,
        category: form.category || 'Uncategorised',
        brand: form.brand || null,
        supplier_id: form.supplier_id || null,
        price: Number(form.price),
        cost: form.cost === '' ? null : Number(form.cost),
        stock: Number(form.stock) || 0,
        description: form.description || null,
      });
      setForm({ sku: '', name: '', category: '', brand: '', supplier_id: '', price: '', cost: '', stock: '0', description: '' });
      setOpen(false);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>Add product</button>;
  }

  return (
    <form onSubmit={submit} className="admin-form admin-card" style={{ maxWidth: 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      <label>SKU<input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)} required /></label>
      <label>Name<input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
      <label>Category<input type="text" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Uncategorised" /></label>
      <label>Brand<input type="text" value={form.brand} onChange={(e) => set('brand', e.target.value)} /></label>
      <label>Supplier
        <select value={form.supplier_id} onChange={(e) => set('supplier_id', e.target.value)}>
          <option value="">—</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
      </label>
      <label>Cost ex GST ($)<input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set('cost', e.target.value)} /></label>
      <label>RRP inc GST ($)<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label>
      <label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></label>
      <label style={{ gridColumn: '1 / -1' }}>Description<input type="text" value={form.description} onChange={(e) => set('description', e.target.value)} /></label>
      {error && <p className="form-error" role="alert" style={{ gridColumn: '1 / -1' }}>{error}</p>}
      <div className="admin-actions" style={{ gridColumn: '1 / -1' }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Adding…' : 'Add product'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

function RepricePanel({ suppliers, visibleIds, onDone }) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState('visible');
  const [supplierId, setSupplierId] = useState('');
  const [markup, setMarkup] = useState('30');
  const [rounding, setRounding] = useState('5');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function body(isPreview) {
    const payload = { markup_percent: Number(markup), round_to_cents: Number(rounding) || 5, preview: isPreview };
    if (scope === 'supplier') payload.supplier_id = supplierId || null;
    else payload.product_ids = visibleIds;
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
      const result = await send('/api/admin/catalog/reprice', 'POST', body(isPreview));
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
          <input type="radio" name="scope" checked={scope === 'visible'} onChange={() => setScope('visible')} style={{ width: 'auto' }} />
          the {visibleIds.length} product{visibleIds.length === 1 ? '' : 's'} shown
        </label>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="radio" name="scope" checked={scope === 'supplier'} onChange={() => setScope('supplier')} style={{ width: 'auto' }} />
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

export default function AdminCatalogGrid({ products, tiers, tierPrices, suppliers }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [category, setCategory] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [onlyThin, setOnlyThin] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (!showInactive && !p.active) return false;
      if (supplierId && p.supplier_id !== supplierId) return false;
      if (category && p.category !== category) return false;
      if (onlyThin) {
        const { pct } = marginOf(p.price_cents, p.cost_cents);
        if (pct == null || pct >= 15) return false;
      }
      if (!needle) return true;
      return [p.sku, p.name, p.brand, p.category, p.supplier].some((v) => v && v.toLowerCase().includes(needle));
    });
  }, [products, q, supplierId, category, showInactive, onlyThin]);

  function draftOf(p) {
    return drafts[p.id] || {};
  }

  function setDraft(p, field, value) {
    setDrafts((d) => ({ ...d, [p.id]: { ...(d[p.id] || {}), [field]: value } }));
  }

  function current(p, field) {
    const d = draftOf(p);
    if (field in d) return d[field];
    if (field === 'price') return dollars(p.price_cents);
    if (field === 'cost') return dollars(p.cost_cents);
    if (field === 'supplier_id') return p.supplier_id || '';
    return p[field] ?? '';
  }

  async function save(p) {
    const d = draftOf(p);
    const body = {};
    if ('name' in d) body.name = d.name;
    if ('brand' in d) body.brand = d.brand || null;
    if ('category' in d) body.category = d.category || 'Uncategorised';
    if ('supplier_id' in d) body.supplier_id = d.supplier_id || null;
    if ('price' in d && d.price !== '') body.price = Number(d.price);
    if ('cost' in d) body.cost = d.cost === '' ? null : Number(d.cost);
    if ('stock' in d) body.stock = Number(d.stock) || 0;
    if ('active' in d) body.active = Boolean(d.active);
    setBusyId(p.id);
    setError('');
    try {
      await send(`/api/admin/catalog/products/${p.id}`, 'PATCH', body);
      setDrafts((all) => {
        const next = { ...all };
        delete next[p.id];
        return next;
      });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteForever(p) {
    if (!window.confirm(`Delete ${p.sku} permanently? Its history goes with it, and if a supplier feed still lists this SKU the next pull will create it again.`)) return;
    setBusyId(p.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/catalog/products/${p.id}?permanent=true`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to delete this product.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function discard(p) {
    setDrafts((all) => {
      const next = { ...all };
      delete next[p.id];
      return next;
    });
  }

  function exportCsv() {
    const header = ['SKU', 'Name', 'Brand', 'Category', 'Supplier', 'Cost ex GST', 'RRP inc GST', 'RRP ex GST', 'Margin $', 'Margin %',
      ...tiers.map((t) => t.label), 'Stock', 'Active', 'Last imported'];
    const lines = rows.map((p) => {
      const { cents, pct } = marginOf(p.price_cents, p.cost_cents);
      const tp = tierPrices[p.id] || {};
      return [p.sku, p.name, p.brand, p.category, p.supplier, dollars(p.cost_cents), dollars(p.price_cents), (p.price_cents / GST / 100).toFixed(2),
        cents == null ? '' : (cents / 100).toFixed(2), pct == null ? '' : pct.toFixed(1),
        ...tiers.map((t) => dollars(tp[t.key])), p.stock, p.active ? 'yes' : 'no', p.last_imported_at || ''].map(csvEscape).join(',');
    });
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teracom-store-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const dirtyCount = Object.keys(drafts).length;

  return (
    <div>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-refresh" style={{ gap: '10px' }}>
        <input type="search" placeholder="Search SKU, name, brand, category, supplier" value={q} onChange={(e) => setQ(e.target.value)}
          style={{ ...inputStyle, minWidth: '280px', padding: '6px 10px' }} />
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} aria-label="Supplier">
          <option value="">All suppliers</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} /> show inactive
        </label>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="checkbox" checked={onlyThin} onChange={(e) => setOnlyThin(e.target.checked)} /> thin or negative margin only
        </label>
        <span className="admin-muted">{rows.length} of {products.length} products{dirtyCount ? ` · ${dirtyCount} unsaved` : ''}</span>
      </div>

      <div className="admin-actions" style={{ margin: '0 0 16px' }}>
        <AddProductForm suppliers={suppliers} onDone={() => router.refresh()} />
        <RepricePanel suppliers={suppliers} visibleIds={rows.map((p) => p.id)} onDone={() => router.refresh()} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={exportCsv} disabled={rows.length === 0}>Export CSV</button>
      </div>

      <div className="admin-table-wrap admin-sheet-wrap">
        <table className="admin-table admin-sheet">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Cost ex GST</th>
              <th>RRP inc GST</th>
              <th>Ex GST</th>
              <th>Margin</th>
              <th>Margin %</th>
              {tiers.map((t) => <th key={t.key}>{t.label}</th>)}
              <th>Stock</th>
              <th>Active</th>
              <th>Last imported</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={14 + tiers.length} className="admin-muted">No products match. Import a supplier price list or add one by hand.</td></tr>
            )}
            {rows.map((p) => {
              const d = draftOf(p);
              const dirty = Object.keys(d).length > 0;
              const priceCents = 'price' in d && d.price !== '' ? Math.round(Number(d.price) * 100) : p.price_cents;
              const costCents = 'cost' in d ? (d.cost === '' ? null : Math.round(Number(d.cost) * 100)) : p.cost_cents;
              const { cents, pct } = marginOf(priceCents, costCents);
              const tp = tierPrices[p.id] || {};
              return (
                <tr key={p.id} className={dirty ? 'is-dirty' : undefined} style={p.active ? undefined : { opacity: 0.55 }}>
                  <td><code>{p.sku}</code></td>
                  <td className="wrap" style={{ minWidth: '220px' }}>
                    <input type="text" value={current(p, 'name')} onChange={(e) => setDraft(p, 'name', e.target.value)} style={{ ...inputStyle, width: '100%' }} aria-label="Name" />
                  </td>
                  <td><input type="text" value={current(p, 'brand')} onChange={(e) => setDraft(p, 'brand', e.target.value)} style={{ ...inputStyle, width: '110px' }} aria-label="Brand" /></td>
                  <td><input type="text" value={current(p, 'category')} onChange={(e) => setDraft(p, 'category', e.target.value)} style={{ ...inputStyle, width: '130px' }} aria-label="Category" /></td>
                  <td>
                    <select value={current(p, 'supplier_id')} onChange={(e) => setDraft(p, 'supplier_id', e.target.value)} style={{ ...inputStyle, width: '150px' }} aria-label="Supplier">
                      <option value="">{p.supplier && !p.supplier_id ? `${p.supplier} (feed)` : '—'}</option>
                      {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
                    </select>
                  </td>
                  <td><input type="number" min="0" step="0.01" value={current(p, 'cost')} onChange={(e) => setDraft(p, 'cost', e.target.value)} style={{ ...inputStyle, width: '90px' }} aria-label="Cost" /></td>
                  <td><input type="number" min="0" step="0.01" value={current(p, 'price')} onChange={(e) => setDraft(p, 'price', e.target.value)} style={{ ...inputStyle, width: '90px' }} aria-label="RRP" /></td>
                  <td>{money(priceCents / GST)}</td>
                  <td className={marginClass(pct)}>{cents == null ? '—' : money(cents)}</td>
                  <td className={marginClass(pct)}>{pct == null ? '—' : `${pct.toFixed(1)}%`}</td>
                  {tiers.map((t) => <td key={t.key}>{money(tp[t.key])}</td>)}
                  <td><input type="number" min="0" step="1" value={current(p, 'stock')} onChange={(e) => setDraft(p, 'stock', e.target.value)} style={{ ...inputStyle, width: '70px' }} aria-label="Stock" /></td>
                  <td><input type="checkbox" checked={'active' in d ? Boolean(d.active) : p.active} onChange={(e) => setDraft(p, 'active', e.target.checked)} aria-label="Active" /></td>
                  <td>{formatDateTime(p.last_imported_at, 'By hand')}</td>
                  <td>
                    {dirty && (
                      <span className="admin-actions">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => save(p)} disabled={busyId === p.id}>{busyId === p.id ? '…' : 'Save'}</button>
                        <button type="button" className="admin-link-btn" onClick={() => discard(p)}>undo</button>
                      </span>
                    )}
                    {!dirty && !p.active && (
                      <button type="button" className="admin-link-btn" style={{ color: '#ff8a8a' }} onClick={() => deleteForever(p)} disabled={busyId === p.id}>Delete permanently</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
