export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function cleanMergeRequest(body) {
  if (!body || typeof body !== 'object') {
    return { error: 'Choose the two products to merge.' };
  }

  const { keepId, dropId } = body;

  if (!keepId || typeof keepId !== 'string' || !UUID_PATTERN.test(keepId)) {
    return { error: 'Choose the two products to merge.' };
  }

  if (!dropId || typeof dropId !== 'string' || !UUID_PATTERN.test(dropId)) {
    return { error: 'Choose the two products to merge.' };
  }

  const keep_id = keepId.toLowerCase();
  const drop_id = dropId.toLowerCase();

  if (keep_id === drop_id) {
    return { error: 'Choose two different products.' };
  }

  return { keep_id, drop_id };
}

export function dollars(cents) {
  if (cents === null || cents === undefined) {
    return 'no cost';
  }

  const dollars = cents / 100;
  const isNegative = dollars < 0;
  const absDollars = Math.abs(dollars);

  const formatted = absDollars.toFixed(2);

  return isNegative ? `-$${formatted}` : `$${formatted}`;
}

export function describePreview(preview) {
  if (!preview || !preview.keep || !preview.drop) return [];

  const sentences = [];

  // First sentence: keeps SKU and moves offers
  sentences.push(`Keeps SKU ${preview.keep?.sku} and moves the offers of SKU ${preview.drop?.sku} onto it.`);

  // Offers after
  if (preview.offers_after && Array.isArray(preview.offers_after)) {
    for (const offer of preview.offers_after) {
      sentences.push(`${offer.supplier_name} sells it as ${offer.supplier_sku} for ${dollars(offer.cost_cents)} with ${offer.stock} in stock.`);
    }
  }

  // Cost used becomes X (it was Y)
  if (preview.cost_after !== undefined && preview.cost_before !== undefined) {
    sentences.push(`The cost used becomes ${dollars(preview.cost_after)} (it was ${dollars(preview.cost_before)}).`);
  }

  // Price effect
  if (preview.price_effect === 'tier prices change') {
    sentences.push('Customer tier prices will change because the cost changes.');
  } else {
    sentences.push('Customer prices do not change.');
  }

  // Final sentence: other product stays in catalogue
  sentences.push('The other product stays in the catalogue, hidden, so its history is kept.');

  return sentences;
}