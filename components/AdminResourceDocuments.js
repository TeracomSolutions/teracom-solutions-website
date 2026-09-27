'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime, humanise } from '@/lib/adminFormat';
import { SECTION_LABELS, SITE_DOCUMENT_SECTIONS, sectionForType } from '@/lib/publishedResources';

// The documents collected from one source: set the SKU they belong to,
// correct the type, publish or hide them on the store, put them on the
// website (and say in which section), name the model, remove them.
const DOC_TYPES = ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'];
const SITE_ORIGIN = 'https://www.teracomsolutions.com.au';

function statusClass(status) {
  if (status === 'new') return 'is-needs_review';
  if (status === 'changed') return 'is-pending';
  if (status === 'missing') return 'is-failed';
  return 'is-approved';
}

function sizeLabel(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The change was not saved.');
  return data;
}

const field = { padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' };

export default function AdminResourceDocuments({ documents, downloadBase }) {
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [busyBulk, setBusyBulk] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [skuDrafts, setSkuDrafts] = useState({});
  const [modelDrafts, setModelDrafts] = useState({});
  const [selected, setSelected] = useState(() => new Set());
  const [bulkSection, setBulkSection] = useState('');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return documents.filter((doc) => {
      if (filter === 'on-site' && !doc.site_section) return false;
      if (filter === 'off-site' && doc.site_section) return false;
      if (filter && !['on-site', 'off-site'].includes(filter) && doc.status !== filter && doc.doc_type !== filter) return false;
      if (!needle) return true;
      return [doc.title, doc.sku, doc.model, doc.url].some((v) => v && v.toLowerCase().includes(needle));
    });
  }, [documents, filter, q]);

  const onSite = documents.filter((d) => d.site_section).length;
  const allShownSelected = rows.length > 0 && rows.every((d) => selected.has(d.id));

  function toggleSelected(id) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllShown() {
    setSelected((current) => {
      const next = new Set(current);
      if (allShownSelected) rows.forEach((d) => next.delete(d.id));
      else rows.forEach((d) => next.add(d.id));
      return next;
    });
  }

  async function patch(doc, body) {
    setBusyId(doc.id);
    setError('');
    setNotice('');
    try {
      await send(`/api/admin/resources/documents/${doc.id}`, 'PATCH', body);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function bulk(ids, action) {
    if (!ids.length) return;
    const where = action === 'publish' ? (bulkSection ? `the ${SECTION_LABELS[bulkSection]} section` : 'the section each type maps to') : 'off the website';
    if (!window.confirm(`${action === 'publish' ? 'Publish' : 'Take'} ${ids.length} document${ids.length === 1 ? '' : 's'} ${action === 'publish' ? 'to' : ''} ${where}?`)) return;
    setBusyBulk(true);
    setError('');
    setNotice('');
    try {
      const body = { document_ids: ids, action };
      if (action === 'publish' && bulkSection) body.section = bulkSection;
      const result = await send('/api/admin/resources/documents/bulk-publish', 'POST', body);
      setNotice(`${result.updated} of ${result.matched} document${result.matched === 1 ? '' : 's'} ${action === 'publish' ? 'published to the website' : 'taken off the website'}.`);
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyBulk(false);
    }
  }

  async function remove(doc) {
    if (!window.confirm(`Remove "${doc.title}"? It will be collected again on the next check if the site still links to it.`)) return;
    setBusyId(doc.id);
    setError('');
    try {
      await send(`/api/admin/resources/documents/${doc.id}`, 'DELETE');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}
      <div className="admin-refresh">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
          <option value="">All documents</option>
          <option value="on-site">On the website</option>
          <option value="off-site">Not on the website</option>
          <option value="new">New</option>
          <option value="changed">Changed</option>
          <option value="missing">Missing from the site</option>
          {DOC_TYPES.map((t) => <option key={t} value={t}>{humanise(t)}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search title, SKU, model, link"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ ...field, padding: '6px 10px', minWidth: '240px' }}
        />
        <span className="admin-muted">{rows.length} of {documents.length} · {onSite} on the website</span>
      </div>

      <div className="admin-actions admin-bulk-bar">
        <span className="admin-muted">{selected.size} selected</span>
        <select value={bulkSection} onChange={(e) => setBulkSection(e.target.value)} aria-label="Website section for publishing" style={field}>
          <option value="">Section by document type</option>
          {SITE_DOCUMENT_SECTIONS.map((s) => <option key={s} value={s}>{SECTION_LABELS[s]}</option>)}
        </select>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => bulk([...selected], 'publish')} disabled={busyBulk || selected.size === 0}>Publish selected to website</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => bulk([...selected], 'unpublish')} disabled={busyBulk || selected.size === 0}>Take selected off the website</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => bulk(rows.map((d) => d.id), 'publish')} disabled={busyBulk || rows.length === 0}>Publish everything shown ({rows.length})</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={allShownSelected} onChange={toggleAllShown} aria-label="Select every document shown" /></th>
              <th>Document</th>
              <th>Type</th>
              <th>Model</th>
              <th>Store SKU</th>
              <th>Status</th>
              <th>Size</th>
              <th>Website</th>
              <th>On store</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={10} className="admin-muted">No documents{documents.length ? ' match' : ' yet — run a check'}.</td></tr>
            )}
            {rows.map((doc) => {
              const skuDraft = skuDrafts[doc.id];
              const skuValue = skuDraft !== undefined ? skuDraft : doc.sku || '';
              const modelDraft = modelDrafts[doc.id];
              const modelValue = modelDraft !== undefined ? modelDraft : doc.model || '';
              const busy = busyId === doc.id || busyBulk;
              return (
                <tr key={doc.id}>
                  <td><input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleSelected(doc.id)} aria-label={`Select ${doc.title}`} /></td>
                  <td className="wrap">
                    <a href={`${downloadBase}/resources/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="admin-link">{doc.title}</a>
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px', overflowWrap: 'anywhere' }}>{doc.brand ? `${doc.brand} · ` : ''}{doc.url}</span>
                  </td>
                  <td>
                    <select value={doc.doc_type} onChange={(e) => patch(doc, { doc_type: e.target.value })} disabled={busy} style={{ ...field, padding: '4px 6px' }}>
                      {DOC_TYPES.map((t) => <option key={t} value={t}>{humanise(t)}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className="admin-actions">
                      <input
                        type="text"
                        value={modelValue}
                        placeholder="Model"
                        onChange={(e) => setModelDrafts({ ...modelDrafts, [doc.id]: e.target.value })}
                        style={{ ...field, width: '130px' }}
                        aria-label="Product model"
                      />
                      {modelDraft !== undefined && modelDraft !== (doc.model || '') && (
                        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={async () => { await patch(doc, { model: modelDraft.trim() || null }); setModelDrafts((d) => { const n = { ...d }; delete n[doc.id]; return n; }); }}>
                          Save
                        </button>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="admin-actions">
                      <input
                        type="text"
                        value={skuValue}
                        placeholder="SKU"
                        onChange={(e) => setSkuDrafts({ ...skuDrafts, [doc.id]: e.target.value })}
                        style={{ ...field, width: '130px' }}
                        aria-label="Store SKU"
                      />
                      {skuDraft !== undefined && skuDraft !== (doc.sku || '') && (
                        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={async () => { await patch(doc, { sku: skuDraft.trim() || null }); setSkuDrafts((d) => { const n = { ...d }; delete n[doc.id]; return n; }); }}>
                          Save
                        </button>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status ${statusClass(doc.status)}`}>{humanise(doc.status)}</span>
                    {doc.change_count > 0 && <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>changed {doc.change_count}×</span>}
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>{formatDateTime(doc.last_changed_at || doc.first_seen_at)}</span>
                  </td>
                  <td>{sizeLabel(doc.size_bytes)}</td>
                  <td>
                    <select
                      value={doc.site_section || ''}
                      onChange={(e) => patch(doc, { site_section: e.target.value || null })}
                      disabled={busy}
                      aria-label="Website section"
                      style={{ ...field, padding: '4px 6px' }}
                    >
                      <option value="">Not on the website</option>
                      {SITE_DOCUMENT_SECTIONS.map((s) => <option key={s} value={s}>{SECTION_LABELS[s]}{s === sectionForType(doc.doc_type) ? ' (default)' : ''}</option>)}
                    </select>
                    {doc.site_section && (
                      <a href={`${SITE_ORIGIN}/resources/${doc.site_section}`} target="_blank" rel="noopener noreferrer" className="admin-link" style={{ display: 'block', fontSize: '12px', marginTop: '4px' }}>View on website</a>
                    )}
                  </td>
                  <td>
                    <button type="button" className={`btn btn-sm ${doc.published ? 'btn-secondary' : 'btn-primary'}`} onClick={() => patch(doc, { published: !doc.published })} disabled={busy}>
                      {doc.published ? 'Hide' : 'Publish'}
                    </button>
                    {doc.published && !doc.sku && <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>needs a SKU to show</span>}
                  </td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(doc)} disabled={busy}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
