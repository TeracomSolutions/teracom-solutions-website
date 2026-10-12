'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import {
  countCards,
  resolutionText,
  severityText,
  issueLine,
  sourceLine,
  problemLine,
} from '@/lib/merchantView.js';
import { lastNote } from '@/lib/analyticsView.js';
import { formatNumber } from '@/lib/searchInsights.js';

export default function AdminSeoMerchant({ initial }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const running = Boolean(data.status && data.status.running);

  const reload = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/seo/insights/merchant');
      const next = await response.json().catch(() => ({}));
      if (response.ok) setData(next);
    } catch {
      // The data stays as it was.
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
      const response = await fetch('/api/admin/seo/insights/merchant', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'That did not work.');
      setMessage('Asking Google now. This takes under a minute; press Reload to see the answer.');
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
        <h2>What Google says</h2>
        <p className="lead">Google Merchant Center snapshot.</p>
        {data.status?.error && (
          <p className="form-error" role="alert">{data.status.error}</p>
        )}
        <div className="admin-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={refresh} disabled={busy || running}>Ask Google now</button>
        </div>
      </div>
    );
  }

  const { snapshot, status } = data;

  return (
    <div className="admin-card">
      <h2>What Google says</h2>
      <p className="lead">Google Merchant Center snapshot.</p>

      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={refresh} disabled={busy || running}>Ask Google now</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={reload} disabled={busy}>Reload</button>
      </div>

      <p className="admin-muted">{lastNote(status)}</p>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="admin-stats">
        {countCards(snapshot.counts).map((card) => (
          <div key={card.key} className="admin-stat">
            <span className="admin-stat-label">{card.label}</span>
            <strong className="admin-stat-value">{formatNumber(card.value)}</strong>
          </div>
        ))}
      </div>

      {snapshot.account && snapshot.account.length > 0 && (
        <>
          {snapshot.account.map((acc, i) => (
            <p key={i} className="form-error" role="alert">
              {acc.title}: {acc.detail}
            </p>
          ))}
        </>
      )}

      <h3>Why products are held back</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Reason</th>
            <th>What it means</th>
            <th>Who acts</th>
          </tr>
        </thead>
        <tbody>
          {snapshot.issues && snapshot.issues.length > 0 ? (
            snapshot.issues.map((issue, i) => (
              <tr key={i}>
                <td>{issueLine(issue)}</td>
                <td>{severityText(issue.severity)}</td>
                <td>{resolutionText(issue.resolution)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Nothing reported.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Products we need to fix</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
          </tr>
        </thead>
        <tbody>
          {snapshot.problems && snapshot.problems.length > 0 ? (
            snapshot.problems.slice(0, 50).map((problem, i) => (
              <tr key={i}>
                <td>{problemLine(problem)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="1">None. Google is only waiting to check the rest.</td>
            </tr>
          )}
        </tbody>
      </table>

      {snapshot.problems && snapshot.problems.length > 50 && (
        <p className="admin-muted">{formatNumber(snapshot.problems.length - 50)} more products need fixing.</p>
      )}

      <h3>Where Google gets the products</h3>
      <ul>
        {snapshot.sources && snapshot.sources.length > 0 ? (
          snapshot.sources.map((source, i) => (
            <li key={i}>{sourceLine(source)}</li>
          ))
        ) : (
          <li>No feed source found.</li>
        )}
      </ul>
    </div>
  );
}