'use client';

import { useEffect, useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';

// Make prices live automatically (Robert, 28 November 2026): a tick box, how often and at what hour.
const EVERY = { 1: 'Every day', 2: 'Every 2 days', 3: 'Every 3 days', 7: 'Every week', 14: 'Every 2 weeks' };
const hourLabel = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'am' : 'pm'}`;

export default function AdminPriceSchedule() {
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/pricing/schedule').then((r) => r.json()).then(setS).catch(() => setError('Could not load the schedule.'));
  }, []);

  async function save(changes) {
    const next = { ...s, ...changes };
    setS(next);
    setBusy(true);
    setNote('');
    setError('');
    try {
      const res = await fetch('/api/admin/pricing/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next.enabled, every_days: next.every_days, hour: next.hour }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'The schedule was not saved.');
      setS(data);
      setNote('Saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!s) return error ? <p className="form-error">{error}</p> : null;
  return (
    <div className="price-schedule">
      <h3>Make prices live automatically</h3>
      <label className="admin-check">
        <input type="checkbox" checked={Boolean(s.enabled)} disabled={busy} onChange={(e) => save({ enabled: e.target.checked })} />
        Prices updated on a schedule
      </label>
      <div className="bp-inline">
        <label htmlFor="price-every">How often</label>
        <select id="price-every" value={s.every_days} disabled={busy} onChange={(e) => save({ every_days: Number(e.target.value) })}>
          {(s.every_days_choices || [1, 2, 3, 7, 14]).map((d) => <option key={d} value={d}>{EVERY[d] || `Every ${d} days`}</option>)}
        </select>
        <label htmlFor="price-hour">at</label>
        <select id="price-hour" value={s.hour} disabled={busy} onChange={(e) => save({ hour: Number(e.target.value) })}>
          {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
        </select>
      </div>
      <p className="admin-muted">
        {s.enabled ? `Next: ${s.next_at ? formatDateTime(s.next_at) : 'soon'}. ` : 'Off: prices are made live only when someone presses the button. '}
        {s.last_at ? `Last automatic run: ${formatDateTime(s.last_at)}${s.last_result ? ` (${s.last_result})` : ''}.` : ''}
        {' '}It does what Make prices live now does. The supplier price lists are pulled by their own feeds on Data Feeds.
      </p>
      {s.last_error ? <p className="form-error">{s.last_error}</p> : null}
      {note ? <p className="form-note-banner" role="status">{note}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
