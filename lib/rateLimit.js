// In-process, per-key sliding-window rate limiter. Mirrors the pattern
// teracom-ai-backend already uses for login rate limiting
// (auth/rate_limit.py's LoginRateLimiter) -- same tradeoff, documented the
// same way: state lives in this process's memory, so it resets on restart
// and isn't shared across multiple instances/workers. Acceptable for this
// app's current single-instance deployment (Website_Application_Separation
// _Plan_V1.md section 4.8); would need a shared store (e.g. Redis) if this
// is ever scaled to multiple instances.

const buckets = new Map();

/**
 * @param {string} key - identifies what's being limited, e.g. `${route}:${ip}`.
 * @param {{ maxAttempts: number, windowMs: number }} options
 * @returns {{ allowed: boolean, retryAfterSeconds: number }}
 */
export function checkRateLimit(key, { maxAttempts, windowMs }) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= maxAttempts) {
    const retryAfterMs = windowMs - (now - timestamps[0]);
    buckets.set(key, timestamps);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

// The limit every route uses (security review 2026-11-06). On Vercel each server
// instance has its own memory, so checkRateLimit alone resets on a cold start and
// is not shared. This also counts the attempt on the backend, which runs as one
// process (POST /internal/rate-limit). The local count still answers first, and
// stands in when the backend cannot be reached, so a limit is never skipped.
export async function checkSharedRateLimit(key, { maxAttempts, windowMs }) {
  const local = checkRateLimit(key, { maxAttempts, windowMs });
  if (!local.allowed) return local;
  const base = process.env.BACKEND_API_URL;
  const token = process.env.WEBSITE_FRONTEND_SERVICE_TOKEN;
  if (!base || !token) return local;
  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/internal/rate-limit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Service-Token': token },
      body: JSON.stringify({
        key: String(key).slice(0, 300),
        max_attempts: maxAttempts,
        window_seconds: Math.max(1, Math.ceil(windowMs / 1000)),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) return local;
    const data = await response.json();
    return data.allowed ? { allowed: true, retryAfterSeconds: 0 } : { allowed: false, retryAfterSeconds: Math.max(1, Number(data.retry_after) || 1) };
  } catch {
    return local;
  }
}

// Best-effort client IP extraction for a Next.js App Router Request. There
// is no portable req.ip in a route handler (unlike some platform-specific
// middleware APIs) -- this reads the same header nginx is configured to set
// (Website_Application_Separation_Phase5_Runbook_V1.md section 4:
// `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`), with a
// generic fallback key so an unrecognised client still gets *a* limit
// rather than bypassing rate limiting entirely for lack of a header.
export function clientIpFromRequest(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

export function rateLimitResponse(retryAfterSeconds, message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfterSeconds),
    },
  });
}
