'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { formatDateTime } from '@/lib/adminFormat';
import {
  GROUP_INFO,
  GROUP_ORDER,
  KIND_LABELS,
  formatNumber,
  groupHelp,
  groupLabel,
  jobText,
  queueNotice,
  shortPath,
  sitemapLine,
} from '@/lib/searchInsights';

// Search -> Indexing (Robert, 2026-10-10): how Google sees each page of the
// website. Pages are checked with Google a day's quota at a time; this shows
// what it said, why a page may be left out, and sends product pages that
// have no photo or description to Photos & text.

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

export default function AdminSeoIndexing({ initial }) {
  const [data, setData] = useState(initial);
  const [group, setGroup] = useState('');
  const [kind, setKind] = useState('');
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState([]);
  const [sitemaps, setSitemaps] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const summary = data.summary || {};
  const groups = summary.groups || {};
  const pages = data.pages || [];
  const status = summary.status || {};
  const running = Boolean(status.running);
  const checkedLine = status.summary && status.summary.checked != null ? ` The last run checked ${formatNumber(status.summary.checked)} pages.` : '';

  const query = useCallback(
    async (next, skip = 0, quiet = false) => {
      if (!quiet) setBusy(true);
      setError('');
      try {
        const params = new URLSearchParams({ skip: String(skip) });
        if (next.group) params.set('group', next.group);
        if (next.kind) params.set('kind', next.kind);
        if (next.q) params.set('q', next.q);
        const response = await fetch(`/api/admin/seo/insights/indexing?${params.toString()}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not load the list.');
        setData((current) => (skip > 0 ? { ...result, pages: [...(current.pages || []), ...result.pages] } : result));
        if (skip === 0) setPicked([]);
      } catch (err) {
        setError(err.message);
      } finally {
        if (!quiet) setBusy(false);
      }
    },
    [],
  );

  const loadSitemaps = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/seo/insights/indexing/sitemaps');
      const result = await response.json().catch(() => ({}));
      setSitemaps(response.ok ? result.sitemaps : { error: result.error || 'Google did not answer.' });
    } catch {
      setSitemaps({ error: 'Google did not answer.' });
    }
  }, []);

  useEffect(() => {
    loadSitemaps();
  }, [loadSitemaps]);

  // While a check is running, the page looks again by itself.
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => query({ group, kind, q }, 0, true), 15000);
    return () => clearInterval(timer);
  }, [running, group, kind, q, query]);

  function filter(next) {
    const merged = { group, kind, q, ...next };
    setGroup(merged.group);
    setKind(merged.kind);
    setQ(merged.q);
    query(merged);
  }

  async function act(work, text) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await work();
      setMessage(text(result));
      await query({ group, kind, q });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function checkNow() {
    return act(() => send('/api/admin/seo/insights/indexing', 'POST'), (result) => (result.started ? 'Checking pages with Google now. This takes a while; the list updates by itself.' : result.detail || 'Nothing started.'));
  }

  function findContent() {
    return act(() => send('/api/admin/seo/insights/indexing/queue', 'POST', { page_ids: picked }), queueNotice);
  }

  async function tellGoogle() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await send('/api/admin/seo/insights/indexing/sitemaps', 'POST');
      setMessage('Google has been told about the sitemap. It will read it when it next visits.');
      await loadSitemaps();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function toggle(id) {
    setPicked((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  const productRows = pages.filter((page) => page.kind === 'product');
  const allPicked = productRows.length > 0 && productRows.every((page) => picked.includes(page.id));

  if (summary.connected === false) {
    return (
      <p className="admin-muted">
        Google Search Console is not connected yet. Add its key under <Link href="/admin/connections">Connections</Link>.
      </p>
    );
  }

  return (
    <div>
      <div className="admin-stats">
        {GROUP_ORDER.map((name) => (
          <button
            key={name}
            type="button"
            className="admin-stat"
            style={{ textAlign: 'left', cursor: 'pointer', outline: group === name ? '2px solid var(--red)' : 'none' }}
            onClick={() => filter({ group: group === name ? '' : name })}
            title={GROUP_INFO[name].help}
          >
            <span className="admin-stat-label">{groupLabel(name)}</span>
            <strong className="admin-stat-value">{formatNumber(groups[name])}</strong>
          </button>
        ))}
      </div>
      <p className="admin-muted">
        {formatNumber(summary.total)} pages. Checked with Google today: {formatNumber(summary.checked_today)} of {formatNumber(summary.daily_limit)} Google allows a day.
        {checkedLine} {jobText(status, 'Last check')}
      </p>

      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={checkNow} disabled={busy || running}>Check now</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={tellGoogle} disabled={busy}>Tell Google about the sitemap</button>
      </div>

      {sitemaps && !sitemaps.error && sitemaps.length > 0 ? (
        <ul className="admin-muted" style={{ margin: '0 0 12px', paddingLeft: '20px' }}>
          {sitemaps.map((item) => (
            <li key={item.path}>
              {item.path}: {sitemapLine(item)}
            </li>
          ))}
        </ul>
      ) : null}
      {sitemaps && sitemaps.error ? <p className="admin-muted">Sitemap status: {sitemaps.error}</p> : null}
      {sitemaps && !sitemaps.error && sitemaps.length === 0 ? <p className="admin-muted">Google has no sitemap on record for the website. Press Tell Google about the sitemap.</p> : null}

      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="admin-actions">
        <select value={group} onChange={(event) => filter({ group: event.target.value })} aria-label="Show pages Google says">
          <option value="">Every state</option>
          {GROUP_ORDER.map((name) => (
            <option key={name} value={name}>{groupLabel(name)}</option>
          ))}
        </select>
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
      </div>

      {productRows.length > 0 ? (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(allPicked ? [] : productRows.map((page) => page.id))}>
            {allPicked ? 'Clear selection' : 'Select every product page in the list'}
          </button>
          <button type="button" className="btn btn-primary btn-sm" disabled={busy || picked.length === 0} onClick={findContent}>
            Find photos and text for the selected ({picked.length})
          </button>
        </div>
      ) : null}

      {pages.length === 0 ? (
        <p className="admin-muted">No pages match.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th aria-label="Select" />
                <th>Page</th>
                <th>Google says</th>
                <th>Shown (90 days)</th>
                <th>Last crawled</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>
                    {page.kind === 'product' ? (
                      <input type="checkbox" checked={picked.includes(page.id)} onChange={() => toggle(page.id)} aria-label={`Select ${page.path}`} />
                    ) : null}
                  </td>
                  <td className="wrap" style={{ minWidth: '240px' }}>
                    <a href={page.path} target="_blank" rel="noopener noreferrer" title={page.path}><code>{shortPath(page.path, 70)}</code></a>
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>
                      {KIND_LABELS[page.kind] || page.kind}{page.in_sitemap ? ' · in the sitemap' : ' · not in the sitemap'}
                    </span>
                  </td>
                  <td className="wrap" style={{ minWidth: '260px' }}>
                    <strong>{groupLabel(page.group)}</strong>
                    {page.coverage_state ? <span className="admin-muted"> · {page.coverage_state}</span> : null}
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{groupHelp(page.group, page.kind)}</span>
                    {page.google_canonical && page.google_canonical !== page.user_canonical && page.group === 'duplicate' ? (
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>Google chose: {page.google_canonical}</span>
                    ) : null}
                    {page.error ? <span className="form-error" style={{ display: 'block', fontSize: '12px' }}>{page.error}</span> : null}
                  </td>
                  <td>{formatNumber(page.impressions)}</td>
                  <td>{page.last_crawl_at ? formatDateTime(page.last_crawl_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages.length < (data.total || 0) ? (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => query({ group, kind, q }, pages.length)}>
            Show more ({formatNumber(data.total - pages.length)} left)
          </button>
        </div>
      ) : null}
    </div>
  );
}
