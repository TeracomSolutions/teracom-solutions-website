'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CHANNEL_LABELS, WEEKDAYS, campaignPayload, campaignStateText, campaignStateTone, emptyCampaign, hourLabel } from '@/lib/marketingView';

async function call(path, method, body) {
  const response = await fetch('/api/admin/marketing' + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

function CampaignForm({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial);
  const set = (name) => (event) => setForm({ ...form, [name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });
  return (
    <form className="admin-form marketing-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <label>Name of the special<input value={form.title} onChange={set('title')} maxLength={200} required placeholder="Hikvision domes 15% off" /></label>
      <label>The offer in plain words (used in the weekly update)
        <textarea value={form.offer} onChange={set('offer')} maxLength={2000} required rows={3} placeholder="15% off every Hikvision dome camera until Sunday." />
      </label>
      <label>Banner line on the website (short)<input value={form.banner_text || ''} onChange={set('banner_text')} maxLength={160} placeholder="15% off Hikvision domes this week" /></label>
      <label>Link (a page on the site such as /store/cctv, or https://...)<input value={form.link_url || ''} onChange={set('link_url')} maxLength={500} /></label>
      <label>Coupon code (optional; make it under Coupons first)<input value={form.coupon_code || ''} onChange={set('coupon_code')} maxLength={100} /></label>
      <div className="marketing-form-row">
        <label>Starts<input type="date" value={form.starts_on} onChange={set('starts_on')} required /></label>
        <label>Ends (optional)<input type="date" value={form.ends_on || ''} onChange={set('ends_on')} /></label>
        <label>Status
          <select value={form.status} onChange={set('status')}>
            <option value="draft">Draft (not shown)</option>
            <option value="active">Active (shown while its dates run)</option>
            <option value="paused">Paused</option>
          </select>
        </label>
      </div>
      <label className="marketing-check"><input type="checkbox" checked={form.show_banner} onChange={set('show_banner')} /> Show in the website banner</label>
      <label className="marketing-check"><input type="checkbox" checked={form.in_weekly} onChange={set('in_weekly')} /> Include in the weekly specials update</label>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminMarketing({ initial }) {
  const [data, setData] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function act(work, note) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await work();
      setData(await call('', 'GET'));
      if (note) setMessage(note);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function save(form) {
    const body = campaignPayload(form);
    const ok = await act(() => (editing === 'new' ? call('/campaigns', 'POST', body) : call('/campaigns/' + editing, 'PUT', body)), 'Saved.');
    if (ok) setEditing(null);
  }

  async function prepare() {
    let result = null;
    await act(async () => { result = await call('/weekly/prepare', 'POST'); }, '');
    if (!result) return;
    if (result.status === 'made') setMessage('This week\'s specials update is ready as a draft in Social > Posting. Check it there and press Send.');
    else if (result.status === 'nothing_on') setMessage('Nothing is on this week, so no update was made.');
    else if (result.status === 'no_channels') setError('Choose at least one place to send it to first.');
  }

  const settings = data.settings;
  const saveSettings = (changes, note) => act(() => call('/settings', 'PUT', changes), note);
  const editingRow = editing && editing !== 'new' ? data.campaigns.find((c) => c.id === editing) : null;

  return (
    <>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-note-banner" role="status">{message}</p>}

      <section className="admin-card">
        <h2 style={{ marginTop: 0 }}>On the website now</h2>
        {data.banner.length === 0 ? (
          <p className="admin-muted">No banner is showing. A campaign shows in the banner when it is Active, between its start and end days, has a banner line, and Show in the website banner is ticked.</p>
        ) : (
          <div className="campaign-banner-preview">
            {data.banner.map((item) => (
              <p key={item.id}><strong>{item.text}</strong>{item.coupon_code ? ' Use code ' + item.coupon_code + '.' : ''}{item.link_url ? <span className="admin-muted"> ({item.link_url})</span> : null}</p>
            ))}
          </div>
        )}
      </section>

      <section className="admin-card">
        <div className="marketing-head">
          <h2 style={{ margin: 0 }}>Campaigns</h2>
          {!editing && <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>New campaign</button>}
        </div>
        {editing === 'new' && <CampaignForm initial={emptyCampaign()} onSave={save} onCancel={() => setEditing(null)} busy={busy} />}
        {editingRow && <CampaignForm key={editingRow.id} initial={{ ...editingRow, ends_on: editingRow.ends_on || '' }} onSave={save} onCancel={() => setEditing(null)} busy={busy} />}
        {data.campaigns.length === 0 && !editing ? <p className="admin-muted">No campaigns yet. Press New campaign to add this week&apos;s specials.</p> : null}
        {data.campaigns.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Special</th><th>Dates</th><th>State</th><th>Banner</th><th>Weekly</th><th /></tr></thead>
              <tbody>
                {data.campaigns.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.title}</strong><br /><span className="admin-muted">{c.banner_text || c.offer}</span></td>
                    <td>{c.starts_on}{c.ends_on ? ' to ' + c.ends_on : ' onwards'}</td>
                    <td><span className={`admin-status is-${campaignStateTone(c.state)}`}>{campaignStateText(c.state)}</span></td>
                    <td>{c.show_banner && c.banner_text ? 'Yes' : 'No'}</td>
                    <td>{c.in_weekly ? 'Yes' : 'No'}</td>
                    <td className="admin-actions">
                      <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => setEditing(c.id)}>Edit</button>
                      <button type="button" className="btn btn-secondary btn-sm" disabled={busy}
                        onClick={() => window.confirm('Delete the campaign "' + c.title + '"?') && act(() => call('/campaigns/' + c.id, 'DELETE'), 'Deleted.')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-card">
        <h2 style={{ marginTop: 0 }}>Weekly specials update</h2>
        <p className="admin-muted">Once a week the live campaigns are gathered into one update for customers and the social networks, made in <Link href="/admin/social">Social &gt; Posting</Link>. Emails only go to customers who agreed to marketing email, each with an unsubscribe link.</p>
        <label className="marketing-check">
          <input type="checkbox" checked={settings.enabled} disabled={busy} onChange={(e) => saveSettings({ enabled: e.target.checked }, e.target.checked ? 'The weekly update is on.' : 'The weekly update is off.')} />
          <strong>Make the weekly update</strong> <span className="admin-muted">Off: nothing is made.</span>
        </label>
        <label className="marketing-check">
          <input type="checkbox" checked={settings.auto_send} disabled={busy} onChange={(e) => saveSettings({ auto_send: e.target.checked }, e.target.checked ? 'It will be sent automatically.' : 'It will wait as a draft for you to send.')} />
          <strong>Send it automatically</strong> <span className="admin-muted">Off: it waits as a draft in Social &gt; Posting for someone to check and send.</span>
        </label>
        <p>
          Every{' '}
          <select value={settings.weekday} disabled={busy} onChange={(e) => saveSettings({ weekday: Number(e.target.value) }, 'Saved.')} aria-label="Day of the week">
            {WEEKDAYS.map((day, index) => <option key={day} value={index}>{day}</option>)}
          </select>{' '}at{' '}
          <select value={settings.hour} disabled={busy} onChange={(e) => saveSettings({ hour: Number(e.target.value) }, 'Saved.')} aria-label="Hour">
            {Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{hourLabel(hour)}</option>)}
          </select>{' '}Melbourne time
        </p>
        <fieldset className="marketing-channels">
          <legend>Send to</legend>
          {settings.channel_choices.map((channel) => (
            <label key={channel} className="marketing-check">
              <input type="checkbox" checked={settings.channels.includes(channel)} disabled={busy}
                onChange={(e) => saveSettings({ channels: e.target.checked ? [...settings.channels, channel] : settings.channels.filter((c) => c !== channel) }, 'Saved.')} />
              {CHANNEL_LABELS[channel] || channel}
            </label>
          ))}
        </fieldset>
        <h3>This week&apos;s update would say</h3>
        {data.weekly_preview ? (
          <pre className="marketing-preview">{data.weekly_preview.title + '\n\n' + data.weekly_preview.body + '\n\n' + data.weekly_preview.link_url}</pre>
        ) : <p className="admin-muted">Nothing is on, so no update would be made.</p>}
        <button type="button" className="btn btn-secondary" disabled={busy || !data.weekly_preview} onClick={prepare}>Prepare this week&apos;s update now</button>
      </section>
    </>
  );
}
