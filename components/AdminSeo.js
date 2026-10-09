'use client';

import { useCallback, useEffect, useState } from 'react';

import { VIEWS, confidenceLabel, countFor, decideNotice, shownText, startNotice, syncNotice, validTarget } from '@/lib/searchPage';

// Search: the old addresses Google still shows and the page on this website
// each one now goes to (Robert, 2026-10-09). The confident ones are live
// already; the rest wait here for a yes.
async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

export default function AdminSeo({ initial }) {
  const [view, setView] = useState('proposed');
  const [data, setData] = useState(initial);
  const [picked, setPicked] = useState([]);
  const [editing, setEditing] = useState(null);
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const rows = data.redirects || [];
  const overview = data.overview || {};
  const running = Boolean(overview.sync && overview.sync.running);

  const load = useCallback(async (status, skip = 0, quiet = false) => {
    if (!quiet) setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/seo?status=${status}&skip=${skip}`);
      const next = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(next.error || 'Could not load the list.');
      setData((current) => (skip > 0 ? { ...next, redirects: [...(current.redirects || []), ...next.redirects] } : next));
      if (skip === 0) setPicked([]);
      setView(status);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setBusy(false);
    }
  }, []);

  // While a search is running, the page checks for the result by itself.
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => load(view, 0, true), 15000);
    return () => clearInterval(timer);
  }, [running, view, load]);

  async function act(work, text) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await work();
      setMessage(text(result));
      setEditing(null);
      await load(view);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function decide(ids, action) {
    return act(() => send('/api/admin/seo/decide', 'POST', { ids, action }), (result) => decideNotice(result.done, action));
  }

  function change(row) {
    return act(() => send(`/api/admin/seo/${row.id}`, 'PATCH', { to_path: target.trim() }), () => 'Saved. That redirect is on.');
  }

  function searchNow() {
    return act(() => send('/api/admin/seo/sync', 'POST'), startNotice);
  }

  function toggle(id) {
    setPicked((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  const allPicked = rows.length > 0 && picked.length === rows.length;
  const proposed = view === 'proposed';

  return (
    <div>
      <div className="admin-actions">
        {VIEWS.map((v) => (
          <button key={v.key} type="button" className={`btn btn-sm ${view === v.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => load(v.key)} disabled={busy}>
            {v.label}{countFor(overview.counts, v.key)}
          </button>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={searchNow} disabled={busy || running || !overview.connected}>Search now</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => load(view)} disabled={busy}>Refresh</button>
      </div>

      <p className="admin-muted">
        {overview.connected === false
          ? 'Google Search Console is not connected yet. Add it under Connections, then press Search now.'
          : syncNotice(overview.sync)}
      </p>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {rows.length === 0 ? (
        <p className="admin-muted">
          {proposed ? 'Nothing is waiting for a yes.' : 'Nothing here.'}
        </p>
      ) : (
        <>
          {proposed ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(allPicked ? [] : rows.map((r) => r.id))}>
                {allPicked ? 'Clear selection' : 'Select all'}
              </button>
              <button type="button" className="btn btn-primary btn-sm" disabled={busy || picked.length === 0} onClick={() => decide(picked, 'approve')}>Approve selected</button>
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy || picked.length === 0} onClick={() => decide(picked, 'reject')}>Reject selected</button>
            </div>
          ) : null}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {proposed ? <th aria-label="Select" /> : null}
                  <th>Old address</th>
                  <th>Goes to</th>
                  <th>Why</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {proposed ? (
                      <td>
                        <input type="checkbox" checked={picked.includes(row.id)} onChange={() => toggle(row.id)} aria-label={`Select ${row.from_path}`} />
                      </td>
                    ) : null}
                    <td className="wrap" style={{ minWidth: '240px', wordBreak: 'break-all' }}>
                      <code>{row.from_path}</code>
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{shownText(row)}</span>
                      {row.top_query ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>Searched for: {row.top_query}</span> : null}
                    </td>
                    <td className="wrap" style={{ minWidth: '220px' }}>
                      {editing === row.id ? (
                        <div className="admin-actions">
                          <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="/store/cctv" aria-label="The page it should go to" />
                          <button type="button" className="btn btn-primary btn-sm" disabled={busy || !validTarget(target)} onClick={() => change(row)}>Save</button>
                          <button type="button" className="admin-link-btn" onClick={() => setEditing(null)}>Cancel</button>
                        </div>
                      ) : (
                        <a href={row.to_path} target="_blank" rel="noopener noreferrer">{row.to_path}</a>
                      )}
                    </td>
                    <td className="wrap" style={{ minWidth: '260px' }}>
                      <strong>{confidenceLabel(row.confidence)}</strong>
                      {row.decided ? <span className="admin-muted"> · decided by staff</span> : null}
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{row.reason}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        {view !== 'active' ? (
                          <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => decide([row.id], 'approve')}>Approve</button>
                        ) : null}
                        <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => { setEditing(row.id); setTarget(row.to_path); }}>Change</button>
                        {view !== 'rejected' ? (
                          <button type="button" className="admin-link-btn" disabled={busy} onClick={() => decide([row.id], 'reject')}>{view === 'active' ? 'Turn off' : 'Reject'}</button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length < (data.total || 0) ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => load(view, rows.length)}>
                Show more ({data.total - rows.length} left)
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}