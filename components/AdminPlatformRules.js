'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

import { formatDate, formatDateTime } from '@/lib/adminFormat';

// System > Platform rules (api/staff_platform_rules.py in the backend): what Vercel has switched on right now, read
// live, then every setting made on purpose to keep the website safe and cheap to run, with why and where it is changed.

function days(n) {
  if (n === null || n === undefined) return 'not set';
  if (n === 7) return '1 week';
  return n === 1 ? '1 day' : `${n} days`;
}

function setOn(value) {
  if (!value) return '';
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value) : value;
}

function Live({ live }) {
  if (!live) return null;
  if (!live.ok) return <p className="form-note-banner" role="status">{live.error}</p>;
  const fw = live.firewall;
  const r = live.retention || {};
  return (
    <div className="rules-live">
      <section className="rules-card">
        <h3>Firewall rules {fw ? <span className={fw.enabled ? 'rules-pill is-on' : 'rules-pill'}>{fw.enabled ? 'Firewall on' : 'Firewall off'}</span> : null}</h3>
        {fw ? (
          <>
            {fw.rules.length ? (
              <ul className="rules-list">
                {fw.rules.map((rule) => (
                  <li key={rule.name}>
                    <strong>{rule.action}</strong>{' '}{rule.name}
                    {!rule.active ? <span className="rules-pill">Switched off</span> : null}
                    <div className="admin-muted">When {rule.when.join(', or ')}.</div>
                  </li>
                ))}
              </ul>
            ) : <p className="admin-muted">No custom firewall rules.</p>}
            {fw.blocked_addresses.length ? (
              <>
                <h4>Blocked addresses</h4>
                <ul className="rules-list">
                  {fw.blocked_addresses.map((ip) => <li key={ip.address}>{ip.address}{ip.note ? ` · ${ip.note}` : ''}</li>)}
                </ul>
              </>
            ) : <p className="admin-muted">No single addresses are blocked.</p>}
            {fw.changed_at ? <p className="admin-muted">Last changed in Vercel {formatDateTime(fw.changed_at)}.</p> : null}
          </>
        ) : <p className="admin-muted">{live.firewall_error}</p>}
        {live.firewall_link ? (
          <a className="btn btn-secondary btn-sm" href={live.firewall_link} target="_blank" rel="noopener noreferrer">
            Open in Vercel <ExternalLink size={14} aria-hidden="true" />
          </a>
        ) : null}
      </section>
      <section className="rules-card">
        <h3>How long deployments are kept</h3>
        <dl className="rules-facts">
          <div><dt>Production</dt><dd>{days(r.production_days)}</dd></div>
          <div><dt>Previews</dt><dd>{days(r.preview_days)}</dd></div>
          <div><dt>Failed</dt><dd>{days(r.errored_days)}</dd></div>
          <div><dt>Cancelled</dt><dd>{days(r.canceled_days)}</dd></div>
          {r.keep_latest ? <div><dt>Always kept</dt><dd>the latest {r.keep_latest}</dd></div> : null}
        </dl>
      </section>
    </div>
  );
}

function Schedules({ groups, items }) {
  return (
    <>
      <p className="admin-muted">Everything that runs by itself on a timetable: what it does, when, and where it is set. Every new scheduled job or reminder is added here in the same change that makes it.</p>
      {groups.map((group) => {
        const list = items.filter((item) => item.group === group);
        if (!list.length) return null;
        return (
          <section key={group} className="rules-area">
            <h3>{group}</h3>
            <div className="rules-grid">
              {list.map((item) => (
                <article key={item.id} className="rules-card">
                  <h4>{item.name}</h4>
                  <p>{item.what}</p>
                  <p><span className="admin-muted">When: </span>{item.when}</p>
                  <p><span className="admin-muted">Where it is set: </span>{item.where}</p>
                  {item.last_at ? (
                    <p className="admin-muted">
                      Last ran {formatDateTime(item.last_at)}
                      {item.last_ok === false ? <span className="rules-pill is-bad">Pages failing</span> : null}
                      {item.last_error ? ` · last error: ${item.last_error}` : ''}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function SiteCheck({ check, checking, onCheck }) {
  const results = check.results || [];
  const history = check.history || [];
  return (
    <>
      <div className="rules-head">
        <p className="admin-muted">Every hour, and within 15 minutes of each website release, these pages are loaded as a visitor and as a signed-in customer. A failure turns the Dashboard red and sends an email; another email follows when they load again.</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCheck} disabled={checking === 'started'}>
          <RefreshCw size={14} aria-hidden="true" /> {checking === 'started' ? 'Checking, about a minute…' : 'Check now'}
        </button>
      </div>
      {checking === 'failed' ? <p className="form-error" role="alert">The check could not be started. Try again.</p> : null}
      {!check.last_at ? <p className="form-note-banner" role="status">The check has not run yet. It runs within the next 15 minutes, or press Check now.</p> : (
        <>
          <p className={check.ok ? 'rules-status is-good' : 'rules-status is-bad'} role="status">
            {check.ok ? 'Every page checked loads.' : `${(check.failed || []).length} page(s) not loading${check.failing_since ? ` since ${formatDateTime(check.failing_since)}` : ''}.`}
            <span className="admin-muted"> Last checked {formatDateTime(check.last_at)} ({check.reason}).</span>
          </p>
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-compact admin-lines">
              <thead><tr><th>Page</th><th>Address</th><th>Answer</th><th>Time</th></tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={`${r.path}-${r.signed_in}`} className={r.problem ? 'rules-row-bad' : undefined}>
                    <td>{r.label}</td>
                    <td><a href={r.path} target="_blank" rel="noopener noreferrer">{r.path}</a></td>
                    <td>{r.problem ? <strong>{r.problem}</strong> : 'Loads'}</td>
                    <td>{(r.ms / 1000).toFixed(1)} s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {history.length ? (
            <p className="admin-muted">Last {history.length} checks: {history.filter((h) => h.ok).length} passed, {history.filter((h) => !h.ok).length} found problems.</p>
          ) : null}
        </>
      )}
    </>
  );
}

export default function AdminPlatformRules() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('rules');
  const [checking, setChecking] = useState('');

  useEffect(() => {
    const wanted = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (['rules', 'schedules', 'check'].includes(wanted)) {
      const t = setTimeout(() => setTab(wanted), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const load = useCallback(async (fresh) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/platform-rules${fresh ? '?fresh=1' : ''}`, { cache: 'no-store' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'The platform rules did not load.');
      setData(body);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => load(false), 0);
    return () => clearTimeout(first);
  }, [load]);

  async function checkNow() {
    setChecking('started');
    try {
      const res = await fetch('/api/admin/platform-rules/site-check', { method: 'POST' });
      if (!res.ok) throw new Error();
      setTimeout(() => { load(false); setChecking(''); }, 75000);
    } catch {
      setChecking('failed');
    }
  }

  if (error && !data) return <p className="form-error" role="alert">{error}</p>;
  if (!data) return <p className="admin-muted">Loading…</p>;

  const check = data.site_check || {};
  const failing = (check.failed || []).length;
  const TABS = [
    ['rules', 'Rules'],
    ['schedules', 'Scheduled jobs'],
    ['check', failing ? `Website check (${failing} failing)` : 'Website check'],
  ];

  return (
    <div className="rules-page">
      <div className="rules-tabs" role="tablist" aria-label="Platform rules">
        {TABS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key}
            className={tab === key ? 'rules-tab active' : 'rules-tab'} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'schedules' ? <Schedules groups={data.schedule_groups || []} items={data.schedules || []} /> : null}
      {tab === 'check' ? <SiteCheck check={check} checking={checking} onCheck={checkNow} /> : null}
      {tab === 'rules' ? <>
      <div className="rules-head">
        <h2>Switched on in Vercel now</h2>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => load(true)} disabled={busy}>
          <RefreshCw size={14} aria-hidden="true" /> {busy ? 'Reading…' : 'Read again'}
        </button>
      </div>
      <Live live={data.live} />

      <h2>Settings made on purpose</h2>
      {data.areas.map((area) => {
        const rules = data.rules.filter((rule) => rule.area === area);
        if (!rules.length) return null;
        return (
          <section key={area} className="rules-area">
            <h3>{area}</h3>
            <div className="rules-grid">
              {rules.map((rule) => (
                <article key={rule.id} className="rules-card">
                  <h4>{rule.title}</h4>
                  <p>{rule.what}</p>
                  <p><span className="admin-muted">Why: </span>{rule.why}</p>
                  <p><span className="admin-muted">Where it is changed: </span>{rule.where}</p>
                  <p className="admin-muted">Set {setOn(rule.set_on)}</p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
      </> : null}
    </div>
  );
}
