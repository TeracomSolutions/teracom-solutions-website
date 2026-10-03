'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminBrandPicker from '@/components/AdminBrandPicker';

// The brands a supplier's imports keep to. Set at the first import (or
// here from the latest file); every later import, by hand or from an
// automatic feed, takes only these brands. Clearing it makes the next
// import ask again.
export default function AdminBrandRule({ supplierId, supplierName, rule, latestUploadId }) {
  const router = useRouter();
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const brands = rule || [];

  async function clearRule() {
    if (!window.confirm(`Clear the brand rule for ${supplierName}? The next import will ask which brands to take. Products already in the store stay there.`)) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/suppliers/${supplierId}/brand-rule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: [] }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not clear the rule.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card admin-brand-rule">
      {brands.length > 0 ? (
        <>
          <p>Imports from {supplierName} take only these {brands.length} brand{brands.length === 1 ? '' : 's'}:</p>
          <ul className="admin-brand-chips">
            {brands.map((brand) => <li key={brand}>{brand}</li>)}
          </ul>
        </>
      ) : (
        <p className="admin-muted">No brands chosen yet. The first import will ask which brands to take from the file, and remember them.</p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      {picking ? (
        <AdminBrandPicker
          uploadId={latestUploadId}
          supplierName={supplierName}
          onCancel={() => setPicking(false)}
          onDone={() => {
            setPicking(false);
            router.refresh();
          }}
        />
      ) : (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicking(true)} disabled={!latestUploadId || busy}
            title={latestUploadId ? undefined : 'Upload or pull a price list first'}>
            {brands.length > 0 ? 'Change brands' : 'Choose brands'}
          </button>
          {brands.length > 0 && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={clearRule} disabled={busy}>Clear rule</button>
          )}
        </div>
      )}
    </div>
  );
}