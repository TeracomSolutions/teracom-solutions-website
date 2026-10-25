'use client';

import { useState } from 'react';

import PermissionGrid from '@/components/PermissionGrid';
import { summarisePermissions } from '@/lib/permissionsView';

async function call(path, method, body) {
  const response = await fetch('/api/admin/staff-users/permission-profiles' + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not save.');
  return data;
}

function SetForm({ initial, catalogue, onSave, onCancel, busy }) {
  const [name, setName] = useState(initial.name || '');
  const [description, setDescription] = useState(initial.description || '');
  const [permissions, setPermissions] = useState({ ...(initial.permissions || {}) });
  const presets = catalogue.presets || [];
  return (
    <form className="admin-form permission-set-form" onSubmit={(event) => { event.preventDefault(); onSave({ name, description, permissions }); }}>
      <label>Name<input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required placeholder="Store staff" /></label>
      <label>What it is for (optional)<input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} /></label>
      <label>
        Start from
        <select defaultValue="" onChange={(e) => { const p = presets.find((x) => x.key === e.target.value); if (p) setPermissions({ ...p.permissions }); }}>
          <option value="">Keep what is ticked below</option>
          {presets.filter((p) => p.key !== 'administrator').map((p) => <option key={p.key} value={p.key}>{p.label}: {p.description}</option>)}
        </select>
      </label>
      <PermissionGrid sections={catalogue.sections} permissions={permissions} onChange={setPermissions} disabled={busy} />
      <p className="admin-muted">In short: {summarisePermissions(permissions, catalogue.sections).join('. ')}</p>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>Save permission set</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}

// Account > Operator permissions: named sets of section levels to give to Limited access users.
export default function AdminPermissionSets({ initialSets, catalogue }) {
  const [sets, setSets] = useState(initialSets || []);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!catalogue) return <p className="form-error" role="alert">The permission list could not be loaded. Reload the page.</p>;

  async function act(work, note) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await work();
      setSets(await call('', 'GET'));
      setMessage(note);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function save(body) {
    const ok = await act(() => (editing === 'new' ? call('', 'POST', body) : call('/' + editing, 'PUT', body)), 'Permission set saved. Everyone on it has the new permissions now.');
    if (ok) setEditing(null);
  }

  const editingRow = editing && editing !== 'new' ? sets.find((s) => s.id === editing) : null;

  return (
    <section>
      <div className="marketing-head">
        <h2 style={{ margin: 0 }}>Operator permissions</h2>
        {!editing && <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>New permission set</button>}
      </div>
      <p className="admin-muted">Make a set once, tick what it may see and whether it is Read only or Read and write, then give it to any Limited access user under Users. Changing a set changes everyone on it straight away.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-note-banner" role="status">{message}</p>}
      {editing === 'new' && <SetForm initial={{ permissions: {} }} catalogue={catalogue} onSave={save} onCancel={() => setEditing(null)} busy={busy} />}
      {editingRow && <SetForm key={editingRow.id} initial={editingRow} catalogue={catalogue} onSave={save} onCancel={() => setEditing(null)} busy={busy} />}
      {sets.length === 0 && !editing ? <p className="admin-muted">No permission sets yet. Press New permission set to make one.</p> : null}
      {sets.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Permission set</th><th>What it may do</th><th>Users</th><th /></tr></thead>
            <tbody>
              {sets.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong>{s.description ? <><br /><span className="admin-muted">{s.description}</span></> : null}</td>
                  <td className="admin-muted">{summarisePermissions(s.permissions, catalogue.sections).join('. ')}</td>
                  <td>{s.users}</td>
                  <td className="admin-actions">
                    <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => setEditing(s.id)}>Edit</button>
                    <button type="button" className="btn btn-secondary btn-sm" disabled={busy || s.users > 0} title={s.users > 0 ? 'Give its users another set first' : ''}
                      onClick={() => window.confirm('Delete the permission set "' + s.name + '"?') && act(() => call('/' + s.id, 'DELETE'), 'Deleted.')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
