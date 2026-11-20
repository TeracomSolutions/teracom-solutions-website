'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Play, Plus, Save, Trash2, X } from 'lucide-react';

import { formatDate, formatDateTime } from '@/lib/adminFormat';

// System > Reports (backend services/reports.py, Robert 20 November 2026: "a whole report engine so we can report on
// anything in the platform"). The page only describes a report (data, columns, filters, grouping, totals, sort); the
// backend checks every name against its list of safe columns and runs it.

const EMPTY = { dataset: '', mode: 'list', columns: [], filters: [], group_by: [], aggregates: [{ fn: 'count', column: '' }], sort: { by: '', dir: 'desc' }, limit: 1000, days: '', from: '', to: '' };

function fromSpec(spec) {
  const grouped = Boolean((spec.group_by && spec.group_by.length) || (spec.aggregates && spec.aggregates.length));
  return {
    ...EMPTY, ...spec, mode: grouped ? 'group' : 'list',
    columns: spec.columns || [], filters: spec.filters || [], group_by: spec.group_by || [],
    aggregates: spec.aggregates && spec.aggregates.length ? spec.aggregates : EMPTY.aggregates,
    sort: spec.sort || { by: '', dir: 'desc' }, limit: spec.limit || 1000, days: spec.days ?? '', from: spec.from || '', to: spec.to || '',
  };
}

function toSpec(r) {
  const spec = { dataset: r.dataset, filters: r.filters.filter((f) => f.column && f.op), limit: Number(r.limit) || 1000 };
  if (r.mode === 'group') {
    spec.group_by = r.group_by.filter(Boolean);
    spec.aggregates = r.aggregates.filter((a) => a.fn).map((a) => (a.column ? a : { fn: a.fn }));
  } else {
    spec.columns = r.columns;
  }
  if (r.sort.by) spec.sort = r.sort;
  if (r.days !== '' && r.days != null) spec.days = Number(r.days);
  if (r.from) spec.from = r.from;
  if (r.to) spec.to = r.to;
  return spec;
}

// The keys the backend gives each output column, so Sort can offer them before the report runs.
function outputKeys(r, ds) {
  if (!ds) return [];
  const label = (name) => ds.columns.find((c) => c.name === name)?.label || name;
  if (r.mode === 'group') {
    return [
      ...r.group_by.filter(Boolean).map((g) => { const [n, b] = g.split(':'); return { key: g, label: label(n) + (b ? ` (${b})` : '') }; }),
      ...r.aggregates.filter((a) => a.fn).map((a) => (a.fn === 'count' && !a.column ? { key: 'count', label: 'Count' } : { key: `${a.fn}_${a.column}`, label: `${a.fn} of ${label(a.column)}` })),
    ];
  }
  return (r.columns.length ? r.columns : ds.columns.slice(0, 12).map((c) => c.name)).map((n) => ({ key: n, label: label(n) }));
}

function show(value, kind) {
  if (value === null || value === undefined || value === '') return '';
  if (kind === 'money') return `$${(Number(value) / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (kind === 'bool') return value ? 'Yes' : 'No';
  if (kind === 'datetime') return formatDateTime(value);
  if (kind === 'date') return formatDate(String(value).slice(0, 10));
  if (kind === 'number' && typeof value === 'number') return Number.isInteger(value) ? value.toLocaleString('en-AU') : value.toLocaleString('en-AU', { maximumFractionDigits: 2 });
  return String(value);
}

function csvCell(value) {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(result, name) {
  const lines = [result.columns.map((c) => csvCell(c.label)).join(',')];
  for (const row of result.rows) lines.push(result.columns.map((c) => csvCell(c.kind === 'money' && row[c.key] != null ? (row[c.key] / 100).toFixed(2) : row[c.key])).join(','));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(name || result.label).replace(/[^\w-]+/g, '-').toLowerCase()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function call(url, options) {
  const res = await fetch(url, { cache: 'no-store', ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || body.detail || 'That did not work.');
  return body;
}

function Results({ result, name }) {
  const numeric = result.columns.find((c, i) => i > 0 && (c.kind === 'number' || c.kind === 'money'));
  const top = numeric ? Math.max(...result.rows.map((r) => Number(r[numeric.key]) || 0), 1) : 1;
  const grouped = numeric && result.columns.length <= 4;
  return (
    <div className="rep-results">
      <div className="rep-results-head">
        <strong>{result.rows.length.toLocaleString('en-AU')} {result.rows.length === 1 ? 'row' : 'rows'}</strong>
        {result.truncated ? <span className="rules-pill is-bad">More rows than shown: narrow it or raise the limit</span> : null}
        <span className="admin-muted">{result.label} · run {formatDateTime(result.ran_at)}</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => downloadCsv(result, name)}><Download size={14} aria-hidden="true" /> CSV</button>
      </div>
      {result.rows.length ? (
        <div className="admin-table-wrap rep-table-wrap">
          <table className="admin-table admin-table-compact rep-table">
            <thead><tr>{result.columns.map((c) => <th key={c.key} className={c.kind === 'number' || c.kind === 'money' ? 'num' : undefined}>{c.label}</th>)}</tr></thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {result.columns.map((c) => (
                    <td key={c.key} className={c.kind === 'number' || c.kind === 'money' ? 'num' : undefined}>
                      {show(row[c.key], c.kind)}
                      {grouped && c.key === numeric.key ? <span className="rep-bar" aria-hidden="true"><span style={{ width: `${Math.max(1, ((Number(row[c.key]) || 0) / top) * 100)}%` }} /></span> : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="admin-muted">Nothing matches.</p>}
    </div>
  );
}

export default function AdminReports() {
  const [cat, setCat] = useState(null);
  const [saved, setSaved] = useState([]);
  const [r, setR] = useState(EMPTY);
  const [current, setCurrent] = useState(null); // { id, name } of the saved report open, if any
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    call('/api/admin/reports').then((body) => { setCat(body); setSaved(body.saved || []); }).catch((e) => setError(e.message));
  }, []);

  const ds = useMemo(() => cat?.datasets.find((d) => d.key === r.dataset), [cat, r.dataset]);
  const keys = outputKeys(r, ds);
  const dateCols = ds ? ds.columns.filter((c) => c.kind === 'date' || c.kind === 'datetime') : [];
  const numCols = ds ? ds.columns.filter((c) => c.kind === 'number' || c.kind === 'money') : [];
  const set = (changes) => setR((x) => ({ ...x, ...changes }));

  function open(spec, entry) {
    setR(fromSpec(spec));
    setCurrent(entry ? { id: entry.id, name: entry.name } : null);
    setName(entry ? entry.name : spec.name || '');
    setResult(null);
    setError('');
    setNote('');
    if (spec.dataset) run(fromSpec(spec));
  }

  async function run(report = r) {
    if (!report.dataset) return;
    setBusy('run');
    setError('');
    try {
      setResult(await call('/api/admin/reports/run', { method: 'POST', body: JSON.stringify(toSpec(report)) }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }

  async function save(asNew) {
    setBusy('save');
    setError('');
    try {
      const body = await call('/api/admin/reports/saved', { method: 'POST', body: JSON.stringify({ name, spec: toSpec(r), id: asNew ? undefined : current?.id }) });
      setSaved(body.saved);
      setCurrent({ id: body.report.id, name: body.report.name });
      setNote('Saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }

  async function remove(entry) {
    if (!window.confirm(`Remove the saved report "${entry.name}"?`)) return;
    try {
      const body = await call(`/api/admin/reports/saved/${entry.id}`, { method: 'DELETE' });
      setSaved(body.saved);
      if (current?.id === entry.id) setCurrent(null);
    } catch (e) {
      setError(e.message);
    }
  }

  if (error && !cat) return <p className="form-error" role="alert">{error}</p>;
  if (!cat) return <p className="admin-muted">Loading…</p>;

  const colOptions = (list) => list.map((c) => <option key={c.name} value={c.name}>{c.label}</option>);

  return (
    <div className="rep">
      <aside className="rep-side">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => open({})}><Plus size={14} aria-hidden="true" /> New report</button>
        <h3>Saved</h3>
        {saved.length ? (
          <ul className="rep-list">
            {saved.map((s) => (
              <li key={s.id} className={current?.id === s.id ? 'is-on' : undefined}>
                <button type="button" onClick={() => open(s.spec, s)}>{s.name}</button>
                <button type="button" className="rep-x" aria-label={`Remove ${s.name}`} onClick={() => remove(s)}><X size={13} aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
        ) : <p className="admin-muted">None yet. Build one and press Save.</p>}
        <h3>Ready-made</h3>
        <ul className="rep-list">
          {cat.templates.map((t) => <li key={t.name}><button type="button" onClick={() => open(t)}>{t.name}</button></li>)}
        </ul>
      </aside>

      <section className="rep-main">
        <div className="rep-row">
          <label className="rep-grow">Report on
            <select value={r.dataset} onChange={(e) => { set({ ...EMPTY, dataset: e.target.value }); setResult(null); }}>
              <option value="">Choose the data…</option>
              {cat.areas.map((area) => (
                <optgroup key={area} label={area}>
                  {cat.datasets.filter((d) => d.area === area).map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
          {ds ? (
            <div className="rep-toggle" role="group" aria-label="Kind of report">
              <button type="button" className={r.mode === 'list' ? 'rules-tab active' : 'rules-tab'} onClick={() => set({ mode: 'list', sort: { by: '', dir: 'desc' } })}>List rows</button>
              <button type="button" className={r.mode === 'group' ? 'rules-tab active' : 'rules-tab'} onClick={() => set({ mode: 'group', sort: { by: '', dir: 'desc' } })}>Group and total</button>
            </div>
          ) : null}
        </div>
        {ds ? <p className="admin-muted rep-about">{ds.about}</p> : <p className="admin-muted">Pick the data to report on, or open a ready-made report on the left.</p>}

        {ds ? (
          <>
            {r.mode === 'list' ? (
              <fieldset className="rep-box">
                <legend>Columns <span className="admin-muted">(none ticked: the first 12)</span></legend>
                <div className="rep-chips">
                  {ds.columns.map((c) => (
                    <label key={c.name} className={r.columns.includes(c.name) ? 'rep-chip is-on' : 'rep-chip'}>
                      <input type="checkbox" checked={r.columns.includes(c.name)}
                        onChange={() => set({ columns: r.columns.includes(c.name) ? r.columns.filter((x) => x !== c.name) : [...r.columns, c.name] })} /> {c.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <fieldset className="rep-box">
                <legend>Group by and totals</legend>
                {r.group_by.map((g, i) => {
                  const [colName, bucket] = g.split(':');
                  const isDate = dateCols.some((c) => c.name === colName);
                  return (
                    <div key={i} className="rep-line">
                      <span className="rep-word">Group by</span>
                      <select value={colName} onChange={(e) => { const next = [...r.group_by]; next[i] = dateCols.some((c) => c.name === e.target.value) ? `${e.target.value}:month` : e.target.value; set({ group_by: next }); }}>
                        <option value="">Choose…</option>{colOptions(ds.columns)}
                      </select>
                      {isDate ? (
                        <select value={bucket || ''} onChange={(e) => { const next = [...r.group_by]; next[i] = e.target.value ? `${colName}:${e.target.value}` : colName; set({ group_by: next }); }}>
                          <option value="">Exact</option>{cat.buckets.map((b) => <option key={b} value={b}>By {b}</option>)}
                        </select>
                      ) : null}
                      <button type="button" className="rep-x" aria-label="Remove" onClick={() => set({ group_by: r.group_by.filter((_, n) => n !== i) })}><X size={13} aria-hidden="true" /></button>
                    </div>
                  );
                })}
                {r.aggregates.map((a, i) => (
                  <div key={`a${i}`} className="rep-line">
                    <span className="rep-word">Show</span>
                    <select value={a.fn} onChange={(e) => { const next = [...r.aggregates]; next[i] = { fn: e.target.value, column: e.target.value === 'count' ? '' : a.column || numCols[0]?.name || '' }; set({ aggregates: next }); }}>
                      {Object.entries(cat.aggregates).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={a.column || ''} onChange={(e) => { const next = [...r.aggregates]; next[i] = { ...a, column: e.target.value }; set({ aggregates: next }); }}>
                      {a.fn === 'count' ? <option value="">of rows</option> : null}
                      {colOptions(a.fn === 'sum' || a.fn === 'avg' ? numCols : ds.columns)}
                    </select>
                    <button type="button" className="rep-x" aria-label="Remove" onClick={() => set({ aggregates: r.aggregates.filter((_, n) => n !== i) })}><X size={13} aria-hidden="true" /></button>
                  </div>
                ))}
                <div className="rep-line">
                  {r.group_by.length < 4 ? <button type="button" className="btn btn-secondary btn-sm" onClick={() => set({ group_by: [...r.group_by, ''] })}><Plus size={14} aria-hidden="true" /> Group by</button> : null}
                  {r.aggregates.length < 6 ? <button type="button" className="btn btn-secondary btn-sm" onClick={() => set({ aggregates: [...r.aggregates, { fn: 'count', column: '' }] })}><Plus size={14} aria-hidden="true" /> Total</button> : null}
                </div>
              </fieldset>
            )}

            <fieldset className="rep-box">
              <legend>Only include</legend>
              {r.filters.map((f, i) => {
                const col = ds.columns.find((c) => c.name === f.column);
                const noValue = f.op === 'empty' || f.op === 'not_empty';
                const upd = (ch) => { const next = [...r.filters]; next[i] = { ...f, ...ch }; set({ filters: next }); };
                return (
                  <div key={i} className="rep-line">
                    <select value={f.column} onChange={(e) => upd({ column: e.target.value })}><option value="">Column…</option>{colOptions(ds.columns)}</select>
                    <select value={f.op} onChange={(e) => upd({ op: e.target.value })}>
                      {Object.entries(cat.ops).filter(([k]) => (col?.kind === 'bool' ? ['eq', 'ne', 'empty', 'not_empty'].includes(k) : true)).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    {noValue ? null : col?.kind === 'bool' ? (
                      <select value={f.value || ''} onChange={(e) => upd({ value: e.target.value })}><option value="true">Yes</option><option value="false">No</option></select>
                    ) : (
                      <input type={col?.kind === 'date' || col?.kind === 'datetime' ? 'date' : 'text'} value={f.value || ''} onChange={(e) => upd({ value: e.target.value })}
                        placeholder={col?.kind === 'money' ? 'Dollars' : 'Value'} />
                    )}
                    <button type="button" className="rep-x" aria-label="Remove" onClick={() => set({ filters: r.filters.filter((_, n) => n !== i) })}><X size={13} aria-hidden="true" /></button>
                  </div>
                );
              })}
              <div className="rep-line">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => set({ filters: [...r.filters, { column: '', op: 'eq', value: '' }] })}><Plus size={14} aria-hidden="true" /> Filter</button>
                {ds.date_column ? (
                  <>
                    <span className="rep-word">{ds.columns.find((c) => c.name === ds.date_column)?.label}:</span>
                    <select value={r.days} onChange={(e) => set({ days: e.target.value })}>
                      <option value="">Any time</option>
                      {[1, 7, 30, 90, 365].map((n) => <option key={n} value={n}>Last {n === 1 ? 'day' : `${n} days`}</option>)}
                    </select>
                    <label className="rep-inline">from <input type="date" value={r.from} onChange={(e) => set({ from: e.target.value })} /></label>
                    <label className="rep-inline">to <input type="date" value={r.to} onChange={(e) => set({ to: e.target.value })} /></label>
                  </>
                ) : null}
              </div>
            </fieldset>

            <div className="rep-row">
              <label className="rep-inline">Sort by
                <select value={r.sort.by} onChange={(e) => set({ sort: { ...r.sort, by: e.target.value } })}>
                  <option value="">As stored</option>{keys.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
                </select>
                <select value={r.sort.dir} onChange={(e) => set({ sort: { ...r.sort, dir: e.target.value } })}>
                  <option value="desc">High to low, newest first</option><option value="asc">Low to high, oldest first</option>
                </select>
              </label>
              <label className="rep-inline">Up to
                <input type="number" min="1" max={cat.max_rows} value={r.limit} onChange={(e) => set({ limit: e.target.value })} className="rep-num" /> rows
              </label>
              <button type="button" className="btn btn-primary" onClick={() => run()} disabled={busy === 'run'}><Play size={15} aria-hidden="true" /> {busy === 'run' ? 'Running…' : 'Run'}</button>
            </div>

            <div className="rep-row rep-save">
              <input type="text" placeholder="Name this report to save it" value={name} onChange={(e) => setName(e.target.value)} />
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy === 'save' || !name.trim()} onClick={() => save(!current)}>
                <Save size={14} aria-hidden="true" /> {current ? 'Save changes' : 'Save'}
              </button>
              {current ? <button type="button" className="btn btn-secondary btn-sm" disabled={busy === 'save' || !name.trim()} onClick={() => save(true)}>Save as new</button> : null}
              {current ? <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove({ id: current.id, name: current.name })}><Trash2 size={14} aria-hidden="true" /> Remove</button> : null}
              {note ? <span className="form-success" role="status">{note}</span> : null}
            </div>
          </>
        ) : null}

        {error ? <p className="form-error" role="alert">{error}</p> : null}
        {result ? <Results result={result} name={name} /> : null}
      </section>
    </div>
  );
}
