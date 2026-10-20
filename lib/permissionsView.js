export const LEVEL_ORDER = ['none', 'read', 'write'];

export function levelLabel(level) {
  if (level === 'none') return 'No access';
  if (level === 'read') return 'Read only';
  if (level === 'write') return 'Read and write';
  return String(level || '');
}

export function presetFor(permissions, presets) {
  if (!Array.isArray(presets)) return 'custom';
  for (const preset of presets) {
    const presetPerms = (preset && preset.permissions) || {};
    if (permsMatch(permissions, presetPerms)) return preset.key;
  }
  return 'custom';
}

function permsMatch(a, b) {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const k of keys) {
    const lv = (a || {})[k] || 'none';
    const pv = (b || {})[k] || 'none';
    if (lv !== pv) return false;
  }
  return true;
}

export function applyPreset(preset) {
  if (!preset || !preset.permissions) return {};
  return { ...preset.permissions };
}

export function summarisePermissions(permissions, sections) {
  const writeSections = (sections || []).filter((s) => (permissions || {})[s.key] === 'write');
  const readSections = (sections || []).filter((s) => (permissions || {})[s.key] === 'read');
  const lines = [];
  if (writeSections.length) {
    lines.push('Read and write: ' + writeSections.map((s) => s.label).join(', '));
  }
  if (readSections.length) {
    lines.push('Read only: ' + readSections.map((s) => s.label).join(', '));
  }
  if (!lines.length) {
    lines.push('No access to anything yet.');
  }
  return lines;
}

export const AREA_SECTIONS = {
  '/admin': ['overview'],
  '/admin/activity': ['audit_log'],
  '/admin/ai-connections': ['ai_connections'],
  '/admin/assistant': ['assistant'],
  '/admin/connections': ['connections'],
  '/admin/coupons': ['coupons'],
  '/admin/leads': ['leads'],
  '/admin/resources': ['resources'],
  '/admin/sales': ['sales', 'orders', 'purchase_orders'],
  '/admin/scout': ['scout'],
  '/admin/social': ['social'],
  '/admin/support': ['support'],
  '/admin/suppliers': ['store'],
  '/admin/website-data': ['website_data'],
};

export function areaVisible(href, permissions) {
  if (!permissions || typeof permissions !== 'object') return true;
  const sections = AREA_SECTIONS[href];
  if (!sections) return true;
  return sections.some((key) => permissions[key] && permissions[key] !== 'none');
}
