'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, DatabaseBackup, RefreshCw } from 'lucide-react';

import { formatDateTime } from '@/lib/adminFormat';

// The Backups page (api/staff_backups.py in the backend): what is backed up to the NAS, the schedule, Back up now,
// and every backup made. The NAS itself is set up on Connections (Backup NAS).

const BASE = '/api/admin/backups';

async function call(path, method = 'GET', body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'The backend did not answer.');
  return data;
}

const STATUS = { queued: 'Starting', running: 'Running', done: 'Saved', failed: 'Failed' };
const STATUS_CLASS = { queued: 'is-attention', running: 'is-attention', done: 'is-good', failed: 'is-failed' };
const HOURS = Array.from({ length: 24 }, (_, h) => h);

function hourLabel(h) {
  if (h === 0) return '12 am (midnight)';
  if (h === 12) return '12 pm (midday)';
  return h < 12 ? `${h} am` : `${h - 12} pm`;
}

function Summary({ data, onRun, busy }) {
  const { nas, last_good: lastGood, running, next_at: nextAt } = data;
  return (
    <div className="backups-summary">
      <div className="ads-tiles">
        <div><span>Last good backup</span><strong>{lastGood ? formatDateTime(lastGood.finished_at || lastGood.created_at) : 'None yet'}</strong></div>
        <div><span>Its size</span><strong>{lastGood?.size || '—'}</strong></div>
        <div><span>Next backup</span><strong>{nextAt ? formatDateTime(nextAt) : (data.settings.enabled ? 'When the NAS is set up' : 'Schedule off')}</strong></div>
        <div><span>Backup NAS</span><strong>{nas.ready ? 'Set up' : 'Not set up'}</strong></div>
      </div>
      {!nas.ready ? (
        <p className="form-note-banner" role="status">
          {nas.set_up && !nas.passphrase_set
            ? 'The NAS is set up but has no backup passphrase yet. '
            : 'Backups need the Synology first. '}
          Open <Link href="/admin/connections">Connections</Link>, Storage, <strong>Backup NAS</strong>: the Synology&apos;s address, shared folder, a user that may write there, its password and a backup passphrase. Save, then Test.
        </p>
      ) : (
        <p className="admin-muted">
          Saved to <code>{nas.location}</code>. {nas.status === 'failing' && nas.detail ? <span className="form-error">{nas.detail}</span> : null}
        </p>
      )}
      <div className="admin-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={onRun} disabled={!nas.ready || Boolean(running) || busy}>
          <DatabaseBackup size={15} aria-hidden="true" /> {running ? 'Backing up…' : busy ? 'Starting…' : 'Back up now'}
        </button>
      </div>
    </div>
  );
}

function Schedule({ data, onSaved }) {
  const [form, setForm] = useState(data.settings);
  const [state, setState] = useState('');
  const [problem, setProblem] = useState('');
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setState(''); };

  async function save() {
    setState('saving');
    setProblem('');
    try {
      const d = await call('/settings', 'PUT', {
        enabled: Boolean(form.enabled), every: form.every, day: Number(form.day), hour: Number(form.hour),
        keep: Number(form.keep), include_files: Boolean(form.include_files),
      });
      setState('saved');
      onSaved(d);
    } catch (e) {
      setProblem(e.message);
      setState('');
    }
  }

  return (
    <fieldset className="ads-caps">
      <legend>Schedule</legend>
      <label className="form-editor-check"><input type="checkbox" checked={Boolean(form.enabled)} onChange={(e) => set('enabled', e.target.checked)} /> Back up on a schedule</label>
      <div className="ads-form-row">
        <label className="form-editor-label">How often
          <select value={form.every} onChange={(e) => set('every', e.target.value)}>
            <option value="weekly">Once a week</option>
            <option value="daily">Every day</option>
          </select>
        </label>
        {form.every === 'weekly' ? (
          <label className="form-editor-label">Day
            <select value={form.day} onChange={(e) => set('day', Number(e.target.value))}>
              {data.days.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </label>
        ) : null}
        <label className="form-editor-label">Time ({data.time_zone})
          <select value={form.hour} onChange={(e) => set('hour', Number(e.target.value))}>
            {HOURS.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
          </select>
        </label>
        <label className="form-editor-label">Backups to keep on the NAS
          <input type="number" min={1} max={60} value={form.keep} onChange={(e) => set('keep', e.target.value)} />
        </label>
      </div>
      <label className="form-editor-check"><input type="checkbox" checked={Boolean(form.include_files)} onChange={(e) => set('include_files', e.target.checked)} /> Include the uploaded files and graphics library (the largest part)</label>
      <p className="admin-muted">Once the number to keep is reached, the oldest backup this page made is removed from the NAS. Nothing else on the NAS is touched.</p>
      {problem ? <p className="form-error" role="alert">{problem}</p> : null}
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={save} disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save schedule'}</button>
        {state === 'saved' ? <span className="admin-muted" role="status">Saved.</span> : null}
      </div>
    </fieldset>
  );
}

function Contents({ contents }) {
  return (
    <>
      <h3 className="admin-subheading">What goes in every backup</h3>
      <div className="admin-table-wrap">
        <table className="admin-table admin-table-compact admin-lines backups-contents">
          <colgroup><col className="col-part" /><col /><col className="col-size" /></colgroup>
          <thead><tr><th>Part</th><th>What it holds</th><th>Size now</th></tr></thead>
          <tbody>
            {contents.map((c) => (
              <tr key={c.name}><td>{c.name}{c.optional ? ' (optional)' : ''}</td><td className="backups-wrap">{c.what}</td><td>{c.size || '—'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="admin-muted">Every file is locked with the backup passphrase before it leaves this server, and checked to open before it is copied. The website code is copied too (both repositories, every branch and commit); Vercel's own settings stay in Vercel. Keep the passphrase in Zoho Vault: without it no backup can be opened.</p>
    </>
  );
}

function History({ backups }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <h3 className="admin-subheading">Backups</h3>
      <div className="admin-table-wrap">
        <table className="admin-table admin-table-compact admin-lines backups-lines">
          <colgroup><col className="col-open" /><col className="col-when" /><col className="col-status" /><col className="col-how" /><col className="col-size" /><col /></colgroup>
          <thead><tr><th aria-label="Open" /><th>When</th><th>Result</th><th>How</th><th>Size</th><th>Where</th></tr></thead>
          <tbody>
            {backups.length === 0 ? <tr><td colSpan={6} className="admin-muted">No backups yet.</td></tr> : null}
            {backups.map((b) => (
              <Fragment key={b.id}>
                <tr className={`admin-line${open === b.id ? ' is-open' : ''}`} onClick={() => setOpen(open === b.id ? null : b.id)}>
                  <td>{open === b.id ? <ChevronDown size={15} aria-hidden="true" /> : <ChevronRight size={15} aria-hidden="true" />}</td>
                  <td>{formatDateTime(b.created_at)}</td>
                  <td><span className={`admin-status ${STATUS_CLASS[b.status] || ''}`}>{STATUS[b.status] || b.status}</span></td>
                  <td>{b.trigger === 'manual' ? 'Back up now' : 'Schedule'}</td>
                  <td>{b.size || '—'}</td>
                  <td title={b.folder || ''}>{b.status === 'failed' ? b.error : b.folder || '—'}</td>
                </tr>
                {open === b.id ? (
                  <tr className="backups-detail">
                    <td colSpan={6}>
                      {b.error ? <p className="form-error" role="alert">{b.error}</p> : null}
                      {b.parts.length ? (
                        <ul className="backups-parts">
                          {b.parts.map((p) => <li key={p.name}><code>{p.name}</code> {(p.bytes / 1048576).toFixed(1)} MB: {p.what}</li>)}
                        </ul>
                      ) : null}
                      <ol className="backups-steps">
                        {b.steps.map((s) => <li key={s.at + s.text}><span className="admin-muted">{formatDateTime(s.at)}</span> {s.text}</li>)}
                      </ol>
                      {b.removed_old.length ? <p className="admin-muted">Older backups removed: {b.removed_old.join(', ')}</p> : null}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminBackups() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    call('').then((d) => { setData(d); setError(''); }).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  // Follow a running backup.
  useEffect(() => {
    if (!data?.running) return undefined;
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [data?.running, load]);

  async function runNow() {
    setBusy(true);
    setError('');
    try {
      await call('/run', 'POST', {});
      setTimeout(load, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) return <p className="form-error" role="alert">{error}</p>;
  if (!data) return <p className="admin-muted">Loading…</p>;
  return (
    <div className="backups">
      <Summary data={data} onRun={runNow} busy={busy} />
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <Schedule key={JSON.stringify(data.settings)} data={data} onSaved={setData} />
      <Contents contents={data.contents} />
      <History backups={data.backups} />
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14} aria-hidden="true" /> Refresh</button>
      </div>
    </div>
  );
}
