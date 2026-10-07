'use client';

import { useEffect, useState } from 'react';

import AdminSheetPager from '@/components/AdminSheetPager';
import { formatDateTime } from '@/lib/adminFormat';
import { money } from '@/lib/catalogShared';
import { DEFAULT_FILTERS, clampPage, nextSort } from '@/lib/sheetQuery';
import useSheet from '@/lib/useSheet';

// The Pricing page's price list (Robert, 2026-10-04): one slim line per
// product, every column sortable by clicking its heading, and filters for
// supplier, category, live on the website, and a search box. It loads 100
// products at a time and the backend does the filtering and sorting
// (Robert, 2026-10-07). reloadKey changes when a tier or supplier markup is
// saved, so the prices shown are worked out again.

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

const number = (value) => Number(value || 0).toLocaleString('en-AU');

export default function AdminPriceList({ initial, facets, suppliers, reloadKey }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, loading, error, reload } = useSheet(filters, initial);

  useEffect(() => {
    if (reloadKey) reload();
  }, [reloadKey, reload]);

  function change(patch) {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  }

  function sortBy(key) {
    setFilters((f) => ({ ...f, ...nextSort(f, key), page: 1 }));
  }

  const tiers = data.tiers;
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
        <select value={filters.supplierId} onChange={(event) => change({ supplierId: event.target.value })} aria-label="Supplier">
          <option value="">All suppliers</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
        <select value={filters.category} onChange={(event) => change({ category: event.target.value })} aria-label="Category">
          <option value="">All categories</option>
          {facets.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search SKU, name, category"
          value={filters.q}
          onChange={(event) => change({ q: event.target.value })}
          style={{ ...inputStyle, minWidth: '240px' }}
        />
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="checkbox" checked={filters.live === 'live'} onChange={(event) => change({ live: event.target.checked ? 'live' : '' })} /> live on the website only
        </label>
        <span className="admin-muted">{number(data.total)} products · click a heading to sort{loading ? ' · loading…' : ''}</span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={cell} aria-sort={filters.sort === column.key ? (filters.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" style={headButton} onClick={() => sortBy(column.key)}>
                    {column.label}
                    {filters.sort === column.key ? (filters.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.products.length === 0 && (
              <tr><td colSpan={columns.length} className="admin-muted" style={cell}>No products match. Import a supplier price list from Data Feeds.</td></tr>
            )}
            {data.products.map((row) => (
              <tr key={row.id}>
                <td style={cell}>{row.sku}</td>
                <td style={productCell} title={row.name}>{row.name}</td>
                <td style={cell}>{row.category}</td>
                <td style={cell}>{row.supplier || '—'}</td>
                <td style={cell}>{row.published ? 'Live' : <span className="admin-muted">Offline</span>}</td>
                <td style={cell}>{money(row.cost_cents)}</td>
                <td style={cell}>{money(row.price_cents)}</td>
                {tiers.map((tier) => <td key={tier.key} style={cell}>{money(row.tier_prices_cents[tier.key])}</td>)}
                <td style={cell}>{formatDateTime(row.last_imported_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminSheetPager total={data.total} page={filters.page} onPage={(page) => setFilters((f) => ({ ...f, page: clampPage(page, data.total) }))} loading={loading} />
    </div>
  );
}