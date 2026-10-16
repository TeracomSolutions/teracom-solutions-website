"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRemoveUploadButton({ uploadId, productsAdded = 0 }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUndoImport = async () => {
    if (busy) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/uploads/${uploadId}/removal`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch removal preview');
      }

      const { added, live } = data;

      if (live > 0) {
        setError(live + ' of the ' + added + ' products are live on the website. Take them offline (Store, Catalog), then undo the import.');
        setBusy(false);
        return;
      }

      const confirmed = window.confirm(
        'Undo this import? This deletes the ' + added + ' product' + (added === 1 ? '' : 's') +
        ' it added and removes the upload from the history. Products it only updated are not changed.'
      );

      if (!confirmed) {
        setBusy(false);
        return;
      }

      const deleteRes = await fetch(`/api/admin/uploads/${uploadId}?remove_products=true`, {
        method: 'DELETE',
      });

      const deleteData = await deleteRes.json();

      if (!deleteRes.ok) {
        throw new Error(deleteData.error || 'Failed to undo import');
      }

      const { products_removed, products_hidden, holds_removed } = deleteData;
      setMessage(
        'Removed ' + products_removed + ' product' + (products_removed === 1 ? '' : 's') +
        (products_hidden ? ', hid ' + products_hidden + ' that other records still use' : '') + '.'
      );

      router.refresh();
    } catch (err) {
      setError(err.message || 'That did not work.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteFromHistory = async () => {
    if (busy) return;

    const confirmed = window.confirm(
      'Remove this upload from the history? ' +
      (productsAdded > 0 ? 'The ' + productsAdded + ' products it added stay in the store.' : 'Nothing in the store changes.')
    );

    if (!confirmed) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/uploads/${uploadId}?remove_products=false`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete from history');
      }

      router.refresh();
    } catch (err) {
      setError(err.message || 'That did not work.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
      {productsAdded > 0 && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleUndoImport}
          disabled={busy}
        >
          Undo import ({productsAdded} product{productsAdded === 1 ? '' : 's'})
        </button>
      )}

      <button
        className="admin-link-button"
        onClick={handleDeleteFromHistory}
        disabled={busy}
      >
        Delete from history
      </button>

      {message && <span className="admin-muted">{message}</span>}
      {error && (
        <span className="admin-error-inline" role="alert" style={{ marginLeft: 0, whiteSpace: 'normal' }}>
          {error}
        </span>
      )}
    </div>
  );
}