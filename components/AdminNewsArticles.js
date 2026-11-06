'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUS_LABELS = { draft: 'Draft', published: 'Published', rejected: 'Rejected' };
const when = (iso) => (iso ? new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

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
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [error, setError] = useState('');

  async function saveSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    setSettingsNote('');
    const res = await fetch('/api/admin/industry-news/articles/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekly_enabled: next.weekly_enabled, per_week: Number(next.per_week) }),
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
        {['draft', 'published', 'rejected'].map((s) => (
          <Link key={s} href={`/admin/resources/articles?status=${s}`} className={status === s ? 'admin-tab active' : 'admin-tab'}>
            {STATUS_LABELS[s]} ({counts?.[s] ?? 0})
          </Link>
        ))}
      </nav>
      {articles.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Article</th><th>Industry</th><th>From</th><th>Made</th><th>Status</th></tr></thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="wrap"><Link className="admin-link" href={`/admin/resources/articles/${a.id}`}>{a.title}</Link></td>
                  <td>{a.industry}</td>
                  <td className="wrap"><a className="admin-link" href={a.source_url} target="_blank" rel="noopener noreferrer">{a.source_name}</a></td>
                  <td>{when(a.created_at)}{a.made_by === 'weekly' ? ' (weekly)' : ''}</td>
                  <td>{STATUS_LABELS[a.status] || a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-muted">Nothing here yet.</p>
      )}
    </>
  );
}
