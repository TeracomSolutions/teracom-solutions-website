'use client';

import { useEffect, useState } from 'react';

import ChannelPanel from '@/components/posting/ChannelPanel';
import MediaUploader from '@/components/posting/MediaUploader';
import StartFromLink from '@/components/posting/StartFromLink';
import {
  CHANNELS,
  channelLabel,
  describeAudience,
  isInFlight,
  statusLabel,
  statusTone,
  summariseDeliveries,
  updateWhen,
} from '@/lib/socialFormat';
import { checkPost } from '@/lib/socialRules';

// Posting: write once, add pictures or a video, tick where it goes, adjust
// the text per network with a preview and checklist, then save, schedule or
// send. The history below shows each network's result and a link to the post.
const TITLED = ['linkedin', 'facebook', 'instagram'];
const EMPTY = { title: '', body: '', link_url: '', channels: [], audienceMode: 'all', tiers: '', scheduled_at: '' };

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || (typeof data.detail === 'string' ? data.detail : '') || 'The backend did not accept that.');
    err.problems = data.problems || null;
    throw err;
  }
  return data;
}

// The text a network gets, as the panel shows it and the backend posts it
// (the link is added by the network rules, not here).
function channelText(channel, form, overrides) {
  const own = overrides[channel];
  if (own !== null && own !== undefined) return own;
  const title = form.title.trim();
  return TITLED.includes(channel) && title ? `${title}\n\n${form.body}` : form.body;
}

export default function AdminSocialPosting({ initialUpdates, accounts, audienceCount, loadError }) {
  const [updates, setUpdates] = useState(initialUpdates || []);
  const [form, setForm] = useState(EMPTY);
  const [media, setMedia] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [activeChannel, setActiveChannel] = useState('');
  const [errors, setErrors] = useState([]);
  const [problems, setProblems] = useState(null);
  const [error, setError] = useState(loadError || '');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [nextFree, setNextFree] = useState('');

  const accountFor = (network) => (accounts || []).find((a) => a.network === network);
  const active = form.channels.includes(activeChannel) ? activeChannel : form.channels[0];

  async function reload() {
    setUpdates(await send('/api/admin/social/updates', 'GET'));
  }

  // While something is scheduled or sending, refresh every ten seconds so
  // the per-network results appear without a reload.
  useEffect(() => {
    if (!updates.some(isInFlight)) return undefined;
    const timer = setInterval(() => {
      reload().catch(() => {});
    }, 10000);
    return () => clearInterval(timer);
  }, [updates]);

  const channelKey = form.channels.join(",");

  // The next free time for the ticked networks (Add to queue uses it).
  useEffect(() => {
    let cancelled = false;
    const channels = channelKey ? channelKey.split(",") : [];

    if (channels.length === 0) {
      setNextFree('');
      return;
    }
    
    async function fetchNextSlot() {
      try {
        const response = await fetch('/api/admin/social/next-slot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channels }),
        });
        
        const data = await response.json();
        
        if (!cancelled) {
          setNextFree(response.ok ? data.label || '' : '');
        }
      } catch {
        if (!cancelled) {
          setNextFree('');
        }
      }
    }
    
    fetchNextSlot();
    
    return () => {
      cancelled = true;
    };
  }, [channelKey]);

  function set(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleChannel(key) {
    setForm((current) => ({
      ...current,
      channels: current.channels.includes(key) ? current.channels.filter((c) => c !== key) : [...current.channels, key],
    }));
  }

  function setOverride(channel, value) {
    setOverrides((current) => {
      const next = { ...current };
      if (value === null || value === undefined) delete next[channel];
      else next[channel] = value;
      return next;
    });
  }

  function localProblems() {
    const found = {};
    for (const channel of form.channels) {
      const text = channelText(channel, form, overrides);
      const messages = checkPost(channel, { text, linkUrl: form.link_url.trim(), media })
        .filter((p) => p.level === 'error')
        .map((p) => p.message);
      if (messages.length) found[channel] = messages;
    }
    return Object.keys(found).length ? found : null;
  }

  function payload(extra) {
    const tiers = form.tiers.split(',').map((t) => t.trim()).filter(Boolean);
    const own = Object.fromEntries(
      Object.entries(overrides).filter(([channel, value]) => form.channels.includes(channel) && value && value.trim()),
    );
    return {
      title: form.title.trim(),
      body: form.body.trim(),
      link_url: form.link_url.trim() || null,
      channels: form.channels,
      audience: form.audienceMode === 'tiers' && tiers.length ? { tiers } : { all: true },
      media_ids: media.map((m) => m.id),
      overrides: own,
      ...extra,
    };
  }

  function applyDraft(draft) {
    setForm((current) => ({ ...current, title: draft.title || current.title, body: draft.text || current.body, link_url: draft.link_url || current.link_url }));
    setOverrides({ ...(draft.overrides || {}) });
    setNotice('A draft was written from the link. Check each network tab before posting.');
  }

  async function submit(mode) {
    const found = [];
    if (!form.title.trim()) found.push('Give the post a title.');
    if (!form.body.trim()) found.push('Write the text.');
    if (!form.channels.length) found.push('Tick at least one place to post.');
    if (mode === 'schedule' && !form.scheduled_at) found.push('Choose the date and time to send.');
    if (form.channels.includes('email') && form.audienceMode === 'tiers' && !form.tiers.trim()) {
      found.push('Name at least one tier, or choose all customers.');
    }
    const checks = localProblems();
    setErrors(found);
    setProblems(checks);
    if (found.length || checks) return;
    if (mode === 'now') {
      const where = form.channels.map(channelLabel).join(', ');
      if (!window.confirm(`Send "${form.title.trim()}" now to ${where}? This cannot be recalled.`)) return;
    }
    setBusy(mode);
    setError('');
    setNotice('');
    try {
      const body = payload(mode === 'now' ? { send_now: true } : mode === 'schedule' ? { scheduled_at: form.scheduled_at } : mode === 'queue' ? { queue: true } : {});
      const response = await send('/api/admin/social/updates', 'POST', body);
      setForm(EMPTY);
      setMedia([]);
      setOverrides({});
      if (mode === 'queue') {
        const when = new Date(response.scheduled_at).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
        setNotice(`Queued for ${when}.`);
      } else {
        setNotice(mode === 'now' ? 'Sending now; each network reports below within a minute.' : mode === 'schedule' ? 'Scheduled.' : 'Draft saved.');
      }
      await reload();
    } catch (err) {
      setError(err.message);
      setProblems(err.problems);
    } finally {
      setBusy('');
    }
  }

  async function act(update, action) {
    if (action === 'send' && !window.confirm(`Send "${update.title}" now to ${(update.channels || []).map(channelLabel).join(', ')}?`)) return;
    if (action === 'delete' && !window.confirm(`Delete "${update.title}"?`)) return;
    setBusy(`${action}:${update.id}`);
    setError('');
    setNotice('');
    setProblems(null);
    try {
      if (action === 'delete') await send(`/api/admin/social/updates/${update.id}`, 'DELETE');
      else await send(`/api/admin/social/updates/${update.id}/${action}`, 'POST');
      await reload();
    } catch (err) {
      setError(err.message);
      setProblems(err.problems);
    } finally {
      setBusy('');
    }
  }

  return (
    <section className="admin-social">
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}

      <form className="admin-form admin-card" onSubmit={(e) => { e.preventDefault(); submit('draft'); }}>
        <h3>Write</h3>
        <StartFromLink onDraft={applyDraft} onPicture={(item) => setMedia((current) => [...current, item])} />
        <label>
          Title
          <input value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={200} required />
          <span className="admin-muted">The email subject, the name in the history, and the headline on LinkedIn, Facebook and Instagram.</span>
        </label>
        <label>
          Text
          <textarea value={form.body} onChange={(e) => set('body', e.target.value)} rows={6} maxLength={5000} required />
        </label>
        <label>
          Link (optional)
          <input type="url" value={form.link_url} onChange={(e) => set('link_url', e.target.value)} maxLength={500} placeholder="https://www.teracomsolutions.com.au/..." />
        </label>

        <h3>Pictures or video</h3>
        <MediaUploader media={media} onChange={setMedia} />

        <h3>Where</h3>
        <div className="posting-where">
          {CHANNELS.map((channel) => {
            const account = channel.key === 'email' ? null : accountFor(channel.key);
            const available = channel.key === 'email' || Boolean(account?.configured);
            return (
              <label key={channel.key} className={available ? 'admin-check' : 'admin-check is-off'}>
                <input
                  type="checkbox"
                  checked={form.channels.includes(channel.key)}
                  onChange={() => toggleChannel(channel.key)}
                  disabled={!available}
                />
                {channel.label}
                {!available && <span className="admin-muted"> (set up under Accounts)</span>}
              </label>
            );
          })}
        </div>

        {form.channels.includes('email') && (
          <fieldset className="admin-social-channels">
            <legend>Customer email goes to</legend>
            <label className="admin-check">
              <input type="radio" name="audience" checked={form.audienceMode === 'all'} onChange={() => set('audienceMode', 'all')} />
              Everyone who agreed to hear from us{audienceCount != null ? ` (${audienceCount} customers)` : ''}
            </label>
            <label className="admin-check">
              <input type="radio" name="audience" checked={form.audienceMode === 'tiers'} onChange={() => set('audienceMode', 'tiers')} />
              Only these pricing tiers
            </label>
            {form.audienceMode === 'tiers' && (
              <input value={form.tiers} onChange={(e) => set('tiers', e.target.value)} placeholder="Gold, Silver" aria-label="Pricing tiers, comma separated" />
            )}
          </fieldset>
        )}

        {form.channels.length > 0 && (
          <>
            <div className="admin-tabs" role="tablist" aria-label="Preview per network">
              {form.channels.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active === key}
                  className={active === key ? 'admin-tab active' : 'admin-tab'}
                  onClick={() => setActiveChannel(key)}
                >
                  {channelLabel(key)}
                </button>
              ))}
            </div>
            {active && (
              <ChannelPanel
                key={active}
                channel={active}
                label={channelLabel(active)}
                accountName={accountFor(active)?.display_name || ''}
                mainText={form.body}
                override={overrides[active]}
                onOverride={(value) => setOverride(active, value)}
                linkUrl={form.link_url}
                title={form.title}
                media={media}
              />
            )}
          </>
        )}

        <h3>When</h3>
        <label>
          Send at (for Schedule)
          <input type="datetime-local" value={form.scheduled_at} onChange={(e) => set('scheduled_at', e.target.value)} />
          <span className="admin-muted">Melbourne time. A scheduled post goes within 15 minutes of its time.</span>
          {nextFree && <span className="admin-muted">Add to queue picks the next free time: {nextFree}.</span>}
        </label>

        {errors.length > 0 && (
          <ul className="form-error" role="alert">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}
        {problems && (
          <div className="form-error" role="alert">
            <p>Fix these before posting:</p>
            <ul>
              {Object.entries(problems).map(([channel, messages]) => (
                <li key={channel}><strong>{channelLabel(channel)}:</strong> {(messages || []).join(' ')}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="admin-actions">
          <button type="submit" className="btn btn-secondary btn-sm" disabled={Boolean(busy)}>{busy === 'draft' ? 'Saving…' : 'Save draft'}</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => submit('schedule')} disabled={Boolean(busy)}>{busy === 'schedule' ? 'Scheduling…' : 'Schedule'}</button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => submit('now')} disabled={Boolean(busy)}>{busy === 'now' ? 'Sending…' : 'Send now'}</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => submit('queue')} disabled={Boolean(busy)}>{busy === 'queue' ? 'Queuing…' : 'Add to queue'}</button>
        </div>
      </form>

      <h3>History</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Title</th>
              <th>Where</th>
              <th>Audience</th>
              <th>Status</th>
              <th>Result</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {updates.length === 0 && (
              <tr><td colSpan={7} className="admin-muted">Nothing posted yet.</td></tr>
            )}
            {updates.map((update) => {
              const first = (update.media || [])[0];
              const links = (update.deliveries || []).filter((d) => d.url);
              return (
                <tr key={update.id}>
                  <td>{updateWhen(update)}</td>
                  <td>
                    <div className="posting-history-title">
                      {first && first.kind === 'video' && <video className="posting-thumb" src={first.url} muted preload="metadata" />}
                      {first && first.kind !== 'video' && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="posting-thumb" src={first.url} alt={first.alt_text || ''} />
                      )}
                      <strong>{update.title}</strong>
                    </div>
                  </td>
                  <td>{(update.channels || []).map(channelLabel).join(', ')}</td>
                  <td>{(update.channels || []).includes('email') ? describeAudience(update.audience) : '—'}</td>
                  <td><span className={`admin-pill admin-pill-${statusTone(update.status)}`}>{statusLabel(update.status)}</span></td>
                  <td className="admin-muted">
                    {summariseDeliveries(update.deliveries) || '—'}
                    {links.length > 0 && (
                      <span className="posting-links">
                        {links.map((d) => (
                          <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer">View on {channelLabel(d.channel)}</a>
                        ))}
                      </span>
                    )}
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
