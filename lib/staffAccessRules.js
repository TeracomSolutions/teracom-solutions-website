// What a signed-in staff member may do in one section of the console, from /staff/me (Robert, 2026-10-25).
// Used where the website itself guards a section, such as Coupons, whose backend calls use the website's
// own service token rather than the staff member's sign-in.

const ORDER = ['none', 'read', 'write'];

export function sectionLevel(me, section) {
  if (!me || typeof me !== 'object') return 'none';
  if (me.staff_role === 'platform_admin') return 'write';
  if (me.staff_role !== 'operator') return 'none';
  const level = (me.permissions || {})[section];
  return ORDER.includes(level) ? level : 'none';
}

export function levelAllows(level, needed) {
  return level !== 'none' && ORDER.indexOf(level) >= ORDER.indexOf(needed);
}

export function neededFor(method) {
  return ['GET', 'HEAD', 'OPTIONS'].includes(String(method || '').toUpperCase()) ? 'read' : 'write';
}
