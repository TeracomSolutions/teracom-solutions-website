'use client';

import { useState } from 'react';

// The Industry news publications (Robert, 2026-11-06): one trade publication per industry,
// in the order the website shows them. Change any of them, switch one off, add another,
// test a feed, then Save. The website's Industry news page and the homepage ticker follow
// within a moment of saving.
const EMPTY = { id: '', label: '', source: '', site: '', feed: '', host: '', excludeTitle: '', excludeCategories: [], stripLeadDash: false, active: true, fallback: null };

function Field({ label, value, onChange, help, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {help ? <span className="admin-muted">{help}</span> : null}
    </label>
  );
}

export default function AdminNewsSources({ initial, isDefault }) {
  const [sources, setSources] = useState(initial || []);
  const [open, setOpen] = useState(null);
  const [tests, setTests] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const change = (i, patch) => setSources((list) => list.map((s, n) => (n === i ? { ...s, ...patch } : s)));
  const move = (i, by) =>
    setSources((list) => {
      const j = i + by;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  async function testFeed(key, feed, host, excludeTitle) {
    setTests((t) => ({ ...t, [key]: { running: true } }));
    try {
      const res = await fetch('/api/admin/industry-news/sources/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feed: feed || '', host: host || '', excludeTitle: excludeTitle || '' }),
      });
      const data = await res.json().catch(() => ({}));
      setTests((t) => ({ ...t, [key]: res.ok ? data : { ok: false, error: data.error || 'The test did not run.' } }));
    } catch {
      setTests((t) => ({ ...t, [key]: { ok: false, error: 'The test did not run.' } }));
    }
  }

  async function save() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/industry-news/sources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The list was not saved.');
      setSources(data.sources);
      setMessage('Saved. The Industry news page shows the new list now.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const result = (key) => {
    const t = tests[key];
    if (!t) return null;
    if (t.running) return <p className="admin-muted">Reading the feed...</p>;
    return t.ok ? (
      <p className="admin-muted">Working: {t.count} headlines, latest &ldquo;{t.titles?.[0]}&rdquo;.</p>
    ) : (
      <p className="form-error">Not working: {t.error}</p>
    );
  };

  return (
    <div className="admin-card">
      {isDefault ? (
        <p className="admin-muted">This is the original list built into the website. Save it once to start keeping your own.</p>
      ) : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Show</th><th>Industry</th><th>Publication</th><th>Feed</th><th /></tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={`${s.id || 'new'}-${i}`}>
                <td>
                  <button type="button" className="admin-mini-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${s.label} up`}>Up</button>{' '}
                  <button type="button" className="admin-mini-btn" onClick={() => move(i, 1)} disabled={i === sources.length - 1} aria-label={`Move ${s.label} down`}>Down</button>
                </td>
                <td>
                  <input type="checkbox" checked={s.active !== false} onChange={(e) => change(i, { active: e.target.checked })} aria-label={`Show ${s.label}`} />
                </td>
                <td>{s.label || <span className="admin-muted">New</span>}</td>
                <td>{s.site ? <a className="admin-link" href={s.site} target="_blank" rel="noopener noreferrer">{s.source}</a> : s.source}{s.fallback?.source ? <span className="admin-muted"> (backup: {s.fallback.source})</span> : null}</td>
                <td className="wrap">
                  <span className="admin-muted">{s.feed}</span>
                  {result(`row-${i}`)}
                </td>
                <td className="admin-actions">
                  <button type="button" className="admin-mini-btn" onClick={() => testFeed(`row-${i}`, s.feed, s.host, s.excludeTitle)}>Test feed</button>{' '}
                  <button type="button" className="admin-mini-btn" onClick={() => setOpen(open === i ? null : i)}>{open === i ? 'Close' : 'Edit'}</button>{' '}
                  <button type="button" className="admin-mini-btn" onClick={() => { setSources((list) => list.filter((_, n) => n !== i)); setOpen(null); }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open !== null && sources[open] ? (
        <div className="admin-form admin-card">
          <h3>{sources[open].label || 'New industry'}</h3>
          <Field label="Industry" value={sources[open].label} onChange={(v) => change(open, { label: v })} placeholder="e.g. Fire & safety" />
          <Field label="Publication" value={sources[open].source} onChange={(v) => change(open, { source: v })} placeholder="e.g. Fire Australia" />
          <Field label="Publication website" value={sources[open].site} onChange={(v) => change(open, { site: v })} placeholder="https://..." />
          <Field label="RSS feed link" value={sources[open].feed} onChange={(v) => change(open, { feed: v })} placeholder="https://.../feed/" help="Most news sites built on WordPress have one at /feed/." />
          <Field label="Story links must be on" value={sources[open].host} onChange={(v) => change(open, { host: v })} help="The publication's domain, e.g. sen.news. Left blank, it is taken from the website." />
          <Field label="Leave out headlines matching" value={sources[open].excludeTitle} onChange={(v) => change(open, { excludeTitle: v })} help="Optional. Words separated by | such as sponsored|webinar." />
          <Field
            label="Leave out categories"
            value={(sources[open].excludeCategories || []).join(', ')}
            onChange={(v) => change(open, { excludeCategories: v.split(',').map((x) => x.trim()).filter(Boolean) })}
            help="Optional, separated by commas."
          />
          <label className="checkbox-row">
            <input type="checkbox" checked={Boolean(sources[open].stripLeadDash)} onChange={(e) => change(open, { stripLeadDash: e.target.checked })} />
            <span>The feed repeats the headline before a dash in its summary (SEN.news does)</span>
          </label>
          <h4>Backup feed (optional)</h4>
          <p className="admin-muted">Used when the main feed turns our server away or is empty.</p>
          <Field label="Backup publication" value={sources[open].fallback?.source} onChange={(v) => change(open, { fallback: { ...(sources[open].fallback || {}), source: v } })} />
          <Field label="Backup website" value={sources[open].fallback?.site} onChange={(v) => change(open, { fallback: { ...(sources[open].fallback || {}), site: v } })} />
          <Field label="Backup RSS feed link" value={sources[open].fallback?.feed} onChange={(v) => change(open, { fallback: { ...(sources[open].fallback || {}), feed: v } })} />
          <div className="admin-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => testFeed(`edit-${open}`, sources[open].feed, sources[open].host, sources[open].excludeTitle)}>Test the feed</button>
            {sources[open].fallback?.feed ? (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => testFeed(`backup-${open}`, sources[open].fallback.feed, '', '')}>Test the backup</button>
            ) : null}
          </div>
          {result(`edit-${open}`)}
          {result(`backup-${open}`)}
        </div>
      ) : null}

      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setSources((list) => [...list, { ...EMPTY }]); setOpen(sources.length); }}>
          Add an industry
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
      {message ? <p className="admin-muted" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
