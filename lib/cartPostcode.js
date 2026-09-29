// The delivery postcode the cart last priced, kept in this browser so the
// checkout page can send it and the next visit starts with it. Storage can
// be blocked (private windows), so every read and write is guarded.
const KEY = 'teracom-cart-postcode-v1';

export function readPostcode() {
  try {
    return window.localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

export function writePostcode(value) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Not kept; the customer types it again next time.
  }
}