// The tick boxes for a permission map (Robert, 2026-10-25): each section is seen or not, then Read only or
// Read and write; each part of a section follows it unless given its own level. Pure helpers for
// components/PermissionGrid.js.

export function canSee(permissions, key) {
  const level = (permissions || {})[key];
  return level === 'read' || level === 'write';
}

// Ticking a section on gives Read only; unticking it gives No access and clears its parts.
export function toggleSection(permissions, section, on) {
  const next = { ...(permissions || {}) };
  next[section.key] = on ? (canSee(permissions, section.key) ? permissions[section.key] : 'read') : 'none';
  if (!on) for (const child of section.children || []) delete next[child.key];
  return next;
}

export function setSectionLevel(permissions, key, level) {
  return { ...(permissions || {}), [key]: level };
}

// A part's choice: 'inherit' (same as its section), 'none', 'read' or 'write'.
export function partChoice(permissions, key) {
  const level = (permissions || {})[key];
  return ['none', 'read', 'write'].includes(level) ? level : 'inherit';
}

export function setPart(permissions, key, choice) {
  const next = { ...(permissions || {}) };
  if (choice === 'inherit') delete next[key];
  else next[key] = choice;
  return next;
}
