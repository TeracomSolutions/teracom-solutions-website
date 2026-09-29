'use client';

import { Fragment, useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';

const ROLES = [
  ['platform_admin', 'Administrator'],
  ['licensing_approver', 'Licensing approver'],
];
const EMPTY_FORM = { email: '', first_name: '', last_name: '', staff_role: 'platform_admin' };

function roleLabel(user) {
  const found = ROLES.find(([value]) => value === user.staff_role);
  return user.role_label || (found ? found[1] : user.staff_role);
}

function fullName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || '—';
}

export default function AdminStaffUsers({ initialUsers, currentId }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [shownPassword, setShownPassword] = useState(null);
  const [copied, setCopied] = useState(false);

  async function reload() {
    const res = await fetch('/api/admin/staff-users', { cache: 'no-store' });
    const data = await res.json().catch(() => []);
    if (res.ok && Array.isArray(data)) setUsers(data);
  }

  // Every action runs the same way: one at a time, old messages cleared,
  // the list reloaded afterwards, and the backend's own sentence shown when
  // something is refused.
  async function run(key, url, options, onDone) {
    setBusy(key);
    setError('');
    setNotice('');
    try {
      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || 'That did not work.');
        return;
      }
      await reload();
      onDone(data);
    } catch {
      setError('That did not work. Check your connection and try again.');
    } finally {
      setBusy('');
    }
  }

  function send(method, body) {
    return {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    };
  }

  function showPassword(email, password) {
    setCopied(false);
    setShownPassword({ email, password });
  }

  function addUser(event) {
    event.preventDefault();
    run('add', '/api/admin/staff-users', send('POST', form), (data) => {
      const email = data.user?.email || form.email;
      setForm(EMPTY_FORM);
      showPassword(email, data.temporary_password);
      setNotice(`${email} was added.`);
    });
  }

  function startEdit(user) {
    setEditing(user.id);
    setEditForm({
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      staff_role: user.staff_role,
    });
  }

  function saveEdit(user) {
    run(`edit-${user.id}`, `/api/admin/staff-users/${user.id}`, send('PATCH', editForm), () => {
      setEditing(null);
      setNotice('Saved.');
    });
  }

  function switchActive(user) {
    const active = !user.active;
    run(`switch-${user.id}`, `/api/admin/staff-users/${user.id}`, send('PATCH', { active }), () => {
      setNotice(active ? `${user.email} can sign in again.` : `${user.email} is switched off and signed out.`);
    });
  }

  function resetPassword(user) {
    if (!window.confirm(`Give ${user.email} a new temporary password? They will be signed out.`)) return;
    run(`password-${user.id}`, `/api/admin/staff-users/${user.id}/reset-password`, send('POST'), (data) => {
      showPassword(user.email, data.temporary_password);
      setNotice(`${user.email} has a new temporary password and was signed out.`);
    });
  }

  function resetTwoFactor(user) {
    if (!window.confirm(`Reset two-factor for ${user.email}? They will sign in with their password only until they set it up again.`)) return;
    run(`mfa-${user.id}`, `/api/admin/staff-users/${user.id}/reset-two-factor`, send('POST'), () => {
      setNotice('Two-factor was reset; they can set it up again.');
    });
  }

  function deleteUser(user) {
    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    run(`delete-${user.id}`, `/api/admin/staff-users/${user.id}`, send('DELETE'), () => {
      if (editing === user.id) setEditing(null);
      setNotice(`${user.email} was deleted.`);
    });
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(shownPassword.password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="admin-staff-users">
      <h2>Users</h2>
      <p className="admin-muted">Everyone who can sign in to this console. New users get a temporary password to change after they sign in.</p>

      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}

      {shownPassword && (
        <div className="admin-card admin-temp-password">
          <p>Temporary password for {shownPassword.email}:</p>
          <code>{shownPassword.password}</code>
          <div className="admin-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={copyPassword}>{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShownPassword(null)}>Done</button>
          </div>
          <p className="admin-muted">It is shown once. Give it to the person privately; they change it under Account → Change password.</p>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Two-factor</th>
              <th>Status</th>
              <th>Last active</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isMe = user.id === currentId;
              return (
                <Fragment key={user.id}>
                  <tr>
                    <td>{fullName(user)}{isMe ? ' (you)' : ''}</td>
                    <td>{user.email}</td>
                    <td>{roleLabel(user)}</td>
                    <td>{user.mfa_enabled ? 'On' : 'Off'}</td>
                    <td>
                      <span className={`admin-status ${user.active ? 'is-approved' : 'is-failed'}`}>
                        {user.active ? 'Active' : 'Switched off'}
                      </span>
                    </td>
                    <td>{formatDateTime(user.last_active_at, 'Never')}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => (editing === user.id ? setEditing(null) : startEdit(user))}>
                          {editing === user.id ? 'Close' : 'Edit'}
                        </button>
                        {!isMe && (
                          <>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => switchActive(user)}>
                              {user.active ? 'Switch off' : 'Switch on'}
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => resetPassword(user)}>
                              Reset password
                            </button>
                            {user.mfa_enabled && (
                              <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => resetTwoFactor(user)}>
                                Reset two-factor
                              </button>
                            )}
                            <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => deleteUser(user)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {editing === user.id && (
                    <tr>
                      <td colSpan={7}>
                        <form
                          className="admin-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            saveEdit(user);
                          }}
                        >
                          <label>
                            First name
                            <input type="text" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} />
                          </label>
                          <label>
                            Last name
                            <input type="text" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} />
                          </label>
                          <label>
                            Email
                            <input type="email" required value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                          </label>
                          <label>
                            Role
                            <select value={editForm.staff_role} disabled={isMe} onChange={(e) => setEditForm({ ...editForm, staff_role: e.target.value })}>
                              {ROLES.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </label>
                          {isMe && <p className="admin-muted">You cannot change your own role.</p>}
                          <div className="admin-actions">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>
                              {busy === `edit-${user.id}` ? 'Saving…' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <form className="admin-form admin-card" onSubmit={addUser}>
        <h3>Add a user</h3>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          First name
          <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        </label>
        <label>
          Last name
          <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        </label>
        <label>
          Role
          <select value={form.staff_role} onChange={(e) => setForm({ ...form, staff_role: e.target.value })}>
            {ROLES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>
            {busy === 'add' ? 'Adding…' : 'Add user'}
          </button>
        </div>
      </form>
    </div>
  );
}