'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// A Remove button that asks first, calls DELETE on one of this app's own
// /api/admin routes, then re-renders the page. `afterHref` sends the
// visitor somewhere else when the page they are on is the thing removed.
export default function AdminRemoveButton({ url, confirmText, afterHref, label = 'Remove' }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(url, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to remove this.');
      }
      if (afterHref) {
        router.push(afterHref);
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="admin-actions">
      <button type="button" className="btn btn-secondary btn-sm" onClick={handleClick} disabled={busy}>
        {busy ? 'Removing…' : label}
      </button>
      {error && <span className="admin-error-inline" role="alert">{error}</span>}
    </span>
  );
}
