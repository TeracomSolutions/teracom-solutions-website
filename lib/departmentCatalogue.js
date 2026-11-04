// The Departments and extension packs Teracom AI offers, as Global publishes them
// (teracom-ai-docs Architecture/DEPARTMENT_PACK_SYNC_AND_FRESHNESS_2026-11-03.md, rule 7):
// the website lists every one and follows Global's catalogue when it changes. Names,
// descriptions, tiers, versions, workers and what each pack includes: never prices
// (none are published until Robert approves). Pure, with relative imports, so the
// plain Node test runner can load it; the fetch is in lib/api/departmentCatalogue.js.
import { DEPARTMENTS } from './platformMessaging.js';

export const CATALOGUE_URL = 'https://platform.teracomsolutions.com.au/api/public/department-catalogue';

// The switch: on since Global's endpoint answered (2026-11-03, 21 packs). Off shows the
// bundled Departments as before.
export const USE_LIVE_CATALOGUE = true;

// Left out on purpose by Global; kept out here too in case an entry slips through.
const EXCLUDED = new Set(['defence', 'defence-security', 'software-development']);
const KINDS = ['department', 'extension', 'industry_extension'];
export const KIND_LABELS = { department: 'Department', extension: 'Extension pack', industry_extension: 'Industry extension' };

// How a pack is sold, shown where the old plan names were (Robert, 4 November 2026: no
// Starter, Enterprise or Platinum plans any more; everything is priced per Department).
const AVAILABLE_AS = {
  department: 'Available as a Department pack, priced per Department',
  extension: 'Available as an extension pack, added to its Department',
  industry_extension: 'Available as an industry extension, added to your Departments',
};
export const availableAs = (pack) => AVAILABLE_AS[pack?.kind] || AVAILABLE_AS.department;

const text = (value, max = 600) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
// Global still sends tier keys (starter, enterprise, platinum). They are kept in the data but never shown: there are no plans any more (Robert, 4 November 2026); see availableAs.
const tierName = (value) => text(value, 60).replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
export const slugOf = (value) => text(value, 80).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const sentence = (value) => {
  const s = text(value, 3000);
  return s ? s[0].toUpperCase() + s.slice(1) : '';
};
const strings = (value, max, each = 300) => (Array.isArray(value) ? value.map((v) => text(v, each)).filter(Boolean).slice(0, max) : []);

function workersOf(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return Math.round(value);
  if (!Array.isArray(value)) return [];
  return value
    .map((w) => (typeof w === 'string' ? text(w, 80) : text(w?.name || w?.title, 80)))
    .filter(Boolean)
    .slice(0, 40);
}

function workerDetails(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((w) => ({ name: text(w?.name, 120), role: sentence(w?.role) }))
    .filter((w) => w.name)
    .slice(0, 40);
}

/**
 * The catalogue's entries, checked. Accepts a bare list or { packs | items | entries | catalogue: [...] }
 * (Global sends packs). Anything else in an entry (prices above all) is dropped.
 */
export function cleanCatalogue(raw) {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.packs) ? raw.packs : Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw?.catalogue) ? raw.catalogue : [];
  const seen = new Set();
  const out = [];
  for (const entry of list.slice(0, 300)) {
    if (!entry || typeof entry !== 'object') continue;
    const name = text(entry.name, 120);
    const slug = slugOf(entry.slug || name);
    const kind = KINDS.includes(entry.kind) ? entry.kind : '';
    if (!name || !slug || !kind || seen.has(slug) || EXCLUDED.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      name,
      description: text(entry.description, 1200),
      kind,
      group: text(entry.group, 120) || (kind === 'department' ? name : text(entry.department_name, 120)),
      department: kind === 'department' ? '' : slugOf(entry.department),
      departmentName: kind === 'department' ? '' : text(entry.department_name, 120),
      tiers: Array.isArray(entry.tiers) ? entry.tiers.map((t) => tierName(typeof t === 'string' ? t : t?.name)).filter(Boolean).slice(0, 10) : [],
      version: text(String(entry.version ?? ''), 30),
      workers: workersOf(entry.workers),
      workerDetails: workerDetails(entry.worker_details),
      includes: strings(entry.includes, 60),
      howItWorks: sentence(entry.how_it_works),
      connectsTo: strings(entry.connects_to, 30, 120),
    });
  }
  return out;
}

/**
 * Departments in catalogue order, each with the extension packs in its group; packs whose
 * group is not a Department get their own heading (Global's "Industry Extensions").
 * Returns { departments, sections: [{ title, packs }] }.
 */
export function groupCatalogue(entries) {
  const departments = entries.filter((e) => e.kind === 'department').map((d) => ({ ...d, extensions: [] }));
  const byGroup = new Map(departments.map((d) => [slugOf(d.group || d.name), d]));
  const bySlug = new Map(departments.map((d) => [d.slug, d]));
  const sections = new Map();
  for (const pack of entries.filter((e) => e.kind !== 'department')) {
    const home = byGroup.get(slugOf(pack.group)) || bySlug.get(pack.department) || byGroup.get(slugOf(pack.departmentName));
    if (home && pack.kind === 'extension') {
      home.extensions.push(pack);
      continue;
    }
    const title = pack.group || (pack.kind === 'industry_extension' ? 'Industry Extensions' : 'Extension packs');
    if (!sections.has(title)) sections.set(title, []);
    sections.get(title).push(pack);
  }
  return { departments, sections: [...sections].map(([title, packs]) => ({ title, packs })) };
}

/**
 * A pack's "includes" sorted for its page: what each screen answers, its dashboards and
 * its reports. Global writes them as "Name: question", "Dashboard: name", "Report: name".
 */
export function splitIncludes(includes) {
  const out = { widgets: [], dashboards: [], reports: [], other: [] };
  for (const line of includes || []) {
    const at = line.indexOf(':');
    const head = at > 0 ? line.slice(0, at).trim() : '';
    const rest = at > 0 ? line.slice(at + 1).trim() : line.trim();
    if (head.toLowerCase() === 'dashboard') out.dashboards.push(rest);
    else if (head.toLowerCase() === 'report') out.reports.push(rest);
    else if (head) out.widgets.push({ name: head, question: rest });
    else out.other.push(rest);
  }
  return out;
}

export const findPack = (entries, slug) => (entries || []).find((e) => e.slug === slug) || null;

// The bundled copy: today's Departments in the catalogue's shape, shown when the live
// catalogue is switched off or has never answered.
export const SAMPLE_CATALOGUE = cleanCatalogue(
  DEPARTMENTS.map((d) => ({ slug: d.name, name: d.name, description: d.purpose, kind: 'department', tiers: [], version: '', workers: d.workers })),
);
