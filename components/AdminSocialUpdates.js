'use client';

import { useEffect, useState } from 'react';

import {
  CHANNELS,
  X_LIMIT,
  channelLabel,
  describeAudience,
  isInFlight,
  statusLabel,
  statusTone,
  summariseDeliveries,
  updateWhen,
  validateUpdate,
  xLength,
} from '@/lib/socialFormat';

// The composer and the history. One update goes to every ticked network and,
// with Customer email, to every customer who agreed to marketing email.
async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'The backend did not accept that.');
  return data;
}

const EMPTY = { title: '', body: '', link_url: '', image_url: '', channels: [], audienceMode: 'all', tiers: '', scheduled_at: '' };

export default function AdminSocialUpdates({ initialUpdates, loadError }) {
  const [updates, setUpdates] = useState(initialUpdates || []);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(loadError || '');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  const usesX = form.channels.includes('x');
  const xCount = xLength(form.body, form.link_url);

  async function reload() {
    setUpdates(await send('/api/admin/social/updates', 'GET'));
  }

  // While something is scheduled or sending, refresh every ten seconds so
  // the per-channel results appear without a reload.
  useEffect(() => {
    if (!updates.some(isInFlight)) return undefined;
    const timer = setInterval(() => {
      reload().catch(() => {});
    }, 10000);
    return () => clearInterval(timer);
  }, [updates]);

  function set(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleChannel(key) {
    setForm((current) => ({
      ...current,
      channels: current.channels.includes(key) ? current.channels.filter((c) => c !== key) : [...current.channels, key],
    }));
  }

  function payload(extra) {
    const tiers = form.tiers.split(',').map((t) => t.trim()).filter(Boolean);
    return {
      title: form.title.trim(),
      body: form.body.trim(),
      link_url: form.link_url.trim() || null,
      image_url: form.image_url.trim() || null,
      channels: form.channels,
      audience: form.audienceMode === 'tiers' && tiers.length ? { tiers } : { all: true },
      ...extra,
    };
  }

  async function submit(mode) {
    const found = validateUpdate(form);
    if (mode === 'schedule' && !form.scheduled_at) found.push('Choose the date and time to send.');
    if (form.audienceMode === 'tiers' && !form.tiers.trim()) found.push('Name at least one tier, or choose all customers.');
    setErrors(found);
    if (found.length) return;
    if (mode === 'now') {
      const where = form.channels.map(channelLabel).join(', ');
      if (!window.confirm(`Send "${form.title.trim()}" now to ${where}? This cannot be recalled.`)) return;
    }
    setBusy(mode);
    setError('');
    setNotice('');
    try {
      const body = payload(mode === 'now' ? { send_now: true } : mode === 'schedule' ? { scheduled_at: form.scheduled_at } : {});
      await send('/api/admin/social/updates', 'POST', body);
      setForm(EMPTY);
      setNotice(mode === 'now' ? 'Sending now; each channel reports below within a minute.' : mode === 'schedule' ? 'Scheduled.' : 'Draft saved.');
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function act(update, action) {
    const label = `${action}:${update.id}`;
    if (action === 'send' && !window.confirm(`Send "${update.title}" now to ${(update.channels || []).map(channelLabel).join(', ')}?`)) return;
    if (action === 'delete' && !window.confirm(`Delete "${update.title}"?`)) return;
    setBusy(label);
    setError('');
    setNotice('');
    try {
      if (action === 'delete') await send(`/api/admin/social/updates/${update.id}`, 'DELETE');
      else await send(`/api/admin/social/updates/${update.id}/${action}`, 'POST');
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <section className="admin-social">
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}

      <form className="admin-form admin-card" onSubmit={(e) => { e.preventDefault(); submit('draft'); }}>
        <h3>New update</h3>
        {errors.length > 0 && (
          <ul className="form-error" role="alert">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}
        <label>
          Title
          <input value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={200} required />
          <span className="admin-muted">The email subject and the headline on LinkedIn and Facebook.</span>
        </label>
        <label>
          Update
          <textarea value={form.body} onChange={(e) => set('body', e.target.value)} rows={6} maxLength={3000} required />
          <span className={usesX && xCount > X_LIMIT ? 'form-error' : 'admin-muted'}>
            {usesX ? `${xCount} of ${X_LIMIT} characters for X (a link counts as 24)` : `${form.body.length} of 3000 characters`}
          </span>
        </label>
        <label>
          Link (optional)
          <input type="url" value={form.link_url} onChange={(e) => set('link_url', e.target.value)} maxLength={500} placeholder="https://www.teracomsolutions.com.au/..." />
        </label>
        <label>
          Image link (needed for Instagram)
          <input type="url" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} maxLength={500} placeholder="https://" />
        </label>

        <fieldset className="admin-social-channels">
          <legend>Send to</legend>
          {CHANNELS.map((channel) => (
            <label key={channel.key} className="admin-check">
              <input type="checkbox" checked={form.channels.includes(channel.key)} onChange={() => toggleChannel(channel.key)} />
              {channel.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="admin-social-channels">
          <legend>Customer email goes to</legend>
          <label className="admin-check">
            <input type="radio" name="audience" checked={form.audienceMode === 'all'} onChange={() => set('audienceMode', 'all')} />
            Everyone who agreed to hear from us
          </label>
          <label className="admin-check">
            <input type="radio" name="audience" checked={form.audienceMode === 'tiers'} onChange={() => set('audienceMode', 'tiers')} />
            Only these pricing tiers
          </label>
          {form.audienceMode === 'tiers' && (
            <input value={form.tiers} onChange={(e) => set('tiers', e.target.value)} placeholder="Gold, Silver" aria-label="Pricing tiers, comma separated" />
          )}
        </fieldset>

        <label>
          Send at (optional)
          <input type="datetime-local" value={form.scheduled_at} onChange={(e) => set('scheduled_at', e.target.value)} />
          <span className="admin-muted">Melbourne time. A scheduled update goes within 15 minutes of its time.</span>
        </label>

        <div className="admin-actions">
          <button type="submit" className="btn btn-secondary btn-sm" disabled={Boolean(busy)}>{busy === 'draft' ? 'Saving…' : 'Save draft'}</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => submit('schedule')} disabled={Boolean(busy)}>{busy === 'schedule' ? 'Scheduling…' : 'Schedule'}</button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => submit('now')} disabled={Boolean(busy)}>{busy === 'now' ? 'Sending…' : 'Send now'}</button>
        </div>
      </form>

      <h3>History</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Title</th>
              <th>Channels</th>
              <th>Audience</th>
              <th>Status</th>
              <th>Result</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {updates.length === 0 && (
              <tr><td colSpan={7} className="admin-muted">No updates yet.</td></tr>
            )}
            {updates.map((update) => (
              <tr key={update.id}>
                <td>{updateWhen(update)}</td>
                <td><strong>{update.title}</strong></td>
                <td>{(update.channels || []).map(channelLabel).join(', ')}</td>
                <td>{(update.channels || []).includes('email') ? describeAudience(update.audience) : '—'}</td>
                <td><span className={`admin-pill admin-pill-${statusTone(update.status)}`}>{statusLabel(update.status)}</span></td>
                <td className="admin-muted">{summariseDeliveries(update.deliveries) || '—'}</td>
                <td>
                  <div className="admin-actions">
                    {['draft', 'scheduled', 'failed'].includes(update.status) && (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => act(update, 'send')} disabled={Boolean(busy)}>Send now</button>
                    )}
                    {['draft', 'scheduled'].includes(update.status) && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => act(update, 'cancel')} disabled={Boolean(busy)}>Cancel</button>
                    )}
                    {['draft', 'cancelled'].includes(update.status) && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => act(update, 'delete')} disabled={Boolean(busy)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
