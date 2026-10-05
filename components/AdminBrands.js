'use client';

import { useState } from 'react';

// Admin -> Store -> Brands: every brand on a store product, with its logo
// (found on the brand's own website, or uploaded), its other spellings and
// the text of its page on the website (Robert, 2026-10-05).
async function call(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

function BrandCard({ brand, onChange }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: brand.name,
    website: brand.website || '',
    aliases: (brand.aliases || []).join(', '),
    tagline: brand.tagline || '',
    body: brand.body || '',
  });
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const base = `/api/admin/brands/${encodeURIComponent(brand.slug)}`;

  async function run(label, work, done) {
    setBusy(label);
    setError('');
    setMessage('');
    try {
      const result = await work();
      done?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  const put = (body) => call(base, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  function save(event) {
    event.preventDefault();
    run('save', () => put({
      name: form.name,
      website: form.website,
      aliases: form.aliases.split(',').map((a) => a.trim()).filter(Boolean),
      tagline: form.tagline,
      body: form.body,
    }), (updated) => {
      onChange(updated);
      setEditing(false);
      setMessage('Saved.');
    });
  }

  function findLogo() {
    run('find', () => call(`${base}/find-logo`, { method: 'POST' }), (result) => {
      onChange(result.brand);
      setMessage(result.found ? 'Found a logo on the website of the brand.' : 'No logo found on the website of the brand. Upload one instead.');
    });
  }

  function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    run('upload', () => call(`${base}/logo`, { method: 'POST', body }), (updated) => {
      onChange(updated);
      setMessage('Logo uploaded.');
    });
  }

  return (
    <div className="admin-card brand-admin-card">
      <div className="brand-admin-head">
        <div className={`brand-admin-logo${brand.logo_tile ? ' is-tile' : ''}`}>
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt={`${brand.name} logo`} />
          ) : (
            <span className="admin-muted">No logo</span>
          )}
        </div>
        <div className="brand-admin-name">
          <strong>{brand.name}</strong>
          <div className="admin-muted">
            {brand.products} {brand.products === 1 ? 'product' : 'products'} in the store
            {brand.logo_source === 'auto' ? ', logo found automatically' : ''}
            {brand.website ? `, ${brand.website.replace('https://', '')}` : ''}
          </div>
        </div>
        <label className="admin-check">
          <input type="checkbox" checked={brand.supported} disabled={Boolean(busy)} onChange={(e) => run('supported', () => put({ supported: e.target.checked }), onChange)} />
          Shown with the brands we work with
        </label>
      </div>

      <div className="brand-admin-actions">
        <a className="btn btn-secondary btn-sm" href={`/brands/${brand.slug}`} target="_blank" rel="noopener noreferrer">View page</a>
        <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => setEditing((v) => !v)}>
          {editing ? 'Close' : 'Edit'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={findLogo}>
          {busy === 'find' ? 'Looking…' : 'Find logo'}
        </button>
        <label className="btn btn-secondary btn-sm" aria-disabled={Boolean(busy)}>
          {busy === 'upload' ? 'Uploading…' : 'Upload logo'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden disabled={Boolean(busy)} onChange={upload} />
        </label>
        {brand.logo_url ? (
          <> 
            <button type="button" className="admin-link-btn" disabled={Boolean(busy)} onClick={() => run('remove', () => call(`${base}/logo`, { method: 'DELETE' }), onChange)}>
              Remove logo
            </button>
            <label className="admin-check">
              <input type="checkbox" checked={brand.logo_tile} disabled={Boolean(busy)} onChange={(e) => run('tile', () => put({ logo_tile: e.target.checked }), onChange)} />
              Show the logo as it is
            </label>
          </>
        ) : null}
      </div>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {editing ? (
        <form className="admin-form" onSubmit={save}>
          <label>
            Name
            <input value={form.name} maxLength={200} required onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label>
            Website
            <input value={form.website} maxLength={300} placeholder="https://www.example.com" onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
          </label>
          <label>
            Other spellings in the feeds, separated by commas
            <input value={form.aliases} placeholder="UNV, Uni view" onChange={(e) => setForm((f) => ({ ...f, aliases: e.target.value }))} />
          </label>
          <label>
            One-line description
            <input value={form.tagline} maxLength={300} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
          </label>
          <label>
            Page text (leave blank for the standard wording)
            <textarea rows={6} value={form.body} maxLength={6000} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
          </label>
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>{busy === 'save' ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default function AdminBrands({ initial }) {
  const [brands, setBrands] = useState(initial);
  const [filter, setFilter] = useState('');
  const [noLogo, setNoLogo] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function replace(updated) {
    setBrands((list) => list.map((b) => (b.slug === updated.slug ? updated : b)));
  }

  async function findAll() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await call('/api/admin/brands/find-logos', { method: 'POST' });
      setMessage('Looking for the missing logos in the background. Reload this page in a few minutes.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const wanted = filter.trim().toLowerCase();
  const shown = brands.filter((b) => (!wanted || b.name.toLowerCase().includes(wanted)) && (!noLogo || !b.logo_url));
  const missing = brands.filter((b) => !b.logo_url).length;

  return (
    <div>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="admin-actions support-controls">
        <input
          type="search"
          value={filter}
          placeholder="Find a brand"
          aria-label="Find a brand"
          onChange={(e) => setFilter(e.target.value)}
        />
        <label className="admin-check">
          <input type="checkbox" checked={noLogo} onChange={(e) => setNoLogo(e.target.checked)} />
          Only brands without a logo ({missing})
        </label>
        <button type="button" className="btn btn-secondary btn-sm" disabled={busy || missing === 0} onClick={findAll}>
          Find missing logos
        </button>
      </div>

      {shown.length ? (
        <div className="brand-admin-list">
          {shown.map((brand) => <BrandCard key={`${brand.slug}-${brand.logo_url || ''}`} brand={brand} onChange={replace} />)}
        </div>
      ) : (
        <p className="admin-muted">{brands.length ? 'No brands match.' : 'No brands yet. They appear once products with a brand go live in the store.'}</p>
      )}
    </div>
  );
}