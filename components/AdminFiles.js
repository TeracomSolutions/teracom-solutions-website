'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/adminFormat';

function sizeText(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const ICON = { folder: '📁', image: '🖼️', text: '📄', pdf: '📕', file: '📦' };

function rawUrl(root, path, download) {
  return `/api/admin/files/raw?root=${encodeURIComponent(root)}&path=${encodeURIComponent(path)}${download ? '&download=1' : ''}`;
}

export default function AdminFiles({ roots }) {
  const available = roots.filter((r) => r.available);
  const [root, setRoot] = useState(available[0]?.key || '');
  const [path, setPath] = useState('');
  const [listing, setListing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(null); // the file being previewed
  const [text, setText] = useState(null);

  async function load(nextRoot, nextPath) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/files/list?root=${encodeURIComponent(nextRoot)}&path=${encodeURIComponent(nextPath)}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to open that folder.');
      setListing(result);
      setRoot(nextRoot);
      setPath(nextPath);
      setOpen(null);
      setText(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (root) load(root, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function preview(row) {
    const filePath = path ? `${path}/${row.name}` : row.name;
    setOpen({ ...row, path: filePath });
    setText(null);
    if (row.kind === 'text') {
      try {
        const response = await fetch(`/api/admin/files/text?root=${encodeURIComponent(root)}&path=${encodeURIComponent(filePath)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Unable to preview that file.');
        setText(result);
      } catch (err) {
        setError(err.message);
      }
    }
  }

  function click(row) {
    if (row.type === 'folder') load(root, path ? `${path}/${row.name}` : row.name);
    else preview(row);
  }

  const crumbs = path ? path.split('/') : [];
  const label = roots.find((r) => r.key === root)?.label || '';

  return (
    <div className="files-layout">
      <nav className="files-roots" aria-label="Places">
        {available.map((r) => (
          <button key={r.key} type="button" className={`files-root${r.key === root ? ' is-active' : ''}`} onClick={() => load(r.key, '')}>
            {r.label}
          </button>
        ))}
      </nav>

      <div className="files-main">
        <div className="files-path">
          <button type="button" className="files-crumb" onClick={() => load(root, '')}>{label}</button>
          {crumbs.map((c, i) => (
            <span key={`${c}-${i}`}>
              {' / '}
              <button type="button" className="files-crumb" onClick={() => load(root, crumbs.slice(0, i + 1).join('/'))}>{c}</button>
            </span>
          ))}
        </div>

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Size</th><th>Changed</th><th></th></tr>
            </thead>
            <tbody>
              {path ? (
                <tr>
                  <td colSpan={4}>
                    <button type="button" className="files-link" onClick={() => load(root, crumbs.slice(0, -1).join('/'))}>⬆️ Up one folder</button>
                  </td>
                </tr>
              ) : null}
              {(listing?.rows || []).map((row) => (
                <tr key={row.name}>
                  <td>
                    <button type="button" className="files-link" onClick={() => click(row)}>
                      {ICON[row.kind] || ICON.file} {row.name}
                    </button>
                  </td>
                  <td>{sizeText(row.size)}</td>
                  <td>{formatDateTime(row.modified)}</td>
                  <td>
                    {row.type === 'file' ? (
                      <a href={rawUrl(root, path ? `${path}/${row.name}` : row.name, true)}>Download</a>
                    ) : null}
                  </td>
                </tr>
              ))}
              {listing && !listing.rows.length ? (
                <tr><td colSpan={4}>{busy ? 'Loading…' : 'This folder is empty.'}</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {listing?.hidden ? (
          <p className="muted">{listing.hidden} hidden {listing.hidden === 1 ? 'item' : 'items'} (keys, settings, installed packages and the like) are not shown.</p>
        ) : null}
        {listing?.truncated ? <p className="muted">Only the first 1,000 items are shown.</p> : null}

        {open ? (
          <div className="admin-card files-preview">
            <div className="files-preview-head">
              <strong>{open.path}</strong>
              <span>
                <a href={rawUrl(root, open.path, true)}>Download</a>{' '}
                <button type="button" className="files-link" onClick={() => setOpen(null)}>Close</button>
              </span>
            </div>
            {open.kind === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="files-image" src={rawUrl(root, open.path, false)} alt={open.name} />
            ) : null}
            {open.kind === 'pdf' ? <iframe className="files-pdf" title={open.name} src={rawUrl(root, open.path, false)} /> : null}
            {open.kind === 'text' ? (
              text ? (
                <>
                  <pre className="files-text">{text.text}</pre>
                  {text.truncated ? <p className="muted">Showing the first 200 KB of {sizeText(text.size)}.</p> : null}
                </>
              ) : <p className="muted">Loading…</p>
            ) : null}
            {open.kind === 'file' ? <p className="muted">No preview for this kind of file. Use Download to open it.</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
