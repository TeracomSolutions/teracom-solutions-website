// A copy of the website that is only an admin console (Luneva at admin.luneva.com.au, ADMIN_ONLY=true):
// the console and what it needs answer; every other address goes to the console or is not found, so the
// copy never publishes the public website's pages (Robert, 2026-10-25).

const ALLOWED = [/^\/admin(\/|$)/, /^\/api\/admin(\/|$)/, /^\/api\/voice(\/|$)/];

export function adminOnlyOn(env) {
  return String((env && env.ADMIN_ONLY) || '').trim().toLowerCase() === 'true';
}

// 'next' (let it through), 'console' (send the browser to /admin) or 'not_found'.
export function adminOnlyAction(pathname) {
  const path = String(pathname || '/');
  if (ALLOWED.some((re) => re.test(path))) return 'next';
  if (path.startsWith('/api/')) return 'not_found';
  return 'console';
}
