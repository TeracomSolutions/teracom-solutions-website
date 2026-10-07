'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminPriceList from '@/components/AdminPriceList';
import { formatDateTime } from '@/lib/adminFormat';

// The Pricing page: tier markups, per-supplier overrides, and the whole
// price list priced at every tier. Everything is cost-based (Robert,
// 2026-10-03): a tier price is our cost ex GST plus that tier's markup,
// plus GST, to the nearest 5 cents, and never more than the RRP.

const inputStyle = { padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' };

function money(cents) {
  if (cents == null) return '—';
  return `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function percentText(value) {
  return value == null ? '' : String(value);
}

// What a $100 (ex GST) cost sells for at this markup, inc GST.
function exampleCents(markup) {
  if (markup === '' || markup == null || !Number.isFinite(Number(markup))) return null;
  return Math.round((10000 * (100 + Number(markup)) / 100 * 1.1) / 5) * 5;
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
  const [drafts, setDrafts] = useState(() => Object.fromEntries(tiers.map((t) => [t.key, percentText(t.markup_percent)])));
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState('');

  async function save(tier) {
    const raw = drafts[tier.key];
    setBusyKey(tier.key);
    setError('');
    try {
      if (raw === '') {
        await send(`/api/admin/pricing/tiers/${tier.key}`, 'PUT', { clear_markup: true });
      } else {
        const value = Number(raw);
        if (!Number.isFinite(value) || value < 0 || value > 1000) {
          throw new Error('Enter a markup between 0 and 1000 per cent, or clear the box to charge RRP.');
        }
        await send(`/api/admin/pricing/tiers/${tier.key}`, 'PUT', { markup_percent: value });
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: '26px' }}>
      <h2 style={{ marginTop: 0 }}>Markup on cost by tier</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Price = our cost ex GST plus the markup, plus GST, to the nearest 5 cents. It never goes above RRP: where the markup would, the customer pays RRP. Products without a cost sell at RRP.
        Member is any signed-in customer without a Silver, Gold or Platinum tier on their account. Visitors who are not signed in see RRP.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-table-wrap" style={{ marginBottom: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Markup on cost</th>
              <th>$100 cost sells for</th>
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
                      max="1000"
                      step="0.5"
                      placeholder="RRP"
                      value={drafts[tier.key]}
                      onChange={(event) => setDrafts({ ...drafts, [tier.key]: event.target.value })}
                      style={{ ...inputStyle, width: '90px' }}
                      aria-label={`${tier.label} markup percent`}
                    />
                    <span className="admin-muted">%</span>
                  </span>
                </td>
                <td>{exampleCents(drafts[tier.key]) == null ? <span className="admin-muted">RRP</span> : `${money(exampleCents(drafts[tier.key]))} inc GST`}</td>
                <td>{formatDateTime(tier.updated_at)}</td>
                <td>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => save(tier)} disabled={busyKey === tier.key || percentText(tier.markup_percent) === drafts[tier.key]}>
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
        if (!Number.isFinite(value) || value < 0 || value > 1000) {
          throw new Error('Enter a markup between 0 and 1000 per cent, or clear the box to use the tier markup.');
        }
        await send(`/api/admin/pricing/suppliers/${supplier.supplier_id}/tiers/${tier.key}`, 'PUT', { markup_percent: value });
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
      <h2 style={{ marginTop: 0 }}>Per-supplier markups</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Leave a box blank to use the tier markup above. A number here applies to that supplier&apos;s products only.
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
                <td className="wrap">{supplier.supplier_name}</td>
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
                          max="1000"
                          step="0.5"
                          placeholder={tier.markup_percent == null ? 'RRP' : `${tier.markup_percent}`}
                          value={value}
                          onChange={(event) => setDrafts({ ...drafts, [key]: event.target.value })}
                          style={{ ...inputStyle, width: '80px' }}
                          aria-label={`${supplier.supplier_name} ${tier.label} markup percent`}
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

export default function AdminPricingManager({ tiers, suppliers, priceList, facets }) {
  const router = useRouter();
  // Counts up when a markup is saved, so the price list works its prices out again.
  const [listVersion, setListVersion] = useState(0);
  function saved() {
    router.refresh();
    setListVersion((v) => v + 1);
  }
  return (
    <div>
      <TierEditor tiers={tiers} onSaved={saved} />
      <SupplierOverrides tiers={tiers} suppliers={suppliers} onSaved={saved} />
      <AdminPriceList initial={priceList} facets={facets} suppliers={suppliers} reloadKey={listVersion} />
    </div>
  );
}
