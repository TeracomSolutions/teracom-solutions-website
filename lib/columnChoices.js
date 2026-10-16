// Checks the column choices the matching screen sends before they go to the
// backend: each store field is on or off, and read from a heading of the file
// (or found automatically when there is no heading).
const FIELDS = [
  'sku', 'name', 'description', 'price', 'price_ex_gst', 'cost', 'stock', 'category',
  'subcategory', 'brand', 'image_url', 'weight_kg', 'length_cm', 'width_cm', 'height_cm',
];

export function cleanColumnChoices(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'No choices were sent.' };
  const choices = {};
  for (const [field, choice] of Object.entries(input)) {
    if (!FIELDS.includes(field)) return { error: `Unknown field: ${field}` };
    if (!choice || typeof choice !== 'object') return { error: `Bad choice for ${field}.` };
    const on = choice.on !== false;
    const heading = typeof choice.heading === 'string' ? choice.heading.trim().slice(0, 100) : '';
    if (!on && (field === 'sku' || field === 'name')) return { error: 'The part number and the name cannot be turned off.' };
    choices[field] = { on, heading: on && heading ? heading : null };
  }
  if (Object.keys(choices).length === 0) return { error: 'No choices were sent.' };
  return { choices };
}