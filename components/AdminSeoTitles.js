'use client';

import { useState } from 'react';

import { formatNumber, lengthNote, shortPath } from '@/lib/searchInsights';

// Search -> Titles (Robert, 2026-10-10): the page titles and descriptions that
// the AI suggested or staff wrote for the pages Google shows. A yes (or a
// staff edit) puts the words on the website at once; the website uses them in
// place of the ones the page was built with. Titles are 15 to 65 characters,
// descriptions 70 to 160.

const VIEWS = [
  { key: 'proposed', label: 'Waiting for a yes' },
  { key: 'active', label: 'Live' },
  { key: 'rejected', label: 'Set aside' },
];

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

export default function AdminSeoTitles({ initial }) {
  const [view, setView] = useState('proposed');
  const [data, setData] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title: '', description: '' });
  const [path, setPath] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const rows = data.titles || [];
  const counts = data.counts || {};

  async function load(status, skip = 0) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/seo/insights/titles?status=${status}&skip=${skip}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not load the list.');
      setData((current) => (skip > 0 ? { ...result, titles: [...(current.titles || []), ...result.titles] } : result));
      setView(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function act(work, text, then) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await work();
      setMessage(text(result));
      setEditing(null);
      await load(then || view);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function suggest() {
    return act(() => send('/api/admin/seo/insights/titles', 'POST', { path: path.trim() }), () => 'Suggestion ready below. Read it, then say yes or no.', 'proposed').then(() => setPath(''));
  }

  function decide(id, action) {
    return act(
      () => send('/api/admin/seo/insights/titles', 'PUT', { ids: [id], action }),
      () => (action === 'approve' ? 'Done. The website uses it now.' : 'Set aside.'),
    );
  }

  function save(row) {
    return act(
      () => send(`/api/admin/seo/insights/titles/${row.id}`, 'PATCH', { title: draft.title, description: draft.description.trim() || null }),
      () => 'Saved. The website uses your words now.',
      'active',
    );
  }

  function startEdit(row) {
    setEditing(row.id);
    setDraft({ title: row.title, description: row.description || '' });
  }

  return (
    <div>
      <div className="admin-actions">
        {VIEWS.map((item) => (
          <button key={item.key} type="button" className={`btn btn-sm ${view === item.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => load(item.key)} disabled={busy}>
            {item.label} ({formatNumber(counts[item.key])})
          </button>
        ))}
      </div>

      <div className="admin-actions">
        <input
          type="text"
          value={path}
          onChange={(event) => setPath(event.target.value)}
          placeholder="/store/cctv"
          aria-label="The address of a page to suggest a title for"
          style={{ minWidth: '260px' }}
        />
        <button type="button" className="btn btn-secondary btn-sm" onClick={suggest} disabled={busy || !path.trim()}>Suggest a title for this page</button>
      </div>
      <p className="admin-muted">The page must be on this website and have been shown by Google for some search.</p>

      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {rows.length === 0 ? (
        <p className="admin-muted">
          {view === 'proposed' ? 'Nothing is waiting. Suggestions come from the Opportunities tab, or type a page address above.' : 'Nothing here.'}
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Page</th><th>Title and description</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="wrap" style={{ minWidth: '200px' }}>
                    <a href={row.path} target="_blank" rel="noopener noreferrer"><code>{shortPath(row.path)}</code></a>
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{row.source === 'staff' ? 'Written by staff' : 'Suggested by the AI'}</span>
                    {row.reason ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{row.reason}</span> : null}
                  </td>
                  <td className="wrap" style={{ minWidth: '380px' }}>
                    {editing === row.id ? (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <input type="text" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} aria-label="Title" />
                        <span className="admin-muted" style={{ fontSize: '12px' }}>{lengthNote(draft.title, 60).text}</span>
                        <textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} aria-label="Description" />
                        <span className="admin-muted" style={{ fontSize: '12px' }}>{lengthNote(draft.description, 155).text}</span>
                      </div>
                    ) : (
                      <>
                        <strong>{row.title}</strong>
                        <span style={{ display: 'block' }}>{row.description}</span>
                        {row.current_title ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>Was: {row.current_title}</span> : null}
                      </>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions">
                      {editing === row.id ? (
                        <>
                          <button type="button" className="btn btn-primary btn-sm" disabled={busy || !draft.title.trim()} onClick={() => save(row)}>Save and use</button>
                          <button type="button" className="admin-link-btn" onClick={() => setEditing(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          {view !== 'active' ? (
                            <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => decide(row.id, 'approve')}>Use this</button>
                          ) : null}
                          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => startEdit(row)}>Edit</button>
                          {view !== 'rejected' ? (
                            <button type="button" className="admin-link-btn" disabled={busy} onClick={() => decide(row.id, 'reject')}>
                              {view === 'active' ? 'Turn off' : 'Not this one'}
                            </button>
                          ) : null}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length < (data.total || 0) ? (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => load(view, rows.length)}>
            Show more ({formatNumber(data.total - rows.length)} left)
          </button>
        </div>
      ) : null}
    </div>
  );
}
