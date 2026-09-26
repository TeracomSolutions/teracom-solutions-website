'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime, humanise } from '@/lib/adminFormat';

// The documents collected from one source: set the SKU they belong to,
// correct the type, publish or hide them on the store, remove them.
const DOC_TYPES = ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'];

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

export default function AdminResourceDocuments({ documents, downloadBase }) {
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [skuDrafts, setSkuDrafts] = useState({});

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return documents.filter((doc) => {
      if (filter && doc.status !== filter && doc.doc_type !== filter) return false;
      if (!needle) return true;
      return [doc.title, doc.sku, doc.url].some((v) => v && v.toLowerCase().includes(needle));
    });
  }, [documents, filter, q]);

  async function patch(doc, body) {
    setBusyId(doc.id);
    setError('');
    try {
      await send(`/api/admin/resources/documents/${doc.id}`, 'PATCH', body);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
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
      <div className="admin-refresh">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
          <option value="">All documents</option>
          <option value="new">New</option>
          <option value="changed">Changed</option>
          <option value="missing">Missing from the site</option>
          {DOC_TYPES.map((t) => <option key={t} value={t}>{humanise(t)}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search title, SKU, link"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff', minWidth: '240px' }}
        />
        <span className="admin-muted">{rows.length} of {documents.length}</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Store SKU</th>
              <th>Status</th>
              <th>Size</th>
              <th>Last changed</th>
              <th>On store</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="admin-muted">No documents{documents.length ? ' match' : ' yet — run a check'}.</td></tr>
            )}
            {rows.map((doc) => {
              const draft = skuDrafts[doc.id];
              const skuValue = draft !== undefined ? draft : doc.sku || '';
              return (
                <tr key={doc.id}>
                  <td className="wrap">
                    <a href={`${downloadBase}/resources/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="admin-link">{doc.title}</a>
                    <span className="admin-muted" style={{ display: 'block', fontSize: '12px', overflowWrap: 'anywhere' }}>{doc.url}</span>
                  </td>
                  <td>
                    <select value={doc.doc_type} onChange={(e) => patch(doc, { doc_type: e.target.value })} disabled={busyId === doc.id} style={{ padding: '4px 6px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' }}>
                      {DOC_TYPES.map((t) => <option key={t} value={t}>{humanise(t)}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className="admin-actions">
                      <input
                        type="text"
                        value={skuValue}
                        placeholder="SKU"
                        onChange={(e) => setSkuDrafts({ ...skuDrafts, [doc.id]: e.target.value })}
                        style={{ width: '140px', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' }}
                        aria-label="Store SKU"
                      />
                      {draft !== undefined && draft !== (doc.sku || '') && (
                        <button type="button" className="btn btn-primary btn-sm" disabled={busyId === doc.id} onClick={async () => { await patch(doc, { sku: draft.trim() || null }); setSkuDrafts((d) => { const n = { ...d }; delete n[doc.id]; return n; }); }}>
                          Save
                        </button>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status ${statusClass(doc.status)}`}>{humanise(doc.status)}</span>
                    {doc.change_count > 0 && <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>changed {doc.change_count}×</span>}
                  </td>
                  <td>{sizeLabel(doc.size_bytes)}</td>
                  <td>{formatDateTime(doc.last_changed_at || doc.first_seen_at)}</td>
                  <td>
                    <button type="button" className={`btn btn-sm ${doc.published ? 'btn-secondary' : 'btn-primary'}`} onClick={() => patch(doc, { published: !doc.published })} disabled={busyId === doc.id}>
                      {doc.published ? 'Hide' : 'Publish'}
                    </button>
                    {doc.published && !doc.sku && <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>needs a SKU to show</span>}
                  </td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(doc)} disabled={busyId === doc.id}>Remove</button>
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
