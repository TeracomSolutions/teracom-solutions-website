'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime } from '@/lib/adminFormat';

// Import paid orders from Stripe (Robert, 27 and 28 November 2026): list the paid website orders from the last
// N days that are in Stripe but not here, and import only the one you pick. Nobody needs to open Stripe.
export default function AdminOrderImport() {
  const router = useRouter();
  const [days, setDays] = useState(30);
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function find() {
    setBusy('find');
    setNote('');
    setError('');
    try {
      const res = await fetch(`/api/admin/orders/import-stripe?days=${encodeURIComponent(days)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not read the orders from Stripe.');
      setList(data.missing || []);
      if (!(data.missing || []).length) setNote(`Every paid website order from the last ${data.days} days is already here.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function importOne(row) {
    setBusy(row.id);
    setNote('');
    setError('');
    try {
      const res = await fetch('/api/admin/orders/import-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not import that order.');
      if (data.failed && data.failed.length) throw new Error(data.failed.map((f) => f.reason).join('; '));
      setNote(data.recorded?.length ? `Imported ${row.name || row.email} ($${(row.total_cents / 100).toFixed(2)}). It is in the list below.` : 'That order was already here.');
      setList((current) => (current || []).filter((r) => r.id !== row.id));
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="admin-card">
      <h2 className="admin-heading">Import paid orders from Stripe</h2>
      <p className="admin-muted">Lists paid website orders that are in Stripe but not here. Import only the ones you choose: each gets the card fraud check, nothing is emailed, and the rest are left alone.</p>
      <div className="bp-inline">
        <label htmlFor="import-days">Look back</label>
        <input id="import-days" type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} style={{ maxWidth: '6rem' }} />
        <span>days</span>
        <button type="button" className="btn btn-primary btn-sm" onClick={find} disabled={Boolean(busy)}>{busy === 'find' ? 'Looking…' : 'Find missing orders'}</button>
        {list && list.length > 0 && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setList(null); setNote(''); }} disabled={Boolean(busy)}>Clear list</button>
        )}
      </div>
      {list && list.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Paid</th><th>Customer</th><th>Items</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td>{formatDateTime(new Date(row.created * 1000).toISOString())}</td>
                  <td>{row.name || row.email}{row.name && row.email ? <div className="admin-muted">{row.email}</div> : null}</td>
                  <td>{row.items}</td>
                  <td>${(row.total_cents / 100).toFixed(2)}</td>
                  <td><button type="button" className="btn btn-primary btn-sm" onClick={() => importOne(row)} disabled={Boolean(busy)}>{busy === row.id ? 'Importing…' : 'Import'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {note && <p className="form-note-banner" role="status">{note}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
