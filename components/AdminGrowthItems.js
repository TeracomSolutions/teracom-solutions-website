'use client';

import { useCallback, useEffect, useState } from 'react';

import AdminListPager, { useListPage } from '@/components/AdminListPager';
import { formatDateTime } from '@/lib/adminFormat';
import { ITEM_KINDS, itemPublicPath } from '@/lib/growthTools';

// The pages a growth tool makes (Robert, 2026-11-05): area pages, project case
// studies, answered questions and newsletter issues. Each is a draft until a
// person publishes it (or sends it, for a newsletter).

async function call(url, method, body, isForm = false) {
  const response = await fetch(url, {
    method,
    headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

function Editor({ tool, item, onSaved, onClose }) {
  const kind = ITEM_KINDS[tool];
  const [values, setValues] = useState({
    title: item?.title || '',
    summary: item?.summary || '',
    body: item?.body || '',
    data: { ...(item?.data || {}) },
  });
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const base = `/api/admin/growth/${tool}/items`;

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));
  const setData = (name, value) => setValues((v) => ({ ...v, data: { ...v.data, [name]: value } }));

  async function act(label, work) {
    setBusy(label);
    setError('');
    try {
      await work();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  const payload = (status) => ({
    title: values.title,
    summary: values.summary,
    body: values.body,
    data: Object.fromEntries(Object.entries(values.data).filter(([k]) => k !== 'photos')),
    ...(status ? { status } : {}),
  });

  const save = (status) => act(status || 'save', async () => {
    const saved = item ? await call(`${base}/${item.id}`, 'PUT', payload(status)) : await call(base, 'POST', payload(status));
    onSaved(saved, !item);
  });

  const draft = () => act('draft', async () => {
    const extra = kind.fields.map((f) => (values.data[f.name] ? `${f.label}: ${values.data[f.name]}` : '')).filter(Boolean).join('. ');
    const text = await call(`/api/admin/growth/${tool}/draft`, 'POST', { title: values.title, notes: [notes, extra].filter(Boolean).join('. ') });
    setValues((v) => ({ ...v, summary: text.summary || v.summary, body: text.body || v.body }));
  });

  const upload = (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file || !item) return;
    act('photo', async () => {
      const form = new FormData();
      form.append('file', file);
      const saved = await call(`${base}/${item.id}/photos`, 'POST', form, true);
      setData('photos', saved.data.photos || []);
      onSaved(saved, false, true);
    });
  };

  const removePhoto = (name) => act('photo', async () => {
    const saved = await call(`${base}/${item.id}/photos/${name}`, 'DELETE');
    setData('photos', saved.data.photos || []);
    onSaved(saved, false, true);
  });

  const send = () => {
    if (!window.confirm(`Email "${values.title}" to every customer who agreed to hear from Teracom? It cannot be unsent.`)) return;
    act('send', async () => {
      await call(`${base}/${item.id}`, 'PUT', payload());
      const result = await call(`${base}/${item.id}/send`, 'POST');
      onSaved(result.item, false);
      window.alert(`Sent to ${result.sent} of ${result.matched} customers${result.failed ? `; ${result.failed} failed` : ''}.`);
    });
  };

  const photos = values.data.photos || [];
  const sent = item?.status === 'sent';

  return (
    <div className="growth-editor">
      <label>
        {kind.titleLabel}
        <input value={values.title} maxLength={300} onChange={(e) => set('title', e.target.value)} disabled={sent} />
      </label>
      {kind.fields.map((field) => (
        <label key={field.name}>
          {field.label}
          <input value={values.data[field.name] || ''} onChange={(e) => setData(field.name, e.target.value)} disabled={sent} />
        </label>
      ))}
      {!sent ? (
        <div className="growth-draft">
          <label>
            Notes for the AI draft (optional)
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={kind.notesHint} />
          </label>
          <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy) || !values.title.trim()} onClick={draft}>
            {busy === 'draft' ? 'Writing…' : 'Write a draft with AI'}
          </button>
        </div>
      ) : null}
      <label>
        {kind.summaryLabel}
        <textarea rows={2} value={values.summary} onChange={(e) => set('summary', e.target.value)} disabled={sent} />
      </label>
      <label>
        {kind.bodyLabel}
        <textarea rows={10} value={values.body} onChange={(e) => set('body', e.target.value)} disabled={sent} />
      </label>
      {kind.photos ? (
        <div className="growth-photos">
          <span className="admin-muted">Photos{item ? '' : ' (save first, then add photos)'}</span>
          <div className="growth-photo-row">
            {photos.map((photo) => (
              <figure key={photo.file}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" />
                <button type="button" className="admin-link-btn" onClick={() => removePhoto(photo.file)} disabled={Boolean(busy)}>Remove</button>
              </figure>
            ))}
            {item ? (
              <label className="btn btn-secondary btn-sm growth-upload">
                {busy === 'photo' ? 'Uploading…' : 'Add a photo…'}
                <input type="file" accept="image/*" onChange={upload} disabled={Boolean(busy)} />
              </label>
            ) : null}
          </div>
        </div>
      ) : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        {!sent ? <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => save()}>{busy === 'save' ? 'Saving…' : 'Save'}</button> : null}
        {tool === 'newsletter' ? (
          item && !sent ? <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy)} onClick={send}>{busy === 'send' ? 'Sending…' : 'Send to customers'}</button> : null
        ) : item?.status === 'published' ? (
          <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => save('hidden')}>Take off the website</button>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy) || !values.body.trim()} onClick={() => save('published')}>Publish</button>
        )}
        <button type="button" className="admin-link-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function AdminGrowthItems({ tool, enabled }) {
  const kind = ITEM_KINDS[tool];
  const [list, setList] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await call(`/api/admin/growth/${tool}/items`, 'GET');
      setList(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  }, [tool]);

  useEffect(() => { load(); }, [load]);
  const view = useListPage(list || [], { sizes: [10, 20, 50, 100], initialSize: 10 });

  async function remove(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await call(`/api/admin/growth/${tool}/items/${item.id}`, 'DELETE');
      if (editing && editing.id === item.id) setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function saved(item, isNew, keepOpen) {
    load();
    if (isNew || keepOpen) setEditing(item);
    else setEditing(null);
  }

  return (
    <div className="growth-items">
      <div className="growth-items-head">
        <strong>{kind.plural}</strong>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing({ id: null })}>{kind.addLabel}</button>
      </div>
      {!enabled && tool !== 'newsletter' ? <p className="admin-muted">The tool is off, so published {kind.plural.toLowerCase()} are not on the website until you switch it on.</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {editing ? (
        <Editor key={editing.id || 'new'} tool={tool} item={editing.id ? editing : null} onSaved={saved} onClose={() => setEditing(null)} />
      ) : null}
      {list && list.length === 0 && !editing ? <p className="admin-muted">None yet.</p> : null}
      {list && list.length > 0 ? (
        <>
          <table className="admin-table admin-table-compact">
            <thead><tr><th>{kind.titleLabel}</th><th>State</th><th>Changed</th><th /></tr></thead>
            <tbody>
              {view.rows.map((item) => (
                <tr key={item.id}>
                  <td className="wrap">
                    {item.status === 'published' && itemPublicPath(tool, item) ? (
                      <a href={itemPublicPath(tool, item)} target="_blank" rel="noopener noreferrer" className="admin-link">{item.title}</a>
                    ) : item.title}
                  </td>
                  <td><span className={`admin-status ${item.status === 'published' || item.status === 'sent' ? 'is-approved' : 'is-pending'}`}>{item.status}</span></td>
                  <td>{formatDateTime(item.updated_at)}</td>
                  <td>
                    <span className="growth-item-actions">
                      <button type="button" className="admin-link-btn" onClick={() => setEditing(item)}>{item.status === 'sent' ? 'Open' : 'Edit'}</button>
                      {item.status !== 'sent' ? <button type="button" className="admin-link-btn" onClick={() => remove(item)}>Delete</button> : null}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminListPager view={view} label={kind.plural.toLowerCase()} />
        </>
      ) : null}
    </div>
  );
}
