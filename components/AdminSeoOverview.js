'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import AdminBars from '@/components/AdminBars';
import {
  OPPORTUNITY_TABS,
  changeText,
  formatNumber,
  jobText,
  percentText,
  positionText,
  trendSentence,
  weekBars,
} from '@/lib/searchInsights';

// Search -> Overview (Robert, 2026-10-10): how Google has been showing the
// website, week by week, against the 28 days before, and where to look next.

function StatTile({ label, value, previous, text, lowerIsBetter = false }) {
  const better = lowerIsBetter ? Number(value) <= Number(previous) : Number(value) >= Number(previous);
  return (
    <div className="admin-stat">
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-value">{text}</strong>
      <span className={`admin-stat-delta ${better ? 'up' : 'down'}`} title="Compared with the 28 days before">
        {changeText(value, previous)} vs the 28 days before
      </span>
    </div>
  );
}

function SplitTable({ title, rows, nameLabel }) {
  const total = rows.reduce((sum, row) => sum + row.impressions, 0) || 1;
  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      <h3 style={{ margin: '16px 20px 8px' }}>{title}</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{nameLabel}</th>
            <th>Views in Google</th>
            <th>Clicks</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="admin-muted">Nothing yet.</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{formatNumber(row.impressions)}</td>
              <td>{formatNumber(row.clicks)}</td>
              <td>{Math.round((row.impressions / total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminSeoOverview({ initial, indexing }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const stats = data.stats;
  const running = Boolean(data.status && data.status.running);

  const reload = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/seo/insights/performance');
      const next = await response.json().catch(() => ({}));
      if (response.ok) setData(next);
    } catch {
      // The numbers stay as they were.
    }
  }, []);

  // While Google's figures are being pulled, the page looks again by itself.
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(reload, 10000);
    return () => clearInterval(timer);
  }, [running, reload]);

  async function refresh() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/seo/insights/performance', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'That did not work.');
      setMessage(result.started ? 'Pulling Google’s figures now. This takes about a minute.' : result.detail || 'Nothing started.');
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (data.connected === false) {
    return (
      <p className="admin-muted">
        Google Search Console is not connected yet. Add its key under <Link href="/admin/connections">Connections</Link>, then come back and press Refresh.
      </p>
    );
  }

  const groups = (indexing && indexing.groups) || {};
  const checked = Object.entries(groups).filter(([name]) => name !== 'unchecked').reduce((sum, [, n]) => sum + n, 0);

  return (
    <div>
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={refresh} disabled={busy || running}>Refresh</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={reload} disabled={busy}>Reload</button>
      </div>
      <p className="admin-muted">{jobText(data.status, 'Google’s figures were last pulled')}</p>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {!stats ? (
        <p className="admin-muted">No figures yet. Press Refresh to pull them from Google.</p>
      ) : (
        <>
          <div className="admin-stats">
            <StatTile label="Clicks from Google" value={stats.now.clicks} previous={stats.before.clicks} text={formatNumber(stats.now.clicks)} />
            <StatTile label="Times shown in Google" value={stats.now.impressions} previous={stats.before.impressions} text={formatNumber(stats.now.impressions)} />
            <StatTile label="Click rate" value={stats.now.ctr} previous={stats.before.ctr} text={percentText(stats.now.ctr)} />
            <StatTile
              label="Average position"
              value={stats.now.position || 0}
              previous={stats.before.position || 0}
              text={positionText(stats.now.position)}
              lowerIsBetter
            />
          </div>
          <p className="admin-muted">Last 28 days against the 28 before. A lower position is better: 1 is the top of the first page.</p>
          {trendSentence(stats.weeks) ? <p>{trendSentence(stats.weeks)}</p> : null}

          <div className="admin-charts">
            <AdminBars title="Clicks" series={weekBars(stats.weeks, 'clicks')} field="clicks" />
            <AdminBars title="Times shown" series={weekBars(stats.weeks, 'impressions')} field="impressions" />
          </div>

          <h2>Where to look next</h2>
          <div className="admin-stats">
            {OPPORTUNITY_TABS.map((tab) => (
              <Link key={tab.key} href={`/admin/seo/opportunities?kind=${tab.key}`} className="admin-stat" style={{ textDecoration: 'none' }}>
                <span className="admin-stat-label">{tab.label}</span>
                <strong className="admin-stat-value">{formatNumber((data.counts || {})[tab.key])}</strong>
                <span className="admin-stat-delta">{tab.help}</span>
              </Link>
            ))}
            <Link href="/admin/seo/titles" className="admin-stat" style={{ textDecoration: 'none' }}>
              <span className="admin-stat-label">Titles waiting for a yes</span>
              <strong className="admin-stat-value">{formatNumber((data.titles || {}).proposed)}</strong>
              <span className="admin-stat-delta">{formatNumber((data.titles || {}).active)} live</span>
            </Link>
            <Link href="/admin/seo/indexing" className="admin-stat" style={{ textDecoration: 'none' }}>
              <span className="admin-stat-label">Pages in Google</span>
              <strong className="admin-stat-value">{formatNumber(groups.indexed)}</strong>
              <span className="admin-stat-delta">
                of {formatNumber(checked)} checked so far ({formatNumber(groups.unchecked)} still to check)
              </span>
            </Link>
          </div>

          <div className="admin-two-col">
            <SplitTable title="Devices" rows={stats.devices || []} nameLabel="Device" />
            <SplitTable title="Countries" rows={stats.countries || []} nameLabel="Country" />
          </div>
        </>
      )}
    </div>
  );
}
