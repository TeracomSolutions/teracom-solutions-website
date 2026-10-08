'use client';

import { useState } from 'react';

import { manualNotice } from '@/lib/content';

// Giving one product its photo and description by hand (Robert, 2026-10-08):
// a page on the manufacturer's website, a picture's address, a picture from
// this computer, or the words themselves. Fetching a page can take a few
// seconds. Whatever works replaces what the product has.

const inputStyle = { padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff', font: 'inherit', fontSize: '13px', width: '100%' };

async function post(url, body, isForm = false) {
  const response = await fetch(url, {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

export default function AdminContentManual({ productId, onDone }) {
  const [pageUrl, setPageUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [words, setWords] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function run(label, send) {
    setBusy(label);
    setError('');
    setMessage('');
    try {
      const result = await send();
      setMessage(manualNotice(result));
      if (result.photo || result.description) onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  function usePage(event) {
    event.preventDefault();
    if (pageUrl.trim()) run('page', () => post(`/api/admin/content/products/${productId}/manual`, { page_url: pageUrl.trim() }));
  }

  function usePicture(event) {
    event.preventDefault();
    if (imageUrl.trim()) run('picture', () => post(`/api/admin/content/products/${productId}/manual`, { image_url: imageUrl.trim() }));
  }

  function useWords(event) {
    event.preventDefault();
    if (words.trim().length >= 10) run('words', () => post(`/api/admin/content/products/${productId}/manual`, { description: words.trim() }));
  }

  function upload(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    run('upload', () => post(`/api/admin/content/products/${productId}/image`, form, true));
  }

  return (
    <div className="admin-card" style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
      <form onSubmit={usePage} className="admin-actions">
        <input style={{ ...inputStyle, flex: '1 1 320px' }} type="url" placeholder="Link to the product on the manufacturer's website" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} aria-label="Link to the manufacturer's page" />
        <button type="submit" className="btn btn-secondary btn-sm" disabled={Boolean(busy) || !pageUrl.trim()}>{busy === 'page' ? 'Reading…' : 'Use this page'}</button>
      </form>
      <form onSubmit={usePicture} className="admin-actions">
        <input style={{ ...inputStyle, flex: '1 1 320px' }} type="url" placeholder="Link to a picture of the product" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} aria-label="Link to a picture" />
        <button type="submit" className="btn btn-secondary btn-sm" disabled={Boolean(busy) || !imageUrl.trim()}>{busy === 'picture' ? 'Fetching…' : 'Use this picture'}</button>
      </form>
      <div className="admin-actions">
        <label className="btn btn-secondary btn-sm" style={{ cursor: busy ? 'default' : 'pointer' }}>
          {busy === 'upload' ? 'Uploading…' : 'Upload a picture'}
          <input type="file" accept="image/*" onChange={upload} disabled={Boolean(busy)} style={{ display: 'none' }} />
        </label>
        <span className="admin-muted" style={{ fontSize: '12px' }}>Up to 4 MB. For a bigger picture, paste a link.</span>
      </div>
      <form onSubmit={useWords} style={{ display: 'grid', gap: '8px' }}>
        <textarea style={{ ...inputStyle, minHeight: '70px' }} placeholder="Or type the description" value={words} onChange={(e) => setWords(e.target.value)} aria-label="Description" />
        <div className="admin-actions">
          <button type="submit" className="btn btn-secondary btn-sm" disabled={Boolean(busy) || words.trim().length < 10}>{busy === 'words' ? 'Saving…' : 'Save description'}</button>
        </div>
      </form>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}