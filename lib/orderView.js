// lib/orderView.js
// Pure display helpers for order views in the admin console.

export const STEP_LABELS = {
  contact: 'Customer in Zoho',
  items: 'Products in Zoho',
  invoice: 'Invoice',
  mark_sent: 'Mark invoice as sent (no email)',
  payment: 'Payment',
  freight_check: 'Freight check',
};

/**
 * Return the label for a step name.
 */
export function stepLabel(name) {
  return STEP_LABELS[name] || humanise(name);
}

/**
 * Return the human-readable status label.
 */
export function statusLabel(status) {
  switch (status) {
    case 'pending': return 'Waiting';
    case 'preview': return 'Preview only';
    case 'awaiting_approval': return 'Needs your approval';
    case 'approved': return 'Approved';
    case 'sent': return 'Sent';
    case 'failed': return 'Failed';
    case 'done': return 'Done';
    case 'skipped': return 'Not needed';
    default: return humanise(status);
  }
}

/**
 * Return the tone for a status.
 */
export function statusTone(status) {
  switch (status) {
    case 'done':
    case 'sent':
      return 'good';
    case 'awaiting_approval':
    case 'approved':
    case 'preview':
      return 'warn';
    case 'failed':
      return 'bad';
    default:
      return 'muted';
  }
}

/**
 * Return the order status label.
 */
export function orderStatusLabel(status) {
  switch (status) {
    case 'recorded': return 'Recorded';
    case 'in_progress': return 'In progress';
    case 'attention': return 'Needs attention';
    case 'complete': return 'Complete';
    default: return humanise(status);
  }
}

/**
 * Return the tone for an order status.
 */
export function orderStatusTone(status) {
  switch (status) {
    case 'complete':
      return 'good';
    case 'attention':
      return 'bad';
    case 'in_progress':
      return 'warn';
    default:
      return 'muted';
  }
}

/**
 * Format cents into a currency string.
 */
export function cents(value) {
  if (value == null || Number.isNaN(value)) return '—';
  return '$' + (value / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const KIND_LABELS = {
  contact: 'Create the customer',
  item: 'Create a product',
  invoice: 'Create the invoice',
  invoice_status: 'Mark the invoice as sent (no email is sent)',
  payment: 'Record the payment',
};

/**
 * Describe a call with its kind, method and path.
 */
export function describeCall(call) {
  return (KIND_LABELS[call.kind] || call.kind) + ' (' + call.method + ' ' + call.path + ')';
}

/**
 * Return the next step that is not done or skipped.
 */
export function nextStep(steps) {
  return [...steps].sort((a, b) => (a.seq || 0) - (b.seq || 0)).find((step) => step.status !== 'done' && step.status !== 'skipped') || null;
}

/**
 * Determine which buttons to show for a step.
 */
export function stepButtons(step, steps) {
  const n = nextStep(steps);
  if (!n || n.name !== step.name) return { prepare: false, approve: false };
  return {
    prepare: step.status === 'pending',
    approve: ['awaiting_approval', 'preview', 'failed'].includes(step.status),
  };
}

/**
 * Build a query string for the orders API.
 */
export function buildOrdersQuery(filters) {
  const { status, mode, q, page } = filters;
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (mode) params.append('mode', mode);
  if (q) params.append('q', q);
  if (page && page > 1) params.append('page', page);
  const query = params.toString();
  return query ? '?' + query : '';
}

export const PAGE_SIZE = 50;

/**
 * Convert a page number to the skip value for API.
 */
export function pageToSkip(page) {
  return (Math.max(1, Number(page) || 1) - 1) * PAGE_SIZE;
}

/**
 * Return the tone for an alert severity.
 */
export function alertTone(severity) {
  return severity === 'problem' ? 'bad' : 'muted';
}

/**
 * Humanise a string by turning underscores into spaces and capitalizing first letter.
 */
function humanise(str) {
  const spaced = String(str).replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}