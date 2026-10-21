'use client';

import { useState } from 'react';

// Connections -> Zoho order flow (Robert, 2026-10-21): the switches for what the
// website may do in Zoho Books. Everything is off until it is turned on, and a
// function that is switched off is only shown as "would have sent". Live mode,
// the organisation ids and the live confirmation stay server settings.

async function send(changes) {
  const response = await fetch('/api/admin/connections/zoho-flow', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'The setting was not saved.');
  return data;
}

function Switch({ label, checked, onChange, hint, disabled }) {
  return (
    <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '8px 0' }}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span>
        <strong>{label}</strong>
        {hint ? <span className="admin-muted"> {hint}</span> : null}
      </span>
    </label>
  );
}

export default function AdminZohoFlow({ initial }) {
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
      setState(await send(changes));
      setMessage(note);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-card" style={{ marginTop: '24px' }}>
      <h2 style={{ marginTop: 0 }}>Zoho order flow</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        What the website may do in Zoho Books when an order is paid. Everything is off until you turn it on. A function that is switched off is not created in Zoho; it is recorded as would have sent. Live mode is set on the server.
      </p>
      <p><strong>{state.banner?.text}</strong></p>
      {(state.warnings || []).map((text) => (
        <p key={text} className="form-note-banner" role="status">{text}</p>
      ))}
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-note-banner" role="status">{message}</p>}

      <h3>The flow</h3>
      <Switch
        label="Order flow on"
        hint="Record paid orders and run the Zoho steps. Off: nothing happens."
        checked={state.flow_enabled}
        disabled={busy}
        onChange={(value) => change({ flow_enabled: value }, value ? 'The order flow is on.' : 'The order flow is off.')}
      />
      <Switch
        label="Send to Zoho"
        hint="Off: every step is only previewed and nothing reaches Zoho."
        checked={state.writes_enabled}
        disabled={busy}
        onChange={(value) => change({ writes_enabled: value }, value ? 'Writes to Zoho are on.' : 'Writes to Zoho are off.')}
      />
      <p style={{ margin: '10px 0' }}>
        <label>
          <span className="admin-muted">Mode </span>
          <select
            value={state.mode}
            disabled={busy}
            onChange={(event) => change({ mode: event.target.value }, 'The mode is ' + event.target.value + '.')}
            aria-label="Zoho order flow mode"
          >
            {state.mode_choices.map((mode) => (
              <option key={mode} value={mode}>{mode === 'preview' ? 'Preview (nothing is sent)' : 'Test (the Zoho test organisation only)'}</option>
            ))}
            {state.mode === 'live' && <option value="live" disabled>Live (set on the server)</option>}
          </select>
        </label>
      </p>

      <h3>What it may create in Zoho</h3>
      {state.functions.map((fn) => (
        <Switch
          key={fn.key}
          label={fn.label}
          hint={fn.description}
          checked={fn.enabled}
          disabled={busy}
          onChange={(value) => change({ functions: { [fn.key]: value } }, fn.label + (value ? ' are on.' : ' are off.'))}
        />
      ))}
    </section>
  );
}
