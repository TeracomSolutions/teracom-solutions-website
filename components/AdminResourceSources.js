'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Folder, Pause, Pencil, Play, RefreshCw, Trash2 } from 'lucide-react';

import { formatDateTime, humanise } from '@/lib/adminFormat';
import { SECTION_LABELS, SITE_DOCUMENT_SECTIONS, sectionForType } from '@/lib/publishedResources';
import { changedFields, sourceFormDefaults } from '@/lib/resourceSourceFields';
import { problemsLine, splitProblems } from '@/lib/checkProblems';

// The Resources page: the websites we watch and a form to add one, with
// where each one's documents go on the public website. One compact row per
// website (Robert, 2026-10-03): the details are on the site's own page, and
// Check, Pause, Edit and Remove stay in view.
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

// The address without its scheme or www, for a one-line cell; the full
// address is in the cell's tooltip and on the site's own page.
function shortUrl(url) {
  const text = String(url || '');
  const start = text.indexOf('://');
  const rest = start >= 0 ? text.slice(start + 3) : text;
  return rest.startsWith('www.') ? rest.slice(4) : rest;
}

function sameMap(a, b) {
  const ka = Object.keys(a || {}).sort();
  const kb = Object.keys(b || {}).sort();
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && (a[k] ?? null) === (b[k] ?? null));
}

function SourceForm({ suppliers, initial, onSaved, onCancel }) {
  const defaults = sourceFormDefaults();
  const start = initial || defaults;
  const [name, setName] = useState(start.name);
  const [url, setUrl] = useState(start.url);
  const [supplierId, setSupplierId] = useState(start.supplier_id || '');
  const [docTypes, setDocTypes] = useState([...start.doc_types]);
  const [recurrence, setRecurrence] = useState(start.recurrence);
  const [followLinks, setFollowLinks] = useState(start.follow_links);
  const [maxPages, setMaxPages] = useState(String(start.max_pages));
  const [brand, setBrand] = useState(start.brand || '');
  const [sitePublish, setSitePublish] = useState(Boolean(start.site_publish));
  const [sectionMap, setSectionMap] = useState({ ...(start.section_map || {}) });
  const [publishExisting, setPublishExisting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function toggleType(key) {
    setDocTypes((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));
  }

  // The map only holds the types that differ from the default section.
  function setSection(docType, value) {
    setSectionMap((current) => {
      const next = { ...current };
      if (value === 'default') delete next[docType];
      else next[docType] = value === 'off' ? null : value;
      return next;
    });
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
        max_pages: Number(maxPages) || defaults.max_pages,
      };
      const publishing = { brand: brand.trim() || null, site_publish: sitePublish, section_map: sectionMap };

      if (initial) {
        const changes = changedFields(initial, dataToSubmit);
        if ((initial.brand || null) !== publishing.brand) changes.brand = publishing.brand;
        if (Boolean(initial.site_publish) !== sitePublish) changes.site_publish = sitePublish;
        if (!sameMap(initial.section_map, sectionMap)) changes.section_map = sectionMap;
        if (sitePublish && publishExisting) changes.publish_existing = true;
        if (Object.keys(changes).length === 0) {
          onCancel();
          return;
        }
        await send(`/api/admin/resources/sources/${initial.id}`, 'PATCH', changes);
      } else {
        await send('/api/admin/resources/sources', 'POST', { ...dataToSubmit, ...publishing });
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
          onChange={(e) => setMaxPages(e.target.value)}
          min="1"
          max="500"
          step="1"
        />
        <small>How many pages of the site one check may read. A document library with 16 pages of listings needs about 20; 60 is a safe default.</small>
      </label>

      <fieldset className="admin-publish-fields">
        <legend>On the public website</legend>
        <label>
          Brand
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder={name || 'e.g. Aritech'} maxLength={100} />
          <small>Shown with every document from this site and used for the brand tabs on the Resources pages. Blank means the website name.</small>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 400, color: '#fff' }}>
          <input type="checkbox" checked={sitePublish} onChange={(e) => setSitePublish(e.target.checked)} style={{ width: 'auto' }} />
          Publish new documents to the website automatically
        </label>
        {isEditMode && sitePublish && !initial.site_publish && (
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 400, color: '#fff', marginLeft: '24px' }}>
            <input type="checkbox" checked={publishExisting} onChange={(e) => setPublishExisting(e.target.checked)} style={{ width: 'auto' }} />
            Also publish the {initial.document_count} document{initial.document_count === 1 ? '' : 's'} already collected
          </label>
        )}
        <div className="admin-section-map">
          <span className="admin-muted">Where each kind of document goes</span>
          {DOC_TYPE_OPTIONS.map((option) => {
            const fallback = sectionForType(option.key);
            const current = option.key in sectionMap ? (sectionMap[option.key] === null ? 'off' : sectionMap[option.key]) : 'default';
            return (
              <label key={option.key}>
                {option.label}
                <select value={current} onChange={(e) => setSection(option.key, e.target.value)}>
                  <option value="default">Default: {SECTION_LABELS[fallback]}</option>
                  {SITE_DOCUMENT_SECTIONS.map((s) => <option key={s} value={s}>{SECTION_LABELS[s]}</option>)}
                  <option value="off">Not on the website</option>
                </select>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? (isEditMode ? 'Saving…' : 'Adding…') : isEditMode ? 'Save changes' : 'Add and check now'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function AddSource({ suppliers, onAdded }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
        Add a website to watch
      </button>
    );
  }
  return <SourceForm suppliers={suppliers} onSaved={() => { setOpen(false); onAdded(); }} onCancel={() => setOpen(false)} />;
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
        <table className="admin-table admin-sources-table">
          <colgroup>
            <col style={{ width: '31%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '21%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '22%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Website</th>
              <th>Collects</th>
              <th>Status</th>
              <th>Documents</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 && (
              <tr><td colSpan={5} className="admin-muted">No websites yet. Add a supplier or manufacturer downloads page below.</td></tr>
            )}
            {sources.map((source) => {
              const isEditing = editingId === source.id;
              const busy = busyId === source.id;
              return (
                <Fragment key={source.id}>
                  <tr className={source.active ? undefined : 'is-paused'}>
                    <td>
                      <Link href={`/admin/resources/${source.id}`} className="admin-link admin-source-name">{source.name}</Link>
                      <span className="admin-source-url" title={source.url}>{shortUrl(source.url)}</span>
                      {(source.brand && source.brand !== source.name) || source.folder ? (
                        <span className="admin-source-sub">
                          {source.brand && source.brand !== source.name ? `Brand: ${source.brand}` : ''}
                          {source.folder && (
                            <Link href={`/admin/resources/${source.id}#files`} className="admin-tree-inline" title="Where its files are kept on the server">
                              <Folder size={12} strokeWidth={1.8} aria-hidden="true" /> uploads/{source.folder}/
                            </Link>
                          )}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <span className="admin-source-line" title={source.doc_types.length ? source.doc_types.map((t) => humanise(t)).join(', ') : 'All PDFs'}>
                        {source.doc_types.length ? source.doc_types.map((t) => humanise(t)).join(', ') : 'All PDFs'}
                      </span>
                      <span className="admin-source-sub">
                        {source.recurrence === 'manual' ? 'Manual' : humanise(source.recurrence)}{source.follow_links ? ` · up to ${source.max_pages} pages` : ''}
                      </span>
                    </td>
                    <td>
                      {!source.active && <span className="admin-status is-failed" style={{ marginRight: '6px' }}>Paused</span>}
                      <span className={`admin-status ${statusClass(source.last_status)}`}>{humanise(source.last_status)}</span>
                      <span className="admin-source-sub">
                        {source.last_status === 'ok'
                          ? `${source.last_found} found · ${source.last_new} new · ${source.last_changed} changed`
                          : `Checked ${formatDateTime(source.last_checked_at, 'never')}`}
                      </span>
                      <span className="admin-source-sub">
                        {source.active ? `Next: ${formatDateTime(source.next_check_at, source.recurrence === 'manual' ? 'manual' : 'soon')}` : 'Checks paused'}
                      </span>
                      {source.last_error && (
                        <details className="admin-result-details">
                          <summary>{problemsLine(source.last_error)}</summary>
                          <ul>{splitProblems(source.last_error).map((p, i) => <li key={i}>{p}</li>)}</ul>
                        </details>
                      )}
                    </td>
                    <td>
                      {source.document_count}
                      <span className="admin-source-sub" title={source.site_publish ? 'New ones go on the website automatically' : undefined}>
                        {source.site_document_count || 0} on site{source.site_publish ? ' · auto' : ''}
                      </span>
                    </td>
                    <td>
                      <div className="admin-source-actions">
                        <button type="button" className="admin-mini-btn is-primary" onClick={() => checkNow(source)} disabled={busy || source.last_status === 'running'} title="Check this website now">
                          <RefreshCw size={13} strokeWidth={2} aria-hidden="true" /> {source.last_status === 'running' ? 'Checking…' : 'Check'}
                        </button>
                        <button type="button" className="admin-mini-btn" onClick={() => toggleActive(source)} disabled={busy} title={source.active ? 'Stop checking this website for new documents' : 'Start checking this website again'}>
                          {source.active ? <Pause size={13} strokeWidth={2} aria-hidden="true" /> : <Play size={13} strokeWidth={2} aria-hidden="true" />} {source.active ? 'Pause' : 'Resume'}
                        </button>
                        <button type="button" className="admin-mini-btn" onClick={() => setEditingId(isEditing ? null : source.id)} disabled={busy} title="Change the address, name, schedule or publishing">
                          <Pencil size={13} strokeWidth={2} aria-hidden="true" /> {isEditing ? 'Close' : 'Edit'}
                        </button>
                        <button type="button" className="admin-mini-btn" onClick={() => remove(source)} disabled={busy} title="Remove this website and its documents" aria-label={`Remove ${source.name}`}>
                          <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isEditing && (
                    <tr key={`${source.id}-edit`}>
                      <td colSpan={5} className="wrap">
                        <SourceForm
                          suppliers={suppliers}
                          initial={source}
                          onSaved={() => { setEditingId(null); router.refresh(); }}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddSource suppliers={suppliers} onAdded={addedThenCheck} />
    </div>
  );
}