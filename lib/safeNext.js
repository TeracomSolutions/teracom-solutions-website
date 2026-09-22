// Where to send someone after signing in or up: a same-site path from ?next=,
// or /account. Rejects absolute and protocol-relative URLs (open redirects).
export function safeNextPath(value, fallback = '/account') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }
  return value;
}
