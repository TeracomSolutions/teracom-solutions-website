'use client';

import { useMemo, useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';

// The Pricing page's price list (Robert, 2026-10-04): one slim line per
// product, every column sortable by clicking its heading, and filters for
// supplier, category, live on the website, and a search box.

const inputStyle = { padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' };
const cell = { padding: '5px 10px', fontSize: '13px', whiteSpace: 'nowrap', verticalAlign: 'middle' };
const productCell = { ...cell, maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis' };
const headButton = {
  background: 'none',
  border: 0,
  padding: 0,
  color: 'inherit',
  font: 'inherit',
  letterSpacing: 'inherit',
  textTransform: 'inherit',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

function money(cents) {
  if (cents == null) return '—';
  return `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// How each column sorts: text alphabetically, money and dates by value.
function sortValue(row, key) {
  if (key.startsWith('tier:')) return row.tier_prices_cents[key.slice(5)] ?? null;
  if (key === 'published') return row.published ? 1 : 0;
  if (key === 'last_imported_at') return row.last_imported_at ? new Date(row.last_imported_at).getTime() : null;
  return row[key] ?? null;
}

function compare(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'en-AU', { numeric: true, sensitivity: 'base' });
}

export default function AdminPriceList({ tiers, rows, suppliers }) {
  const [supplierId, setSupplierId] = useState('');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);
  const [sort, setSort] = useState({ key: 'name', dir: 1 });

  const categories = useMemo(() => [...new Set(rows.map((row) => row.category).filter(Boolean))].sort(), [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (supplierId && row.supplier_id !== supplierId) return false;
      if (category && row.category !== category) return false;
      if (liveOnly && !row.published) return false;
      if (!needle) return true;
      return [row.sku, row.name, row.supplier, row.category].some((v) => v && v.toLowerCase().includes(needle));
    });
    // Empty values always go last, whichever way the column is sorted.
    return filtered.sort((a, b) => {
      const va = sortValue(a, sort.key);
      const vb = sortValue(b, sort.key);
      if (va === null || vb === null) return compare(va, vb);
      return compare(va, vb) * sort.dir;
    });
  }, [rows, supplierId, category, q, liveOnly, sort]);

  function sortBy(key) {
    setSort((current) => (current.key === key ? { key, dir: -current.dir } : { key, dir: 1 }));
  }

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'published', label: 'Website' },
    { key: 'cost_cents', label: 'Cost ex GST' },
    { key: 'rrp_cents', label: 'RRP' },
    ...tiers.map((tier) => ({ key: `tier:${tier.key}`, label: tier.label })),
    { key: 'last_imported_at', label: 'Last imported' },
  ];

  return (
    <div>
      <h2>Price list</h2>
      <div className="admin-refresh">
        <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)} aria-label="Supplier">
          <option value="">All suppliers</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search SKU, name, category"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          style={{ ...inputStyle, minWidth: '240px' }}
        />
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="checkbox" checked={liveOnly} onChange={(event) => setLiveOnly(event.target.checked)} /> live on the website only
        </label>
        <span className="admin-muted">{shown.length} of {rows.length} products · click a heading to sort</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={cell} aria-sort={sort.key === column.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" style={headButton} onClick={() => sortBy(column.key)}>
                    {column.label}
                    {sort.key === column.key ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr><td colSpan={columns.length} className="admin-muted" style={cell}>No products match. Import a supplier price list from Data Feeds.</td></tr>
            )}
            {shown.map((row) => (
              <tr key={row.id}>
                <td style={cell}>{row.sku}</td>
                <td style={productCell} title={row.name}>{row.name}</td>
                <td style={cell}>{row.category}</td>
                <td style={cell}>{row.supplier || '—'}</td>
                <td style={cell}>{row.published ? 'Live' : <span className="admin-muted">Offline</span>}</td>
                <td style={cell}>{money(row.cost_cents)}</td>
                <td style={cell}>{money(row.rrp_cents)}</td>
                {tiers.map((tier) => <td key={tier.key} style={cell}>{money(row.tier_prices_cents[tier.key])}</td>)}
                <td style={cell}>{formatDateTime(row.last_imported_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}