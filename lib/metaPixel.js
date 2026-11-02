// The Meta (Facebook and Instagram) pixel (Robert, 2026-11-03).
//
// Every event the site already reports to Google Analytics goes through
// lib/gtag.js, which passes it here too, so a new GA event needs no second
// call. Only the events Meta's ads can use are sent, under Meta's own names.
// The Pixel ID comes from the console (Connections > Meta), so nothing here
// changes when it is set. Pure apart from metaTrack and loadPixel, with
// relative imports, so the plain Node test runner can load this file.

export const META_EVENTS = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
  generate_lead: 'Lead',
  contact_click: 'Contact',
  search: 'Search',
};

// Query parameters that can carry a secret (password reset, unsubscribe,
// sign-in links). The pixel reports the page address, so a page that has
// one is not reported at all.
const PRIVATE_PARAMS = ['token', 't', 'c'];

export function isPrivateUrl(search = '') {
  const params = new URLSearchParams(search);
  return PRIVATE_PARAMS.some((name) => params.has(name));
}

export function validPixelId(value) {
  const text = String(value || '').trim();
  return /^\d{6,20}$/.test(text) ? text : '';
}

/** [metaName, data] for a GA4 event, or null when Meta has no use for it. */
export function metaEvent(name, params = {}) {
  const metaName = META_EVENTS[name];
  if (!metaName) return null;
  const data = {};
  if (typeof params.value === 'number') {
    data.value = params.value;
    data.currency = params.currency || 'AUD';
  }
  const items = Array.isArray(params.items) ? params.items : [];
  const contents = items
    .filter((item) => item && item.item_id)
    .map((item) => ({ id: String(item.item_id), quantity: Number(item.quantity) || 1 }));
  if (contents.length) {
    data.contents = contents;
    data.content_ids = contents.map((c) => c.id);
    data.content_type = 'product';
    data.num_items = contents.reduce((sum, c) => sum + c.quantity, 0);
  }
  if (items.length === 1 && items[0]?.item_name) data.content_name = String(items[0].item_name);
  if (name === 'search' && params.search_term) data.search_string = String(params.search_term);
  return [metaName, data];
}

/** The id Meta uses to count a browser event and a server event once. */
export function metaEventId(name, params = {}) {
  if (name === 'purchase' && params.transaction_id) return String(params.transaction_id);
  if (name === 'generate_lead' && params.lead_id) return String(params.lead_id);
  return '';
}

/** Report a GA4 event to Meta too. Silent when the pixel is not loaded. */
export function metaTrack(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false;
  const event = metaEvent(name, params);
  if (!event) return false;
  try {
    const eventID = metaEventId(name, params);
    if (eventID) window.fbq('track', event[0], event[1], { eventID });
    else window.fbq('track', event[0], event[1]);
    return true;
  } catch {
    return false;
  }
}

/** Meta's standard loader, written out rather than pasted as a string. */
export function loadPixel(pixelId) {
  if (typeof window === 'undefined' || window.fbq) return;
  const fbq = function fbq(...args) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  };
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  // Only what the site reports itself: no automatic button and form reading.
  fbq('set', 'autoConfig', false, pixelId);
  fbq('init', pixelId);
}
