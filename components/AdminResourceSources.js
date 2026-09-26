'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Folder, Pencil } from 'lucide-react';

import { formatDateTime, humanise } from '@/lib/adminFormat';

// The Resources page: the websites we watch and a form to add one.
const DOC_TYPE_OPTIONS = [
  { key: 'datasheet', label: 'Data sheets' },
  { key: 'user_manual', label: 'User manuals' },
  { key: 'installer_manual', label: 'Installer manuals' },
  { key: 'brochure', label: 'Brochures' },
  { key: 'other', label: 'Other PDFs' },
];

const RECURRENCE_OPTIONS = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'daily', label: 'Daily' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'manual', label: 'Only when I click Check now' },
];

function statusClass(status) {
  if (status === 'ok') return 'is-approved';
  if (status === 'failed') return 'is-failed';
  if (status === 'running') return 'is-running';
  return 'is-pending';
}

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

function SourceForm({ suppliers, initial, onSaved, onCancel }) {
  const [name, setName] = useState(initial ? initial.name : '');
  const [url, setUrl] = useState(initial ? initial.url : '');
  const [supplierId, setSupplierId] = useState(initial ? (initial.supplier_id || '') : '');
  const [docTypes, setDocTypes] = useState(initial ? [...initial.doc_types] : ['datasheet', 'user_manual', 'installer_manual']);
  const [recurrence, setRecurrence] = useState(initial ? initial.recurrence : 'weekly');
  const [followLinks, setFollowLinks] = useState(initial ? initial.follow_links : true);
  const [maxPages, setMaxPages] = useState(initial ? initial.max_pages : 60);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function toggleType(key) {
    setDocTypes((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const dataToSubmit = {
        name,
        url,
        supplier_id: supplierId || null,
        doc_types: docTypes,
        recurrence,
        follow_links: followLinks,
        max_pages: maxPages,
      };

      if (initial) {
        // Edit mode - calculate changed fields
        const { changedFields } = await import('@/lib/resourceSourceFields');
        const changes = changedFields(initial, dataToSubmit);
        if (Object.keys(changes).length === 0) {
          onCancel();
          return;
        }
        await send(`/api/admin/resources/sources/${initial.id}`, 'PATCH', changes);
      } else {
        // Add mode
        await send('/api/admin/resources/sources', 'POST', dataToSubmit);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isEditMode = !!initial;

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-card">
      <h2>{isEditMode ? `Edit ${initial.name}` : 'Add a website to watch'}</h2>
      <label>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hikvision downloads" required />
      </label>
      <label>
        Page to watch
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.example.com/support/downloads" required />
      </label>
      <label>
        Supplier (optional)
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
          <option value="">—</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name} ({s.business_name})</option>)}
        </select>
      </label>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Collect</legend>
        <div className="admin-actions">
          {DOC_TYPE_OPTIONS.map((option) => (
            <label key={option.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 400, color: '#fff' }}>
              <input type="checkbox" checked={docTypes.includes(option.key)} onChange={() => toggleType(option.key)} style={{ width: 'auto' }} />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Check
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
          {RECURRENCE_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
        </select>
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 400, color: '#fff' }}>
        <input type="checkbox" checked={followLinks} onChange={(e) => setFollowLinks(e.target.checked)} style={{ width: 'auto' }} />
        Also follow links on the same site (document libraries, category pages, page 2, 3, ...) up to Max pages
      </label>
      <label>
        Max pages
        <input 
          type="number" 
          value={maxPages} 
          onChange={(e) => setMaxPages(parseInt(e.target.value) || 1)} 
          min="1" 
          max="500" 
          step="1" 
        />
        <small>How many pages of the site one check may read. A document library with 16 pages of listings needs about 20; 60 is a safe default.</small>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? (isEditMode ? 'Saving…' : 'Adding…') : isEditMode ? 'Save changes' : 'Add and check now'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminResourceSources({ sources, suppliers }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function checkNow(source) {
    setBusyId(source.id);
    setError('');
    try {
      await send(`/api/admin/resources/sources/${source.id}/check`, 'POST');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(source) {
    setBusyId(source.id);
    setError('');
    try {
      await send(`/api/admin/resources/sources/${source.id}`, 'PATCH', { active: !source.active });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(source) {
    if (!window.confirm(`Remove ${source.name} and every document collected from it? This cannot be undone.`)) return;
    setBusyId(source.id);
    setError('');
    try {
      await send(`/api/admin/resources/sources/${source.id}`, 'DELETE');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function addedThenCheck() {
    router.refresh();
  }

  return (
    <div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-refresh">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => router.refresh()}>Refresh</button>
        <span className="admin-muted">{sources.length} website{sources.length === 1 ? '' : 's'} watched. The scheduler checks recurring ones every 15 minutes for anything due.</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Collects</th>
              <th>Check</th>
              <th>Last check</th>
              <th>Result</th>
              <th>Documents</th>
              <th>Next check</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 && (
              <tr><td colSpan={8} className="admin-muted">No websites yet. Add a supplier or manufacturer downloads page below.</td></tr>
            )}
            {sources.map((source) => {
              const isEditing = editingId === source.id;
              return (
                <tbody key={source.id}>
                  <tr style={source.active ? undefined : { opacity: 0.55 }}>
                    <td className="wrap">
                      <Link href={`/admin/resources/${source.id}`} className="admin-link">{source.name}</Link>
                      <span className="admin-muted" style={{ display: 'block', fontSize: '12px', overflowWrap: 'anywhere' }}>{source.url}</span>
                      {source.folder && (
                        <Link href={`/admin/resources/${source.id}#files`} className="admin-tree-inline" title="Where its files are kept on the server">
                          <Folder size={13} strokeWidth={1.8} aria-hidden="true" /> uploads/{source.folder}/
                        </Link>
                      )}
                    </td>
                    <td className="wrap">{source.doc_types.length ? source.doc_types.map((t) => humanise(t)).join(', ') : 'All PDFs'}</td>
                    <td>{source.recurrence === 'manual' ? 'Manual' : humanise(source.recurrence)}{source.follow_links ? ` · linked pages · ${source.max_pages} pages` : ''}</td>
                    <td>{formatDateTime(source.last_checked_at, 'Never')}</td>
                    <td>
                      {!source.active && <span className="admin-status is-failed" style={{ marginRight: '6px' }}>Paused</span>}
                      <span className={`admin-status ${statusClass(source.last_status)}`}>{humanise(source.last_status)}</span>
                      {source.last_status === 'ok' && (
                        <span className="admin-muted" style={{ display: 'block', fontSize: '12px' }}>
                          {source.last_found} found · {source.last_new} new · {source.last_changed} changed
                        </span>
                      )}
                      {source.last_error && <span className="admin-message" style={{ color: '#ff8a8a', display: 'block' }}>{source.last_error}</span>}
                    </td>
                    <td>{source.document_count}</td>
                    <td>{source.active ? formatDateTime(source.next_check_at, source.recurrence === 'manual' ? 'Manual' : 'Soon') : 'Paused'}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => checkNow(source)} disabled={busyId === source.id || source.last_status === 'running'}>
                          {source.last_status === 'running' ? 'Checking…' : 'Check now'}
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => toggleActive(source)} disabled={busyId === source.id}>
                          {source.active ? 'Pause checks' : 'Resume checks'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setEditingId(isEditing ? null : source.id)} 
                          disabled={busyId === source.id}
                        >
                          <Pencil size={14} strokeWidth={2} />
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(source)} disabled={busyId === source.id}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isEditing && (
                    <tr key={`${source.id}-edit`}>
                      <td colSpan={8}>
                        <SourceForm 
                          suppliers={suppliers} 
                          initial={source} 
                          onSaved={() => { setEditingId(null); router.refresh(); }} 
                          onCancel={() => setEditingId(null)} 
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
          </tbody>
        </table>
      </div>

      {!editingId && <SourceForm suppliers={suppliers} onSaved={addedThenCheck} onCancel={() => {}} />}
    </div>
  );
}
