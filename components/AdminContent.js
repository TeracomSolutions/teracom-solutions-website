'use client';

import { useCallback, useEffect, useState } from 'react';

import AdminContentManual from '@/components/AdminContentManual';
import AdminListPager from '@/components/AdminListPager';
import { LIST_DEFAULT, LIST_SIZES } from '@/lib/listPage';
import { STATUS_LABELS, confidenceText, foundText, queueNotice, traceLines } from '@/lib/content';

// Store -> Photos & text: the products whose photo and description are being
// found on the manufacturer's website before they go on the store (Robert,
// 2026-10-08). A page that carries the part number is used straight away; a
// looser match waits here for a yes. Nothing here goes live without both.
// Robert, 2026-11-05: say why a lookup missed, offer a best guess from the
// wider web with its source, let him pick or upload the photo, let Tera stand
// in when there is none, page the list, and give the controls room.
const VIEWS = [
  { key: 'attention', label: 'Needs a look' },
  { key: 'waiting', label: 'Being looked up' },
  { key: 'done', label: 'Done' },
  { key: 'left', label: 'Left offline' },
];
const COUNT_KEYS = { attention: 'attention', waiting: null, done: 'done', left: 'left' };
const TERA = '/assets/tera/tera-ready.webp';

function countFor(counts, key) {
  if (!counts) return '';
  if (key === 'waiting') return ` (${(counts.queued || 0) + (counts.working || 0)})`;
  return ` (${counts[COUNT_KEYS[key]] ?? 0})`;
}

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

function Thumb({ src }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="content-thumb" />;
  }
  return (
    <span className="content-thumb content-thumb-tera" title="No photo yet: Tera stands in on the store">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={TERA} alt="" />
    </span>
  );
}

export default function AdminContent({ initial }) {
  const [view, setView] = useState('attention');
  const [data, setData] = useState(initial);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(LIST_DEFAULT);
  const [picked, setPicked] = useState([]);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const jobs = data.jobs || [];
  const total = Number(data.total) || jobs.length;

  const load = useCallback(async (status, { quiet = false, toPage = 1, perPage = LIST_DEFAULT } = {}) => {
    if (!quiet) setBusy(true);
    setError('');
    try {
      const skip = (toPage - 1) * perPage;
      const response = await fetch(`/api/admin/content?status=${status}&skip=${skip}&limit=${perPage}`);
      const next = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(next.error || 'Could not load the list.');
      setData(next);
      setPicked([]);
      setView(status);
      setPage(toPage);
      setSize(perPage);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setBusy(false);
    }
  }, []);

  // While products are being looked up, the list refreshes by itself.
  useEffect(() => {
    if (view !== 'waiting') return undefined;
    const timer = setInterval(() => load('waiting', { quiet: true, toPage: page, perPage: size }), 15000);
    return () => clearInterval(timer);
  }, [view, load, page, size]);

  const reload = () => load(view, { toPage: page, perPage: size });

  async function resolve(ids, action, text) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await post('/api/admin/content/resolve', { ids, action });
      setMessage(`${result.done} ${text}`);
      await reload();
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
      await reload();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function choose(job, imageUrl) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const updated = await post(`/api/admin/content/jobs/${job.id}/image`, { image_url: imageUrl });
      setData((current) => ({ ...current, jobs: current.jobs.map((j) => (j.id === job.id ? updated : j)) }));
      setMessage(`Photo changed for ${job.sku}. Press Use this to put it on the product.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function upload(job, event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const form = new FormData();
      form.append('file', file);
      const result = await post(`/api/admin/content/products/${job.product_id}/image`, form, true);
      setMessage(result.photo ? `Photo uploaded for ${job.sku}.` : (result.problems || []).join(' ') || 'That picture could not be used.');
      await reload();
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
  const pages = Math.max(1, Math.ceil(total / size));
  const pagerView = {
    total,
    page,
    pages,
    size,
    sizes: LIST_SIZES,
    first: total === 0 ? 0 : (page - 1) * size + 1,
    last: Math.min(page * size, total),
    setPage: (n) => load(view, { toPage: Math.min(Math.max(1, n), pages), perPage: size }),
    setSize: (n) => load(view, { toPage: 1, perPage: n }),
  };

  return (
    <div>
      <div className="content-toolbar">
        <div className="content-toolbar-group" role="group" aria-label="Show">
          {VIEWS.map((v) => (
            <button key={v.key} type="button" className={`btn btn-sm ${view === v.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => load(v.key, { perPage: size })} disabled={busy}>
              {v.label}{countFor(data.counts, v.key)}
            </button>
          ))}
        </div>
        <div className="content-toolbar-group">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => findAll(true)} disabled={busy}>Find for every live product without a photo</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => findAll(false)} disabled={busy}>Find for every product without one</button>
        </div>
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
            <div className="admin-review-bar">
              <div className="admin-review-bar-group">
                <span className="admin-review-count">{picked.length} of {jobs.length} on this page selected</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(allPicked ? [] : jobs.map((j) => j.id))}>
                  {allPicked ? 'Clear selection' : 'Select this page'}
                </button>
              </div>
              <div className="admin-review-bar-group">
                <button type="button" className="btn btn-primary btn-sm" disabled={busy || picked.length === 0} onClick={() => resolve(picked, 'approve', 'used.')}>Use selected</button>
                <button type="button" className="btn btn-secondary btn-sm" disabled={busy || picked.length === 0} onClick={() => resolve(picked, 'retry', 'looked up again.')}>Try selected again</button>
                <button type="button" className="btn btn-secondary btn-sm" disabled={busy || picked.length === 0} onClick={() => { if (window.confirm(`Put ${picked.length} product${picked.length === 1 ? '' : 's'} live with Tera standing in for the photo?`)) resolve(picked, 'use_tera', 'put live with Tera standing in.'); }}>Use Tera for selected</button>
              </div>
            </div>
          ) : null}

          <div className="admin-table-wrap">
            <table className="admin-table content-table">
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
                  const tried = traceLines(job.trace);
                  const settle = ['review', 'not_found', 'left'].includes(job.status);
                  return (
                    <tr key={job.id}>
                      {attention ? (
                        <td>
                          <input type="checkbox" checked={picked.includes(job.id)} onChange={() => toggle(job.id)} aria-label={`Select ${job.sku}`} />
                        </td>
                      ) : null}
                      <td className="wrap content-product">
                        <code>{job.sku}</code> {job.published ? <span className="admin-muted">(live)</span> : null}
                        <span className="content-name">{job.name}</span>
                        <span className="content-sub">{[job.brand, job.supplier].filter(Boolean).join(' · ')}</span>
                        <span className="content-sub">
                          {STATUS_LABELS[job.status] || job.status}{job.go_live ? ' · will go live when ready' : ''}
                        </span>
                        {job.note ? <span className="content-why">{job.note}</span> : null}
                        {tried.length > 0 ? (
                          <details className="content-tried">
                            <summary>What was tried ({tried.length})</summary>
                            <ul>{tried.map((line, i) => <li key={i}>{line}</li>)}</ul>
                          </details>
                        ) : null}
                      </td>
                      <td className="wrap content-found">
                        {found ? (
                          <div className="content-found-row">
                            <Thumb src={found.image_url} />
                            <div>
                              <span className="content-found-title">{foundText(found)}</span>
                              {found.source ? <span className="content-guess">Best guess from {found.source}, not the manufacturer</span> : null}
                              {found.description ? <span className="content-desc">{found.description}</span> : null}
                              {found.features && found.features.length > 0 ? (
                                <ul className="content-features">
                                  {found.features.map((line) => <li key={line}>{line}</li>)}
                                </ul>
                              ) : null}
                              {found.page_url ? (
                                <a href={found.page_url} target="_blank" rel="noopener noreferrer" className="content-link">Open the page it came from</a>
                              ) : null}
                              <span className="content-sub">{confidenceText(found.confidence)}</span>
                              {found.images && found.images.length > 1 ? (
                                <div className="content-pick">
                                  <span className="content-sub">Other pictures on that page (click one to use it instead):</span>
                                  <div className="content-pick-row">
                                    {found.images.map((url) => (
                                      <button key={url} type="button" className="content-pick-btn" onClick={() => choose(job, url)} disabled={busy} title="Use this picture">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt="" loading="lazy" referrerPolicy="no-referrer" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <div className="content-found-row">
                            <Thumb src={job.image_url} />
                            <span className="admin-muted">{job.page_url ? <a href={job.page_url} target="_blank" rel="noopener noreferrer">The page it came from</a> : 'Nothing found yet.'}</span>
                          </div>
                        )}
                        {open === job.id ? <AdminContentManual productId={job.product_id} onDone={reload} /> : null}
                      </td>
                      <td>
                        <div className="content-actions">
                          {job.status === 'review' ? (
                            <>
                              <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => resolve([job.id], 'approve', 'used.')}>Use this</button>
                              <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve([job.id], 'reject', 'set aside.')}>Not this one</button>
                            </>
                          ) : null}
                          {settle ? (
                            <label className={`btn btn-secondary btn-sm content-upload${busy ? ' is-busy' : ''}`}>
                              Choose a photo…
                              <input type="file" accept="image/*" onChange={(event) => upload(job, event)} disabled={busy} />
                            </label>
                          ) : null}
                          {['review', 'not_found', 'left', 'done'].includes(job.status) ? (
                            <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve([job.id], 'retry', 'looked up again.')}>Try again</button>
                          ) : null}
                          {settle ? (
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(open === job.id ? null : job.id)}>
                              {open === job.id ? 'Close' : 'Add by hand'}
                            </button>
                          ) : null}
                          {settle ? (
                            <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => { if (window.confirm('Put this product live with Tera standing in for the photo?')) resolve([job.id], 'use_tera', 'put live with Tera standing in.'); }}>Use Tera</button>
                          ) : null}
                          <span className="content-actions-links">
                            {settle ? (
                              <button type="button" className="admin-link-btn" disabled={busy} onClick={() => { if (window.confirm('Put this product live without a full photo and description?')) resolve([job.id], 'go_live_anyway', 'put live.'); }}>Go live anyway</button>
                            ) : null}
                            {['review', 'not_found'].includes(job.status) ? (
                              <button type="button" className="admin-link-btn" disabled={busy} onClick={() => resolve([job.id], 'leave_offline', 'left offline.')}>Leave offline</button>
                            ) : null}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <AdminListPager view={pagerView} label="products" />
        </>
      )}
    </div>
  );
}
