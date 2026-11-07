'use client';

import { useState } from 'react';

function clockText(iso, zone) {
  try {
    return new Date(iso).toLocaleString('en-AU', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone: zone, timeZoneName: 'short',
    });
  } catch {
    return '';
  }
}

export default function AdminTimeZone({ initial, zones, common }) {
  const [current, setCurrent] = useState(initial);
  const [choice, setChoice] = useState(initial.zone);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [clock, setClock] = useState(null);

  const others = zones.filter((z) => !common.includes(z));

  async function save() {
    setBusy('save');
    setError('');
    setSaved('');
    try {
      const response = await fetch('/api/admin/time', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ zone: choice }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to save the time zone.');
      setCurrent(result);
      setSaved('Saved. Every page now shows times in this zone; reload a page that is already open.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function check() {
    setBusy('clock');
    setError('');
    try {
      const response = await fetch('/api/admin/time/clock-check', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to check the clock.');
      setClock(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  const offsetText = clock && clock.offset_ms != null
    ? (Math.abs(clock.offset_ms) < 1000 ? `${clock.offset_ms} ms` : `${(clock.offset_ms / 1000).toFixed(1)} seconds`)
    : '';

  return (
    <div className="admin-card" style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
      <div>
        <h2 className="admin-subheading">Time zone</h2>
        <p className="admin-muted">
          Every time in the console and in the Assistant&apos;s answers is shown in this zone, with its name beside it. The server itself keeps all times in UTC, so changing this never moves anything already recorded or scheduled (for example, article publishing slots stay on Melbourne time).
        </p>
        <p>
          Now in <strong>{current.zone.replace(/_/g, ' ')}</strong>: {clockText(current.now, current.zone)} ({current.offset})
        </p>
        <label className="field-label" htmlFor="time-zone-select">Show times in</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select id="time-zone-select" value={choice} onChange={(e) => setChoice(e.target.value)} style={{ minWidth: 280 }}>
            <optgroup label="Common">
              {common.map((z) => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
            </optgroup>
            <optgroup label="All zones">
              {others.map((z) => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
            </optgroup>
          </select>
          <button type="button" className="btn btn-primary" onClick={save} disabled={busy === 'save' || choice === current.zone}>
            {busy === 'save' ? 'Saving…' : 'Save'}
          </button>
        </div>
        {saved ? <p role="status">{saved}</p> : null}
      </div>

      <div>
        <h2 className="admin-subheading">Server clock</h2>
        <p className="admin-muted">Compares the website server&apos;s clock with an internet time source (NTP). A clock that is more than a second out can make scheduled posts, sign-in codes and logs disagree.</p>
        <button type="button" className="btn" onClick={check} disabled={busy === 'clock'}>
          {busy === 'clock' ? 'Checking…' : 'Check the clock'}
        </button>
        {clock ? (
          clock.source ? (
            <p role="status">
              {clock.status === 'ok' ? 'In step.' : clock.status === 'attention' ? 'Slightly out.' : 'Out of step.'}{' '}
              The server is {Math.abs(clock.offset_ms) < 1 ? 'exactly in step with' : `${offsetText} ${clock.offset_ms > 0 ? 'behind' : 'ahead of'}`} {clock.source} (round trip {clock.round_trip_ms} ms).
            </p>
          ) : (
            <p className="form-error" role="alert">{clock.detail}</p>
          )
        ) : null}
      </div>

      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
