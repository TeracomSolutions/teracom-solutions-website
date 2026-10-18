'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { describePreview, dollars } from '@/lib/productMerge';

export default function AdminProductMerge({ groups, history }) {
  if (!groups || groups.length === 0) {
    return (
      <div className="admin-card">
        <p>No duplicate products found.</p>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <Group key={group.identity} group={group} />
      ))}

      {history && history.length > 0 && (
        <div className="admin-card">
          <h3 className="admin-heading">Merged so far</h3>
          <ul className="admin-muted">
            {history.map((entry) => (
              <li key={entry.id}>
                {entry.kept_sku} kept, {entry.merged_sku} merged in ({new Date(entry.created_at).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function Group({ group }) {
  const router = useRouter();
  const [keepId, setKeepId] = useState(group.suggested_keep_id);
  const [previewResult, setPreviewResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [merged, setMerged] = useState(false);

  // Get all products in this group
  const products = group.products || [];

  // For groups with more than 2 products, we need to merge two at a time
  const isLargeGroup = products.length > 2;

  // Get the drop ID (the one not selected as keep)
  const dropId = products.find(p => p.id !== keepId)?.id;

  async function handlePreview() {
    if (!keepId || !dropId) return;

    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/catalog/merges/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keepId, dropId }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not preview the merge.');

      setPreviewResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove() {
    if (!keepId || !dropId || !previewResult) return;

    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/catalog/merges/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keepId, dropId }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not apply the merge.');

      setMerged(true);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Render a table of products in this group
  function renderProductTable() {
    return (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Keep this one</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Supplier</th>
              <th>Cost</th>
              <th>RRP</th>
              <th>Stock</th>
              <th>Photo / Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {isLargeGroup ? (
                    <input
                      type="radio"
                      name={`keep-${group.identity}`}
                      checked={keepId === product.id}
                      onChange={() => setKeepId(product.id)}
                    />
                  ) : (
                    <input
                      type="radio"
                      name={`keep-${group.identity}`}
                      checked={keepId === product.id}
                      onChange={() => setKeepId(product.id)}
                    />
                  )}
                </td>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.supplier}</td>
                <td>{dollars(product.cost_cents)}</td>
                <td>{dollars(product.price_cents)}</td>
                <td>{product.stock}</td>
                <td>{product.has_image ? 'Yes' : 'No'} / {product.has_description ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Render the merge instructions for large groups
  function renderLargeGroupInstructions() {
    if (!isLargeGroup) return null;

    return (
      <p className="admin-muted">Merge two at a time; choose which one to merge into the kept one.</p>
    );
  }

  // Render the preview results
  function renderPreviewResults() {
    if (!previewResult) return null;

    const sentences = describePreview(previewResult);

    return (
      <>
        <h4>Preview:</h4>
        <ul>
          {sentences.map((sentence, index) => (
            <li key={index}>{sentence}</li>
          ))}
        </ul>
      </>
    );
  }

  // Render the approve button
  function renderApproveButton() {
    if (merged) return <p className="admin-muted">Merged.</p>;

    const canApprove = previewResult !== null && !busy;

    return (
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={handleApprove}
        disabled={!canApprove || busy}
      >
        {busy ? 'Approving...' : 'Approve this merge'}
      </button>
    );
  }

  return (
    <div className="admin-card">
      <h3 className="admin-heading">{group.identity}</h3>
      <p className="admin-muted">These products look like the same product sold by two suppliers (same brand and maker part number); merging keeps one product and gives it both suppliers; the cost of the cheaper in-stock supplier is used; nothing is deleted.</p>

      {renderProductTable()}

      {renderLargeGroupInstructions()}

      <div className="admin-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handlePreview}
          disabled={!keepId || !dropId || busy}
        >
          {busy ? 'Previewing...' : 'Preview'}
        </button>

        {renderApproveButton()}
      </div>

      {previewResult && renderPreviewResults()}

      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}