'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';

// Resources > Product comparisons (backend api/comparisons.py): the comparisons on the website's Resources >
// Product comparisons pages. Staff add a product with its maker's web page; the backend reads the maker's pages
// and the AI fills the table, then checks each product again every week.

const STATUS = {
  new: 'Waiting', queued: 'Waiting for the weekly check', researching: 'Reading the maker\'s website…',
  ok: 'Up to date', failed: 'Last check failed',
};

function when(iso) {
  if (!iso) return 'never';
  try {
    return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return iso;
  }
}

async function call(url, method = 'GET', body) {
  const res = await fetch(url, {
    method, cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'That did not work. Please try again.');
  return data;
}

function ProductEditor({ product, template, onSave, onCancel, busy }) {
  const [form, setForm] = useState(() => ({
    name: product.name, maker: product.maker, website_url: product.website_url,
    extra_sites: (product.extra_sites || []).join('\n'), shown: product.shown,
    facts: JSON.parse(JSON.stringify(product.facts || {})), fit: JSON.parse(JSON.stringify(product.fit || {})),
  }));
  const setFact = (key, part, value) => setForm((f) => ({ ...f, facts: { ...f.facts, [key]: { ...(f.facts[key] || {}), [part]: value } } }));
  const toggleFit = (q, v) => setForm((f) => {
    const now = f.fit[q] || [];
    return { ...f, fit: { ...f.fit, [q]: now.includes(v) ? now.filter((x) => x !== v) : [...now, v] } };
  });

  return (
    <div className="cmpa-editor">
      <div className="admin-form cmpa-grid">
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Maker<input value={form.maker} onChange={(e) => setForm({ ...form, maker: e.target.value })} /></label>
        <label className="cmpa-wide">Maker&apos;s page for the product
          <input type="url" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
        </label>
        <label className="cmpa-wide">More pages to read, one per line
          <span className="admin-muted">A datasheet or licensing page is always read. A bare website (wavevms.com) lets the research read that site too.</span>
          <textarea rows={3} value={form.extra_sites} onChange={(e) => setForm({ ...form, extra_sites: e.target.value })} />
        </label>
        <label className="admin-check cmpa-wide">
          <input type="checkbox" checked={form.shown} onChange={(e) => setForm({ ...form, shown: e.target.checked })} />
          Show on the website
        </label>
      </div>

      <h4>The table</h4>
      {template.groups.map((g) => (
        <fieldset key={g.id} className="cmpa-group">
          <legend>{g.title}</legend>
          {g.rows.map((row) => (
            <div key={row.key} className="cmpa-fact">
              <label htmlFor={`f-${product.id}-${row.key}`}>{row.label}</label>
              <textarea id={`f-${product.id}-${row.key}`} rows={2} value={form.facts[row.key]?.text || ''}
                onChange={(e) => setFact(row.key, 'text', e.target.value)} />
              <input aria-label={`${row.label} source`} placeholder="Source page https://…" value={form.facts[row.key]?.source || ''}
                onChange={(e) => setFact(row.key, 'source', e.target.value)} />
            </div>
          ))}
        </fieldset>
      ))}

      {template.questions.length ? (
        <fieldset className="cmpa-group">
          <legend>Help me choose: what this product suits</legend>
          {template.questions.map((q) => (
            <div key={q.id} className="cmpa-fit">
              <span>{q.label}</span>
              {q.options.map((o) => (
                <label key={o.value} className="admin-check">
                  <input type="checkbox" checked={(form.fit[q.id] || []).includes(o.value)} onChange={() => toggleFit(q.id, o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
          ))}
        </fieldset>
      ) : null}

      <div className="cmpa-actions">
        <button type="button" className="btn btn-primary btn-sm" disabled={busy}
          onClick={() => onSave({ ...form, extra_sites: form.extra_sites.split(/\s+/).filter(Boolean) })}>
          <Save size={14} aria-hidden="true" /> Save product
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}><X size={14} aria-hidden="true" /> Cancel</button>
      </div>
    </div>
  );
}

function Comparison({ c, act, busy }) {
  const [meta, setMeta] = useState({ title: c.title, intro: c.intro, published: c.published });
  const [adding, setAdding] = useState({ name: '', maker: '', website_url: '', extra_sites: '' });
  const [editing, setEditing] = useState('');
  const [openChanges, setOpenChanges] = useState('');

  return (
    <section className="admin-card cmpa-card">
      <div className="admin-form cmpa-grid">
        <label>Title<input value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} /></label>
        <label className="admin-check">
          <input type="checkbox" checked={meta.published} onChange={(e) => setMeta({ ...meta, published: e.target.checked })} />
          Published on the website
        </label>
        <label className="cmpa-wide">Introduction
          <textarea rows={2} value={meta.intro} onChange={(e) => setMeta({ ...meta, intro: e.target.value })} />
        </label>
      </div>
      <div className="cmpa-actions">
        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => act(`/api/admin/comparisons/${c.id}`, 'PUT', meta, 'Saved.')}>
          <Save size={14} aria-hidden="true" /> Save
        </button>
        {c.published ? (
          <a className="btn btn-secondary btn-sm" href={`/resources/comparisons/${c.slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} aria-hidden="true" /> View on the website
          </a>
        ) : null}
        <button type="button" className="btn btn-secondary btn-sm" disabled={busy}
          onClick={() => window.confirm(`Delete "${c.title}" and all its products? This cannot be undone.`) && act(`/api/admin/comparisons/${c.id}`, 'DELETE', null, 'Comparison deleted.')}>
          <Trash2 size={14} aria-hidden="true" /> Delete comparison
        </button>
      </div>

      <h3 className="admin-subheading">Products</h3>
      <div className="admin-table-wrap">
        <table className="admin-table cmpa-table">
          <thead>
            <tr><th>Product</th><th>Status</th><th>Last checked</th><th>Changes</th><th><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>
            {c.products.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>{p.shown ? null : <span className="admin-muted"> (hidden)</span>}
                  <br /><span className="admin-muted">{p.maker}</span>
                  {p.website_url ? <><br /><a href={p.website_url} target="_blank" rel="noopener noreferrer" className="admin-muted">Maker&apos;s page</a></> : null}
                </td>
                <td>
                  <span className={`cmpa-status is-${p.status}`}>{STATUS[p.status] || p.status}</span>
                  {p.detail ? <><br /><span className="admin-muted">{p.detail}</span></> : null}
                </td>
                <td>{when(p.checked_at)}</td>
                <td>
                  {p.changes.length ? (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpenChanges(openChanges === p.id ? '' : p.id)}>
                      {p.changes.length} {p.changes.length === 1 ? 'change' : 'changes'}
                    </button>
                  ) : <span className="admin-muted">none</span>}
                </td>
                <td className="cmpa-row-actions">
                  <button type="button" className="btn btn-secondary btn-sm" disabled={busy || p.status === 'researching'}
                    onClick={() => act(`/api/admin/comparisons/products/${p.id}/research`, 'POST', null, `Reading ${p.name}'s pages now. This takes about a minute.`)}>
                    <RefreshCw size={14} aria-hidden="true" /> Check now
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(editing === p.id ? '' : p.id)}>
                    <Pencil size={14} aria-hidden="true" /> Edit
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" disabled={busy} aria-label={`Delete ${p.name}`}
                    onClick={() => window.confirm(`Delete ${p.name} from this comparison? This cannot be undone.`) && act(`/api/admin/comparisons/products/${p.id}`, 'DELETE', null, `${p.name} deleted.`)}>
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )).flatMap((row, i) => {
              const p = c.products[i];
              const extra = [];
              if (openChanges === p.id) {
                extra.push(
                  <tr key={`${p.id}-changes`} className="cmpa-sub"><td colSpan={5}>
                    <ul className="cmpa-changes">
                      {p.changes.map((ch, n) => {
                        const label = c.template.groups.flatMap((g) => g.rows).find((r) => r.key === ch.key)?.label || ch.key;
                        return (
                          <li key={n}>
                            <strong>{label}</strong> <span className="admin-muted">({ch.by}, {when(ch.at)})</span><br />
                            <del>{ch.old || 'empty'}</del><br /><ins>{ch.new}</ins>
                          </li>
                        );
                      })}
                    </ul>
                  </td></tr>,
                );
              }
              if (editing === p.id) {
                extra.push(
                  <tr key={`${p.id}-edit`} className="cmpa-sub"><td colSpan={5}>
                    <ProductEditor product={p} template={c.template} busy={busy} onCancel={() => setEditing('')}
                      onSave={(body) => act(`/api/admin/comparisons/products/${p.id}`, 'PUT', body, `${p.name} saved.`).then((ok) => ok && setEditing(''))} />
                  </td></tr>,
                );
              }
              return [row, ...extra];
            })}
          </tbody>
        </table>
      </div>

      <h3 className="admin-subheading">Add a product</h3>
      <div className="admin-form cmpa-grid">
        <label>Name<input value={adding.name} placeholder="Milestone XProtect" onChange={(e) => setAdding({ ...adding, name: e.target.value })} /></label>
        <label>Maker<input value={adding.maker} placeholder="Milestone Systems" onChange={(e) => setAdding({ ...adding, maker: e.target.value })} /></label>
        <label className="cmpa-wide">Maker&apos;s page for the product
          <input type="url" value={adding.website_url} placeholder="https://www.milestonesys.com/products/software/xprotect/"
            onChange={(e) => setAdding({ ...adding, website_url: e.target.value })} />
        </label>
        <label className="cmpa-wide">More pages to read, one per line (optional)
          <span className="admin-muted">The datasheet and licensing pages give the best results.</span>
          <textarea rows={2} value={adding.extra_sites} onChange={(e) => setAdding({ ...adding, extra_sites: e.target.value })} />
        </label>
      </div>
      <div className="cmpa-actions">
        <button type="button" className="btn btn-primary btn-sm" disabled={busy || !adding.name || !adding.website_url}
          onClick={() => act(`/api/admin/comparisons/${c.id}/products`, 'POST', { ...adding, extra_sites: adding.extra_sites.split(/\s+/).filter(Boolean) },
            `${adding.name} added. The backend is reading the maker's pages now; the table fills in a minute or two.`)
            .then((ok) => ok && setAdding({ name: '', maker: '', website_url: '', extra_sites: '' }))}>
          <Plus size={14} aria-hidden="true" /> Add and research
        </button>
      </div>
    </section>
  );
}

export default function AdminComparisons() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [newOne, setNewOne] = useState({ title: '', kind: 'vms' });

  const load = useCallback(() => call('/api/admin/comparisons').then(setData).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const working = data?.comparisons?.some((c) => c.products.some((p) => p.status === 'researching'));
  useEffect(() => {
    if (!working) return undefined;
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [working, load]);

  async function act(url, method, body, done) {
    setBusy(true);
    setError('');
    setNote('');
    try {
      setData(await call(url, method, body));
      setNote(done);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  if (!data) return error ? <p className="form-error" role="alert">{error}</p> : <p className="admin-muted">Loading…</p>;

  return (
    <div className="cmpa">
      {note ? <p className="form-success" role="status">{note}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {data.comparisons.map((c) => <Comparison key={c.id} c={c} act={act} busy={busy} />)}

      <section className="admin-card cmpa-card">
        <h3 className="admin-subheading">New comparison</h3>
        <div className="admin-form cmpa-grid">
          <label>Title<input value={newOne.title} placeholder="Access control comparison" onChange={(e) => setNewOne({ ...newOne, title: e.target.value })} /></label>
          <label>Kind of products
            <select value={newOne.kind} onChange={(e) => setNewOne({ ...newOne, kind: e.target.value })}>
              {data.templates.map((t) => <option key={t.kind} value={t.kind}>{t.label}</option>)}
            </select>
          </label>
        </div>
        <div className="cmpa-actions">
          <button type="button" className="btn btn-primary btn-sm" disabled={busy || !newOne.title}
            onClick={() => act('/api/admin/comparisons', 'POST', newOne, 'Comparison added. Add its products, then tick Published.').then((ok) => ok && setNewOne({ title: '', kind: 'vms' }))}>
            <Plus size={14} aria-hidden="true" /> Add comparison
          </button>
        </div>
        <p className="admin-muted">Each kind has its own rows and questions. Only VMS exists so far; cameras and access control will be added as new kinds.</p>
      </section>
    </div>
  );
}
