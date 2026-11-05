'use client';

import { useCallback, useEffect, useState } from 'react';

import AdminGrowthItems from '@/components/AdminGrowthItems';
import AdminListPager, { useListPage } from '@/components/AdminListPager';
import { formatDateTime } from '@/lib/adminFormat';
import { growthGroups, growthStatus } from '@/lib/growthTools';

// Scout -> Growth tools (Robert, 2026-11-05: "build them all", each with its
// own switch so he picks which ones run). Every tool is off until switched on.
// A tool that runs on a schedule shows its last report; Run now starts one.

async function call(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

function Report({ report }) {
  const rows = report?.table?.rows || [];
  const view = useListPage(rows, { sizes: [10, 20, 50, 100], initialSize: 10 });
  if (!report) return null;
  return (
    <div className="growth-report">
      <p className="growth-headline">{report.headline}</p>
      {report.notes && report.notes.length > 0 ? (
        <ul className="growth-notes">{report.notes.map((note, i) => <li key={i}>{note}</li>)}</ul>
      ) : null}
      {rows.length > 0 ? (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-compact">
              <thead><tr>{report.table.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {view.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="wrap">
                        {typeof cell === 'string' && cell.startsWith('https://') ? (
                          <a href={cell} target="_blank" rel="noopener noreferrer" className="admin-link">{cell}</a>
                        ) : String(cell ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminListPager view={view} label="rows" />
        </>
      ) : null}
    </div>
  );
}

function Settings({ tool, onSave, busy }) {
  const [values, setValues] = useState(() => Object.fromEntries(tool.fields.map((f) => [f.name, f.type === 'secret' ? '' : (f.value ?? '')])));
  if (!tool.fields.length) return null;
  return (
    <form
      className="growth-settings"
      onSubmit={(event) => { event.preventDefault(); onSave(values); }}
    >
      {tool.fields.map((field) => (
        <label key={field.name}>
          {field.label}
          {field.type === 'textarea' ? (
            <textarea rows={4} value={values[field.name]} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} />
          ) : (
            <input
              type={field.type === 'secret' ? 'password' : field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
              value={values[field.name]}
              placeholder={field.type === 'secret' && field.value ? 'Saved; leave blank to keep it' : ''}
              autoComplete="off"
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          )}
        </label>
      ))}
      <div className="admin-actions">
        <button type="submit" className="btn btn-secondary btn-sm" disabled={busy}>Save settings</button>
      </div>
    </form>
  );
}

function ToolCard({ tool, busy, onToggle, onRun, onSave }) {
  const [open, setOpen] = useState(false);
  const status = growthStatus(tool);
  return (
    <div className={`growth-card${tool.enabled ? ' is-on' : ''}${open ? ' is-open' : ''}`}>
      <div className="growth-card-head">
        <span className="growth-number">{tool.number}</span>
        <div className="growth-card-title">
          <strong>{tool.label}</strong>
          <span className="admin-muted">{tool.summary}</span>
        </div>
        <label className="growth-switch">
          <input type="checkbox" checked={tool.enabled} disabled={busy} onChange={(e) => onToggle(tool, e.target.checked)} />
          <span>{tool.enabled ? 'On' : 'Off'}</span>
        </label>
      </div>
      <p className="growth-status">
        <span className={`admin-status ${status.tone}`}>{status.label}</span>
        {tool.last_at ? <span className="admin-muted"> Last run {formatDateTime(tool.last_at)}</span> : null}
        {tool.error ? <span className="growth-error"> {tool.error}</span> : null}
      </p>
      <p className="admin-muted growth-needs"><strong>Needs:</strong> {tool.needs}</p>
      <div className="admin-actions">
        {tool.can_run ? (
          <button type="button" className="btn btn-primary btn-sm" disabled={busy || !tool.enabled || tool.running} onClick={() => onRun(tool)} title={tool.enabled ? '' : 'Switch it on first'}>
            {tool.running ? 'Running…' : 'Run now'}
          </button>
        ) : null}
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(!open)}>
          {open ? 'Close' : tool.has_items ? 'Open' : tool.fields.length ? 'Settings and report' : tool.links && tool.links.length ? 'Open' : 'Report'}
        </button>
      </div>
      {open ? (
        <div className="growth-card-body">
          <Settings tool={tool} busy={busy} onSave={(values) => onSave(tool, values)} />
          {tool.links && tool.links.length > 0 ? (
            <ul className="growth-links">
              {tool.links.map((link) => (
                <li key={link.url}>{link.label}: <a href={link.url} target="_blank" rel="noopener noreferrer" className="admin-link">{link.url}</a></li>
              ))}
            </ul>
          ) : null}
          {tool.has_items ? <AdminGrowthItems tool={tool.key} enabled={tool.enabled} /> : null}
          {tool.report ? <Report report={tool.report} /> : tool.can_run ? <p className="admin-muted">No report yet. Switch it on and press Run now.</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminGrowthTools() {
  const [tools, setTools] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await call('/api/admin/growth', 'GET');
      setTools(data.tools || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // While a tool runs, look again every five seconds.
  const anyRunning = (tools || []).some((t) => t.running);
  useEffect(() => {
    if (!anyRunning) return undefined;
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [anyRunning, load]);

  async function act(tool, work, done) {
    setBusy(tool.key);
    setError('');
    setMessage('');
    try {
      const data = await work();
      if (data && data.tools) setTools(data.tools);
      else await load();
      if (done) setMessage(done);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  const toggle = (tool, on) => act(tool, () => call(`/api/admin/growth/${tool.key}`, 'PUT', { enabled: on }), `${tool.label} is ${on ? 'on' : 'off'}.`);
  const save = (tool, values) => act(tool, () => call(`/api/admin/growth/${tool.key}`, 'PUT', { values }), `${tool.label}: settings saved.`);
  const run = (tool) => act(tool, () => call(`/api/admin/growth/${tool.key}/run`, 'POST'), `${tool.label} is running; its report appears here when it finishes.`);

  return (
    <div className="growth">
      <p className="lead">Tools that help the website get found and chosen. Each one is off until you switch it on; switch on the ones you want to use.</p>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {tools === null ? <p className="admin-muted">Loading…</p> : null}
      {growthGroups(tools || []).map((group) => (
        <section key={group.label} className="growth-group">
          <h2>{group.label}</h2>
          <div className="growth-grid">
            {group.tools.map((tool) => (
              <ToolCard key={tool.key} tool={tool} busy={busy === tool.key} onToggle={toggle} onRun={run} onSave={save} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
