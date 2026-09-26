export function sourceFormDefaults() {
  return {
    name: '',
    url: '',
    supplier_id: '',
    doc_types: ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'],
    recurrence: 'weekly',
    follow_links: true,
    max_pages: 60,
  };
}

export function changedFields(initial, values) {
  const result = {};

  // Compare name
  if (initial.name !== values.name) {
    result.name = values.name;
  }

  // Compare url
  if (initial.url !== values.url) {
    result.url = values.url;
  }

  // Compare supplier_id - track explicit changes
  if (initial.supplier_id !== values.supplier_id) {
    result.supplier_id = values.supplier_id;
  }

  // Compare doc_types - treat as sorted arrays
  const initialDocTypes = [...initial.doc_types].sort();
  const valuesDocTypes = [...values.doc_types].sort();
  const initialDocTypesStr = initialDocTypes.join(',');
  const valuesDocTypesStr = valuesDocTypes.join(',');
  if (initialDocTypesStr !== valuesDocTypesStr) {
    result.doc_types = values.doc_types;
  }

  // Compare recurrence
  if (initial.recurrence !== values.recurrence) {
    result.recurrence = values.recurrence;
  }

  // Compare follow_links
  if (initial.follow_links !== values.follow_links) {
    result.follow_links = values.follow_links;
  }

  // Compare max_pages - as numbers
  const initialMaxPages = Number(initial.max_pages);
  const valuesMaxPages = Number(values.max_pages);
  if (initialMaxPages !== valuesMaxPages) {
    result.max_pages = valuesMaxPages;
  }

  return result;
}
