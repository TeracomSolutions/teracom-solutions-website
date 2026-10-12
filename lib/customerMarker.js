// Check if customer marker cookie is present
export const CUSTOMER_MARKER_COOKIE = 'teracom_customer_in';

/**
 * Checks if the customer marker cookie is set to '1'
 * @param {string} cookieText - The text of document.cookie
 * @returns {boolean} - True if marker cookie exists with value '1'
 */
export function hasCustomerMarker(cookieText) {
  if (typeof cookieText !== 'string') {
    return false;
  }

  const cookies = cookieText.split(';');

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed === `${CUSTOMER_MARKER_COOKIE}=1`) {
      return true;
    }
  }

  return false;
}