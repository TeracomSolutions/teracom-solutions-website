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

export default function AdminPlatformRules() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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

  if (error && !data) return <p className="form-error" role="alert">{error}</p>;
  if (!data) return <p className="admin-muted">Loading…</p>;

  return (
    <div className="rules-page">
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
    </div>
  );
}
