export const ORDERING_LIMITS = {
  zoho_vendor_id: 64,
  zoho_vendor_name: 200,
  po_email: 255,
  account_number: 100,
  paperwork_wording: 2000
};

export function emailLooksRight(text) {
  if (typeof text !== 'string') return false;
  const parts = text.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (domain.indexOf('.') === -1) return false;
  const domainParts = domain.split('.');
  if (domainParts.some(part => !part)) return false;
  if (text.includes(' ')) return false;
  return true;
}

export function cleanOrderingInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'No details were sent.' };
  }

  const values = {};
  let hasKnownKey = false;

  // Handle text fields
  for (const key of ['zoho_vendor_id', 'zoho_vendor_name', 'po_email', 'account_number', 'paperwork_wording']) {
    if (input.hasOwnProperty(key)) {
      hasKnownKey = true;
      const value = input[key];
      if (typeof value !== 'string') {
        return { error: `${key.replace('_', ' ')} must be text.` };
      }

      const trimmed = value.trim();
      const limit = ORDERING_LIMITS[key];
      values[key] = trimmed.slice(0, limit);
    }
  }

  // Handle booleans
  for (const key of ['drop_ship', 'own_paperwork', 'auto_send_pos']) {
    if (input.hasOwnProperty(key)) {
      hasKnownKey = true;
      const value = input[key];
      if (typeof value !== 'boolean') {
        return { error: `${key.replace('_', ' ')} must be yes or no.` };
      }
      values[key] = value;
    }
  }

  // Validate email
  if (values.hasOwnProperty('po_email') && values.po_email && !emailLooksRight(values.po_email)) {
    return { error: 'That email address does not look right.' };
  }

  if (!hasKnownKey) {
    return { error: 'No details were sent.' };
  }

  return { values };
}