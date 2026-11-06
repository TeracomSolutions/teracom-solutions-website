'use client';

import { Fragment, useState } from 'react';

// The Industry news publications (Robert, 2026-11-06): one row per industry, in the order the
// website shows them, each with a main publication and any number of more websites (up to 6)
// read alongside it. Change any of them, switch one off, add another, test a feed, then Save.
// The website's Industry news page and the homepage ticker follow within a moment of saving.
// Edit opens the details right under the row, so the form is where the click was.
const EMPTY = { id: '', label: '', source: '', site: '', feed: '', host: '', excludeTitle: '', excludeCategories: [], stripLeadDash: false, active: true, fallback: null, extra: [] };
const EMPTY_SITE = { source: '', site: '', feed: '', host: '' };
const MAX_EXTRA = 6;

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
  const changeExtra = (i, j, patch) =>
    setSources((list) => list.map((s, n) => (n === i ? { ...s, extra: (s.extra || []).map((e, m) => (m === j ? { ...e, ...patch } : e)) } : s)));
  const move = (i, by) => {
    const j = i + by;
    if (j < 0 || j >= sources.length) return;
    setSources((list) => {
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    if (open === i) setOpen(j);
    else if (open === j) setOpen(i);
  };

  async function testFeed(key, feed, host, excludeTitle) {
    setTests((t) => ({ ...t, [key]: { running: true } }));
    try {
      const res = await fetch('/api/admin/industry-news/sources/check', {
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

  const editor = (i) => {
    const s = sources[i];
    const extra = s.extra || [];
    return (
      <div className="admin-form">
        <h3>{s.label || 'New industry'}</h3>
        <Field label="Industry" value={s.label} onChange={(v) => change(i, { label: v })} placeholder="e.g. Fire & safety" />
        <h4>Main publication</h4>
        <Field label="Publication" value={s.source} onChange={(v) => change(i, { source: v })} placeholder="e.g. Fire Australia" />
        <Field label="Publication website" value={s.site} onChange={(v) => change(i, { site: v })} placeholder="https://..." />
        <Field label="RSS feed link" value={s.feed} onChange={(v) => change(i, { feed: v })} placeholder="https://.../feed/" help="Most news sites built on WordPress have one at /feed/." />
        <Field label="Story links must be on" value={s.host} onChange={(v) => change(i, { host: v })} help="The publication's domain, e.g. sen.news. Left blank, it is taken from the website." />
        <Field label="Leave out headlines matching" value={s.excludeTitle} onChange={(v) => change(i, { excludeTitle: v })} help="Optional. Words separated by | such as sponsored|webinar." />
        <Field
          label="Leave out categories"
          value={(s.excludeCategories || []).join(', ')}
          onChange={(v) => change(i, { excludeCategories: v.split(',').map((x) => x.trim()).filter(Boolean) })}
          help="Optional, separated by commas."
        />
        <label className="checkbox-row">
          <input type="checkbox" checked={Boolean(s.stripLeadDash)} onChange={(e) => change(i, { stripLeadDash: e.target.checked })} />
          <span>The feed repeats the headline before a dash in its summary (SEN.news does)</span>
        </label>
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => testFeed(`edit-${i}`, s.feed, s.host, s.excludeTitle)}>Test the feed</button>
        </div>
        {result(`edit-${i}`)}

        <h4>More websites for {s.label || 'this industry'}</h4>
        <p className="admin-muted">Read alongside the main publication; their headlines are mixed in, newest first, each credited to its own site. Up to {MAX_EXTRA}.</p>
        {extra.map((e, j) => (
          <div className="admin-card" key={j}>
            <Field label="Publication" value={e.source} onChange={(v) => changeExtra(i, j, { source: v })} />
            <Field label="Website" value={e.site} onChange={(v) => changeExtra(i, j, { site: v })} placeholder="https://..." />
            <Field label="RSS feed link" value={e.feed} onChange={(v) => changeExtra(i, j, { feed: v })} placeholder="https://.../feed/" />
            <Field label="Leave out headlines matching" value={e.excludeTitle} onChange={(v) => changeExtra(i, j, { excludeTitle: v })} help="Optional." />
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => testFeed(`extra-${i}-${j}`, e.feed, e.host, e.excludeTitle)}>Test this feed</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => change(i, { extra: extra.filter((_, m) => m !== j) })}>Remove this website</button>
            </div>
            {result(`extra-${i}-${j}`)}
          </div>
        ))}
        {extra.length < MAX_EXTRA ? (
          <div className="admin-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => change(i, { extra: [...extra, { ...EMPTY_SITE }] })}>Add another website</button>
          </div>
        ) : null}

        <h4>Backup feed (optional)</h4>
        <p className="admin-muted">Used only when the main feed turns our server away or is empty.</p>
        <Field label="Backup publication" value={s.fallback?.source} onChange={(v) => change(i, { fallback: { ...(s.fallback || {}), source: v } })} />
        <Field label="Backup website" value={s.fallback?.site} onChange={(v) => change(i, { fallback: { ...(s.fallback || {}), site: v } })} />
        <Field label="Backup RSS feed link" value={s.fallback?.feed} onChange={(v) => change(i, { fallback: { ...(s.fallback || {}), feed: v } })} />
        {s.fallback?.feed ? (
          <div className="admin-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => testFeed(`backup-${i}`, s.fallback.feed, '', '')}>Test the backup</button>
          </div>
        ) : null}
        {result(`backup-${i}`)}
        <div className="admin-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(null)}>Done</button>
          <span className="admin-muted">Then press Save below the list.</span>
        </div>
      </div>
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
            <tr><th>Order</th><th>Show</th><th>Industry</th><th>Websites</th><th>Feed</th><th /></tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <Fragment key={`${s.id || 'new'}-${i}`}>
                <tr>
                  <td>
                    <button type="button" className="admin-mini-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${s.label} up`}>Up</button>{' '}
                    <button type="button" className="admin-mini-btn" onClick={() => move(i, 1)} disabled={i === sources.length - 1} aria-label={`Move ${s.label} down`}>Down</button>
                  </td>
                  <td>
                    <input type="checkbox" checked={s.active !== false} onChange={(e) => change(i, { active: e.target.checked })} aria-label={`Show ${s.label}`} />
                  </td>
                  <td>{s.label || <span className="admin-muted">New</span>}</td>
                  <td>
                    {s.site ? <a className="admin-link" href={s.site} target="_blank" rel="noopener noreferrer">{s.source}</a> : s.source}
                    {(s.extra || []).filter((e) => e.source).map((e) => (
                      <span key={e.feed || e.source}>, {e.site ? <a className="admin-link" href={e.site} target="_blank" rel="noopener noreferrer">{e.source}</a> : e.source}</span>
                    ))}
                    {s.fallback?.source ? <span className="admin-muted"> (backup: {s.fallback.source})</span> : null}
                  </td>
                  <td className="wrap">
                    <span className="admin-muted">{s.feed}</span>
                    {result(`row-${i}`)}
                  </td>
                  <td className="admin-actions">
                    <button type="button" className="admin-mini-btn" onClick={() => testFeed(`row-${i}`, s.feed, s.host, s.excludeTitle)}>Test feed</button>{' '}
                    <button type="button" className="admin-mini-btn" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>{open === i ? 'Close' : 'Edit'}</button>{' '}
                    <button type="button" className="admin-mini-btn" onClick={() => { setSources((list) => list.filter((_, n) => n !== i)); setOpen(null); }}>Remove</button>
                  </td>
                </tr>
                {open === i ? (
                  <tr className="admin-row-editor">
                    <td colSpan={6}>{editor(i)}</td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

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
