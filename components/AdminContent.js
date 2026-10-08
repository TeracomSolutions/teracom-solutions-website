'use client';

import { useCallback, useEffect, useState } from 'react';

import AdminContentManual from '@/components/AdminContentManual';
import { STATUS_LABELS, confidenceText, foundText, queueNotice } from '@/lib/content';

// Store -> Photos & text: the products whose photo and description are being
// found on the manufacturer's website before they go on the store (Robert,
// 2026-10-08). A page that carries the part number is used straight away; a
// looser match waits here for a yes. Nothing here goes live without both.
const VIEWS = [
  { key: 'attention', label: 'Needs a look' },
  { key: 'waiting', label: 'Being looked up' },
  { key: 'done', label: 'Done' },
  { key: 'left', label: 'Left offline' },
];
const COUNT_KEYS = { attention: 'attention', waiting: null, done: 'done', left: 'left' };
const THUMB = { width: '64px', height: '64px', objectFit: 'contain', background: '#fff', borderRadius: '6px', flex: '0 0 auto' };
const NO_THUMB = { ...THUMB, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '11px', fontWeight: 700 };

function countFor(counts, key) {
  if (!counts) return '';
  if (key === 'waiting') return ` (${(counts.queued || 0) + (counts.working || 0)})`;
  return ` (${counts[COUNT_KEYS[key]] ?? 0})`;
}

async function post(url, body) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

export default function AdminContent({ initial }) {
  const [view, setView] = useState('attention');
  const [data, setData] = useState(initial);
  const [picked, setPicked] = useState([]);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const jobs = data.jobs || [];

  const load = useCallback(async (status, quiet = false) => {
    if (!quiet) setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/content?status=${status}`);
      const next = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(next.error || 'Could not load the list.');
      setData(next);
      setPicked([]);
      setView(status);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setBusy(false);
    }
  }, []);

  // While products are being looked up, the list refreshes by itself.
  useEffect(() => {
    if (view !== 'waiting') return undefined;
    const timer = setInterval(() => load('waiting', true), 15000);
    return () => clearInterval(timer);
  }, [view, load]);

  async function resolve(ids, action, text) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await post('/api/admin/content/resolve', { ids, action });
      setMessage(`${result.done} ${text}`);
      await load(view);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function findAll(liveOnly) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await post('/api/admin/content/queue-missing', { live_only: liveOnly });
      setMessage(queueNotice(result));
      await load(view);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function toggle(id) {
    setPicked((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  const attention = view === 'attention';
  const allPicked = jobs.length > 0 && picked.length === jobs.length;

  return (
    <div>
      <div className="admin-actions">
        {VIEWS.map((v) => (
          <button key={v.key} type="button" className={`btn btn-sm ${view === v.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => load(v.key)} disabled={busy}>
            {v.label}{countFor(data.counts, v.key)}
          </button>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => findAll(true)} disabled={busy}>Find for every live product without a photo</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => findAll(false)} disabled={busy}>Find for every product without one</button>
      </div>

      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {jobs.length === 0 ? (
        <p className="admin-muted">
          {attention
            ? 'Nothing needs a look. When you press Go live on products without a photo or description, they are looked up on the manufacturers’ websites and any that need your yes appear here.'
            : 'Nothing here.'}
        </p>
      ) : (
        <>
          {attention ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(allPicked ? [] : jobs.map((j) => j.id))}>
                {allPicked ? 'Clear selection' : 'Select all'}
              </button>
              <button type="button" className="btn btn-primary btn-sm" disabled={busy || picked.length === 0} onClick={() => resolve(picked, 'approve', 'used.')}>Use selected</button>
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy || picked.length === 0} onClick={() => resolve(picked, 'retry', 'looked up again.')}>Try selected again</button>
            </div>
          ) : null}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {attention ? <th aria-label="Select" /> : null}
                  <th>Product</th>
                  <th>What was found</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const found = job.candidate;
                  return (
                    <tr key={job.id}>
                      {attention ? (
                        <td>
                          <input type="checkbox" checked={picked.includes(job.id)} onChange={() => toggle(job.id)} aria-label={`Select ${job.sku}`} />
                        </td>
                      ) : null}
                      <td className="wrap" style={{ minWidth: '240px' }}>
                        <code>{job.sku}</code> {job.published ? <span className="admin-muted">(live)</span> : null}
                        <span style={{ display: 'block' }}>{job.name}</span>
                        <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>
                          {[job.brand, job.supplier].filter(Boolean).join(' · ')}
                        </span>
                        <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>
                          {STATUS_LABELS[job.status] || job.status}{job.go_live ? ' · will go live when ready' : ''}
                        </span>
                        {job.note ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{job.note}</span> : null}
                      </td>
                      <td className="wrap" style={{ minWidth: '320px' }}>
                        {found ? (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            {found.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={found.image_url} alt="" style={THUMB} />
                            ) : (
                              <span style={NO_THUMB}>No photo</span>
                            )}
                            <div>
                              <span style={{ display: 'block', fontWeight: 700 }}>{foundText(found)}</span>
                              {found.description ? <span style={{ display: 'block', fontSize: '13px' }}>{found.description}</span> : null}
                              {found.features && found.features.length > 0 ? (
                                <ul style={{ margin: '4px 0 0', paddingLeft: '18px', fontSize: '13px' }}>
                                  {found.features.map((line) => <li key={line}>{line}</li>)}
                                </ul>
                              ) : null}
                              {found.page_url ? (
                                <a href={found.page_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px' }}>Open the page it came from</a>
                              ) : null}
                              <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{confidenceText(found.confidence)}</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {job.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={job.image_url} alt="" style={THUMB} />
                            ) : (
                              <span style={NO_THUMB}>No photo</span>
                            )}
                            <span className="admin-muted">{job.page_url ? <a href={job.page_url} target="_blank" rel="noopener noreferrer">The page it came from</a> : 'Nothing found yet.'}</span>
                          </div>
                        )}
                        {open === job.id ? <AdminContentManual productId={job.product_id} onDone={() => load(view)} /> : null}
                      </td>
                      <td>
                        <div className="admin-actions">
                          {job.status === 'review' ? (
                            <>
                              <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => resolve([job.id], 'approve', 'used.')}>Use this</button>
                              <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve([job.id], 'reject', 'set aside.')}>Not this one</button>
                            </>
                          ) : null}
                          {['review', 'not_found', 'left', 'done'].includes(job.status) ? (
                            <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve([job.id], 'retry', 'looked up again.')}>Try again</button>
                          ) : null}
                          {['review', 'not_found', 'left'].includes(job.status) ? (
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(open === job.id ? null : job.id)}>
                              {open === job.id ? 'Close' : 'Add by hand'}
                            </button>
                          ) : null}
                          {['review', 'not_found', 'left'].includes(job.status) ? (
                            <button type="button" className="admin-link-btn" disabled={busy} onClick={() => resolve([job.id], 'go_live_anyway', 'put live.')}>Go live anyway</button>
                          ) : null}
                          {['review', 'not_found'].includes(job.status) ? (
                            <button type="button" className="admin-link-btn" disabled={busy} onClick={() => resolve([job.id], 'leave_offline', 'left offline.')}>Leave offline</button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
