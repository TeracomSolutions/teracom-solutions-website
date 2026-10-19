/*
 * Test tools view helpers
 */

// Map of kind to singular and plural names
export const KIND_NAMES = { payment: ['payment', 'payments'], invoice: ['invoice', 'invoices'], purchase_order: ['purchase order', 'purchase orders'], item: ['product', 'products'], contact: ['customer', 'customers'] };

// Generate a summary sentence of record counts
export function recordsSummary(records) {
  if (!records || records.length === 0) return 'No test records in Zoho';

  const counts = {};
  records.forEach(record => {
    const kind = record.kind || record.kind;
    counts[kind] = (counts[kind] || 0) + 1;
  });

  const parts = [];
  if (counts.payment) parts.push(`${counts.payment} ${counts.payment === 1 ? 'payment' : 'payments'}`);
  if (counts.invoice) parts.push(`${counts.invoice} ${counts.invoice === 1 ? 'invoice' : 'invoices'}`);
  if (counts.purchase_order) parts.push(`${counts.purchase_order} ${counts.purchase_order === 1 ? 'purchase order' : 'purchase orders'}`);
  if (counts.item) parts.push(`${counts.item} ${counts.item === 1 ? 'product' : 'products'}`);
  if (counts.contact) parts.push(`${counts.contact} ${counts.contact === 1 ? 'customer' : 'customers'}`);

  return parts.join(', ');
}

// Generate confirmation text for cleanup
export function cleanupConfirmText(records, simulatedOrders, local) {
  if (!records || records.length === 0) {
    return 'Nothing to delete in Zoho.';
  }

  const summary = recordsSummary(records).replace('No test records in Zoho', '');
  let text = 'Delete ' + summary + ' from the Zoho TEST organisation';

  if (local && simulatedOrders > 0) {
    text += ' and remove ' + simulatedOrders + ' simulated order(s) from this site';
  }

  return text + '? This cannot be undone.';
}

// Check if simulation is allowed
export function canSimulate(info) {
  return Boolean(info && info.allowed === true);
}

// Generate result text for cleanup operation
export function cleanupResultText(result) {
  let text = 'Deleted ' + result.deleted + ' record(s) in Zoho';

  if (result.local_removed) {
    text += ', removed ' + result.local_removed + ' simulated order(s)';
  }

  if (result.failed) {
    text += ', ' + result.failed + ' could not be deleted';
  }

  if (result.problems && result.problems.length > 0) {
    text += '. ' + result.problems.join(' ');
  }

  return text + '.';
}