'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { adminZone } from '@/lib/adminFormat';

const STATUS_LABELS = { draft: 'Draft', scheduled: 'Scheduled', published: 'Published', rejected: 'Rejected' };
const when = (iso) => (iso ? new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const slot = (iso) => (iso ? new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: adminZone(), timeZoneName: 'short' }).format(new Date(iso)) : '');
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const hourLabel = (h) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`;
const CHANNELS = [
  ['email', 'Email list'],
  ['linkedin', 'LinkedIn'],
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['x', 'X'],
];

// Articles from industry news: the weekly batch switch, Draft one now from a recent
// headline, and every draft and published article. Nothing reaches the website until
// someone opens a draft and presses Publish.
export default function AdminNewsArticles({ articles, counts, settings: initialSettings, status }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [settingsNote, setSettingsNote] = useState('');
  const [headlines, setHeadlines] = useState(null);
  const [loadingHeadlines, setLoadingHeadlines] = useState(false);
  const [drafting, setDrafting] = useState('');
  const [batch, setBatch] = useState(null);
  const [approving, setApproving] = useState('');
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [error, setError] = useState('');

  async function saveSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    setSettingsNote('');
    const res = await fetch('/api/admin/industry-news/articles/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weekly_enabled: next.weekly_enabled,
        per_week: Number(next.per_week),
        publish_days: next.publish_days,
        publish_hour: Number(next.publish_hour),
        share_channels: next.share_channels,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSettings(data);
      setSettingsNote('Saved.');
    } else setSettingsNote(data.error || 'Not saved.');
  }

  async function loadHeadlines() {
    setLoadingHeadlines(true);
    setError('');
    try {
      const res = await fetch('/api/admin/industry-news/headlines');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The headlines did not load.');
      setHeadlines(data.headlines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHeadlines(false);
    }
  }

  // What the weekly batch would draft if it ran now: the same picking the batch uses.
  async function loadBatch() {
    setLoadingBatch(true);
    setError('');
    try {
      const res = await fetch('/api/admin/industry-news/next-batch');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The next batch did not load.');
      setBatch(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBatch(false);
    }
  }

  async function approve(a) {
    setApproving(a.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/industry-news/articles/${a.id}/approve`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'It was not approved.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setApproving('');
    }
  }

  const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  async function draft(h) {
    setDrafting(h.link);
    setError('');
    try {
      const res = await fetch('/api/admin/industry-news/articles/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: h.title, link: h.link, summary: h.summary || '', publication: h.publication || '', industry: h.industry || '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No draft was made.');
      router.push(`/admin/resources/articles/${data.id}`);
    } catch (err) {
      setError(err.message);
      setDrafting('');
    }
  }

  return (
    <>
      <div className="admin-card">
        <h2>Weekly drafts</h2>
        <label className="checkbox-row">
          <input type="checkbox" checked={Boolean(settings.weekly_enabled)} onChange={(e) => saveSettings({ weekly_enabled: e.target.checked })} />
          <span>Draft articles from the week&apos;s industry news every week</span>
        </label>
        <label className="field">
          <span>How many a week</span>
          <input type="number" min="1" max="10" value={settings.per_week} onChange={(e) => setSettings({ ...settings, per_week: e.target.value })} onBlur={() => saveSettings({})} />
        </label>
        <p className="admin-muted">
          Drafts only: each one waits here for someone to read, edit and publish it. Each draft uses your AI connections once or twice.
          {settings.last_week ? ` Last run: ${settings.last_week}${settings.last_result ? `, ${settings.last_result}` : ''}.` : ''}
        </p>
        <p className="admin-muted">
          The batch runs within a few minutes of being switched on, then every Monday. It takes the newest headlines not used
          before, in turns across the industries (security, electrical, AV, IT and smart home first), so one industry does not
          fill the week.
        </p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={loadBatch} disabled={loadingBatch}>
          {loadingBatch ? 'Reading the feeds...' : 'See what the next batch would draft'}
        </button>
        {batch ? (
          <>
            <p className="admin-muted">
              {batch.headlines.length
                ? `If it ran now it would draft these ${batch.headlines.length}.`
                : 'There are no new headlines to draft right now.'}
              {batch.next_run === 'off' ? ' Weekly drafts are switched off.' : ` Next run: ${batch.next_run}.`} Headlines change as
              the publications post, so the list on the day can differ.
            </p>
            {batch.headlines.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Headline</th><th>Industry</th><th>Publication</th></tr></thead>
                  <tbody>
                    {batch.headlines.map((h) => (
                      <tr key={h.link}>
                        <td className="wrap"><a className="admin-link" href={h.link} target="_blank" rel="noopener noreferrer">{h.title}</a></td>
                        <td>{h.industry}</td>
                        <td>{h.publication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        ) : null}
        {settingsNote ? <p className="admin-muted" role="status">{settingsNote}</p> : null}
      </div>

      <div className="admin-card">
        <h2>When approved articles go live</h2>
        <p className="admin-muted">
          Approving a draft gives it the next free time below (one article per time, Melbourne time). The website shows it
          from then; the Articles list there refreshes within the hour.
        </p>
        <fieldset className="field">
          <legend>Days</legend>
          <div className="checkbox-inline">
            {DAYS.map((d, i) => (
              <label key={d} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={(settings.publish_days || []).includes(i)}
                  onChange={() => {
                    const days = toggle(settings.publish_days || [], i).sort();
                    if (days.length) saveSettings({ publish_days: days });
                  }}
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="field">
          <span>Time</span>
          <select value={settings.publish_hour ?? 9} onChange={(e) => saveSettings({ publish_hour: Number(e.target.value) })}>
            {HOURS.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
          </select>
        </label>
        <fieldset className="field">
          <legend>Share each one when it goes live (Post it)</legend>
          <div className="checkbox-inline">
            {CHANNELS.map(([key, label]) => (
              <label key={key} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={(settings.share_channels || []).includes(key)}
                  onChange={() => saveSettings({ share_channels: toggle(settings.share_channels || [], key) })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <span className="admin-muted">
            Approving then also schedules a Post it update for the same time: the article&apos;s title and summary with its link.
            Email goes to everyone on the list who has not unsubscribed. Channels need to be connected on Social. None ticked: no sharing.
          </span>
        </fieldset>
      </div>

      <div className="admin-card">
        <h2>Draft one now</h2>
        <p className="admin-muted">Pick a recent headline and Tera&apos;s writer drafts Teracom&apos;s own article about it (about a minute).</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={loadHeadlines} disabled={loadingHeadlines}>
          {loadingHeadlines ? 'Reading the feeds...' : headlines ? 'Refresh the headlines' : 'Show recent headlines'}
        </button>
        {headlines ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Headline</th><th>Industry</th><th>Publication</th><th /></tr></thead>
              <tbody>
                {headlines.map((h) => (
                  <tr key={h.link}>
                    <td className="wrap"><a className="admin-link" href={h.link} target="_blank" rel="noopener noreferrer">{h.title}</a></td>
                    <td>{h.industry}</td>
                    <td>{h.publication}</td>
                    <td>
                      {h.used ? <span className="admin-muted">Used</span> : (
                        <button type="button" className="admin-mini-btn is-primary" onClick={() => draft(h)} disabled={Boolean(drafting)}>
                          {drafting === h.link ? 'Writing...' : 'Draft'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
      </div>

      <nav className="admin-tabs" aria-label="Articles by status">
        {['draft', 'scheduled', 'published', 'rejected'].map((s) => (
          <Link key={s} href={`/admin/resources/articles?status=${s}`} className={status === s ? 'admin-tab active' : 'admin-tab'}>
            {STATUS_LABELS[s]} ({counts?.[s] ?? 0})
          </Link>
        ))}
      </nav>
      {articles.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Article</th><th>Industry</th><th>From</th><th>Made</th><th>{status === 'scheduled' ? 'Goes live' : 'Status'}</th><th /></tr></thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="wrap"><Link className="admin-link" href={`/admin/resources/articles/${a.id}`}>{a.title}</Link></td>
                  <td>{a.industry}</td>
                  <td className="wrap"><a className="admin-link" href={a.source_url} target="_blank" rel="noopener noreferrer">{a.source_name}</a></td>
                  <td>{when(a.created_at)}{a.made_by === 'weekly' ? ' (weekly)' : ''}</td>
                  <td>
                    {a.status === 'scheduled' ? `${slot(a.scheduled_for)}${a.shared ? ' + shared' : ''}` : STATUS_LABELS[a.status] || a.status}
                  </td>
                  <td>
                    {a.status === 'draft' ? (
                      <button type="button" className="admin-mini-btn is-primary" onClick={() => approve(a)} disabled={Boolean(approving)}>
                        {approving === a.id ? 'Approving...' : 'Approve'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-muted">Nothing here yet.</p>
      )}
      {status === 'draft' && articles.length ? (
        <p className="admin-muted">Approve schedules a draft as it is. Open one first to read and edit it.</p>
      ) : null}
      {error && !headlines ? <p className="form-error" role="alert">{error}</p> : null}
    </>
  );
}
