// Server-only. Meta advertising from the backend (api/meta.py): which pixel
// the website loads, and a purchase or an enquiry sent to Meta from the
// backend, which holds the access token. Sending never throws: an ad signal
// that does not go must not break an order or an enquiry.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/meta.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchMetaConfig() {
  return backendFetch('/meta/config');
}

export async function sendMetaEvent(event) {
  try {
    return await backendFetch('/internal/meta/events', {
      method: 'POST',
      body: event,
      headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
    });
  } catch (error) {
    console.warn('Meta event not sent', event?.event_name, error instanceof Error ? error.message : error);
    return { sent: false };
  }
}

// The visitor details Meta matches an event with, from a request's headers
// and cookies. _fbp and _fbc are the pixel's own cookies.
export function metaVisitor(headerList, cookieStore) {
  const forwarded = headerList.get('x-forwarded-for') || '';
  return {
    client_ip: forwarded.split(',')[0].trim() || headerList.get('x-real-ip') || undefined,
    user_agent: headerList.get('user-agent') || undefined,
    fbp: cookieStore.get('_fbp')?.value || undefined,
    fbc: cookieStore.get('_fbc')?.value || undefined,
  };
}
