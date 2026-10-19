/*
 * PO status labels
 */
export const PO_STATUS_LABELS = {
  draft: 'Draft (not in Zoho yet)',
  created: 'Created in Zoho',
  issued: 'Issued in Zoho, email not sent yet',
  sent: 'Sent to the supplier',
  failed: 'Failed'
};

/**
 * @param {string} status
 * @returns {string}
 */
export function poStatusLabel(status) {
  if (PO_STATUS_LABELS[status]) return PO_STATUS_LABELS[status];
  const spaced = String(status).replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * @param {string} status
 * @returns {string}
 */
export function poStatusTone(status) {
  switch (status) {
    case 'sent': return 'good';
    case 'created':
    case 'issued': return 'warn';
    case 'failed': return 'bad';
    default: return 'muted';
  }
}

/**
 * @param {Object} po
 * @returns {{create: boolean, send: boolean}}
 */
export function poButtons(po) {
  const create = po.status === 'draft' || po.status === 'failed';
  const send = po.status === 'created' || po.status === 'issued';
  return { create, send };
}

/**
 * @param {Object} po
 * @returns {string}
 */
export function poRecipientNote(po) {
  if (po.mode === 'live') {
    return 'The purchase order will be emailed to ' + (po.email_to || 'the supplier (no email address set)') + '.';
  } else {
    return 'TEST: nothing goes to the supplier. Emails go only to ' + (po.email_to || 'the test address (not set, so sending is refused)') + '.';
  }
}

/**
 * @param {Object} po
 * @returns {number}
 */
export function poLineTotalCents(po) {
  return po.lines.reduce((total, line) => {
    return total + (line.quantity || 0) * (line.cost_cents || 0);
  }, 0);
}

/**
 * @param {Array} unassigned
 * @returns {string}
 */
export function unassignedNote(unassigned) {
  if (!unassigned || unassigned.length === 0) return '';
  return 'No supplier is set for: ' + unassigned.map(item => item.sku).join(', ') + '. They are not on any purchase order.';
}