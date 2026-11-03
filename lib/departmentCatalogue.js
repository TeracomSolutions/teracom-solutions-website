// The Departments and extension packs Teracom AI offers, as Global publishes them
// (teracom-ai-docs Architecture/DEPARTMENT_PACK_SYNC_AND_FRESHNESS_2026-11-03.md, rule 7):
// the website lists every one and follows Global's catalogue when it changes. Names,
// descriptions, tiers, versions and workers only: never prices (none are published
// until Robert approves). Pure, with relative imports, so the plain Node test runner
// can load it; the fetch is in lib/api/departmentCatalogue.js.
import { DEPARTMENTS } from './platformMessaging.js';

export const CATALOGUE_URL = 'https://platform.teracomsolutions.com.au/api/public/department-catalogue';

// The switch: on since Global's endpoint answered (2026-11-03, 21 packs). Off shows the
// bundled Departments as before.
export const USE_LIVE_CATALOGUE = true;

// Left out on purpose by Global; kept out here too in case an entry slips through.
const EXCLUDED = new Set(['defence', 'software-development']);

const text = (value, max = 600) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
// Global sends tier keys (starter, enterprise, platinum); shown as names.
const tierName = (value) => text(value, 60).replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const slugOf = (value) => text(value, 80).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function workersOf(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return Math.round(value);
  if (!Array.isArray(value)) return [];
  return value
    .map((w) => (typeof w === 'string' ? text(w, 80) : text(w?.name || w?.title, 80)))
    .filter(Boolean)
    .slice(0, 20);
}

/**
 * The catalogue's entries, checked: { slug, name, description, kind, department, tiers, version, workers }.
 * Accepts a bare list or { packs | items | entries | catalogue: [...] } (Global sends packs). Anything else in an entry
 * (prices above all) is dropped.
 */
export function cleanCatalogue(raw) {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.packs) ? raw.packs : Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw?.catalogue) ? raw.catalogue : [];
  const seen = new Set();
  const out = [];
  for (const entry of list.slice(0, 300)) {
    if (!entry || typeof entry !== 'object') continue;
    const name = text(entry.name, 120);
    const slug = slugOf(entry.slug || name);
    const kind = entry.kind === 'extension' ? 'extension' : entry.kind === 'department' ? 'department' : '';
    if (!name || !slug || !kind || seen.has(`${kind}:${slug}`) || EXCLUDED.has(slug)) continue;
    seen.add(`${kind}:${slug}`);
    out.push({
      slug,
      name,
      description: text(entry.description),
      kind,
      department: kind === 'extension' ? slugOf(entry.department) : '',
      departmentName: kind === 'extension' ? text(entry.department_name, 120) : '',
      tiers: Array.isArray(entry.tiers) ? entry.tiers.map((t) => tierName(typeof t === 'string' ? t : t?.name)).filter(Boolean).slice(0, 10) : [],
      version: text(String(entry.version ?? ''), 30),
      workers: workersOf(entry.workers),
    });
  }
  return out;
}

/** Departments in catalogue order, each with its extensions; extensions whose Department is not listed come last. */
export function groupCatalogue(entries) {
  const departments = entries.filter((e) => e.kind === 'department').map((d) => ({ ...d, extensions: [] }));
  const bySlug = new Map(departments.map((d) => [d.slug, d]));
  const byName = new Map(departments.map((d) => [slugOf(d.name), d]));
  const loose = [];
  for (const ext of entries.filter((e) => e.kind === 'extension')) {
    const home = bySlug.get(ext.department) || byName.get(ext.department) || byName.get(slugOf(ext.departmentName));
    if (home) home.extensions.push(ext);
    else loose.push(ext);
  }
  return { departments, loose };
}

// The bundled copy: today's Departments in the catalogue's shape, shown when the live
// catalogue is switched off or has never answered.
export const SAMPLE_CATALOGUE = cleanCatalogue(
  DEPARTMENTS.map((d) => ({ slug: d.name, name: d.name, description: d.purpose, kind: 'department', tiers: [], version: '', workers: d.workers })),
);
