// The pure parts of the Needs review page (Robert, 2026-10-06): price list
// rows whose recommended price is below cost are held back from the import
// until staff decide. The wording and the money shown.

const MONEY = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

export function dollars(cents) {
  return MONEY.format((Number(cents) || 0) / 100);
}

// What an import result adds to its summary when rows were held or left out.
export function heldNotice(result) {
  const held = Number(result?.held) || 0;
  const leftOut = Number(result?.left_out) || 0;
  const parts = [];
  if (held) parts.push(`${held} row${held === 1 ? '' : 's'} held for review (recommended price below cost)`);
  if (leftOut) parts.push(`${leftOut} left out as before`);
  return parts.join(', ');
}

// Why a held row is held, in a sentence.
export function holdReason(hold) {
  return `The recommended price is ${dollars(hold.price_ex_gst_cents)} before GST, which is less than the cost of ${dollars(hold.cost_cents)}.`;
}

export const STATUS_LABELS = {
  pending: 'Waiting for a decision',
  dismissed: 'Left out',
  approved: 'Imported anyway',
  cleared: 'Fixed by a later import',
};

// What the count in the Store tabs says.
export function tabLabel(pending) {
  return pending > 0 ? `Needs review (${pending})` : 'Needs review';
}