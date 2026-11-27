// The accounting platforms a business can connect (Robert, 28 November 2026). Pure, so the plain Node test
// runner can load it.
export const ACCOUNTING_KEYS = ['zoho_books', 'xero', 'myob', 'quickbooks'];
export const OAUTH_KEYS = ['xero', 'myob', 'quickbooks'];
export const PLATFORM_NAMES = { zoho_books: 'Zoho Books', xero: 'Xero', myob: 'MYOB Business', quickbooks: 'QuickBooks Online' };

/** The connection cards to show: an accounting platform's card only when it is the one chosen. */
export function visibleConnections(list, platform) {
  return (list || []).filter((item) => !ACCOUNTING_KEYS.includes(item.key) || item.key === platform);
}

/** The notice after a sign-in comes back: ?xero=connected or ?xero=failed&reason=... */
export function connectNotice(query) {
  for (const key of OAUTH_KEYS) {
    const outcome = query?.[key];
    if (outcome === 'connected' || outcome === 'failed') {
      const reason = typeof query.reason === 'string' ? query.reason : '';
      const text = outcome === 'connected' ? `${PLATFORM_NAMES[key]} is connected.` : `${PLATFORM_NAMES[key]} did not connect.`;
      return { ok: outcome === 'connected', text: [text, reason].filter(Boolean).join(' ') };
    }
  }
  return null;
}
