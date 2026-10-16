'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUploadFeedForm({ supplierId }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [found, setFound] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Choose a file first.');
      return;
    }

    setPending(true);
    setError(null);
    setFound(null); // Clear previous results

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/suppliers/${supplierId}/uploads`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Failed to upload file.');
        return;
      }

      // Set found data after successful upload
      setFound({
        file: file.name,
        rows: data.row_count || 0,
        brands: data.brands_found || [],
        problems: data.problems || []
      });

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
      {found && (
        <div className="admin-card">
          {found.rows > 0 ? (
            <>
              <p><strong>{found.file}</strong>: found {found.rows} product{found.rows === 1 ? '' : 's'}</p>
              {found.brands.length > 0 && (
                <p>Brands: {found.brands.map((b) => (b.brand || '(no brand)') + ' (' + b.products + ')').join(', ')}</p>
              )}
              <p className="admin-muted">Next: press Choose brands and import on its row in the Upload history below.</p>
            </>
          ) : (
            <>
              <p className="form-error" role="alert">found no products in {found.file}.</p>
              {found.problems.length > 0 && (
                <>
                  <ul>
                    {found.problems.slice(0, 5).map((problem, i) => (
                      <li key={i}>{problem}</li>
                    ))}
                  </ul>
                  <p className="admin-muted">Ask the assistant (Ask Tera, bottom right) to look at the file, or check that it has a header row with columns for the part number, the name and a price.</p>
                </>
              )}
            </>
          )}
          {found.rows > 0 && found.problems.length > 0 && (
            <p className="admin-muted">Notes: {found.problems.slice(0, 3).join('; ')}</p>
          )}
        </div>
      )}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>{pending ? 'Uploading\u2026' : 'Upload'}</button>
      </div>
    </form>
  );
}