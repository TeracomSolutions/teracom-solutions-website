'use client';

import { useRef, useState } from 'react';

// Staff upload their own documents (a PDF manual, data sheet...) and file it
// under a brand and a type. The file goes straight to the backend with a
// short-lived ticket (the website's own server takes 4.5 MB at most).
const TYPES = [
  ['user_manual', 'User manual'],
  ['installer_manual', 'Installer manual'],
  ['datasheet', 'Data sheet'],
  ['brochure', 'Brochure'],
  ['other', 'Other'],
];

const SECTIONS = [
  ['user-manuals', 'User Manuals'],
  ['installer-manuals', 'Installer Manuals'],
  ['datasheets', 'Datasheets'],
  ['brochures', 'Brochures'],
  ['downloads', 'Downloads'],
  ['', 'Not on the website'],
];

const DEFAULT_SECTION = {
  user_manual: 'user-manuals',
  installer_manual: 'installer-manuals',
  datasheet: 'datasheets',
  brochure: 'brochures',
  other: 'downloads',
};

function titleFromFile(name) {
  return name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function send(url, form, onProgress) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'json';
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response;
      if (xhr.status === 200 && body && body.id) resolve({ doc: body });
      else resolve({ error: (body && typeof body.detail === 'string' && body.detail) || 'The upload failed.' });
    };
    xhr.onerror = () => resolve({ error: 'The upload failed. Check the connection and try again.' });
    xhr.send(form);
  });
}

export default function AdminResourceUpload({ brands }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [autoTitle, setAutoTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [docType, setDocType] = useState('user_manual');
  const [model, setModel] = useState('');
  const [section, setSection] = useState(DEFAULT_SECTION.user_manual);
  const [sectionChosen, setSectionChosen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);
  const fileRef = useRef(null);

  function chooseFile(event) {
    const chosen = event.target.files?.[0] || null;
    setFile(chosen);
    if (chosen && (!title.trim() || title === autoTitle)) {
      const next = titleFromFile(chosen.name);
      setTitle(next);
      setAutoTitle(next);
    }
  }

  function chooseType(value) {
    setDocType(value);
    if (!sectionChosen) setSection(DEFAULT_SECTION[value]);
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setDone(null);
    if (!file) return setError('Choose a PDF.');
    if (!title.trim()) return setError('Give the document a title.');
    if (!brand.trim()) return setError('Choose the brand.');

    setProgress(0);
    try {
      const response = await fetch('/api/admin/resources/uploads/ticket', { method: 'POST' });
      const ticket = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(ticket.error || 'The upload could not start.');
      if (file.size > ticket.max_bytes) throw new Error(`Too big: the limit is ${Math.round(ticket.max_bytes / 1048576)} MB.`);

      const form = new FormData();
      form.append('file', file);
      form.append('ticket', ticket.ticket);
      form.append('title', title.trim());
      form.append('brand', brand.trim());
      form.append('doc_type', docType);
      form.append('model', model.trim());
      form.append('site_section', section);
      const result = await send(ticket.upload_url, form, setProgress);
      if (result.error) throw new Error(result.error);

      setDone({ title: result.doc.title, sourceId: ticket.source_id });
      setFile(null);
      setTitle('');
      setAutoTitle('');
      setModel('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.message || 'The upload failed.');
    } finally {
      setProgress(null);
    }
  }

  const busy = progress !== null;

  return (
    <form className="admin-form admin-card" onSubmit={submit}>
      <h3>Upload a document</h3>
      {error && <p className="form-error" role="alert">{error}</p>}
      {done && (
        <p className="form-note-banner" role="status">
          Uploaded &ldquo;{done.title}&rdquo;. <a href={`/admin/resources/${done.sourceId}`}>See the uploaded documents</a> to change the brand, type, SKU or where it shows.
        </p>
      )}
      <label>
        PDF file
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={chooseFile} disabled={busy} />
      </label>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={500} disabled={busy} />
      </label>
      <label>
        Brand
        <input value={brand} onChange={(e) => setBrand(e.target.value)} list="resource-brands" maxLength={100} placeholder="e.g. Aritech" disabled={busy} />
        <datalist id="resource-brands">
          {(brands || []).map((b) => <option key={b} value={b} />)}
        </datalist>
      </label>
      <label>
        Type
        <select value={docType} onChange={(e) => chooseType(e.target.value)} disabled={busy}>
          {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label>
        Model (optional)
        <input value={model} onChange={(e) => setModel(e.target.value)} maxLength={120} disabled={busy} />
      </label>
      <label>
        Show it on the website under
        <select value={section} onChange={(e) => { setSection(e.target.value); setSectionChosen(true); }} disabled={busy}>
          {SECTIONS.map(([value, label]) => <option key={value || 'none'} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
          {busy ? `Uploading… ${progress}%` : 'Upload'}
        </button>
      </div>
    </form>
  );
}
