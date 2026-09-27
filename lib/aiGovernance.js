// Pure helpers for the Governance tab under AI Connections: the vocabulary
// of a rule (category, enforcement, scope), its validation and the sentences
// the screen shows. No React here so the plain Node test runner can load it.
export const CATEGORIES = [
  ['privacy', 'Personal details'],
  ['financial', 'Financial details'],
  ['secrets', 'Passwords and keys'],
  ['conduct', 'Conduct'],
  ['custom', 'Custom'],
];

export const MODES = [
  ['instruct', 'Instruction'],
  ['filter', 'Filter'],
  ['both', 'Instruction and filter'],
];

export const SCOPES = [
  ['all', 'All providers'],
  ['external', 'External providers only'],
];

// Only these categories have a filter behind them.
export const FILTERABLE = ['privacy', 'financial', 'secrets'];
export const FILTER_MESSAGE = 'Only Personal details, Financial details and Passwords and keys can be filtered; use Instruction for this rule.';

const REMOVED = {
  secret: 'passwords or keys',
  card: 'card numbers',
  bank: 'bank details',
  tfn: 'tax file numbers',
  phone: 'phone numbers',
  email: 'email addresses',
  address: 'street addresses',
};

export function labelFor(list, key) {
  const found = list.find(([k]) => k === key);
  return found ? found[1] : key || '';
}

export function validateRule({ title, rule_text: ruleText, category, mode, scope } = {}) {
  const errors = [];
  if (!title || !title.trim()) errors.push('Give the rule a short title.');
  if (!ruleText || !ruleText.trim()) errors.push('Write the rule.');
  else if (ruleText.trim().length > 1000) errors.push('Keep the rule under 1000 characters.');
  if (!CATEGORIES.some(([k]) => k === category)) errors.push('Choose a category.');
  if (!MODES.some(([k]) => k === mode)) errors.push('Choose how the rule is enforced.');
  if (!SCOPES.some(([k]) => k === scope)) errors.push('Choose which providers the rule applies to.');
  if ((mode === 'filter' || mode === 'both') && !FILTERABLE.includes(category)) errors.push(FILTER_MESSAGE);
  return errors;
}

export function countsSentence(counts) {
  const parts = Object.entries(counts || {})
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${n} ${REMOVED[k] || k}`);
  return parts.length ? `Removed ${parts.join(', ')}` : 'Nothing to remove';
}

// What a rule does, in one short phrase for the table.
export function enforcementSentence(rule) {
  const where = rule?.scope === 'external' ? 'providers outside Teracom' : 'every provider';
  if (rule?.mode === 'filter') return `Filters ${labelFor(CATEGORIES, rule.category).toLowerCase()} out of what ${where} receive.`;
  if (rule?.mode === 'both') return `Told to the model, and ${labelFor(CATEGORIES, rule.category).toLowerCase()} are filtered out of what ${where} receive.`;
  return 'Told to the model on every request.';
}
