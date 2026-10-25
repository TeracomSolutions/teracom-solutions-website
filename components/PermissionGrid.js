'use client';

import { canSee, partChoice, setPart, setSectionLevel, toggleSection } from '@/lib/permissionGrid';

// Every section with a tick box (can they see it) and Read only or Read and write; under a ticked section,
// each of its parts can follow it or have its own level.
export default function PermissionGrid({ sections, permissions, onChange, disabled = false }) {
  return (
    <div className="permission-grid">
      {(sections || []).map((section) => {
        const seen = canSee(permissions, section.key);
        return (
          <div key={section.key} className={`permission-row${seen ? ' is-on' : ''}`}>
            <label className="permission-tick">
              <input type="checkbox" checked={seen} disabled={disabled} onChange={(event) => onChange(toggleSection(permissions, section, event.target.checked))} />
              <span>
                <strong>{section.label}</strong>
                <span className="admin-muted"> {section.description}</span>
              </span>
            </label>
            {seen ? (
              <select aria-label={section.label + ' access'} value={permissions[section.key]} disabled={disabled}
                onChange={(event) => onChange(setSectionLevel(permissions, section.key, event.target.value))}>
                <option value="read">Read only</option>
                <option value="write">Read and write</option>
              </select>
            ) : <span className="admin-muted">No access</span>}
            {seen && (section.children || []).length > 0 ? (
              <div className="permission-parts">
                {section.children.map((part) => (
                  <label key={part.key} className="permission-part">
                    <span>{part.label} <span className="admin-muted">{part.description}</span></span>
                    <select aria-label={part.label + ' access'} value={partChoice(permissions, part.key)} disabled={disabled}
                      onChange={(event) => onChange(setPart(permissions, part.key, event.target.value))}>
                      <option value="inherit">Same as {section.label}</option>
                      <option value="none">No access</option>
                      <option value="read">Read only</option>
                      <option value="write">Read and write</option>
                    </select>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
