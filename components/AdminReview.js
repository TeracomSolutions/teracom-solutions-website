'use client';

import { useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';
import { STATUS_LABELS, dollars, holdReason } from '@/lib/holds';

// Store -> Needs review: price list rows held back because their recommended
// price, before GST, is below the cost. Nothing here is in the store until
// someone says so (Robert, 2026-10-06). Import anyway puts the row in as the
// supplier sent it; Leave out keeps it out, and the same price and cost in a
// later price list is not held again.
const VIEWS = ['pending', 'dismissed', 'approved'];

export default function AdminReview({ initial }) {
  const [view, setView] = useState('pending');
  const [data, setData] = useState(initial);
  const [picked, setPicked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const holds = data.holds || [];
  const waiting = view === 'pending';

  async function load(status) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/holds?status=${status}`);
      const next = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(next.error || 'Could not load the list.');
      setData(next);
      setPicked([]);
      setView(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function resolve(ids, action) {
    setBusy(true);
    setError('');
    setMessage('');
    setConfirming(false);
    try {
      const response = await fetch('/api/admin/holds/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'That did not work.');
      setMessage(action === 'import'
        ? `${result.done} imported as supplied.`
        : `${result.done} left out.`);
      await load('pending');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function toggle(id) {
    setPicked((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  const allPicked = holds.length > 0 && picked.length === holds.length;

  return (
    <div>
      <div className="admin-actions">
        {VIEWS.map((status) => (
          <button
            key={status}
            type="button"
            className={`btn btn-sm ${view === status ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => load(status)}
            disabled={busy}
          >
            {STATUS_LABELS[status]}
            {data.counts ? ` (${data.counts[status] ?? 0})` : ''}
          </button>
        ))}
      </div>

      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {holds.length === 0 ? (
        <p className="admin-muted">
          {waiting
            ? 'Nothing is waiting. A price list row whose recommended price is below its cost will appear here instead of going into the store.'
            : 'Nothing here.'}
        </p>
      ) : (
        <>
          {waiting ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(allPicked ? [] : holds.map((h) => h.id))}>
                {allPicked ? 'Clear selection' : 'Select all'}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy || picked.length === 0} onClick={() => resolve(picked, 'leave_out')}>
                Leave selected out
              </button>
              {confirming ? (
                <>
                  <span className="admin-muted">Import {picked.length} below-cost row{picked.length === 1 ? '' : 's'} as supplied?</span>
                  <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => resolve(picked, 'import')}>Yes, import</button>
                  <button type="button" className="admin-link-btn" onClick={() => setConfirming(false)}>No</button>
                </>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" disabled={busy || picked.length === 0} onClick={() => setConfirming(true)}>
                  Import selected anyway
                </button>
              )}
            </div>
          ) : null}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {waiting ? <th aria-label="Select" /> : null}
                  <th>Supplier</th>
                  <th>Code</th>
                  <th>Product</th>
                  <th>Recommended price</th>
                  <th>Cost</th>
                  <th>Seen</th>
                  {waiting ? <th /> : <th>Decided</th>}
                </tr>
              </thead>
              <tbody>
                {holds.map((hold) => (
                  <tr key={hold.id}>
                    {waiting ? (
                      <td>
                        <input type="checkbox" checked={picked.includes(hold.id)} onChange={() => toggle(hold.id)} aria-label={`Select ${hold.sku}`} />
                      </td>
                    ) : null}
                    <td>{hold.supplier || '—'}</td>
                    <td><code>{hold.sku}</code></td>
                    <td className="wrap">
                      {hold.name}
                      {hold.brand ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{hold.brand}</span> : null}
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{holdReason(hold)}</span>
                    </td>
                    <td>
                      {dollars(hold.price_cents)}
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{dollars(hold.price_ex_gst_cents)} before GST</span>
                    </td>
                    <td>{dollars(hold.cost_cents)}</td>
                    <td>
                      {hold.times_seen} time{hold.times_seen === 1 ? '' : 's'}
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>last {formatDateTime(hold.last_seen_at)}</span>
                    </td>
                    {waiting ? (
                      <td>
                        <div className="admin-actions">
                          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve([hold.id], 'import')}>Import anyway</button>
                          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve([hold.id], 'leave_out')}>Leave out</button>
                        </div>
                      </td>
                    ) : (
                      <td>{formatDateTime(hold.resolved_at)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
