export function parseCsvFeed(csv) {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });

    return {
      sku: row.sku,
      name: row.name || row.product,
      description: row.description || '',
      price: Number(row.price || 0),
      stock: Number(row.stock || 0),
      category: row.category || 'Uncategorised',
      supplier: row.supplier || 'Unknown',
    };
  });
}

export function parseJsonFeed(json) {
  const data = JSON.parse(json);
  return Array.isArray(data) ? data : data.products || [];
}

// Deliberately not a real XML parser (no DOMParser/libxmljs) — a targeted
// regex extraction over <product>...</product> blocks. This means no DTD
// or external-entity processing ever happens (no XXE risk), at the cost of
// not handling nested tags, CDATA, attributes, or namespaces. Acceptable
// for the simple flat supplier feeds this has been fed so far; revisit if
// a real supplier ever sends a more complex XML shape.
export function parseXmlFeed(xml) {
  const blocks = Array.from(xml.matchAll(/<product>([\s\S]*?)<\/product>/gi)).map((m) => m[1]);

  return blocks.map((block) => {
    const get = (tag) => block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.trim() || '';

    return {
      sku: get('sku'),
      name: get('name') || get('product'),
      description: get('description'),
      price: Number(get('price') || 0),
      stock: Number(get('stock') || 0),
      category: get('category'),
      supplier: get('supplier'),
    };
  });
}

export function parseFeed(content, type) {
  if (type === 'csv') return parseCsvFeed(content);
  if (type === 'json') return parseJsonFeed(content);
  if (type === 'xml') return parseXmlFeed(content);
  throw new Error('Unsupported feed type');
}
