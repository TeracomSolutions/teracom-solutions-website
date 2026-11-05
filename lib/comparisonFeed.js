// The CSV the Australian price comparison sites read (growth tool 13), made
// from the Google Shopping feed's items (lib/shoppingFeed.js feedItem).

export const COLUMNS = ['Product name', 'Brand', 'MPN', 'GTIN', 'SKU', 'Price (AUD)', 'Product URL', 'Image URL', 'Category', 'Availability', 'Description'];

function cell(value) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function amount(price) {
  return String(price || '').replace(/\s*AUD$/, '');
}

export function comparisonRow(item) {
  return [
    item.title,
    item.brand,
    item.mpn,
    item.gtin || '',
    item.id,
    amount(item.salePrice || item.price),
    item.link,
    item.imageLink,
    item.productType,
    item.availability === 'in_stock' ? 'In stock' : 'Available to order',
    String(item.description || '').slice(0, 500),
  ];
}

export function comparisonCsv(items) {
  const lines = [COLUMNS.map(cell).join(',')];
  for (const item of items || []) lines.push(comparisonRow(item).map(cell).join(','));
  return lines.join('\n') + '\n';
}
