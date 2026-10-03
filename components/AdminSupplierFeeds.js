'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime, humanise } from '@/lib/adminFormat';

// A supplier's automatic feeds: a direct download link, a URL or an API
// pulled on a schedule and imported into the store, with the pull history
// landing in the same upload list as hand uploads. The backend keeps the
// full link encrypted and returns only a masked copy (feed.url).
const FORMATS = [
  { key: 'auto', label: 'Work it out' },
  { key: 'csv', label: 'CSV' },
  { key: 'xlsx', label: 'Excel (.xlsx)' },
  { key: 'xls', label: 'Excel (.xls)' },
  { key: 'json', label: 'JSON' },
  { key: 'xml', label: 'XML' },
];
const RECURRENCES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'manual', label: 'Only when I click Pull now' },
];

function statusClass(status) {
  if (status === 'ok') return 'is-approved';
  if (status === 'failed') return 'is-failed';
  if (status === 'running') return 'is-running';
  return 'is-pending';
}

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

function AddFeedForm({ supplierId, onDone }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('auto');
  const [recurrence, setRecurrence] = useState('weekly');
  const [authName, setAuthName] = useState('');
  const [authValue, setAuthValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const feed = await send(`/api/admin/suppliers/${supplierId}/feeds`, 'POST', {
        name, url, format, recurrence,
        auth_header_name: authName || null,
        auth_header_value: authValue || null,
      });
      await send(`/api/admin/feeds/${feed.id}/fetch`, 'POST');
      setName(''); setUrl(''); setAuthName(''); setAuthValue('');
      setOpen(false);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>Add a direct link or feed</button>;
  }

  return (
    <form onSubmit={submit} className="admin-form admin-card">
      <label>Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Leader price file" required /></label>
      <label>Direct link or feed address <span className="admin-muted">for Leader: Data Feed Center, CopyLink next to Stock Data Feed - CSV with Heading. Stored encrypted; only its start is shown again.</span>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://partner.supplier.com.au/... (paste the whole link)" required />
      </label>
      <label>Format
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          {FORMATS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      </label>
      <label>Pull
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
          {RECURRENCES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </label>
      <label>Authentication header (optional) <span className="admin-muted">e.g. X-Api-Key, or Authorization</span>
        <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Header name" />
      </label>
      <label>Header value <span className="admin-muted">e.g. the API key, or Bearer …; stored encrypted, never shown again</span>
        <input type="password" autoComplete="off" value={authValue} onChange={(e) => setAuthValue(e.target.value)} placeholder="Value" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Adding…' : 'Add and pull now'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

// Change a feed after it was added (Robert, 2026-10-03): its name, the link,
// the format, how often it is pulled, or the authentication header. The
// stored link is never shown in full, so the link box starts empty and a
// blank box keeps the current link; the same goes for the header value.
function EditFeedForm({ feed, onCancel, onDone }) {
  const [name, setName] = useState(feed.name);
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState(feed.format);
  const [recurrence, setRecurrence] = useState(feed.recurrence);
  const [authName, setAuthName] = useState(feed.auth_header_name || '');
  const [authValue, setAuthValue] = useState('');
  const [clearAuth, setClearAuth] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const body = {};
    if (name.trim() !== feed.name) body.name = name.trim();
    if (url.trim()) body.url = url.trim();
    if (format !== feed.format) body.format = format;
    if (recurrence !== feed.recurrence) body.recurrence = recurrence;
    if (clearAuth) {
      body.clear_auth = true;
    } else {
      if (authValue) body.auth_header_value = authValue;
      if (authName.trim() !== (feed.auth_header_name || '')) body.auth_header_name = authName.trim() || null;
    }
    if (Object.keys(body).length === 0) {
      onCancel();
      return;
    }
    setBusy(true);
    setError('');
    try {
      await send(`/api/admin/feeds/${feed.id}`, 'PATCH', body);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="admin-form admin-card">
      <h3 style={{ margin: 0 }}>Edit {feed.name}</h3>
      <label>Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label>Direct link or feed address <span className="admin-muted">Now {feed.url}. Leave blank to keep it, or paste the whole new link to replace it; it is stored encrypted.</span>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://... (only to change the link)" />
      </label>
      <label>Format
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          {FORMATS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      </label>
      <label>Pull
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
          {RECURRENCES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </label>
      <label>Authentication header (optional) <span className="admin-muted">e.g. X-Api-Key, or Authorization</span>
        <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Header name" disabled={clearAuth} />
      </label>
      <label>Header value <span className="admin-muted">{feed.has_auth ? 'Leave blank to keep the current value. ' : ''}Stored encrypted, never shown again.</span>
        <input type="password" autoComplete="off" value={authValue} onChange={(e) => setAuthValue(e.target.value)} placeholder="Value" disabled={clearAuth} />
      </label>
      {feed.has_auth && (
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="checkbox" checked={clearAuth} onChange={(e) => setClearAuth(e.target.checked)} style={{ width: 'auto' }} />
          Remove the authentication header
        </label>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminSupplierFeeds({ supplierId, feeds }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const editing = feeds.find((feed) => feed.id === editingId) || null;

  async function act(feed, url, method, body) {
    setBusyId(feed.id);
    setError('');
    try {
      await send(url, method, body);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Feed</th>
              <th>Format</th>
              <th>Pull</th>
              <th>Last pull</th>
              <th>Result</th>
              <th>Next pull</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {feeds.length === 0 && (
              <tr><td colSpan={7} className="admin-muted">No direct link or feed yet. Add one below if this supplier publishes a price file, a download link or an API; otherwise upload files by hand.</td></tr>
            )}
            {feeds.map((feed) => (
              <tr key={feed.id} style={feed.active ? undefined : { opacity: 0.55 }}>
                <td className="wrap">
                  {feed.name}
                  <span className="admin-muted" style={{ display: 'block', fontSize: '12px', overflowWrap: 'anywhere' }}>{feed.url}</span>
                  {feed.has_auth && <span className="admin-muted" style={{ fontSize: '12px' }}>with {feed.auth_header_name} header</span>}
                </td>
                <td>{feed.format === 'auto' ? 'Auto' : feed.format.toUpperCase()}</td>
                <td>{feed.recurrence === 'manual' ? 'Manual' : humanise(feed.recurrence)}</td>
                <td>{formatDateTime(feed.last_fetched_at, 'Never')}</td>
                <td>
                  <span className={`admin-status ${statusClass(feed.last_status)}`}>{humanise(feed.last_status)}</span>
                  {feed.last_summary && feed.last_status === 'ok' && (
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>
                      {feed.last_summary.created} added · {feed.last_summary.updated} updated{feed.last_summary.skipped ? ` · ${feed.last_summary.skipped} skipped` : ''}
                    </span>
                  )}
                  {feed.last_error && <span className="admin-message" style={{ color: '#ff8a8a', display: 'block' }}>{feed.last_error}</span>}
                </td>
                <td>{feed.active ? formatDateTime(feed.next_fetch_at, feed.recurrence === 'manual' ? 'Manual' : 'Soon') : 'Paused'}</td>
                <td>
                  <div className="admin-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => act(feed, `/api/admin/feeds/${feed.id}/fetch`, 'POST')} disabled={busyId === feed.id || feed.last_status === 'running'}>
                      {feed.last_status === 'running' ? 'Pulling…' : 'Pull now'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingId(feed.id)} disabled={busyId === feed.id}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => act(feed, `/api/admin/feeds/${feed.id}`, 'PATCH', { active: !feed.active })} disabled={busyId === feed.id}>
                      {feed.active ? 'Pause' : 'Resume'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => { if (window.confirm(`Remove the feed ${feed.name}? Files it already pulled stay in the upload history.`)) act(feed, `/api/admin/feeds/${feed.id}`, 'DELETE'); }} disabled={busyId === feed.id}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <EditFeedForm
          key={editing.id}
          feed={editing}
          onCancel={() => setEditingId(null)}
          onDone={() => {
            setEditingId(null);
            router.refresh();
          }}
        />
      )}
      <AddFeedForm supplierId={supplierId} onDone={() => router.refresh()} />
    </div>
  );
}