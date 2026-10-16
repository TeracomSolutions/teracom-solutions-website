'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Column matching for one uploaded price list (Robert, 2026-10-17). For each
// store field: tick whether to use it, and choose which column of the file
// holds it. "Find it automatically" uses the usual column names. The choices
// are saved for the supplier, so later uploads and automatic feeds are read
// the same way. The part number and the name always stay on.
const AUTOMATIC = '';

function Panel({ uploadId, supplierId, onClose }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  async function load() {
    try {
      const response = await fetch(`/api/admin/uploads/${uploadId}/columns`);
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not read this file.');
      setData(body);
      setRows(
        body.fields.map((field) => ({
          field: field.field,
          label: field.label,
          required: field.required,
          on: field.on,
          heading: field.saved ? field.heading || AUTOMATIC : AUTOMATIC,
          found: field.heading,
        })),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadId]);

  function change(field, patch) {
    setSaved('');
    setRows((current) => current.map((row) => (row.field === field ? { ...row, ...patch } : row)));
  }

  async function save() {
    setBusy(true);
    setError('');
    setSaved('');
    try {
      const choices = {};
      for (const row of rows) {
        choices[row.field] = { on: row.on, heading: row.on && row.heading ? row.heading : null };
      }
      const response = await fetch(`/api/admin/suppliers/${supplierId}/columns`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choices, uploadId }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not save the choices.');
      await load();
      setSaved('Saved. This supplier\'s price lists are now read this way.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Match columns"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', zIndex: 1000, overflowY: 'auto', padding: '24px 12px' }}
    >
      <div className="admin-card" style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'left' }}>
        <h3 style={{ margin: 0 }}>Match columns{data ? `: ${data.file}` : ''}</h3>
        <p className="admin-muted" style={{ margin: '6px 0 12px' }}>
          Tick the fields to use and choose which column of this file holds each one. Untick a field to ignore it.
          Leave a column on &quot;Find it automatically&quot; to use the usual column names. Your choices are kept for
          {data && data.supplier ? ` ${data.supplier}` : ' this supplier'} and apply to every later upload and automatic feed.
        </p>

        {!data && !error && <p className="admin-muted">Reading the file…</p>}
        {error && <p className="form-error" role="alert">{error}</p>}

        {data && (
          <>
            {data.missing && data.missing.length > 0 && (
              <p className="form-error" role="alert">Still missing: {data.missing.join('; ')}.</p>
            )}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Use</th>
                    <th>Field</th>
                    <th>Column in the file</th>
                    <th>Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const shown = row.heading || row.found;
                    const examples = shown && data.samples ? data.samples[shown] || [] : [];
                    return (
                      <tr key={row.field}>
                        <td>
                          <input
                            type="checkbox"
                            checked={row.on}
                            disabled={row.required}
                            onChange={(e) => change(row.field, { on: e.target.checked })}
                            aria-label={`Use ${row.label}`}
                          />
                        </td>
                        <td>
                          {row.label}
                          {row.required && <span className="admin-muted"> (always used)</span>}
                        </td>
                        <td>
                          <select
                            value={row.heading}
                            disabled={!row.on}
                            onChange={(e) => change(row.field, { heading: e.target.value })}
                            aria-label={`Column for ${row.label}`}
                          >
                            <option value={AUTOMATIC}>
                              {row.found && !row.heading ? `Find it automatically (${row.found})` : 'Find it automatically'}
                            </option>
                            {data.headings.map((heading) => (
                              <option key={heading} value={heading}>{heading}</option>
                            ))}
                          </select>
                        </td>
                        <td className="wrap admin-muted">{row.on ? examples.join(' | ') : 'ignored'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {saved && <p className="admin-muted" role="status">{saved}</p>}
        <div className="admin-actions" style={{ marginTop: '12px' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={busy || !data}>
            {busy ? 'Saving…' : 'Save and check the file again'}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminColumnMatch({ uploadId, supplierId }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="admin-link-button" onClick={() => setOpen(true)}>Match columns</button>
      {open && <Panel uploadId={uploadId} supplierId={supplierId} onClose={() => setOpen(false)} />}
    </>
  );
}