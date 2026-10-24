// The stage strip on each order (Robert, 2026-10-25): the same eleven stages the backend works out
// (services/order_stages.py), how each state reads and which colour it gets.

export const STAGES = [
  ['paid', 'Paid'],
  ['customer', 'Customer in Zoho'],
  ['products', 'Products in the store and Zoho'],
  ['prices', 'Prices on the Zoho items'],
  ['invoice', 'Invoice created'],
  ['invoice_sent', 'Invoice marked sent'],
  ['payment', 'Payment recorded'],
  ['po_raised', 'Supplier order raised'],
  ['po_sent', 'Supplier order sent'],
  ['shipped', 'Shipped with tracking'],
  ['complete', 'Complete'],
];

const LABELS = Object.fromEntries(STAGES);

export function stageName(key) {
  return LABELS[key] || String(key || '');
}

const STATE_TEXT = {
  done: 'Done',
  skipped: 'Not needed',
  preview: 'Preview only',
  waiting: 'Waiting for you',
  failed: 'Problem',
  not_started: 'Not started',
};

export function stageStateText(state) {
  return STATE_TEXT[state] || String(state || '');
}

export function stageTone(state) {
  if (state === 'done') return 'good';
  if (state === 'failed') return 'bad';
  if (state === 'waiting' || state === 'preview') return 'warn';
  return 'muted';
}

// One character per state for the compact strip on the orders list (the colour and the hover text say the rest).
export function stageMark(state) {
  return { done: '✓', skipped: '–', preview: '◐', waiting: '…', failed: '!', not_started: '○' }[state] || '○';
}

// What the button on a stage does: prepare a step that has not started, approve one that is waiting or
// previewed, retry one that failed, or go to the supplier order panel.
export function stageButton(stage) {
  const action = stage && stage.action;
  if (!action) return null;
  if (action.kind === 'purchase_orders') return { kind: 'link', label: 'Open supplier orders', href: '#purchase-orders' };
  if (action.kind !== 'step') return null;
  if (stage.state === 'not_started') return { kind: 'prepare', step: action.name, label: 'Prepare' };
  if (stage.state === 'failed') return { kind: 'approve', step: action.name, label: 'Retry' };
  return { kind: 'approve', step: action.name, label: 'Approve' };
}
