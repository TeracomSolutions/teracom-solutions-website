// Forms customers fill in and sign on the website (Robert, 4 November 2026): monitoring
// commissioning first, then contractor, client and agreement forms the same way.
//
// Each form is plain data (its own file in this folder): sections of fields, the terms it
// asks the customer to accept and the prefix of its reference. The same definition draws
// the form in the browser (components/OnlineForm.js), checks it again on the server
// (app/api/forms/[key]/route.js) and turns the answers into the summary the backend keeps,
// prints into the signed copy and shows staff on the console's Forms page. Pure, with
// relative imports, so the plain Node test runner can load it.
//
// Field types: text, email, tel, number, textarea, select, radio (options may carry a
// description), checkboxes (an array of the ticked options), file (attached separately,
// see FILE_RULES), repeater (rows of sub-fields, e.g. contacts), hours (open and close
// times per day) and grid (one choice per row, e.g. what to do for each kind of alarm).
// A field or section with showIf { field, equals } only applies when that answer matches.

import monitoringCommissioning from './monitoringCommissioning.js';
import monitoring247 from './monitoring247.js';

export const ONLINE_FORMS = [monitoringCommissioning, monitoring247];

export const findOnlineForm = (key) => ONLINE_FORMS.find((form) => form.key === key) || null;

export const DAYS = [
  ['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'],
  ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday'], ['hol', 'Public holidays'],
];

// What can be attached. The website's own request limit is 4.5 MB and a file travels as
// base64 (a third bigger), so all the files together stay under 3 MB.
export const FILE_RULES = {
  maxFiles: 5,
  maxTotalBytes: 3 * 1024 * 1024,
  extensions: ['pdf', 'csv', 'txt', 'xls', 'xlsx', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
};

export const fileExtension = (name) => {
  const match = /\.([a-z0-9]+)$/i.exec(String(name || ''));
  return match ? match[1].toLowerCase() : '';
};

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());

export function shown(item, values) {
  if (!item || !item.showIf) return true;
  const answer = values?.[item.showIf.field];
  const want = item.showIf.equals;
  return Array.isArray(want) ? want.includes(answer) : answer === want;
}

/** The sections and fields that apply to these answers. */
export function visibleSections(form, values) {
  return form.sections
    .filter((section) => shown(section, values))
    .map((section) => ({ ...section, fields: section.fields.filter((field) => shown(field, values)) }));
}

function isEmpty(field, value) {
  switch (field.type) {
    case 'checkboxes':
      return !Array.isArray(value) || value.length === 0;
    case 'repeater':
      return !Array.isArray(value) || !value.some((row) => row && Object.values(row).some((v) => text(v)));
    case 'hours':
      return !value || !Object.values(value).some((d) => d && (text(d.open) || text(d.close)));
    case 'grid':
      return !value || !Object.values(value).some((v) => text(v));
    default:
      return !text(value);
  }
}

/**
 * What is missing or wrong, as messages a person can act on. files: [{ field, name, size }].
 * Empty when the form can be sent.
 */
export function checkForm(form, values = {}, files = []) {
  const problems = [];
  for (const section of visibleSections(form, values)) {
    for (const field of section.fields) {
      const value = values[field.id];
      if (field.type === 'file') {
        if (field.required && !files.some((f) => f.field === field.id)) problems.push(`Attach ${field.label.toLowerCase()}`);
        continue;
      }
      if (field.required && isEmpty(field, value)) {
        problems.push(`Complete ${field.label}`);
        continue;
      }
      if (field.type === 'email' && text(value) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text(value))) {
        problems.push(`${field.label} is not an email address`);
      }
      if ((field.type === 'select' || field.type === 'radio') && text(value) && !field.options.some((o) => optionValue(o) === value)) {
        problems.push(`Choose one of the options for ${field.label}`);
      }
      if (field.type === 'checkboxes' && Array.isArray(value) && value.some((v) => !field.options.some((o) => optionValue(o) === v))) {
        problems.push(`Choose from the options for ${field.label}`);
      }
      if (field.type === 'number' && text(value) && !/^\d{1,6}$/.test(text(value))) {
        problems.push(`${field.label} must be a whole number`);
      }
      if (field.type === 'repeater' && Array.isArray(value)) {
        const rows = value.filter((row) => row && Object.values(row).some((v) => text(v)));
        if (field.min && rows.length < field.min) problems.push(`Add at least ${field.min} ${field.rowLabel || 'row'}${field.min === 1 ? '' : 's'} to ${field.label}`);
        if (field.max && rows.length > field.max) problems.push(`${field.label} takes at most ${field.max}`);
        rows.forEach((row, index) => {
          for (const sub of field.fields) {
            if (sub.required && !text(row[sub.id])) problems.push(`Complete ${sub.label} for ${field.rowLabel || 'row'} ${index + 1}`);
          }
        });
      }
      if (field.type === 'grid' && value && typeof value === 'object') {
        for (const row of field.rows) {
          const answer = value[row.id];
          if (text(answer) && !field.options.some((o) => optionValue(o) === answer)) problems.push(`Choose an option for ${row.label}`);
          if (field.required && !text(answer)) problems.push(`Choose what to do for ${row.label}`);
        }
      }
    }
  }
  if (files.length > FILE_RULES.maxFiles) problems.push(`Attach at most ${FILE_RULES.maxFiles} files`);
  if (files.reduce((sum, f) => sum + (f.size || 0), 0) > FILE_RULES.maxTotalBytes) problems.push('The attached files are larger than 3 MB together');
  for (const f of files) {
    if (!FILE_RULES.extensions.includes(fileExtension(f.name))) problems.push(`${f.name} is not a file type we take (${FILE_RULES.extensions.join(', ')})`);
  }
  return [...new Set(problems)];
}

export const optionValue = (option) => (typeof option === 'string' ? option : option.value);
export const optionLabel = (option) => (typeof option === 'string' ? option : option.label || option.value);

/** Only the answers this form asks for, in their expected shapes. */
export function cleanValues(form, values = {}) {
  const out = {};
  for (const section of visibleSections(form, values)) {
    for (const field of section.fields) {
      const value = values[field.id];
      if (field.type === 'file' || value === undefined || value === null) continue;
      if (field.type === 'checkboxes') out[field.id] = Array.isArray(value) ? value.map(text).filter(Boolean).slice(0, 50) : [];
      else if (field.type === 'repeater') {
        out[field.id] = (Array.isArray(value) ? value : [])
          .filter((row) => row && typeof row === 'object')
          .map((row) => Object.fromEntries(field.fields.map((sub) => [sub.id, text(row[sub.id]).slice(0, 500)])))
          .filter((row) => Object.values(row).some(Boolean))
          .slice(0, field.max || 20);
      } else if (field.type === 'hours') {
        out[field.id] = Object.fromEntries(DAYS.map(([day]) => [day, { open: text(value?.[day]?.open).slice(0, 10), close: text(value?.[day]?.close).slice(0, 10) }]));
      } else if (field.type === 'grid') {
        out[field.id] = Object.fromEntries(field.rows.map((row) => [row.id, text(value?.[row.id]).slice(0, 200)]));
      } else out[field.id] = text(value).slice(0, field.type === 'textarea' ? 8000 : 500);
    }
  }
  return out;
}

function display(field, value, files) {
  switch (field.type) {
    case 'file':
      return files.filter((f) => f.field === field.id).map((f) => f.name).join(', ');
    case 'checkboxes':
      return (Array.isArray(value) ? value : []).join('\n');
    case 'repeater':
      return (Array.isArray(value) ? value : [])
        .map((row, i) => `${i + 1}. ` + field.fields.map((sub) => (text(row[sub.id]) ? `${sub.label}: ${text(row[sub.id])}` : '')).filter(Boolean).join(', '))
        .join('\n');
    case 'hours':
      return DAYS.map(([day, label]) => {
        const d = value?.[day] || {};
        return text(d.open) || text(d.close) ? `${label}: ${text(d.open) || '?'} to ${text(d.close) || '?'}` : '';
      }).filter(Boolean).join('\n');
    case 'grid':
      return field.rows.map((row) => (text(value?.[row.id]) ? `${row.label}: ${text(value[row.id])}` : '')).filter(Boolean).join('\n');
    default:
      return text(value);
  }
}

/** The answers as sections of label and value, for the record, the signed copy and staff. */
export function summarise(form, values = {}, files = []) {
  return visibleSections(form, values)
    .map((section) => ({
      title: section.title,
      rows: section.fields
        .filter((field) => field.type !== 'note')
        .map((field) => ({ label: field.label, value: display(field, values[field.id], files) }))
        .filter((row) => row.value),
    }))
    .filter((section) => section.rows.length > 0);
}

/** The summary as plain text, for a customer to copy if sending fails. */
export const summaryText = (summary) =>
  summary.map((s) => [s.title.toUpperCase(), ...s.rows.map((r) => `${r.label}: ${r.value}`)].join('\n')).join('\n\n');

/** Who the form is from, taken from the fields the form names. */
export function identity(form, values = {}) {
  const pick = (id) => (id ? text(values[id]) : '');
  return {
    name: pick(form.identity.name),
    email: pick(form.identity.email),
    company: pick(form.identity.company),
    phone: pick(form.identity.phone),
  };
}

/** The terms the customer accepts, worded with the version the website is showing. */
export function termsTitle(form, values, termsVersion) {
  const parts = form.agreement.schedules
    .filter((s) => shown(s, values))
    .map((s) => s.title);
  return `Teracom Terms and Conditions v${termsVersion}, ${parts.join(' and ')}`;
}
