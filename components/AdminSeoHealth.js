'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { KIND_LABELS, formatNumber, jobText, shortPath } from '@/lib/searchInsights';
import { SEVERITY_LABELS, checkNotice, needsTitle, siteLine, sortIssues, speedText, suggestNotice } from '@/lib/siteHealth';

// Search -> Health (Robert, 2026-10-10): the website checked page by page, once
// a week, for what Google and visitors need. Counts for each kind of problem,
// the pages that have one, and for a title or description problem a button
// that asks the AI for new wording (it waits for a yes on the Titles tab).

const SEVERITIES = ['problem', 'warning', 'note'];

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

export default function AdminSeoHealth({ initial }) {
  const [data, setData] = useState(initial);
  const [code, setCode] = useState('');
  const [kind, setKind] = useState('');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const summary = data.summary || {};
  const codes = summary.codes || [];
  const status = summary.status || {};
  const running = Boolean(status.running);
  const pages = data.pages || [];
  const site = siteLine(status.summary);

  const query = useCallback(async (next, skip = 0, quiet = false) => {
    if (!quiet) setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams({ skip: String(skip) });
      if (next.code) params.set('code', next.code);
      if (next.kind) params.set('kind', next.kind);
      if (next.q) params.set('q', next.q);
      const response = await fetch(`/api/admin/seo/insights/health?${params.toString()}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not load the list.');
      setData((current) => (skip > 0 ? { ...result, pages: [...(current.pages || []), ...result.pages] } : result));
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setBusy(false);
    }
  }, []);

  // While a check is running, the page looks again by itself.
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => query({ code, kind, q }, 0, true), 20000);
    return () => clearInterval(timer);
  }, [running, code, kind, q, query]);

  function filter(next) {
    const merged = { code, kind, q, ...next };
    setCode(merged.code);
    setKind(merged.kind);
    setQ(merged.q);
    query(merged);
  }

  async function checkNow() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await send('/api/admin/seo/insights/health', 'POST');
      setMessage(checkNotice(result));
      await query({ code, kind, q });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function suggest(path) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await send('/api/admin/seo/insights/titles', 'POST', { path });
      setMessage(suggestNotice(path));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-label">Pages checked</span>
          <strong className="admin-stat-value">{formatNumber(summary.total)}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-label">Without a problem</span>
          <strong className="admin-stat-value">{formatNumber(summary.clean)}</strong>
        </div>
      </div>
      <p className="admin-muted">
        {jobText(status, 'Last check')} {site}
      </p>

      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={checkNow} disabled={busy || running}>Check now</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => query({ code, kind, q })} disabled={busy}>Reload</button>
      </div>

      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {summary.total === 0 && !running ? (
        <p className="admin-muted">Nothing has been checked yet. Press Check now; it takes about ten minutes.</p>
      ) : (
        SEVERITIES.map((severity) => {
          const items = codes.filter((item) => item.severity === severity);
          if (items.length === 0) return null;
          return (
            <div key={severity}>
              <h2>{SEVERITY_LABELS[severity]}</h2>
              <div className="admin-stats">
                {items.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className="admin-stat"
                    disabled={item.count === 0 && code !== item.code}
                    style={{ textAlign: 'left', cursor: item.count > 0 ? 'pointer' : 'default', opacity: item.count === 0 ? 0.55 : 1, outline: code === item.code ? '2px solid var(--red)' : 'none' }}
                    onClick={() => filter({ code: code === item.code ? '' : item.code })}
                    title={item.help}
                  >
                    <span className="admin-stat-label">{item.label}</span>
                    <strong className="admin-stat-value">{formatNumber(item.count)}</strong>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}

      <div className="admin-actions">
        <select value={kind} onChange={(event) => filter({ kind: event.target.value })} aria-label="Show this kind of page">
          <option value="">Every kind of page</option>
          {Object.entries(KIND_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') filter({ q });
          }}
          placeholder="Part of an address"
          aria-label="Search addresses"
        />
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => filter({ q })} disabled={busy}>Search</button>
        {code ? <button type="button" className="admin-link-btn" onClick={() => filter({ code: '' })}>Show every problem</button> : null}
      </div>

      {pages.length === 0 ? (
        <p className="admin-muted">{summary.total === 0 ? '' : 'No pages match.'}</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>What is wrong</th>
                <th>Loads in</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="wrap" style={{ minWidth: '240px' }}>
                    <a href={page.path} target="_blank" rel="noopener noreferrer" title={page.path}><code>{shortPath(page.path, 70)}</code></a>
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{KIND_LABELS[page.kind] || page.kind}</span>
                    {page.title ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{shortPath(page.title, 80)}</span> : null}
                  </td>
                  <td className="wrap" style={{ minWidth: '320px' }}>
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {sortIssues(page.issues).map((issue) => (
                        <li key={issue.code}>
                          <strong>{issue.label}</strong>
                          {issue.detail ? <span className="admin-muted"> · {issue.detail}</span> : null}
                        </li>
                      ))}
                    </ul>
                    {needsTitle(page.issues) ? (
                      <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => suggest(page.path)}>
                        Suggest a better title
                      </button>
                    ) : null}
                  </td>
                  <td>{page.status === 200 ? speedText(page.ms) : page.status ? `Answered ${page.status}` : 'No answer'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages.length < (data.total || 0) ? (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => query({ code, kind, q }, pages.length)}>
            Show more ({formatNumber(data.total - pages.length)} left)
          </button>
        </div>
      ) : null}

      <p className="admin-muted">
        For wording problems, the suggestions wait on the <Link href="/admin/seo/titles">Titles</Link> tab.
      </p>
    </div>
  );
}
