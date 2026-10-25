'use client';

import { useEffect, useState } from 'react';

import PermissionGrid from '@/components/PermissionGrid';
import { summarisePermissions } from '../lib/permissionsView.js';

// One user's role, and for Limited access the operator permission set they are on (Account > Operator
// permissions) or permissions for this person only.
export default function AdminPermissions({ user, catalogue, onSaved, onCancel }) {
  const [role, setRole] = useState(user.staff_role === 'platform_admin' ? 'platform_admin' : 'operator');
  const [setId, setSetId] = useState(user.permission_profile_id || 'custom');
  const [sets, setSets] = useState([]);
  const [permissions, setPermissions] = useState(() => ({ ...(user.permissions || {}) }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/staff-users/permission-profiles', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => { if (!cancelled) setSets(Array.isArray(data) ? data : []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!catalogue) {
    return <p className="form-error" role="alert">The permission list could not be loaded. Reload the page.</p>;
  }

  const sections = catalogue.sections || [];
  const chosenSet = sets.find((item) => item.id === setId) || null;

  async function save() {
    setBusy(true);
    setError('');
    try {
      const onSet = role === 'operator' && setId !== 'custom';
      const res = await fetch('/api/admin/staff-users/' + user.id + '/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_role: role,
          permissions: role === 'operator' && !onSet ? permissions : {},
          permission_profile_id: onSet ? setId : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || 'That did not save.');
        return;
      }
      onSaved('Permissions saved for ' + user.email + '.');
    } catch {
      setError('That did not save. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
      <label>
        Role
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="platform_admin">Administrator (full access to everything)</option>
          <option value="operator">Limited access (choose what they can do)</option>
        </select>
      </label>

      {role === 'platform_admin' ? (
        <p className="admin-muted">Administrators can read and write everything, including Account.</p>
      ) : (
        <>
          <label>
            Permission set
            <select value={setId} onChange={(event) => setSetId(event.target.value)}>
              {sets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              <option value="custom">Custom for this person only</option>
            </select>
          </label>
          {chosenSet ? (
            <p className="admin-muted">
              {chosenSet.description ? chosenSet.description + ' ' : ''}In short: {summarisePermissions(chosenSet.permissions, sections).join('. ')}. Change the set itself under Operator permissions.
            </p>
          ) : (
            <>
              <PermissionGrid sections={sections} permissions={permissions} onChange={setPermissions} disabled={busy} />
              <p className="admin-muted">In short: {summarisePermissions(permissions, sections).join('. ')}</p>
            </>
          )}
        </>
      )}

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
          {busy ? 'Saving...' : 'Save permissions'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
