export const ADMIN_PATH_PREFIXES = ['/admin', '/api/admin'];

export function isAdminPath(pathname) {
  // Check if the path starts with any of the admin prefixes
  return ADMIN_PATH_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
}