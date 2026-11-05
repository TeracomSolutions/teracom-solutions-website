// The console menu's width when dragged (components/AdminSidebarResizer.js).

export const SIDEBAR_MIN = 200;
export const SIDEBAR_MAX = 420;
export const SIDEBAR_DEFAULT = 240;
export const SIDEBAR_KEY = 'teracom-admin-sidebar-width';

export function clampSidebarWidth(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return SIDEBAR_DEFAULT;
  return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, n));
}
