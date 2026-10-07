'use client';

import { useCallback, useMemo, useState } from 'react';

import AdminCatalogAddProduct from '@/components/AdminCatalogAddProduct';
import AdminCatalogReprice from '@/components/AdminCatalogReprice';
import AdminCatalogRow from '@/components/AdminCatalogRow';
import AdminSheetPager from '@/components/AdminSheetPager';
import { catalogCsv, inputStyle, send } from '@/lib/catalogShared';
import { DEFAULT_FILTERS, allTicked, clampPage, sheetQueryString, togglePage } from '@/lib/sheetQuery';
import useSheet from '@/lib/useSheet';

// The Store Catalog as a sheet, 100 products at a time (Robert, 2026-10-07:
// all 4,600 at once made it crawl). Searching, filtering and paging happen on
// the backend. Ticks and unsaved edits are kept while you change page or
// filters. Money is shown in dollars; the backend keeps cents.

const number = (value) => Number(value || 0).toLocaleString('en-AU');

export default function AdminCatalogGrid({ initial, facets: initialFacets, suppliers }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, loading, error: loadError, reload, patchRow } = useSheet(filters, initial);
  const [facets, setFacets] = useState(initialFacets);
  const [drafts, setDrafts] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [publishing, setPublishing] = useState(false);
  const [working, setWorking] = useState('');

  const products = data.products;
  const pageIds = useMemo(() => products.map((p) => p.id), [products]);
  const pageTicked = allTicked(selected, pageIds);
  const dirtyCount = Object.keys(drafts).length;

  function change(patch) {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  }

  function goToPage(page) {
    setFilters((f) => ({ ...f, page: clampPage(page, data.total) }));
  }

  // What the filters offer and the totals beside them, after something changes.
  const refreshFacets = useCallback(async () => {
    try {
      setFacets(await send('/api/admin/catalog/facets', 'GET'));
    } catch {
      // The counts stay as they were.
    }
  }, []);

  const afterChange = useCallback(() => {
    reload();
    refreshFacets();
  }, [reload, refreshFacets]);

  const toggle = useCallback((id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function toggleAll() {
    setSelected((current) => togglePage(current, pageIds, !pageTicked));
  }

  // The id of every product the filters match, across all pages.
  async function matchingIds() {
    return send(`/api/admin/catalog/sheet/ids?${sheetQueryString(filters)}`, 'GET');
  }

  async function tickAllMatching() {
    setWorking('Ticking every matching product…');
    setError('');
    try {
      const result = await matchingIds();
      setSelected(new Set(result.ids));
      if (result.truncated) setError(`${number(result.ids.length)} of ${number(result.total)} ticked. Narrow the filters to tick the rest.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking('');
    }
  }

  async function getIds() {
    const result = await matchingIds();
    if (result.truncated) throw new Error('Too many products match. Narrow the filters first.');
    return result.ids;
  }

  // Go live puts the ticked products on the website; Take offline removes them.
  async function publish(published) {
    const ids = [...selected];
    if (ids.length === 0) return;
    setPublishing(true);
    setError('');
    try {
      await send('/api/admin/catalog/publish', 'POST', { product_ids: ids, published });
      setSelected(new Set());
      afterChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  }

  const setDraft = useCallback((id, field, value) => {
    setDrafts((all) => ({ ...all, [id]: { ...(all[id] || {}), [field]: value } }));
  }, []);

  const discard = useCallback((id) => {
    setDrafts((all) => {
      const next = { ...all };
      delete next[id];
      return next;
    });
  }, []);

  const save = useCallback(async (p, d) => {
    const body = {};
    if ('name' in d) body.name = d.name;
    if ('brand' in d) body.brand = d.brand || null;
    if ('category' in d) body.category = d.category || 'Uncategorised';
    if ('supplier_id' in d) body.supplier_id = d.supplier_id || null;
    if ('price' in d && d.price !== '') body.price = Number(d.price);
    if ('cost' in d) body.cost = d.cost === '' ? null : Number(d.cost);
    if ('stock' in d) body.stock = Number(d.stock) || 0;
    for (const size of ['weight_kg', 'length_cm', 'width_cm', 'height_cm']) {
      if (size in d) body[size] = d[size] === '' ? null : Number(d[size]);
    }
    if ('active' in d) body.active = Boolean(d.active);
    setBusyId(p.id);
    setError('');
    try {
      const updated = await send(`/api/admin/catalog/products/${p.id}`, 'PATCH', body);
      patchRow(updated);
      discard(p.id);
      afterChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }, [patchRow, discard, afterChange]);

  const deleteForever = useCallback(async (p) => {
    if (!window.confirm(`Delete ${p.sku} permanently? Its history goes with it, and if a supplier feed still lists this SKU the next pull will create it again.`)) return;
    setBusyId(p.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/catalog/products/${p.id}?permanent=true`, { method: 'DELETE' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to delete this product.');
      afterChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }, [afterChange]);

  // Every product the filters match, not just this page.
  async function exportCsv() {
    setWorking('Preparing the export…');
    setError('');
    try {
      const result = await send(`/api/admin/catalog/sheet?${sheetQueryString(filters, { all: true })}`, 'GET');
      const blob = new Blob([catalogCsv(result.products, result.tiers)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teracom-store-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking('');
    }
  }

  const shownError = error || loadError;

  return (
    <div>
      {shownError && <p className="form-error" role="alert">{shownError}</p>}

      <div className="admin-refresh" style={{ gap: '10px' }}>
        <input type="search" placeholder="Search SKU, name, brand, category, supplier" value={filters.q} onChange={(e) => change({ q: e.target.value })}
          style={{ ...inputStyle, minWidth: '280px', padding: '6px 10px' }} />
        <select value={filters.supplierId} onChange={(e) => change({ supplierId: e.target.value })} aria-label="Supplier">
          <option value="">All suppliers</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => change({ category: e.target.value })} aria-label="Category">
          <option value="">All categories</option>
          {facets.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.live} onChange={(e) => change({ live: e.target.value })} aria-label="On the website">
          <option value="">Live and offline</option>
          <option value="live">Live on the website</option>
          <option value="offline">Offline</option>
        </select>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="checkbox" checked={filters.showInactive} onChange={(e) => change({ showInactive: e.target.checked })} /> show inactive
        </label>
        <label style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <input type="checkbox" checked={filters.thin} onChange={(e) => change({ thin: e.target.checked })} /> thin or negative margin only
        </label>
        <span className="admin-muted">
          {number(data.total)} of {number(facets.total)} products · {number(facets.live)} live{dirtyCount ? ` · ${dirtyCount} unsaved` : ''}{loading ? ' · loading…' : ''}
        </span>
      </div>

      <div className="admin-actions" style={{ margin: '0 0 16px' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => publish(true)} disabled={publishing || selected.size === 0}>
          {publishing ? 'Saving…' : `Go live${selected.size ? ` (${number(selected.size)})` : ''}`}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => publish(false)} disabled={publishing || selected.size === 0}>Take offline</button>
        <AdminCatalogAddProduct suppliers={suppliers} onDone={afterChange} />
        <AdminCatalogReprice suppliers={suppliers} total={data.total} getIds={getIds} onDone={afterChange} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={exportCsv} disabled={data.total === 0 || Boolean(working)}>Export CSV</button>
        {working && <span className="admin-muted">{working}</span>}
      </div>

      {(selected.size > 0 || (pageTicked && data.total > pageIds.length)) && (
        <p className="admin-muted" style={{ margin: '0 0 12px' }}>
          {selected.size > 0 ? `${number(selected.size)} ticked. ` : ''}
          {pageTicked && data.total > pageIds.length && selected.size < data.total && (
            <button type="button" className="admin-link-btn" onClick={tickAllMatching} disabled={Boolean(working)}>Tick all {number(data.total)} matching</button>
          )}
          {selected.size > 0 && (
            <button type="button" className="admin-link-btn" style={{ marginLeft: '12px' }} onClick={() => setSelected(new Set())}>Clear ticks</button>
          )}
        </p>
      )}

      <div className="admin-table-wrap admin-sheet-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
        <table className="admin-table admin-sheet">
          <thead>
            <tr>
              <th><input type="checkbox" checked={pageTicked} onChange={toggleAll} aria-label="Tick every product on this page" /></th>
              <th>Website</th>
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
              {data.tiers.map((t) => <th key={t.key}>{t.label}</th>)}
              <th>Stock</th>
              <th>Weight kg</th>
              <th>L × W × H cm</th>
              <th>Active</th>
              <th>Last imported</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan={18 + data.tiers.length} className="admin-muted">No products match. Import a supplier price list or add one by hand.</td></tr>
            )}
            {products.map((p) => (
              <AdminCatalogRow
                key={p.id}
                p={p}
                tiers={data.tiers}
                suppliers={suppliers}
                draft={drafts[p.id]}
                checked={selected.has(p.id)}
                busy={busyId === p.id}
                onToggle={toggle}
                onDraft={setDraft}
                onSave={save}
                onDiscard={discard}
                onDelete={deleteForever}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AdminSheetPager total={data.total} page={filters.page} onPage={goToPage} loading={loading} />
    </div>
  );
}
