'use client';

import { useState } from 'react';

// AI Connections -> Automatic checks (Robert, 2026-10-21): the connections are
// checked on a schedule, and a failing one is retried a few times so a dropped
// connection comes back by itself.

const EVERY_LABELS = {
  15: 'every 15 minutes',
  30: 'every 30 minutes',
  60: 'every hour',
  180: 'every 3 hours',
  360: 'every 6 hours',
  720: 'every 12 hours',
  1440: 'once a day',
};

async function call(path, method, body) {
  const response = await fetch('/api/admin/ai-connections/auto-check/' + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

function when(iso) {
  if (!iso) return 'not yet';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'not yet';
  return d.toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function AdminAiAutoCheck({ initial }) {
  const [state, setState] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!state) return null;

  async function change(changes, note) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      setState(await call('settings', 'PUT', changes));
      setMessage(note);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function runNow() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await call('run', 'POST');
      setMessage('Checking every connection now. A failing one is retried, so this can take a few minutes; reload the page to see the result.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const results = Object.entries(state.last_results || {});

  return (
    <section className="admin-card" style={{ marginTop: '24px' }}>
      <h2 style={{ marginTop: 0 }}>Automatic checks</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Check every enabled connection on a schedule. A connection that fails is tried again a few times, a little later each time, so a dropped connection comes back by itself. If it is still failing after the retries it is recorded in the Audit log.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-note-banner" role="status">{message}</p>}
      <label style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '8px 0' }}>
        <input
          type="checkbox"
          checked={state.enabled}
          disabled={busy}
          onChange={(event) => change({ enabled: event.target.checked }, event.target.checked ? 'Automatic checks are on.' : 'Automatic checks are off.')}
        />
        <strong>Check automatically</strong>
      </label>
      <p style={{ margin: '8px 0' }}>
        <label>
          <span className="admin-muted">How often </span>
          <select
            value={state.every_minutes}
            disabled={busy}
            onChange={(event) => change({ every_minutes: Number(event.target.value) }, 'Checking ' + EVERY_LABELS[event.target.value] + '.')}
            aria-label="How often to check the AI connections"
          >
            {state.every_choices.map((minutes) => (
              <option key={minutes} value={minutes}>{EVERY_LABELS[minutes] || minutes + ' minutes'}</option>
            ))}
          </select>
        </label>
        {' '}
        <label>
          <span className="admin-muted">Retries when one fails </span>
          <select
            value={state.retries}
            disabled={busy}
            onChange={(event) => change({ retries: Number(event.target.value) }, 'Retries: ' + event.target.value + '.')}
            aria-label="How many times to retry a failing connection"
          >
            {Array.from({ length: state.max_retries + 1 }, (_, n) => (
              <option key={n} value={n}>{n === 0 ? 'none' : n}</option>
            ))}
          </select>
        </label>
      </p>
      <p className="admin-muted" style={{ margin: '8px 0' }}>
        Retries wait 20 seconds, then 1, 3, 5 and 10 minutes. Last automatic run: {when(state.last_finished_at)}.
      </p>
      <button type="button" className="btn btn-secondary btn-sm" onClick={runNow} disabled={busy}>
        Check all now
      </button>
      {results.length > 0 && (
        <ul style={{ margin: '12px 0 0', paddingLeft: '18px' }}>
          {results.map(([provider, item]) => (
            <li key={provider}>
              <strong>{provider}</strong>: {item.ok ? 'responding' : 'failing'} ({item.attempts} {item.attempts === 1 ? 'try' : 'tries'}, {when(item.at)})
              {item.error ? <span className="admin-muted"> {item.error}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
