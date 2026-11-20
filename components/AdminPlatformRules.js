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

// The register as thin rows (Robert, 20 November 2026: "make them a little bit more horizontal and very thin ...
// this is going to grow exponentially"). One line each: group, title, a one-line summary, when it was set or runs;
// a click opens the full wording, and Administrators can edit it there.
const RULE_FIELDS = [
  ['title', 'Title', 'input'], ['what', 'What it does', 'textarea'], ['why', 'Why', 'textarea'],
  ['where', 'Where it is changed', 'textarea'], ['set_on', 'Set on (YYYY-MM-DD or words)', 'input'],
];
const SCHEDULE_FIELDS = [
  ['name', 'Name', 'input'], ['what', 'What it does', 'textarea'], ['when', 'When it runs', 'input'], ['where', 'Where it is set', 'textarea'],
];

function EditForm({ kind, item, groups, onSave, onCancel, saving }) {
  const fields = kind === 'rules' ? RULE_FIELDS : SCHEDULE_FIELDS;
  const groupKey = kind === 'rules' ? 'area' : 'group';
  const [values, setValues] = useState(() => Object.fromEntries([[groupKey, item[groupKey] || groups[0]], ...fields.map(([k]) => [k, item[k] || ''])]));
  return (
    <form className="reg-form" onSubmit={(e) => { e.preventDefault(); onSave(values); }}>
      <label>{kind === 'rules' ? 'Area' : 'Group'}
        <select value={values[groupKey]} onChange={(e) => setValues({ ...values, [groupKey]: e.target.value })}>
          {groups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      {fields.map(([k, label, type]) => (
        <label key={k} className={type === 'textarea' ? 'reg-wide' : undefined}>{label}
          {type === 'textarea'
            ? <textarea rows={3} value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} />
            : <input value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} />}
        </label>
      ))}
      <p className="admin-muted reg-wide">Changing the wording here updates the record only. The setting itself (in Vercel, the code or a timetable) is changed where it says.</p>
      <div className="reg-actions reg-wide">
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function Register({ kind, items, groups, onChange, intro }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  const [open, setOpen] = useState('');
  const [editing, setEditing] = useState('');
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState('');
  const groupKey = kind === 'rules' ? 'area' : 'group';
  const titleKey = kind === 'rules' ? 'title' : 'name';
  const q = query.trim().toLowerCase();
  const shown = items.filter((item) => (!group || item[groupKey] === group)
    && (!q || Object.values(item).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))));

  async function send(payload) {
    setSaving(true);
    setProblem('');
    try {
      const res = await fetch('/api/admin/platform-rules/edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'That change was not saved.');
      onChange(body);
      setEditing('');
      return true;
    } catch (e) {
      setProblem(e.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="reg">
      {intro ? <p className="admin-muted">{intro}</p> : null}
      <div className="reg-tools">
        <input type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
        <select value={group} onChange={(e) => setGroup(e.target.value)} aria-label={kind === 'rules' ? 'Area' : 'Group'}>
          <option value="">{kind === 'rules' ? 'Every area' : 'Every group'}</option>
          {groups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <span className="admin-muted">{shown.length} of {items.length}</span>
        {kind === 'rules' ? <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing('new'); setOpen(''); }}>Add a rule</button> : null}
      </div>
      {problem ? <p className="form-error" role="alert">{problem}</p> : null}
      {editing === 'new' ? (
        <EditForm kind="rules" item={{}} groups={groups} saving={saving} onCancel={() => setEditing('')}
          onSave={(fields) => send({ action: 'add', fields })} />
      ) : null}
      <ul className="reg-rows">
        {shown.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} className={isOpen ? 'reg-row is-open' : 'reg-row'}>
              <button type="button" className="reg-line" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? '' : item.id); setEditing(''); }}>
                <span className="reg-group">{item[groupKey]}</span>
                <span className="reg-title">{item[titleKey]}{item.edited ? <span className="rules-pill">Edited</span> : null}{item.source === 'staff' ? <span className="rules-pill">Added</span> : null}</span>
                <span className="reg-summary">{item.what}</span>
                <span className="reg-meta">{kind === 'rules' ? setOn(item.set_on) : item.last_at ? `Ran ${formatDateTime(item.last_at)}` : item.when}</span>
                {item.last_ok === false ? <span className="rules-pill is-bad">Failing</span> : null}
              </button>
              {isOpen && editing !== item.id ? (
                <div className="reg-detail">
                  <p>{item.what}</p>
                  {kind === 'rules' ? <p><span className="admin-muted">Why: </span>{item.why}</p> : <p><span className="admin-muted">When: </span>{item.when}</p>}
                  <p><span className="admin-muted">{kind === 'rules' ? 'Where it is changed: ' : 'Where it is set: '}</span>{item.where}</p>
                  {kind === 'rules' ? <p className="admin-muted">Set {setOn(item.set_on)}</p> : null}
                  {item.last_at ? <p className="admin-muted">Last ran {formatDateTime(item.last_at)}{item.last_error ? ` · last error: ${item.last_error}` : ''}</p> : null}
                  {item.edited_by ? <p className="admin-muted">Wording changed by {item.edited_by}{item.edited_at ? ` on ${formatDateTime(item.edited_at)}` : ''}.</p> : null}
                  <div className="reg-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(item.id)}>Edit</button>
                    {item.edited ? <button type="button" className="btn btn-secondary btn-sm" disabled={saving} onClick={() => send({ action: 'reset', kind, id: item.id })}>Reset to the original wording</button> : null}
                    {item.source === 'staff' ? <button type="button" className="btn btn-secondary btn-sm" disabled={saving} onClick={() => { if (window.confirm('Remove this rule from the register?')) send({ action: 'remove', id: item.id }); }}>Remove</button> : null}
                  </div>
                </div>
              ) : null}
              {isOpen && editing === item.id ? (
                <EditForm kind={kind} item={item} groups={groups} saving={saving} onCancel={() => setEditing('')}
                  onSave={(fields) => send({ action: 'edit', kind, id: item.id, fields })} />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
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

      {tab === 'schedules' ? <Register kind="schedules" items={data.schedules || []} groups={data.schedule_groups || []} onChange={setData}
        intro="Everything that runs by itself on a timetable. Every new scheduled job or reminder is added here in the same change that makes it." /> : null}
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
      <Register kind="rules" items={data.rules || []} groups={data.areas || []} onChange={setData}
        intro="Every setting made on purpose to keep the platform safe and cheap to run. Click a row for the detail; Administrators can edit the wording or add a rule." />
      </> : null}
    </div>
  );
}
