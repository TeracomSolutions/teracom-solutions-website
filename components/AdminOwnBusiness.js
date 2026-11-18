'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, Upload } from 'lucide-react';

// System > Business profile (api/staff_business_profile.py in the backend): who this copy of the website belongs to.
// Everything else (emails, the AI's writing, the assistant's and robots' names, tax) reads from it.

function Field({ field, value, onChange, lists }) {
  const id = `bp-${field.name}`;
  const help = field.help ? <span className="admin-muted">{field.help}</span> : null;
  if (field.kind === 'bool') {
    return (
      <label className="admin-check bp-wide" htmlFor={id}>
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
        {help}
      </label>
    );
  }
  if (field.kind === 'select') {
    const options = field.name === 'business_type' ? lists.business_types : lists.currencies;
    return (
      <label htmlFor={id}>
        {field.label}
        <select id={id} value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {help}
      </label>
    );
  }
  if (field.kind === 'textarea') {
    return (
      <label htmlFor={id} className="bp-wide">
        {field.label}
        <textarea id={id} rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        {help}
      </label>
    );
  }
  if (field.kind === 'colour') {
    return (
      <label htmlFor={id}>
        {field.label}
        <span className="bp-colour">
          <input type="color" aria-label={`${field.label} picker`} value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000'} onChange={(e) => onChange(e.target.value)} />
          <input id={id} type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#ff1717" />
        </span>
        {help}
      </label>
    );
  }
  return (
    <label htmlFor={id} className={field.name === 'description' ? 'bp-wide' : undefined}>
      {field.label}
      <input id={id} type={field.kind === 'email' ? 'email' : field.kind === 'url' ? 'url' : 'text'} inputMode={field.kind === 'number' ? 'decimal' : undefined}
        value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      {help}
    </label>
  );
}

function Taxes({ value, onChange }) {
  const rows = value || [];
  const set = (i, key, v) => onChange(rows.map((r, n) => (n === i ? { ...r, [key]: v } : r)));
  return (
    <div className="bp-wide bp-taxes">
      <span className="bp-label">Other taxes <span className="admin-muted">Any other tax, levy or duty, with its rate and what it applies to.</span></span>
      {rows.map((row, i) => (
        <div key={i} className="bp-tax-row">
          <input aria-label="Tax name" placeholder="Name, for example Luxury car tax" value={row.name || ''} onChange={(e) => set(i, 'name', e.target.value)} />
          <input aria-label="Rate (%)" placeholder="Rate %" inputMode="decimal" value={row.rate || ''} onChange={(e) => set(i, 'rate', e.target.value)} />
          <input aria-label="Applies to" placeholder="Applies to" value={row.applies_to || ''} onChange={(e) => set(i, 'applies_to', e.target.value)} />
          <button type="button" className="btn btn-secondary btn-sm" aria-label="Remove this tax" onClick={() => onChange(rows.filter((_, n) => n !== i))}>
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange([...rows, { name: '', rate: '', applies_to: '' }])}>
        <Plus size={14} aria-hidden="true" /> Add a tax
      </button>
    </div>
  );
}

function Picture({ field, src, onUpload, busy }) {
  const what = field.label.toLowerCase();
  return (
    <div className="bp-wide bp-logo">
      <span className="bp-label">{field.label} <span className="admin-muted">{field.help}</span></span>
      <div className="bp-logo-row">
        {src ? <img src={src} alt={field.label} className={field.name === 'favicon_url' ? 'bp-favicon' : undefined} /> : <span className="admin-muted">No {what} yet.</span>}
        <label className="btn btn-secondary btn-sm">
          <Upload size={14} aria-hidden="true" /> {busy ? 'Uploading…' : src ? `Replace ${what}` : `Upload ${what}`}
          <input type="file" accept="image/png,image/jpeg,image/webp" hidden disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onUpload(f); }} />
        </label>
      </div>
    </div>
  );
}

export default function AdminOwnBusiness() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState('');

  function take(body) {
    setData(body);
    setForm(body.profile);
  }

  useEffect(() => {
    let live = true;
    fetch('/api/admin/business-profile', { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || 'The business profile did not load.');
        if (live) take(body);
      })
      .catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, []);

  async function save(e) {
    e.preventDefault();
    setBusy('save');
    setError('');
    setSaved('');
    try {
      const res = await fetch('/api/admin/business-profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'The business profile was not saved.');
      take(body);
      setSaved('Saved. Emails, the AI and the rest of the backend use the new details within a minute.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function upload(fieldName, file) {
    setBusy(fieldName);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file, file.name || 'logo');
      const res = await fetch(`/api/admin/business-profile/image?field=${encodeURIComponent(fieldName)}`, { method: 'POST', body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'The picture was not uploaded.');
      setData(body);
      setForm((f) => ({ ...f, [fieldName]: body.profile[fieldName] }));
      setSaved('Picture saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  if (error && !data) return <p className="form-error" role="alert">{error}</p>;
  if (!data || !form) return <p className="admin-muted">Loading…</p>;

  const lists = { business_types: data.business_types, currencies: data.currencies };

  return (
    <form className="bp-form" onSubmit={save}>
      {data.missing.length ? (
        <p className="form-note-banner" role="status">Still to fill in: {data.missing.join(', ')}.</p>
      ) : null}
      {data.groups.map((group) => (
        <section key={group} className="admin-card bp-section">
          <h2 className="admin-subheading">{group}</h2>
          <div className="admin-form bp-grid">
            {data.fields.filter((f) => f.group === group).map((field) => {
              if (field.kind === 'image') {
                return <Picture key={field.name} field={field} src={(data.image_src || {})[field.name]}
                  onUpload={(file) => upload(field.name, file)} busy={busy === field.name} />;
              }
              if (field.kind === 'taxes') {
                return <Taxes key={field.name} value={form.other_taxes} onChange={(v) => setForm({ ...form, other_taxes: v })} />;
              }
              return (
                <Field key={field.name} field={field} value={form[field.name]} lists={lists}
                  onChange={(v) => setForm({ ...form, [field.name]: v })} />
              );
            })}
            {group === 'Email' ? (
              <p className="admin-muted bp-wide">
                Staff sign in with: <strong>{data.staff_domains.join(', ') || 'not set'}</strong>. Who may sign in is a security setting kept on the server, not here.
              </p>
            ) : null}
          </div>
        </section>
      ))}
      <div className="bp-actions">
        <button type="submit" className="btn btn-primary" disabled={busy === 'save'}>
          <Save size={16} aria-hidden="true" /> {busy === 'save' ? 'Saving…' : 'Save business profile'}
        </button>
        {saved ? <span className="form-success" role="status">{saved}</span> : null}
        {error ? <span className="form-error" role="alert">{error}</span> : null}
      </div>
    </form>
  );
}
