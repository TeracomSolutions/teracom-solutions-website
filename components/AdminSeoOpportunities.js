'use client';

import { useState } from 'react';

import {
  OPPORTUNITY_TABS,
  changeText,
  countFor,
  formatNumber,
  gainText,
  lengthNote,
  percentText,
  positionText,
  shortPath,
  titleStatusLabel,
} from '@/lib/searchInsights';

// Search -> Opportunities (Robert, 2026-10-10): what to work on to get more
// visitors from Google, worked out from the searches Google reports. For a
// page shown often but rarely clicked, the AI suggests a better title and
// description; a yes puts it on the website at once.

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

function PageLink({ path }) {
  return (
    <a href={path} target="_blank" rel="noopener noreferrer" title={path}>
      <code>{shortPath(path)}</code>
    </a>
  );
}

function Proposal({ proposal, busy, onDecide }) {
  return (
    <div className="admin-card" style={{ margin: '8px 0 0' }}>
      <strong>Suggested title</strong>
      <p style={{ margin: '4px 0' }}>{proposal.title}</p>
      <span className="admin-muted" style={{ fontSize: '12px' }}>{lengthNote(proposal.title, 60).text}</span>
      <strong style={{ display: 'block', marginTop: '8px' }}>Suggested description</strong>
      <p style={{ margin: '4px 0' }}>{proposal.description}</p>
      <span className="admin-muted" style={{ fontSize: '12px' }}>{lengthNote(proposal.description, 155).text}</span>
      {proposal.current_title ? (
        <p className="admin-muted" style={{ fontSize: '12px', margin: '8px 0 0' }}>Now: {proposal.current_title}</p>
      ) : null}
      <div className="admin-actions" style={{ marginTop: '8px' }}>
        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => onDecide(proposal, 'approve')}>Use these now</button>
        <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => onDecide(proposal, 'reject')}>Not these</button>
      </div>
    </div>
  );
}

export default function AdminSeoOpportunities({ initial, counts, initialKind }) {
  const [kind, setKind] = useState(initialKind);
  const [data, setData] = useState(initial);
  const [proposals, setProposals] = useState({});
  const [statuses, setStatuses] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const rows = data.rows || [];
  const tab = OPPORTUNITY_TABS.find((item) => item.key === kind) || OPPORTUNITY_TABS[0];

  async function load(next, skip = 0) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/seo/insights/opportunities?kind=${next}&skip=${skip}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not load the list.');
      setData((current) => (skip > 0 ? { ...result, rows: [...(current.rows || []), ...result.rows] } : result));
      setKind(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function suggest(path) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const proposal = await send('/api/admin/seo/insights/titles', 'POST', { path });
      setProposals((current) => ({ ...current, [path]: proposal }));
      setStatuses((current) => ({ ...current, [path]: 'proposed' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function decide(proposal, action) {
    setBusy(true);
    setError('');
    try {
      await send('/api/admin/seo/insights/titles', 'PUT', { ids: [proposal.id], action });
      const key = proposal.path;
      setProposals((current) => {
        const rest = { ...current };
        delete rest[key];
        return rest;
      });
      setStatuses((current) => ({ ...current, [key]: action === 'approve' ? 'active' : null }));
      setMessage(action === 'approve' ? 'Done. The website uses that title and description now.' : 'Set aside.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function titleCell(row) {
    const path = row.path_key;
    const status = path in statuses ? statuses[path] : row.title_status;
    return (
      <>
        {status ? <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{titleStatusLabel(status)}</span> : null}
        {status !== 'active' && !proposals[path] ? (
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => suggest(path)}>
            {status === 'proposed' ? 'Suggest again' : 'Suggest a better title'}
          </button>
        ) : null}
        {proposals[path] ? <Proposal proposal={proposals[path]} busy={busy} onDecide={decide} /> : null}
      </>
    );
  }

  return (
    <div>
      <div className="admin-actions">
        {OPPORTUNITY_TABS.map((item) => (
          <button key={item.key} type="button" className={`btn btn-sm ${kind === item.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => load(item.key)} disabled={busy}>
            {item.label}{countFor(counts, item.key)}
          </button>
        ))}
      </div>
      <p className="admin-muted">{tab.help}</p>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      {rows.length === 0 ? (
        <p className="admin-muted">Nothing here yet. This list fills in as Google shows the site more. Press Refresh on the Overview tab to pull the latest figures.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              {kind === 'striking' ? (
                <tr><th>Page</th><th>Search</th><th>Position</th><th>Times shown (90 days)</th><th>Clicks</th><th>If it reached position 3</th><th /></tr>
              ) : null}
              {kind === 'ctr' ? (
                <tr><th>Page</th><th>Times shown (90 days)</th><th>Clicks</th><th>Click rate</th><th>Usual at that position</th><th>If it matched</th><th /></tr>
              ) : null}
              {kind === 'gaps' ? (
                <tr><th>Search</th><th>Times shown (90 days)</th><th>Position</th><th>Page Google shows</th></tr>
              ) : null}
              {kind === 'rising' || kind === 'falling' ? (
                <tr><th>Search</th><th>Shown, last 28 days</th><th>Before</th><th>Change</th><th>Position</th></tr>
              ) : null}
            </thead>
            <tbody>
              {rows.map((row, index) => {
                if (kind === 'striking') {
                  return (
                    <tr key={`${row.path_key}|${row.query}|${index}`}>
                      <td className="wrap"><PageLink path={row.path_key} /></td>
                      <td className="wrap">{row.query}</td>
                      <td>{positionText(row.position)}</td>
                      <td>{formatNumber(row.impressions)}</td>
                      <td>{formatNumber(row.clicks)}</td>
                      <td>{gainText(row.gain)}</td>
                      <td className="wrap" style={{ minWidth: '220px' }}>{titleCell(row)}</td>
                    </tr>
                  );
                }
                if (kind === 'ctr') {
                  return (
                    <tr key={row.path_key}>
                      <td className="wrap">
                        <PageLink path={row.path_key} />
                        <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>Searched for: {(row.queries || []).join('; ')}</span>
                      </td>
                      <td>{formatNumber(row.impressions)}</td>
                      <td>{formatNumber(row.clicks)}</td>
                      <td>{percentText(row.ctr)}</td>
                      <td>{percentText(row.expected_ctr)} at position {positionText(row.position)}</td>
                      <td>{gainText(row.gain)}</td>
                      <td className="wrap" style={{ minWidth: '220px' }}>{titleCell(row)}</td>
                    </tr>
                  );
                }
                if (kind === 'gaps') {
                  return (
                    <tr key={`${row.query}|${index}`}>
                      <td className="wrap">{row.query}</td>
                      <td>{formatNumber(row.impressions)}</td>
                      <td>{positionText(row.position)}</td>
                      <td className="wrap"><PageLink path={row.path_key} /></td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${row.query}|${index}`}>
                    <td className="wrap">{row.query}</td>
                    <td>{formatNumber(row.impressions_now)}</td>
                    <td>{formatNumber(row.impressions_before)}</td>
                    <td>{row.change > 0 ? '+' : ''}{formatNumber(row.change)} ({changeText(row.impressions_now, row.impressions_before)})</td>
                    <td>{positionText(row.position_now)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {rows.length < (data.total || 0) ? (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => load(kind, rows.length)}>
            Show more ({formatNumber(data.total - rows.length)} left)
          </button>
        </div>
      ) : null}
    </div>
  );
}
