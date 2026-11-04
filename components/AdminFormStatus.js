'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = [
  ['new', 'New'],
  ['in_progress', 'In progress'],
  ['done', 'Done'],
  ['cancelled', 'Cancelled'],
];

// A form's status and staff notes on the console's form page. Saved through
// /api/admin/forms/[id]; the backend records each change in the audit log.
export default function AdminFormStatus({ id, status, notes }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [text, setText] = useState(notes);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  async function save(event) {
    event.preventDefault();
    setState('saving');
    setError('');
    try {
      const res = await fetch(`/api/admin/forms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value, staff_notes: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That could not be saved.');
      setState('saved');
      router.refresh();
    } catch (e) {
      setState('idle');
      setError(e.message || 'That could not be saved.');
    }
  }

  return (
    <form className="admin-form admin-card" onSubmit={save}>
      <label>
        Status
        <select value={value} onChange={(e) => { setValue(e.target.value); setState('idle'); }}>
          {STATUSES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <label>
        Notes <span className="admin-muted">(staff only)</span>
        <textarea rows={3} maxLength={8000} value={text} onChange={(e) => { setText(e.target.value); setState('idle'); }} />
      </label>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={state === 'saving'}>
          {state === 'saving' ? 'Saving…' : 'Save'}
        </button>
        {state === 'saved' ? <span className="admin-muted" role="status">Saved.</span> : null}
        {error ? <span className="form-error" role="alert">{error}</span> : null}
      </div>
    </form>
  );
}
