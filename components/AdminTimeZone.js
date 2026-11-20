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
  const [ntp, setNtp] = useState((initial.ntp_servers || []).join(', '));
  const [ntpSaved, setNtpSaved] = useState('');
  const [sync, setSync] = useState(null);

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

  async function saveNtp() {
    setBusy('ntp');
    setError('');
    setNtpSaved('');
    try {
      const servers = ntp.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
      const response = await fetch('/api/admin/time/ntp', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ servers }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to save the NTP servers.');
      setNtp(result.ntp_servers.join(', '));
      setNtpSaved(result.applied ? result.applied.detail : 'Saved. The next clock check asks these servers.');
      if (result.sync) setSync(result.sync);
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
    <div className="admin-card bp-section bp-time-card">
      <div>
        <h2 className="admin-subheading">Time zone</h2>
        <p className="admin-muted">
          Every time in the console and in the Assistant&apos;s answers is shown in this zone, with its name beside it. The backend follows it too: sales days, posting and article slots, business hours for outreach emails and the times in emails. The server keeps every moment in UTC, so changing it never moves anything already recorded.
        </p>
        <p>
          Now in <strong>{current.zone.replace(/_/g, ' ')}</strong>: {clockText(current.now, current.zone)} ({current.offset})
        </p>
        <label className="field-label" htmlFor="time-zone-select">Show times in</label>
        <div className="bp-inline">
          <select id="time-zone-select" value={choice} onChange={(e) => setChoice(e.target.value)}>
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
        <p className="admin-muted">Compares the website server&apos;s clock with a time source (NTP). A clock that is more than a second out can make scheduled posts, sign-in codes and logs disagree.</p>
        <label className="field-label" htmlFor="ntp-pick">Time source</label>
        <div className="bp-inline">
          <select id="ntp-pick" value="" onChange={(e) => {
            const host = e.target.value;
            if (!host) return;
            const list = ntp.split(/[\s,]+/).filter(Boolean);
            if (!list.includes(host)) setNtp([...list, host].slice(-3).join(', '));
          }}>
            <option value="">Add a common source…</option>
            {(initial.ntp_choices || []).map((c) => <option key={c.host} value={c.host}>{c.label} ({c.host})</option>)}
          </select>
        </div>
        <label className="field-label" htmlFor="ntp-servers">NTP servers, in order (the first that answers is used)</label>
        <div className="bp-inline">
          <input id="ntp-servers" type="text" value={ntp} onChange={(e) => setNtp(e.target.value)}
            placeholder={(initial.ntp_default || []).join(', ')} />
          <button type="button" className="btn btn-secondary" onClick={saveNtp} disabled={busy === 'ntp'}>
            {busy === 'ntp' ? 'Saving…' : 'Save servers'}
          </button>
          <button type="button" className="btn btn-primary" onClick={check} disabled={busy === 'clock'}>
            {busy === 'clock' ? 'Checking…' : 'Check the clock'}
          </button>
        </div>
        <p className="admin-muted">Up to three, separated by commas: pick from the list or type a name or an address, such as the office router. Saving also sets the server&apos;s own clock to follow them. Leave it empty for the defaults.</p>
        {ntpSaved ? <p role="status">{ntpSaved}</p> : null}
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
        {(sync || clock?.sync) ? (
          <p className="admin-muted">
            The server&apos;s own clock {(sync || clock.sync).synchronised ? 'is kept in step' : 'is NOT in step yet'}{(sync || clock.sync).server ? ` by ${(sync || clock.sync).server}` : ''}.
          </p>
        ) : null}
      </div>

      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
