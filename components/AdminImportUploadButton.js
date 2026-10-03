'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminBrandPicker from '@/components/AdminBrandPicker';

function summaryText(result) {
  const parts = [`${result.created} added`, `${result.updated} updated`];
  if (result.filtered) parts.push(`${result.filtered} from other brands left out`);
  if (result.skipped) parts.push(`${result.skipped} row${result.skipped === 1 ? '' : 's'} skipped`);
  return `${parts.join(', ')}.`;
}

// Import one uploaded price list into the store. With a brand rule saved
// for the supplier it imports straight away, keeping to those brands;
// without one it opens the brand picker first.
export default function AdminImportUploadButton({ uploadId, alreadyImported, hasRule, supplierName }) {
  const router = useRouter();
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function done(data) {
    setPicking(false);
    setResult(data);
    router.refresh();
  }

  async function importWithRule() {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`/api/admin/uploads/${uploadId}/import-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: null }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The import failed.');
      if (data.needs_brands) {
        setPicking(true);
        return;
      }
      done(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (picking) {
    return (
      <AdminBrandPicker
        uploadId={uploadId}
        supplierName={supplierName}
        onCancel={() => setPicking(false)}
        onDone={done}
      />
    );
  }

  return (
    <div className="admin-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
      {hasRule ? (
        <button type="button" className={`btn btn-sm ${alreadyImported ? 'btn-secondary' : 'btn-primary'}`} onClick={importWithRule} disabled={busy}>
          {busy ? 'Importing…' : alreadyImported ? 'Import again' : 'Import into store'}
        </button>
      ) : (
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setPicking(true)}>
          Choose brands and import
        </button>
      )}
      {hasRule && (
        <button type="button" className="admin-link-button" onClick={() => setPicking(true)}>Choose other brands</button>
      )}
      {result && (
        <span className="admin-muted" style={{ fontSize: '13px', whiteSpace: 'normal' }}>
          {summaryText(result)}
          {result.problems && result.problems.length > 0 && (
            <>
              {' '}
              <span title={result.problems.join('\n')}>Details on hover.</span>
            </>
          )}
        </span>
      )}
      {error && <span className="admin-error-inline" role="alert" style={{ marginLeft: 0, whiteSpace: 'normal' }}>{error}</span>}
    </div>
  );
}