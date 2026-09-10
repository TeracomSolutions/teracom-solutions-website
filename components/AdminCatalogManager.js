'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { parseFeed } from '@/lib/feed-importer';
import { formatMoney } from '@/lib/products';

const FEED_TYPES = [
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
];

export default function AdminCatalogManager({ initialProducts, initialTotal }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [feedType, setFeedType] = useState('csv');
  const [feedContent, setFeedContent] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function refreshProducts() {
    const res = await fetch('/api/admin/catalog/products?limit=200');
    if (!res.ok) return;
    const data = await res.json();
    setProducts(data.products || []);
    setTotal(data.total || 0);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setFeedContent(text);

    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.json')) setFeedType('json');
    else if (lowerName.endsWith('.xml')) setFeedType('xml');
    else if (lowerName.endsWith('.csv')) setFeedType('csv');
  }

  async function handleImport(e) {
    e.preventDefault();
    setError('');
    setSummary(null);

    let rows;
    try {
      rows = parseFeed(feedContent, feedType);
    } catch (err) {
      setError(`Could not parse feed: ${err.message || err}`);
      return;
    }

    if (!rows.length) {
      setError('No rows found in the pasted/uploaded feed.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/catalog/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Import failed.');
        return;
      }

      setSummary(data);
      await refreshProducts();
    } catch {
      setError('Unable to reach the catalog service.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <button type="button" className="btn btn-secondary" onClick={handleLogout} style={{ marginBottom: '24px' }}>
        Sign out
      </button>

      <form onSubmit={handleImport} style={{ marginBottom: '40px' }}>
        <h2>Import Supplier Feed</h2>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="feed-type">Feed type</label>
          <select
            id="feed-type"
            value={feedType}
            onChange={(e) => setFeedType(e.target.value)}
            style={{ display: 'block' }}
          >
            {FEED_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="feed-file">Upload a file (optional)</label>
          <input id="feed-file" type="file" accept=".csv,.json,.xml,text/plain" onChange={handleFileChange} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="feed-content">Or paste feed content</label>
          <textarea
            id="feed-content"
            rows={10}
            value={feedContent}
            onChange={(e) => setFeedContent(e.target.value)}
            style={{ display: 'block', width: '100%', fontFamily: 'monospace' }}
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {summary && (
          <p className="form-note" role="status">
            Import complete: {summary.created} created, {summary.updated} updated ({summary.total} rows).
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={submitting || !feedContent.trim()}>
          {submitting ? 'Importing…' : 'Import Feed'}
        </button>
      </form>

      <h2>Current Products ({total})</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Supplier</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatMoney(p.price_cents)}</td>
                <td>{p.stock}</td>
                <td>{p.supplier || '—'}</td>
                <td>{p.active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7}>No products yet. Import a supplier feed above to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
