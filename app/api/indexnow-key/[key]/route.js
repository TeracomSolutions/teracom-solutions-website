import { BACKEND_API_URL } from '@/lib/config';

// The IndexNow key file (growth tool 6, Robert 2026-11-05). next.config.mjs
// sends /<32 hex characters>.txt here; the file holds the key only while the
// tool is switched on in the console, and only for the key the backend holds.
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const { key } = await params;
  if (!/^[0-9a-f]{32}$/.test(String(key || ''))) return new Response('Not found', { status: 404 });
  try {
    const response = await fetch(`${BACKEND_API_URL}/public/growth/indexnow-key`, { cache: 'no-store' });
    const saved = response.ok ? (await response.text()).trim().replace(/^"|"$/g, '') : '';
    if (saved !== key) return new Response('Not found', { status: 404 });
    return new Response(saved, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
