'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Import paid orders from Stripe: records paid checkouts that never reached the backend (Robert, 27 November 2026).
export default function AdminOrderImport() {
  const router = useRouter();
  const [days, setDays] = useState(90);
  const [paymentId, setPaymentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function run(one) {
    if (!one && !window.confirm(`This adds every paid website order from the last ${days} days that is not here yet, not just one. Go ahead?`)) return;
    setBusy(true);
    setNote('');
    setError('');
    try {
      const res = await fetch('/api/admin/orders/import-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(one ? { id: paymentId.trim() } : { days }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not import from Stripe.');
      const added = (data.recorded || []).map((o) => `${o.name} ($${(o.total_cents / 100).toFixed(2)})`).join(', ');
      setNote(data.id
        ? (data.recorded.length ? `Added ${added}.` : data.already ? 'That order is already here.' : 'Nothing was added: that payment is not a paid website order.')
        : `Checked ${data.checked} Stripe checkouts from the last ${data.days} days: ${data.recorded.length} added${added ? ` (${added})` : ''}, ${data.already} already here.`);
      if (data.failed && data.failed.length) setError(`${data.failed.length} could not be added: ${data.failed.map((f) => f.reason).join('; ')}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card">
      <h2 className="admin-heading">Import paid orders from Stripe</h2>
      <p className="admin-muted">Adds a paid website order that is in Stripe but not here. Orders already here are left alone, new ones get the card fraud check, and nothing is emailed.</p>
      <label className="field-label" htmlFor="import-one">One order: its Stripe payment ID (starts pi_, on the payment&apos;s page in Stripe under Payment ID)</label>
      <div className="bp-inline">
        <input id="import-one" type="text" value={paymentId} placeholder="pi_..." onChange={(e) => setPaymentId(e.target.value)} />
        <button type="button" className="btn btn-primary btn-sm" onClick={() => run(true)} disabled={busy || !/^(pi|cs)_/.test(paymentId.trim())}>{busy ? 'Importing…' : 'Import this order'}</button>
      </div>
      <label className="field-label" htmlFor="import-days">Or every missing order from the last</label>
      <div className="bp-inline">
        <input id="import-days" type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} style={{ maxWidth: '6rem' }} />
        <span>days</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => run(false)} disabled={busy}>{busy ? 'Importing…' : 'Import all missing orders'}</button>
      </div>
      {note && <p className="form-note-banner" role="status">{note}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
