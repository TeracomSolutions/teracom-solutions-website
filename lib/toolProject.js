// Project report for the free tools (Robert, 2026-11-02): results from any of the
// calculators are added to one project, which grows into a single document. It is
// kept in the visitor's own browser, saved as one PDF, and the same PDF (or a
// project file) can be imported again to carry on and make changes.
//
// Everything here is plain data in and out, so it is unit-tested; the browser parts
// live in components/tools/ToolProject*.js.
import { tools } from './tools.js';

export const PROJECT_FORMAT = 'teracom-tools-project';
export const PROJECT_VERSION = 1;
export const STORAGE_KEY = 'teracom-tools-project';
export const ATTACHMENT_NAME = 'teracom-tools-project.json';

export const MAX_SECTIONS = 60;
const MAX_TEXT = 200;
const MAX_NOTES = 4000;
const MAX_LINES = 80;
const MAX_STATE_BYTES = 20000;

const KNOWN = new Set(tools.map((tool) => tool.slug));

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;
const text = (value, max = MAX_TEXT) => String(value ?? '').replace(CONTROL, '').slice(0, max);

export function toolTitle(slug) {
  return tools.find((tool) => tool.slug === slug)?.title || slug;
}

export function emptyProject(now = new Date().toISOString()) {
  return { format: PROJECT_FORMAT, version: PROJECT_VERSION, name: '', client: '', site: '', preparedBy: '', notes: '', createdAt: now, updatedAt: now, sections: [] };
}

function newId(existing) {
  let id;
  do {
    id = Math.random().toString(36).slice(2, 10).padEnd(8, '0');
  } while (existing.some((section) => section.id === id));
  return id;
}

function cleanLines(lines, max = MAX_LINES) {
  if (!Array.isArray(lines)) return [];
  return lines.slice(0, max).flatMap((line) => {
    if (!line || typeof line !== 'object') return [];
    if (line.warn) return [{ warn: text(line.warn, 600) }];
    if (line.note) return [{ note: text(line.note, 600) }];
    const label = text(line.label);
    const value = text(line.value, 600);
    return label || value ? [{ label, value }] : [];
  });
}

function cleanState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return {};
  try {
    const json = JSON.stringify(state);
    return json.length <= MAX_STATE_BYTES ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

function cleanSection(section, existing = []) {
  if (!section || typeof section !== 'object' || !KNOWN.has(section.slug)) return null;
  const id = typeof section.id === 'string' && /^[a-z0-9]{4,16}$/.test(section.id) && !existing.some((s) => s.id === section.id) ? section.id : newId(existing);
  return {
    id,
    slug: section.slug,
    label: text(section.label),
    state: cleanState(section.state),
    inputs: cleanLines(section.inputs),
    results: cleanLines(section.results),
    notes: text(section.notes, MAX_NOTES),
    savedAt: text(section.savedAt, 40),
  };
}

// A project read from storage, a file or a PDF: anything unexpected is dropped or
// cut to size, never trusted. Returns null when it is not a project at all.
export function cleanProject(raw) {
  if (!raw || typeof raw !== 'object' || raw.format !== PROJECT_FORMAT) return null;
  const project = {
    ...emptyProject(text(raw.createdAt, 40) || undefined),
    name: text(raw.name),
    client: text(raw.client),
    site: text(raw.site),
    preparedBy: text(raw.preparedBy),
    notes: text(raw.notes, MAX_NOTES),
    updatedAt: text(raw.updatedAt, 40),
  };
  for (const section of Array.isArray(raw.sections) ? raw.sections.slice(0, MAX_SECTIONS) : []) {
    const clean = cleanSection(section, project.sections);
    if (clean) project.sections.push(clean);
  }
  return project;
}

export function parseProject(json) {
  try {
    return cleanProject(JSON.parse(json));
  } catch {
    return null;
  }
}

export function serializeProject(project) {
  return JSON.stringify(project, null, 2);
}

const touched = (project, sections, now) => ({ ...project, sections, updatedAt: now || new Date().toISOString() });

export function addSection(project, section, now) {
  if (project.sections.length >= MAX_SECTIONS) throw new Error(`A project holds up to ${MAX_SECTIONS} results.`);
  const clean = cleanSection({ ...section, id: undefined, savedAt: now || new Date().toISOString() }, project.sections);
  if (!clean) throw new Error('That calculator cannot be added.');
  return { project: touched(project, [...project.sections, clean], now), id: clean.id };
}

export function updateSection(project, id, changes, now) {
  return touched(
    project,
    project.sections.map((section) => {
      if (section.id !== id) return section;
      const merged = cleanSection({ ...section, ...changes, id: undefined, slug: section.slug }, []);
      return merged ? { ...merged, id, savedAt: 'state' in changes ? now || new Date().toISOString() : section.savedAt } : section;
    }),
    now
  );
}

export function removeSection(project, id, now) {
  return touched(project, project.sections.filter((section) => section.id !== id), now);
}

export function moveSection(project, id, step, now) {
  const sections = [...project.sections];
  const from = sections.findIndex((section) => section.id === id);
  const to = from + step;
  if (from < 0 || to < 0 || to >= sections.length) return project;
  [sections[from], sections[to]] = [sections[to], sections[from]];
  return touched(project, sections, now);
}

export function updateDetails(project, changes, now) {
  const next = { ...project };
  for (const key of ['name', 'client', 'site', 'preparedBy']) if (key in changes) next[key] = text(changes[key]);
  if ('notes' in changes) next.notes = text(changes.notes, MAX_NOTES);
  return touched(next, project.sections, now);
}

export function sectionTitle(section) {
  return section.label || toolTitle(section.slug);
}

// The built-in PDF fonts only know the Windows-1252 characters; anything else is
// spelled out or replaced so making the PDF never fails on a stray symbol.
const SPELLED = {
  'Ω': 'ohm', 'Ω': 'ohm', '≈': '~', '≤': '<=', '≥': '>=', '−': '-', '→': '->',
  ' ': ' ', ' ': ' ', ' ': ' ',
};
const WIN1252_EXTRA = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');

export function pdfSafe(value) {
  let out = '';
  for (const ch of String(value ?? '')) {
    if (SPELLED[ch] !== undefined) out += SPELLED[ch];
    else if (ch === '\n') out += ch; // kept: wrapText turns it into a new line
    else if (ch === '\t' || ch === '\r') out += ' ';
    else if ((ch >= ' ' && ch <= '~') || (ch >= '¡' && ch <= 'ÿ') || WIN1252_EXTRA.has(ch)) out += ch;
    else out += '?';
  }
  return out;
}

// Splits text into lines no wider than `maxWidth`, using `widthOf(text)` to measure.
export function wrapText(value, maxWidth, widthOf) {
  const lines = [];
  for (const paragraph of String(value ?? '').split(/\r?\n/)) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const tryLine = line ? `${line} ${word}` : word;
      if (widthOf(tryLine) <= maxWidth) {
        line = tryLine;
        continue;
      }
      if (line) lines.push(line);
      let rest = word;
      while (widthOf(rest) > maxWidth && rest.length > 1) {
        let cut = rest.length - 1;
        while (cut > 1 && widthOf(rest.slice(0, cut)) > maxWidth) cut -= 1;
        lines.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      line = rest;
    }
    lines.push(line);
  }
  return lines;
}

export function fileNameFor(project, extension) {
  const base = (project.name || 'Teracom tools project').replace(/[^A-Za-z0-9 ._-]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'Teracom-tools-project';
  return `${base}.${extension}`;
}
