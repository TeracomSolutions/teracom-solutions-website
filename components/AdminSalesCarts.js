'use client';

import { useEffect, useState } from 'react';

import { cents } from '@/lib/orderView';
import { formatDateTime } from '@/lib/adminFormat';

// Sales > Carts: saved carts of signed-in customers and checkouts that expired or failed, with the two
// switches that turn the recording on (Robert, 2026-10-25). Both are off until the privacy policy covers them.
export default function AdminSalesCarts() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load(range = days) {
    try {
      const response = await fetch('/api/admin/sales/carts?days=' + range, { cache: 'no-store' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The carts could not be loaded.');
      setData(body);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(days); }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggle(name, value) {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/sales/carts', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [name]: value }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'That did not save.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <section className="admin-card"><h2 style={{ marginTop: 0 }}>Carts and unfinished checkouts</h2>{error ? <p className="form-error">{error}</p> : <p className="admin-muted">Loading...</p>}</section>;

  const { settings, counts, checkouts } = data;
  return (
    <section className="admin-card">
      <div className="marketing-head">
        <h2 style={{ margin: 0 }}>Carts and unfinished checkouts</h2>
        <span>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Period">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>{' '}
          <a className="btn btn-secondary btn-sm" href="/api/admin/sales/carts.csv">Download CSV</a>
        </span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="sales-carts-switches">
        <label className="marketing-check">
          <input type="checkbox" checked={settings.carts} disabled={busy} onChange={(e) => toggle('carts', e.target.checked)} />
          <strong>Save signed-in customers&apos; carts</strong> <span className="admin-muted">Off: nothing is saved. Turn on only once the privacy policy says carts are saved.</span>
        </label>
        <label className="marketing-check">
          <input type="checkbox" checked={settings.checkouts} disabled={busy} onChange={(e) => toggle('checkouts', e.target.checked)} />
          <strong>Record expired and failed checkouts</strong> <span className="admin-muted">Off: nothing is recorded. Also needs the checkout.session.expired event switched on in Stripe.</span>
        </label>
      </div>
      <div className="sales-carts-figures">
        <div><span className="admin-muted">Active carts</span><strong>{counts.active}</strong></div>
        <div><span className="admin-muted">Abandoned</span><strong>{counts.abandoned}</strong></div>
        <div><span className="admin-muted">Expired</span><strong>{counts.expired}</strong></div>
        <div><span className="admin-muted">Became orders</span><strong>{counts.converted}</strong></div>
        <div><span className="admin-muted">Left behind (value)</span><strong>{cents(data.abandoned_value_cents)}</strong></div>
        <div><span className="admin-muted">Checkouts expired / failed</span><strong>{checkouts.expired} / {checkouts.failed}</strong></div>
      </div>
      <h3>Products left behind most</h3>
      {data.top_abandoned.length === 0 ? <p className="admin-muted">None yet.</p> : (
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Product</th><th>Carts</th><th>Units</th><th>Value</th></tr></thead>
          <tbody>{data.top_abandoned.map((row) => (
            <tr key={row.sku}><td>{row.name} <span className="admin-muted">{row.sku}</span></td><td>{row.carts}</td><td>{row.units}</td><td>{cents(row.value_cents)}</td></tr>
          ))}</tbody>
        </table></div>
      )}
      <h3>Recent expired and failed checkouts</h3>
      {data.recent_checkouts.length === 0 ? <p className="admin-muted">None yet.</p> : (
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>When</th><th>What happened</th><th>Customer</th><th>Items</th><th>Value</th></tr></thead>
          <tbody>{data.recent_checkouts.map((row, index) => (
            <tr key={index}><td>{formatDateTime(row.when)}</td><td>{row.outcome === 'checkout_expired' ? 'Checkout expired' : 'Payment failed'}{row.live ? '' : ' (test)'}</td><td>{row.email || ''}</td><td>{row.items}</td><td>{cents(row.value_cents)}</td></tr>
          ))}</tbody>
        </table></div>
      )}
      <p className="admin-muted">Saved carts belong to signed-in customers only, at shelf prices. Carts count as abandoned after an hour untouched and expired after 30 days; everything is removed after 90 days.</p>
    </section>
  );
}
