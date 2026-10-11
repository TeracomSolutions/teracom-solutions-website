'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import AdminBars from '@/components/AdminBars';
import {
  changeLine,
  funnelWidth,
  lastNote,
  moneyText,
  setupSteps,
  stepLine,
  weekSeries,
} from '@/lib/analyticsView.js';
import { formatNumber } from '@/lib/searchInsights.js';

function StatTile({ label, value, text, change }) {
  const line = changeLine(change);
  const better = line.better;
  return (
    <div className="admin-stat">
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-value">{text}</strong>
      <span className={`admin-stat-delta ${better ? 'up' : 'down'}`} title="Compared with the 28 days before">
        {line.text}
      </span>
    </div>
  );
}

export default function AdminSeoAnalytics({ initial }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const running = Boolean(data.status && data.status.running);

  const reload = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/seo/insights/analytics');
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
      const response = await fetch('/api/admin/seo/insights/analytics', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'That did not work.');
      setMessage('Pulling the figures now. This takes about a minute; press Reload to see them.');
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
        Google is not connected yet. Add the service account key under <Link href="/admin/connections">Connections</Link>.
      </p>
    );
  }

  if (!data.snapshot) {
    return (
      <div>
        <h2>Google Analytics is not set up yet</h2>
        <p className="lead">Follow these steps to connect Google Analytics.</p>
        <ol>
          {setupSteps(data.email).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {data.status?.error && (
          <p className="form-error" role="alert">{data.status.error}</p>
        )}
        <div className="admin-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={refresh} disabled={busy || running}>Pull the figures now</button>
        </div>
      </div>
    );
  }

  const { snapshot, status } = data;
  const { totals, channels, funnel, pages, searches, weeks } = snapshot;

  return (
    <div>
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={refresh} disabled={busy || running}>Pull the figures now</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={reload} disabled={busy}>Reload</button>
      </div>
      <p className="admin-muted">{lastNote(status)} {snapshot.property}</p>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="admin-stats">
        <StatTile label="Visits" value={totals.sessions.now} text={formatNumber(totals.sessions.now)} change={totals.sessions} />
        <StatTile label="Visitors" value={totals.totalUsers.now} text={formatNumber(totals.totalUsers.now)} change={totals.totalUsers} />
        <StatTile label="Orders" value={totals.ecommercePurchases.now} text={formatNumber(totals.ecommercePurchases.now)} change={totals.ecommercePurchases} />
        <StatTile label="Sales" value={totals.purchaseRevenue.now} text={moneyText(totals.purchaseRevenue.now)} change={totals.purchaseRevenue} />
      </div>

      <h2>From product to purchase</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Visits</th>
            <th>Bar</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {funnel.length === 0 ? (
            <tr>
              <td colSpan="4" className="admin-muted">Nothing yet.</td>
            </tr>
          ) : (
            funnel.map((step, i) => {
              const stepInfo = stepLine(step);
              return (
                <tr key={i}>
                  <td>{step.label}</td>
                  <td>{stepInfo.count}</td>
                  <td style={{ minWidth: '160px' }}><div style={{ width: `${funnelWidth(step)}%`, minWidth: step.count > 0 ? '2px' : '0', height: '10px', background: 'var(--red)', borderRadius: '5px' }}></div></td>
                  <td>{stepInfo.note}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="admin-two-col">
        <div className="admin-card">
          <h3>Visit sources</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Visits</th>
                <th>Orders</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {channels.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-muted">Nothing yet.</td>
                </tr>
              ) : (
                channels.map((channel, i) => (
                  <tr key={i}>
                    <td>{channel.channel}</td>
                    <td>{formatNumber(channel.sessions)}</td>
                    <td>{formatNumber(channel.orders)}</td>
                    <td>{moneyText(channel.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h3>Visits</h3>
          <AdminBars title="Visits" series={weekSeries(weeks, 'sessions')} field="sessions" />
        </div>
      </div>

      <h2>Pages that bring visits</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Page</th>
            <th>Seen in Google</th>
            <th>Clicks from Google</th>
            <th>Visits</th>
            <th>Orders</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {pages.length === 0 ? (
            <tr>
              <td colSpan="6" className="admin-muted">Nothing yet.</td>
            </tr>
          ) : (
            pages.map((page, i) => (
              <tr key={i}>
                <td><a href={page.path} target="_blank" rel="noopener noreferrer">{page.path}</a></td>
                <td>{formatNumber(page.impressions)}</td>
                <td>{formatNumber(page.clicks)}</td>
                <td>{formatNumber(page.sessions)}</td>
                <td>{formatNumber(page.orders)}</td>
                <td>{moneyText(page.revenue)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>What people search for in the store</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Search</th>
            <th>Times</th>
          </tr>
        </thead>
        <tbody>
          {searches.length === 0 ? (
            <tr>
              <td colSpan="2" className="admin-muted">Nothing yet.</td>
            </tr>
          ) : (
            searches.map((search, i) => (
              <tr key={i}>
                <td>{search.term}</td>
                <td>{formatNumber(search.count)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}