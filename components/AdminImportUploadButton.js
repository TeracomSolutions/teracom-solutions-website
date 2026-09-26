'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// "Import into store" for one uploaded price list. The backend parses the
// file and upserts by SKU; running it again on the same file updates.
export default function AdminImportUploadButton({ uploadId, alreadyImported }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleClick() {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`/api/admin/uploads/${uploadId}/import`, { method: 'POST' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'The import failed.');
      }
      setResult(data);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
      <button type="button" className={`btn btn-sm ${alreadyImported ? 'btn-secondary' : 'btn-primary'}`} onClick={handleClick} disabled={busy}>
        {busy ? 'Importing…' : alreadyImported ? 'Import again' : 'Import into store'}
      </button>
      {result && (
        <span className="admin-muted" style={{ fontSize: '13px', whiteSpace: 'normal' }}>
          {result.created} added, {result.updated} updated{result.skipped ? `, ${result.skipped} row${result.skipped === 1 ? '' : 's'} skipped` : ''}.
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
