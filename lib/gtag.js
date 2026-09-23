// Thin wrapper over gtag.
//
// Everything that reports an event goes through here, for three reasons:
// gtag may not exist (blocked, still loading, or no measurement ID), a
// failure to report must never break the page, and sending the same event
// twice is worse than not sending it -- a duplicated purchase is a wrong
// number in a revenue report rather than a missing one.

const ONCE_PREFIX = 'teracom-ga-once:';

/** Report an event. Silent and harmless when analytics is unavailable. */
export function track(name, params = {}) {
  if (typeof window === 'undefined') return false;
  try {
    if (typeof window.gtag !== 'function') return false;
    window.gtag('event', name, params);
    return true;
  } catch {
    // An ad blocker replacing gtag with something that throws must not take
    // the page down with it.
    return false;
  }
}

/**
 * Report an event at most once per browser session for a given key.
 *
 * Used for purchases -- trade customers habitually refresh the confirmation
 * page to re-read an order number, and mobile browsers restore tabs.
 */
export function trackOnce(key, name, params = {}) {
  if (typeof window === 'undefined') return false;
  const storageKey = `${ONCE_PREFIX}${key}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return false;
  } catch {
    // Private browsing or blocked storage: report it rather than lose it.
    // A possible duplicate beats a certain absence.
    return track(name, params);
  }
  const sent = track(name, params);
  if (sent) {
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      // Nothing to do; the event is already away.
    }
  }
  return sent;
}

/** A cart line in the shape GA4's ecommerce events expect. */
export function toGaItem(product, quantity = 1, priceCents = null) {
  const cents = priceCents == null ? product.priceCents : priceCents;
  return {
    item_id: product.sku,
    item_name: product.name,
    item_category: product.category,
    item_variant: product.type,
    price: cents == null ? undefined : Number((cents / 100).toFixed(2)),
    quantity,
  };
}

export const AUD = 'AUD';
