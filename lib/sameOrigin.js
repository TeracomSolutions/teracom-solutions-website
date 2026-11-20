// A request that changes something must come from this site's own pages (security review, 20 November 2026).
// Cookies are SameSite=lax, which stops other websites but not a sibling subdomain, and a cross-site form can post
// JSON as text/plain. Browsers always send Origin on a cross-site POST; a request without one (a server, curl) is
// not a browser carrying the visitor's cookies, so it is let through.
export function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}
