'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Copied from the Global Platform's
// app/(admin)/data-feeds/[businessId]/[supplierId]/UploadFeedForm.js.
export default function AdminUploadFeedForm({ supplierId }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Choose a file first.');
      return;
    }

    setPending(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/website-intelligence/suppliers/${supplierId}/uploads`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Failed to upload file.');
        return;
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch {
      setError('Unable to reach the admin service.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-card">
      <label htmlFor="feed-file">
        Feed file (.csv, .xlsx, .xls -- up to 4 MB)
        <input id="feed-file" type="file" accept=".csv,.xlsx,.xls" ref={fileInputRef} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>{pending ? 'Uploading…' : 'Upload'}</button>
      </div>
    </form>
  );
}
