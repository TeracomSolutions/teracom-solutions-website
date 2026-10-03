'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Where each of a supplier's categories goes in the store (Robert,
// 2026-10-03): shopping by category has to list the imported products, and
// every supplier names its categories its own way. Each one is filed under
// a store category once; every later import follows it. Until someone
// chooses, a guess from the category's words is used.
export default function AdminCategoryMapping({ supplierId, storeCategories, categories }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const unlisted = categories.filter((c) => c.store_category === 'Uncategorised').reduce((sum, c) => sum + c.products, 0);

  async function choose(category, value) {
    setBusy(category.source_category);
    setError('');
    try {
      const response = await fetch(`/api/admin/suppliers/${supplierId}/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCategory: category.source_category, storeCategory: value || null }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The category was not saved.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  if (categories.length === 0) {
    return <p className="admin-muted">No products imported from this supplier yet. Its categories appear here after the first import.</p>;
  }

  return (
    <div>
      <p className="admin-muted">
        Each of this supplier&apos;s categories, and the store category its products are listed under on the website.
        <em> Guess</em> means nobody has chosen yet; pick one to confirm it, and every later import keeps to it.
        {unlisted > 0 ? ` ${unlisted} product${unlisted === 1 ? ' is' : 's are'} in no store category, so ${unlisted === 1 ? 'it' : 'they'} only show${unlisted === 1 ? 's' : ''} on ${unlisted === 1 ? 'its' : 'their'} own page and in search.` : ''}
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Supplier category</th>
              <th>Products</th>
              <th>Store category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const value = category.store_category === 'Uncategorised' ? '' : category.store_category;
              return (
                <tr key={category.source_category}>
                  <td className="wrap">{category.source_category}</td>
                  <td>{category.products}</td>
                  <td>
                    <select
                      value={value}
                      onChange={(event) => choose(category, event.target.value)}
                      disabled={busy === category.source_category}
                      aria-label={`Store category for ${category.source_category}`}
                    >
                      <option value="">Not in a store category</option>
                      {storeCategories.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </td>
                  <td>
                    {busy === category.source_category ? <span className="admin-muted">Saving…</span> : category.set_by_staff ? 'Chosen' : <span className="admin-muted">Guess</span>}
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