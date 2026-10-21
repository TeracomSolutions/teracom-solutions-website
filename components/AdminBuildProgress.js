'use client';

import { useEffect, useState } from 'react';

import {
  STAGES,
  clampPercent,
  formatAge,
  formatDuration,
  formatTokens,
  gpuLine,
  groupItems,
  jobTone,
  snapshotWarning,
  stageSteps,
} from '@/lib/buildProgressView';

// Build progress (Robert, 2026-10-22): where each coding job stands, and how the
// coding factory is doing. The page refreshes itself every minute.

function Warn({ text }) {
  return text ? <p className="form-note-banner" role="alert">{text}</p> : null;
}

function Bar({ index }) {
  return (
    <ol className="bp-bar" aria-label="Progress">
      {stageSteps(index).map((step) => (
        <li key={step.label} className={step.current ? 'is-current' : step.done ? 'is-done' : ''}>
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
  );
}

function Item({ item, onMove, busy, isFirst, isLast }) {
  return (
    <div className="bp-item">
      <div className="bp-item-head">
        <strong>{item.title}</strong>
        <span className="bp-owner">{item.owner}</span>
      </div>
      <div className="bp-move">
        <span className="bp-rank" title="Place in the coding order">#{item.rank}</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onMove(item.id, 'up')} disabled={busy || isFirst} aria-label={`Move ${item.title} up`}>Up</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onMove(item.id, 'down')} disabled={busy || isLast} aria-label={`Move ${item.title} down`}>Down</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onMove(item.id, 'top')} disabled={busy || isFirst}>Do next in this group</button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onMove(item.id, 'first')} disabled={busy || item.rank === 1}>Do first</button>
      </div>
      <Bar index={item.stage_index} />
      <p className="admin-muted bp-note">
        <strong>{item.stage}.</strong> {item.evidence} {item.note}
      </p>
      {item.prs && item.prs.length > 0 && (
        <p className="bp-prs">
          {item.prs.map((pr) => (
            <span key={pr.number} className={`bp-chip ${pr.state === 'MERGED' ? 'is-ok' : pr.ci === 'failure' ? 'is-bad' : ''}`}>
              PR {pr.number}: {String(pr.state || 'unknown').toLowerCase()}
              {pr.ci && pr.ci !== 'none' ? `, checks ${pr.ci}` : ''}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function Jobs({ title, jobs, empty }) {
  return (
    <div className="bp-panel-block">
      <h4>{title}</h4>
      {jobs.length === 0 ? (
        <p className="admin-muted">{empty}</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Time</th>
                <th>Tokens</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, n) => {
                const percent = clampPercent(job.percent);
                return (
                  <tr key={`${job.name || job.prefix}-${n}`}>
                    <td>
                      {job.name || job.prefix}
                      {job.title ? <div className="admin-muted">{job.title}</div> : null}
                    </td>
                    <td><span className={`bp-chip is-${jobTone(job.status)}`}>{job.status || 'waiting'}</span></td>
                    <td>
                      {percent === null ? '-' : (
                        <span className="bp-meter" title="An estimate from how long similar jobs take">
                          <span style={{ width: `${percent}%` }} />
                          <em>{percent}%</em>
                        </span>
                      )}
                    </td>
                    <td>{formatDuration(job.elapsed_s ?? job.duration_s)}</td>
                    <td>{formatTokens(job.tokens)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminBuildProgress({ initial }) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState('');
  const [moving, setMoving] = useState(false);

  async function move(itemId, to) {
    setMoving(true);
    try {
      const response = await fetch('/api/admin/build-progress/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, to }),
      });
      if (!response.ok) throw new Error('move failed');
      setData(await response.json());
      setError('');
    } catch {
      setError('Could not change the order. Try again.');
    } finally {
      setMoving(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const response = await fetch('/api/admin/build-progress', { cache: 'no-store' });
        if (!response.ok) throw new Error('refresh failed');
        const fresh = await response.json();
        if (!cancelled) {
          setData(fresh);
          setError('');
        }
      } catch {
        if (!cancelled) setError('Could not refresh just now; showing the last picture.');
      }
    }
    const timer = setInterval(refresh, 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (!data) return <p className="form-error" role="alert">Unable to load Build progress from the backend.</p>;
  if (data.enabled === false) {
    return <p className="admin-muted">Build progress is switched off on this site. It is for Teracom&apos;s own build work.</p>;
  }

  const stages = (data.summary && data.summary.stages) || {};
  const factory = data.factory || {};
  const queue = factory.queue || {};
  const running = queue.running || [];
  const pending = queue.pending || [];
  const jobs = queue.jobs || [];
  const ci = (data.github && data.github.ci) || {};
  const live = (data.github && data.github.live) || {};
  const openhands = factory.openhands || {};
  const groups = groupItems(data.items);

  return (
    <div className="bp-page">
      {error && <p className="form-note-banner" role="status">{error}</p>}
      <Warn text={snapshotWarning('factory', data.factory_age)} />
      <Warn text={snapshotWarning('GitHub', data.github_age)} />
      <p className="admin-muted">
        Factory information {data.factory_age ? formatAge(data.factory_age.age_minutes) : 'not received'}; GitHub information {data.github_age ? formatAge(data.github_age.age_minutes) : 'not received'}. This page refreshes every minute.
      </p>

      <p className="admin-muted">
        Use Up, Down, Do next or Do first to choose what is coded first. The number is the place in the coding order. Queued coding tasks that belong to an item follow this order; every change is recorded in the Audit log.
      </p>

      <div className="bp-chips" aria-label="Summary">
        <span className="bp-chip">{(data.summary && data.summary.total) || 0} items</span>
        {STAGES.map((stage) => (
          <span key={stage} className="bp-chip">{stages[stage] || 0} {stage.toLowerCase()}</span>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="admin-muted">No items yet. They come from the progress list kept by the CTO and the project sessions.</p>
      ) : (
        groups.map((group) => (
          <section key={group.name} className="admin-card bp-group">
            <h2>{group.name}</h2>
            {group.items.map((item, n) => (
              <Item key={item.id} item={item} onMove={move} busy={moving} isFirst={n === 0} isLast={n === group.items.length - 1} />
            ))}
          </section>
        ))
      )}

      <section className="admin-card bp-group">
        <h2>Coding factory</h2>
        <p>{gpuLine(factory.gpu)}</p>
        <p className="bp-chips">
          <span className="bp-chip">{running.length} running</span>
          <span className="bp-chip">{pending.length} waiting</span>
          <span className="bp-chip is-ok">{queue.done_hour ?? '-'} done in the last hour</span>
          <span className={`bp-chip ${queue.failed_hour ? 'is-bad' : ''}`}>{queue.failed_hour ?? '-'} failed in the last hour</span>
          <span className="bp-chip is-ok">{queue.done_day ?? '-'} done today</span>
          <span className={`bp-chip ${queue.failed_day ? 'is-bad' : ''}`}>{queue.failed_day ?? '-'} failed today</span>
        </p>
        <p className="admin-muted">
          OpenHands: {openhands.conversations_day ?? '-'} conversations in the last day, {formatTokens(openhands.tokens_day)} tokens, about {formatTokens(openhands.tokens_per_conversation)} per conversation.
          {' '}Dispatcher (VM 410): {factory.dispatcher_410 ? (factory.dispatcher_410.active ? 'active' : 'not active') : 'not reported'}.
          {' '}Canvas: {factory.canvas ? `${factory.canvas.version || 'unknown version'}, ${factory.canvas.up ? 'up' : 'down'}` : 'not reported'}.
        </p>
        <p className="admin-muted">
          CI: {Object.keys(ci).length === 0 ? 'no reading yet' : Object.entries(ci).map(([repo, c]) => `${repo.split('/').pop()}: ${c.running ?? 0} running, ${c.queued ?? 0} queued`).join('; ')}.
          {live.backend && live.backend.version ? ` Live backend: ${live.backend.version} (${live.backend.commit}).` : ''}
        </p>
        <Jobs title="Running now" jobs={running} empty="Nothing is running." />
        <Jobs title="Waiting in the queue" jobs={pending} empty="Nothing is waiting." />
        <Jobs title="Recent jobs" jobs={jobs} empty="No recent jobs reported." />
        <div className="bp-panel-block">
          <h4>Recent OpenHands conversations</h4>
          {(factory.recent_conversations || []).length === 0 ? (
            <p className="admin-muted">None in the last day.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Conversation</th><th>Status</th><th>Steps</th><th>Time</th><th>Tokens</th></tr>
                </thead>
                <tbody>
                  {factory.recent_conversations.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td><span className={`bp-chip is-${jobTone(c.status)}`}>{c.status}</span></td>
                      <td>{c.events}</td>
                      <td>{formatDuration(c.duration_s)}</td>
                      <td>{formatTokens(c.tokens)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="admin-card bp-group">
        <h2>Sessions</h2>
        {(data.sessions || []).length === 0 ? (
          <p className="admin-muted">No session notes reported.</p>
        ) : (
          <ul className="bp-sessions">
            {data.sessions.map((session) => (
              <li key={session.name}>
                <strong>{session.name}</strong>
                <span className="admin-muted"> updated {formatAge(session.minutes_ago)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(data.history || []).length > 0 && (
        <section className="admin-card bp-group">
          <h2>Recent snapshots</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>When</th><th>Running</th><th>Waiting</th><th>Done in the hour</th><th>Failed in the hour</th></tr>
              </thead>
              <tbody>
                {data.history.slice(0, 12).map((row) => (
                  <tr key={row.received_at}>
                    <td>{new Date(row.received_at).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                    <td>{row.running}</td>
                    <td>{row.pending}</td>
                    <td>{row.done_hour ?? '-'}</td>
                    <td>{row.failed_hour ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
