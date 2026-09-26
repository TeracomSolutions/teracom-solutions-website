'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime } from '@/lib/adminFormat';

// The Pricing page: tier defaults, per-supplier overrides, and the whole
// price list priced at every tier. Everything is RRP-based: RRP is what
// the supplier feed says, each tier takes a percentage off it.

function money(cents) {
  if (cents == null) return '—';
  return `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The change was not saved.');
  return data;
}

function TierEditor({ tiers, onSaved }) {
  const [drafts, setDrafts] = useState(() => Object.fromEntries(tiers.map((t) => [t.key, String(t.discount_percent)])));
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState('');

  async function save(tier) {
    const value = Number(drafts[tier.key]);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setError('Enter a percentage between 0 and 100.');
      return;
    }
    setBusyKey(tier.key);
    setError('');
    try {
      await send(`/api/admin/pricing/tiers/${tier.key}`, 'PUT', { discount_percent: value });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: '26px' }}>
      <h2 style={{ marginTop: 0 }}>Tier discounts off RRP</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        The default for every supplier. Customers are matched to a tier by the pricing tier on their account (Silver, Gold or Platinum); customers with no tier pay RRP.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-table-wrap" style={{ marginBottom: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Discount off RRP</th>
              <th>Last changed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.key}>
                <td>{tier.label}</td>
                <td>
                  <span className="admin-actions">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={drafts[tier.key]}
                      onChange={(event) => setDrafts({ ...drafts, [tier.key]: event.target.value })}
                      style={{ width: '90px', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' }}
                      aria-label={`${tier.label} discount percent`}
                    />
                    <span className="admin-muted">%</span>
                  </span>
                </td>
                <td>{formatDateTime(tier.updated_at)}</td>
                <td>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => save(tier)} disabled={busyKey === tier.key || String(tier.discount_percent) === drafts[tier.key]}>
                    {busyKey === tier.key ? 'Saving…' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupplierOverrides({ tiers, suppliers, onSaved }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});

  function draftKey(supplierId, tierKey) {
    return `${supplierId}:${tierKey}`;
  }

  async function save(supplier, tier) {
    const key = draftKey(supplier.supplier_id, tier.key);
    const raw = drafts[key];
    setBusy(key);
    setError('');
    try {
      if (raw === '' || raw === undefined) {
        if (supplier.overrides[tier.key] !== undefined) {
          await send(`/api/admin/pricing/suppliers/${supplier.supplier_id}/tiers/${tier.key}`, 'DELETE');
        }
      } else {
        const value = Number(raw);
        if (!Number.isFinite(value) || value < 0 || value > 100) {
          throw new Error('Enter a percentage between 0 and 100, or clear the box to use the tier default.');
        }
        await send(`/api/admin/pricing/suppliers/${supplier.supplier_id}/tiers/${tier.key}`, 'PUT', { discount_percent: value });
      }
      setDrafts((d) => {
        const next = { ...d };
        delete next[key];
        return next;
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: '26px' }}>
      <h2 style={{ marginTop: 0 }}>Per-supplier overrides</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Leave a box blank to use the tier default above. A number here applies to that supplier&apos;s products only.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-table-wrap" style={{ marginBottom: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Products</th>
              <th>Last import</th>
              {tiers.map((tier) => <th key={tier.key}>{tier.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && (
              <tr><td colSpan={3 + tiers.length} className="admin-muted">No suppliers yet.</td></tr>
            )}
            {suppliers.map((supplier) => (
              <tr key={supplier.supplier_id}>
                <td className="wrap">
                  {supplier.supplier_name}
                  <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{supplier.business_name}</span>
                </td>
                <td>{supplier.product_count}</td>
                <td>{supplier.last_import_at ? formatDateTime(supplier.last_import_at) : <span className="admin-muted">Never</span>}</td>
                {tiers.map((tier) => {
                  const key = draftKey(supplier.supplier_id, tier.key);
                  const current = supplier.overrides[tier.key];
                  const value = drafts[key] !== undefined ? drafts[key] : current !== undefined ? String(current) : '';
                  const dirty = drafts[key] !== undefined;
                  return (
                    <td key={tier.key}>
                      <span className="admin-actions">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          placeholder={`${tier.discount_percent}`}
                          value={value}
                          onChange={(event) => setDrafts({ ...drafts, [key]: event.target.value })}
                          style={{ width: '80px', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' }}
                          aria-label={`${supplier.supplier_name} ${tier.label} override percent`}
                        />
                        {dirty && (
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => save(supplier, tier)} disabled={busy === key}>
                            {busy === key ? '…' : 'Save'}
                          </button>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriceList({ tiers, rows, suppliers }) {
  const [supplierId, setSupplierId] = useState('');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((row) => {
      if (supplierId && row.supplier_id !== supplierId) return false;
      if (!needle) return true;
      return [row.sku, row.name, row.supplier, row.category].some((v) => v && v.toLowerCase().includes(needle));
    });
  }, [rows, supplierId, q]);

  return (
    <div>
      <h2>Price list</h2>
      <div className="admin-refresh">
        <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)} aria-label="Supplier">
          <option value="">All suppliers</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search SKU, name, category"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff', minWidth: '240px' }}
        />
        <span className="admin-muted">{filtered.length} of {rows.length} products</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Supplier</th>
              <th>RRP</th>
              {tiers.map((tier) => <th key={tier.key}>{tier.label}</th>)}
              <th>Cost</th>
              <th>Last imported</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6 + tiers.length} className="admin-muted">No products. Import a supplier price list from Businesses &amp; Suppliers.</td></tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.sku}</td>
                <td className="wrap">{row.name}<span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{row.category}</span></td>
                <td>{row.supplier || '—'}</td>
                <td>{money(row.rrp_cents)}</td>
                {tiers.map((tier) => <td key={tier.key}>{money(row.tier_prices_cents[tier.key])}</td>)}
                <td>{money(row.cost_cents)}</td>
                <td>{formatDateTime(row.last_imported_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPricingManager({ tiers, suppliers, priceList }) {
  const router = useRouter();
  return (
    <div>
      <TierEditor tiers={tiers} onSaved={() => router.refresh()} />
      <SupplierOverrides tiers={tiers} suppliers={suppliers} onSaved={() => router.refresh()} />
      <PriceList tiers={priceList.tiers} rows={priceList.rows} suppliers={suppliers} />
    </div>
  );
}
