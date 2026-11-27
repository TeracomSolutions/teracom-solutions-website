'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Import paid orders from Stripe: records paid checkouts that never reached the backend (Robert, 27 November 2026).
export default function AdminOrderImport() {
  const router = useRouter();
  const [days, setDays] = useState(90);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function run() {
    setBusy(true);
    setNote('');
    setError('');
    try {
      const res = await fetch('/api/admin/orders/import-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not import from Stripe.');
      const added = (data.recorded || []).map((o) => `${o.name} ($${(o.total_cents / 100).toFixed(2)})`).join(', ');
      setNote(`Checked ${data.checked} Stripe checkouts from the last ${data.days} days: ${data.recorded.length} added${added ? ` (${added})` : ''}, ${data.already} already here.`);
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
      <p className="admin-muted">Adds any paid website order that is in Stripe but not here. Orders already here are left alone, new ones get the card fraud check, and nothing is emailed.</p>
      <div className="bp-inline">
        <label htmlFor="import-days">Days back</label>
        <input id="import-days" type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} style={{ maxWidth: '6rem' }} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={run} disabled={busy}>{busy ? 'Importing…' : 'Import paid orders'}</button>
      </div>
      {note && <p className="form-note-banner" role="status">{note}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
