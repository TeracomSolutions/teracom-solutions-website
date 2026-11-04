'use client';

import Link from 'next/link';
import { useState } from 'react';

import { ALL_FORMS, DEFAULT_FOLDER, KIND_LABELS, blankDestination, describeDestination, destinationsFor, folderExample, kindsFor } from '@/lib/formRouting';

// Where signed forms go (Robert, 5 November 2026): a list of places for all forms and,
// for any form that needs it, its own list instead. Saved through /api/admin/forms/delivery;
// the backend checks every place and records the change in the audit log.
function Places({ list, kinds, formTitle, folder, onChange }) {
  const [adding, setAdding] = useState(kinds[0]);
  const update = (index, changes) => onChange(list.map((d, i) => (i === index ? { ...d, ...changes } : d)));
  return (
    <div className="form-route-places">
      {list.length === 0 ? <p className="admin-muted">Nowhere: only the customer gets a copy.</p> : null}
      {list.map((dest, index) => (
        <div className="form-route-place" key={index}>
          <strong>{KIND_LABELS[dest.kind] || dest.kind}</strong>
          {dest.kind === 'email' ? (
            <input type="email" aria-label="Email address" placeholder="name@example.com" value={dest.to || ''}
              onChange={(e) => update(index, { to: e.target.value })} />
          ) : null}
          {dest.kind === 'network_folder' ? (
            <span className="form-route-folder">
              <input aria-label="Folder inside the network folder" value={dest.path ?? DEFAULT_FOLDER}
                onChange={(e) => update(index, { path: e.target.value })} />
              <span className="admin-muted">
                For example {folder.location ? `${folder.location}\\` : ''}{folderExample(dest.path, formTitle)}\MC-7F3A2C Company
                {folder.set_up ? '' : ' (set up the network folder on Connections first)'}
              </span>
            </span>
          ) : null}
          {dest.kind === 'global_monitoring' ? <span className="admin-muted">Creates or updates the customer&apos;s monitoring site.</span> : null}
          <button type="button" className="link-button" onClick={() => onChange(list.filter((_, i) => i !== index))}>Remove</button>
        </div>
      ))}
      <div className="form-route-add">
        <select aria-label="Kind of place to add" value={adding} onChange={(e) => setAdding(e.target.value)}>
          {kinds.map((kind) => <option key={kind} value={kind}>{KIND_LABELS[kind]}</option>)}
        </select>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange([...list, blankDestination(adding)])}>Add a place</button>
      </div>
    </div>
  );
}

export default function AdminFormDelivery({ initial, forms }) {
  const [routes, setRoutes] = useState(initial.routes);
  const [folder, setFolder] = useState(initial.folder);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const globalForm = initial.global_form;

  const change = (key, list) => { setRoutes({ ...routes, [key]: list }); setState('changed'); };
  const toggleOwn = (key, on) => {
    const next = { ...routes };
    if (on) next[key] = [...(routes[ALL_FORMS] || [])];
    else delete next[key];
    setRoutes(next);
    setState('changed');
  };

  async function save() {
    setState('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/forms/delivery', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ routes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That could not be saved.');
      setRoutes(data.routes);
      setFolder(data.folder);
      setState('saved');
    } catch (e) {
      setState('changed');
      setError(e.message || 'That could not be saved.');
    }
  }

  return (
    <section className="admin-card form-route" aria-labelledby="form-route-heading">
      <h2 id="form-route-heading">Where forms go</h2>
      <p className="admin-muted">
        The customer always gets their own signed copy by email. Teracom&apos;s copies go to every place listed here. Each
        form&apos;s page shows where it went, and <strong>Send again</strong> repeats it.
      </p>
      <p>
        Network folder:{' '}
        {folder.set_up
          ? <>{folder.location}{folder.status === 'failing' ? <span className="form-error"> (last test failed: {folder.detail})</span> : null}</>
          : <span className="admin-muted">not set up.</span>}{' '}
        <Link className="admin-link" href="/admin/connections">{folder.set_up ? 'Change it on Connections' : 'Set it up on Connections'}</Link>
      </p>

      <h3>All forms</h3>
      <Places list={routes[ALL_FORMS] || []} kinds={kindsFor(ALL_FORMS, globalForm)} formTitle="Monitoring commissioning form"
        folder={folder} onChange={(list) => change(ALL_FORMS, list)} />

      {forms.map((form) => {
        const own = Object.prototype.hasOwnProperty.call(routes, form.key);
        return (
          <div className="form-route-form" key={form.key}>
            <h3>{form.title}{form.live ? '' : <span className="admin-muted"> (not live yet)</span>}</h3>
            <label className="checkbox-row">
              <input type="checkbox" checked={own} onChange={(e) => toggleOwn(form.key, e.target.checked)} />
              Send this form somewhere different from the list for all forms
            </label>
            {own ? (
              <Places list={routes[form.key]} kinds={kindsFor(form.key, globalForm)} formTitle={form.title}
                folder={folder} onChange={(list) => change(form.key, list)} />
            ) : (
              <p className="admin-muted">
                Goes to: {destinationsFor(routes, form.key).map((d) => describeDestination(d, folder.location)).join('; ') || 'only the customer'}.
              </p>
            )}
          </div>
        );
      })}

      <div className="admin-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={state === 'saving' || state === 'idle' || state === 'saved'}>
          {state === 'saving' ? 'Saving…' : 'Save where forms go'}
        </button>
        {state === 'saved' ? <span className="admin-muted" role="status">Saved. New forms follow it from now on.</span> : null}
        {error ? <span className="form-error" role="alert">{error}</span> : null}
      </div>
    </section>
  );
}
