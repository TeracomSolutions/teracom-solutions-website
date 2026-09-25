import {
  TERMS_CONTENT_SHA256,
  TERMS_EFFECTIVE,
  TERMS_SOURCE_FILE,
  TERMS_VERSION,
} from './termsDocument.js';

// The one place a version string lives.
//
// Nothing else -- not a checkbox label, not an acceptance record, not an
// email -- may hard-code "3.0" or a date. They read from here, so a version
// bump cannot leave a page claiming one version while the stored record
// claims another.

export const TERMS_EFFECTIVE_DATE = '2026-10-01';

/**
 * The permanent, versioned URL. A published version is never edited in
 * place: when a new version is generated, the previous document module is
 * copied to a frozen one and this path keeps pointing at the old text. An
 * acceptance record that resolves to whatever the terms happen to say today
 * proves nothing at all.
 */
export const TERMS_VERSION_PATH = `/terms/v${TERMS_VERSION}`;

const DOCUMENTS = [
  { key: 'terms', title: 'Terms and Conditions of Trade', anchor: null },
  { key: 'schedule_1', title: 'Schedule 1 — Online store orders', anchor: 'schedule-1' },
  { key: 'schedule_2', title: 'Schedule 2 — Installation and project services', anchor: 'schedule-2' },
  { key: 'schedule_3', title: 'Schedule 3 — Monitoring services', anchor: 'schedule-3' },
  { key: 'schedule_4', title: 'Schedule 4 — Teracom AI platform', anchor: 'schedule-4' },
  { key: 'aup', title: 'Acceptable Use Policy', anchor: 'schedule-5' },
];

export const termsRegistry = DOCUMENTS.map((doc) => ({
  ...doc,
  version: TERMS_VERSION,
  effectiveDate: TERMS_EFFECTIVE_DATE,
  effectiveLabel: TERMS_EFFECTIVE,
  sourceFile: TERMS_SOURCE_FILE,
  // Proves what the customer was shown. Covers the document's own text, not
  // the rendered page -- see lib/termsDocument.js.
  contentHash: TERMS_CONTENT_SHA256,
  url: doc.anchor ? `${TERMS_VERSION_PATH}#${doc.anchor}` : TERMS_VERSION_PATH,
}));

export function findTermsDocument(key) {
  return termsRegistry.find((doc) => doc.key === key) || null;
}

/**
 * What a sign-up or application writes: one row per document accepted, not
 * one per submission. A monitoring application accepts the general terms and
 * Schedule 3; an AI sign-up accepts the terms, Schedule 4 and the acceptable
 * use policy.
 */
export const ACCEPTANCE_CONTEXTS = {
  signup: ['terms'],
  checkout: ['terms', 'schedule_1'],
  monitoring_application: ['terms', 'schedule_3'],
  ai_subscription: ['terms', 'schedule_4', 'aup'],
  version_change: ['terms'],
};

export function documentsForContext(context) {
  return (ACCEPTANCE_CONTEXTS[context] || []).map(findTermsDocument).filter(Boolean);
}

/**
 * The checkbox wording. Built from the registry so the label can never name a
 * version the stored record does not, and never pre-ticked -- "by continuing
 * you agree" is not acceptance.
 */
export function acceptanceLabel(context) {
  const docs = documentsForContext(context);
  if (docs.length === 0) return null;
  const [primary, ...rest] = docs;
  return {
    lead: `I have read and accept the Teracom Solutions ${primary.title} v${primary.version}`,
    also: rest.map((doc) => ({ title: doc.title, url: doc.url })),
    url: primary.url,
  };
}
