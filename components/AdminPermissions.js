'use client';

import { useState } from 'react';
import { applyPreset, presetFor, summarisePermissions, levelLabel } from '../lib/permissionsView.js';

export default function AdminPermissions({ user, catalogue, onSaved, onCancel }) {
  const [role, setRole] = useState(user.staff_role === 'platform_admin' ? 'platform_admin' : 'operator');
  const [permissions, setPermissions] = useState(() => ({ ...(user.permissions || {}) }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!catalogue) {
    return <p className="form-error" role="alert">The permission list could not be loaded. Reload the page.</p>;
  }

  const presets = catalogue.presets || [];
  const sections = catalogue.sections || [];
  const levels = catalogue.levels || [];
  const currentPreset = presetFor(permissions, presets);
  const selectedPreset = presets.find((preset) => preset.key === currentPreset) || null;

  function handlePresetChange(value) {
    if (value === 'custom') return;
    const preset = presets.find((item) => item.key === value);
    if (preset) setPermissions(applyPreset(preset));
  }

  function handleSectionChange(key, value) {
    setPermissions((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/staff-users/' + user.id + '/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_role: role, permissions: role === 'operator' ? permissions : {} }),
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

  function submit(event) {
    event.preventDefault();
    save();
  }

  const summaryLines = summarisePermissions(permissions, sections);

  return (
    <form className="admin-form" onSubmit={submit}>
      <label>
        Role
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="platform_admin">Administrator (full access to everything)</option>
          <option value="operator">Limited access (choose what they can do)</option>
        </select>
      </label>

      {role === 'platform_admin' ? (
        <p className="admin-muted">Administrators can read and write everything, including Account. Robert and Sharon stay Administrators.</p>
      ) : (
        <>
          <label>
            Start from
            <select value={currentPreset} onChange={(event) => handlePresetChange(event.target.value)}>
              {presets.map((preset) => (
                <option key={preset.key} value={preset.key}>{preset.label}</option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </label>

          {selectedPreset && selectedPreset.description ? (
            <p className="admin-muted">{selectedPreset.description}</p>
          ) : null}

          <div className="admin-permission-grid">
            {sections.map((section) => (
              <div key={section.key} className="admin-card">
                <strong>{section.label}</strong>
                <p className="admin-muted">{section.description}</p>
                <select
                  aria-label={section.label + ' access'}
                  value={permissions[section.key] || 'none'}
                  onChange={(event) => handleSectionChange(section.key, event.target.value)}
                >
                  {levels.map((level) => (
                    <option key={level.key} value={level.key}>{level.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <p className="admin-muted">In short: {summaryLines.join('. ')}</p>
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