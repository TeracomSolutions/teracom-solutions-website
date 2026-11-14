// Staff changes to a form, made on the console (Robert, 14 November 2026) and kept in the
// backend (services/form_edits.py). The form's own file stays as built; these changes are laid
// over it wherever it is drawn, checked or summarised, so the website, the server check and
// the signed copy always agree. Pure, with relative imports, for the plain Node test runner.
//
// What can change:
//   title, shortTitle, lead, intro (paragraphs)
//   sections: { [sectionId]: { title } }
//   fields: { [fieldId]: { label, help, text (a note), required, hidden, options } }
//     options: a list of choices, only for a choice field whose choices are plain words;
//     for choices with descriptions, optionText: { [value]: { label, description } }
//   added: new questions [{ id, section, label, type, required, help, options }]
//   agreement: { statement, title, clauses: [{ heading, text }] } (title and clauses only for
//     a form with its own document; Teracom's terms are changed on the Terms page)
// What cannot: a field the form needs to know who sent it (name, email), and a field another
// question depends on, can be reworded but not hidden or given new choices.

import { optionValue } from './index.js';

export const ADDED_TYPES = [
  ['text', 'Short answer'],
  ['textarea', 'Long answer'],
  ['email', 'Email'],
  ['tel', 'Phone'],
  ['number', 'Whole number'],
  ['select', 'Drop-down list'],
  ['radio', 'Choose one'],
  ['checkboxes', 'Tick any'],
  ['note', 'Note (text only, no answer)'],
];
const ADDED = new Set(ADDED_TYPES.map(([t]) => t));
const CHOICE = new Set(['select', 'radio', 'checkboxes']);
const LIMITS = { short: 300, long: 2000, clause: 6000, intro: 10, clauses: 60, added: 40, options: 50 };

const str = (v, max) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : undefined);
const isObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => JSON.parse(JSON.stringify(v));

/** Fields that can be reworded but not hidden or given new choices. */
export function lockedFieldIds(form) {
  const locked = new Set([form.identity?.name, form.identity?.email].filter(Boolean));
  const watch = (item) => {
    if (item?.showIf?.field) locked.add(item.showIf.field);
  };
  for (const section of form.sections) {
    watch(section);
    section.fields.forEach(watch);
  }
  (form.agreement?.schedules || []).forEach(watch);
  return locked;
}

const plainOptions = (field) => CHOICE.has(field.type) && Array.isArray(field.options) && field.options.every((o) => typeof o === 'string');
const describedOptions = (field) => CHOICE.has(field.type) && Array.isArray(field.options) && field.options.some((o) => typeof o !== 'string');

/** What the editor may offer for a field. */
export function fieldAbilities(form, field, locked = lockedFieldIds(form)) {
  const isLocked = locked.has(field.id);
  return {
    label: field.type !== 'note',
    help: field.type !== 'note',
    text: field.type === 'note',
    required: field.type !== 'note' && !isLocked,
    hidden: !isLocked,
    options: plainOptions(field) && !isLocked,
    optionText: describedOptions(field),
    locked: isLocked,
  };
}

function cleanOptions(list) {
  if (!Array.isArray(list)) return undefined;
  const out = [...new Set(list.map((o) => str(o, LIMITS.short)).filter(Boolean))].slice(0, LIMITS.options);
  return out.length ? out : undefined;
}

/** Only changes this form can take, in their expected shapes. Throws nothing. */
export function cleanEdits(form, edits) {
  if (!form || !isObject(edits)) return {};
  const out = {};
  for (const key of ['title', 'shortTitle']) {
    const v = str(edits[key], 200);
    if (v) out[key] = v;
  }
  const lead = str(edits.lead, LIMITS.long);
  if (lead) out.lead = lead;
  if (Array.isArray(edits.intro)) {
    const intro = edits.intro.map((p) => str(p, LIMITS.long)).filter(Boolean).slice(0, LIMITS.intro);
    if (intro.length) out.intro = intro;
  }

  const sectionIds = new Set(form.sections.map((s) => s.id));
  if (isObject(edits.sections)) {
    const sections = {};
    for (const [id, change] of Object.entries(edits.sections)) {
      const title = sectionIds.has(id) && isObject(change) ? str(change.title, 200) : undefined;
      if (title) sections[id] = { title };
    }
    if (Object.keys(sections).length) out.sections = sections;
  }

  const locked = lockedFieldIds(form);
  const byId = new Map(form.sections.flatMap((s) => s.fields).map((f) => [f.id, f]));
  if (isObject(edits.fields)) {
    const fields = {};
    for (const [id, change] of Object.entries(edits.fields)) {
      const field = byId.get(id);
      if (!field || !isObject(change)) continue;
      const can = fieldAbilities(form, field, locked);
      const c = {};
      if (can.label && str(change.label, LIMITS.short)) c.label = str(change.label, LIMITS.short);
      if (can.help && typeof change.help === 'string') c.help = str(change.help, LIMITS.long);
      if (can.text && str(change.text, LIMITS.long)) c.text = str(change.text, LIMITS.long);
      if (can.required && typeof change.required === 'boolean') c.required = change.required;
      if (can.hidden && change.hidden === true) c.hidden = true;
      if (can.options && cleanOptions(change.options)) c.options = cleanOptions(change.options);
      if (can.optionText && isObject(change.optionText)) {
        const values = new Set(field.options.map(optionValue));
        const texts = {};
        for (const [value, t] of Object.entries(change.optionText)) {
          if (!values.has(value) || !isObject(t)) continue;
          const label = str(t.label, LIMITS.short);
          const description = typeof t.description === 'string' ? str(t.description, LIMITS.long) : undefined;
          if (label || description !== undefined) texts[value] = { ...(label ? { label } : {}), ...(description !== undefined ? { description } : {}) };
        }
        if (Object.keys(texts).length) c.optionText = texts;
      }
      if (Object.keys(c).length) fields[id] = c;
    }
    if (Object.keys(fields).length) out.fields = fields;
  }

  if (Array.isArray(edits.added)) {
    const taken = new Set(byId.keys());
    const added = [];
    for (const q of edits.added.slice(0, LIMITS.added)) {
      if (!isObject(q) || !ADDED.has(q.type) || !sectionIds.has(q.section)) continue;
      const id = typeof q.id === 'string' && /^extra_[a-z0-9]{1,12}$/.test(q.id) && !taken.has(q.id) ? q.id : null;
      if (!id) continue;
      const item = { id, section: q.section, type: q.type };
      if (q.type === 'note') {
        item.text = str(q.text, LIMITS.long);
        if (!item.text) continue;
      } else {
        item.label = str(q.label, LIMITS.short);
        if (!item.label) continue;
        item.required = q.required === true;
        const help = str(q.help, LIMITS.long);
        if (help) item.help = help;
        if (CHOICE.has(q.type)) {
          item.options = cleanOptions(q.options);
          if (!item.options) continue;
        }
      }
      taken.add(id);
      added.push(item);
    }
    if (added.length) out.added = added;
  }

  if (isObject(edits.agreement)) {
    const a = {};
    const statement = str(edits.agreement.statement, LIMITS.long);
    if (statement) a.statement = statement;
    if (form.agreement?.document) {
      const title = str(edits.agreement.title, 200);
      if (title) a.title = title;
      if (Array.isArray(edits.agreement.clauses)) {
        const seen = new Set();
        const clauses = [];
        for (const c of edits.agreement.clauses.slice(0, LIMITS.clauses)) {
          const heading = isObject(c) ? str(c.heading, 200) : undefined;
          const text = isObject(c) ? str(c.text, LIMITS.clause) : undefined;
          if (!heading || !text || seen.has(heading)) continue;
          seen.add(heading);
          clauses.push({ heading, text });
        }
        if (clauses.length) a.clauses = clauses;
      }
    }
    if (Object.keys(a).length) out.agreement = a;
  }
  return out;
}

/** Whether a saved set of edits changes anything (a form put back as built has none). */
export const hasEdits = (edits) => Boolean(edits) && !edits.reset && Object.keys(cleanEditsShape(edits)).length > 0;
const cleanEditsShape = (edits) =>
  Object.fromEntries(Object.entries(edits).filter(([k]) => !['revision', 'agreement_revision', 'updated_at', 'updated_by', 'reset'].includes(k)));

/** The form with the staff changes laid over it. Never changes the form passed in. */
export function applyFormEdits(form, saved) {
  if (!form || !hasEdits(saved)) return form;
  const edits = cleanEdits(form, saved);
  const out = copy(form);
  for (const key of ['title', 'shortTitle', 'lead', 'intro']) if (edits[key]) out[key] = edits[key];

  const added = edits.added || [];
  out.sections = out.sections
    .map((section) => {
      const title = edits.sections?.[section.id]?.title;
      const fields = section.fields
        .filter((field) => !edits.fields?.[field.id]?.hidden)
        .map((field) => {
          const c = edits.fields?.[field.id];
          if (!c) return field;
          const next = { ...field };
          if (c.label) next.label = c.label;
          if (c.help !== undefined) next.help = c.help || undefined;
          if (c.text) next.text = c.text;
          if (typeof c.required === 'boolean') next.required = c.required;
          if (c.options) next.options = c.options;
          if (c.optionText) {
            next.options = field.options.map((o) => {
              const t = c.optionText[optionValue(o)];
              if (!t || typeof o === 'string') return o;
              return { ...o, ...(t.label ? { label: t.label } : {}), ...(t.description !== undefined ? { description: t.description || undefined } : {}) };
            });
          }
          return next;
        });
      const extra = added
        .filter((q) => q.section === section.id)
        .map(({ section: _s, ...q }) => q);
      return { ...section, ...(title ? { title } : {}), fields: [...fields, ...extra] };
    })
    .filter((section) => section.fields.length > 0);

  if (edits.agreement) {
    out.agreement = { ...out.agreement };
    if (edits.agreement.statement) out.agreement.statement = edits.agreement.statement;
    if (out.agreement.document && (edits.agreement.title || edits.agreement.clauses)) {
      out.agreement.document = {
        ...out.agreement.document,
        ...(edits.agreement.title ? { title: edits.agreement.title } : {}),
        ...(edits.agreement.clauses ? { clauses: edits.agreement.clauses } : {}),
      };
    }
  }
  if (out.agreement.document && (edits.agreement?.title || edits.agreement?.clauses) && saved.agreement_revision) {
    out.agreement.document = { ...out.agreement.document, version: `${form.agreement.document.version}, change ${saved.agreement_revision}` };
  }
  if (saved.revision) out.version = `${form.version}.${saved.revision}`;
  out.edited = { revision: saved.revision || 0, updatedAt: saved.updated_at || null };
  return out;
}

/** A new question's id, unused in this form. */
export function newQuestionId(form, edits, seed = Date.now()) {
  const taken = new Set([...form.sections.flatMap((s) => s.fields.map((f) => f.id)), ...((edits?.added || []).map((q) => q.id))]);
  let n = Math.abs(Number(seed) || 1);
  let id;
  do {
    id = `extra_${(n++).toString(36).slice(-8)}`;
  } while (taken.has(id));
  return id;
}
