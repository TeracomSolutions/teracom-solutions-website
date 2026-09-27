// Pure helpers for the documents published from the console to the public
// Resources sections. No React here so the plain Node test runner can load it.
import { DOC_TYPE_LABELS, SITE_DOCUMENT_SECTIONS } from './resourcesSections.js';

export { DOC_TYPE_LABELS, SITE_DOCUMENT_SECTIONS };

export const SECTION_FOR_TYPE = {
  datasheet: 'datasheets',
  user_manual: 'user-manuals',
  installer_manual: 'installer-manuals',
  brochure: 'brochures',
  other: 'downloads',
};

export const SECTION_LABELS = {
  'user-manuals': 'User Manuals',
  datasheets: 'Datasheets',
  'installer-manuals': 'Installer Manuals',
  brochures: 'Brochures',
  downloads: 'Downloads',
};

export function sectionForType(docType) {
  return SECTION_FOR_TYPE[docType] || 'downloads';
}

export function sectionLabel(slug) {
  return SECTION_LABELS[slug] || slug || '';
}

// Groups by brand, brands in alphabetical order, documents without a brand
// last under Other.
export function groupByBrand(documents) {
  const groups = new Map();
  for (const doc of documents || []) {
    const brand = doc.brand || 'Other';
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand).push(doc);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    })
    .map(([brand, docs]) => ({ brand, documents: docs }));
}

export function filterDocuments(documents, { brand, q } = {}) {
  const needle = (q || '').trim().toLowerCase();
  return (documents || []).filter((doc) => {
    if (brand && (doc.brand || 'Other') !== brand) return false;
    if (!needle) return true;
    return [doc.title, doc.model, doc.brand].some((v) => v && String(v).toLowerCase().includes(needle));
  });
}

export function formatSize(bytes) {
  if (!bytes || bytes < 0) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// "From aritech.com.au": where the manufacturer's copy came from.
export function describeSource(doc) {
  if (doc?.source_url) {
    try {
      return `From ${new URL(doc.source_url).hostname.replace(/^www\./, '')}`;
    } catch {
      // fall through to the name
    }
  }
  return doc?.source_name ? `From ${doc.source_name}` : '';
}

// One entry per brand with its number of documents, in the groupByBrand
// order (alphabetical, Other last): the brand buttons.
export function brandCounts(documents) {
  return groupByBrand(documents).map(({ brand, documents: docs }) => ({ brand, count: docs.length }));
}

// The brand to show: the one asked for when it exists (any capitalisation,
// returned as spelled in the list), else the first, else nothing.
export function pickBrand(brands, wanted) {
  const list = brands || [];
  const needle = String(wanted || '').trim().toLowerCase();
  const found = needle ? list.find((b) => String(b).toLowerCase() === needle) : undefined;
  return found || list[0] || '';
}
