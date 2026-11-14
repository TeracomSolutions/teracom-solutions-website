// Plain helpers for the Advertising page (components/AdminAdvertising.js); no React, so they can be tested.

export const STATUS_TEXT = {
  draft: 'Draft',
  ready: 'Sent, switched off',
  live: 'Live',
  paused: 'Paused',
  ended: 'Ended',
  failed: 'Not sent',
};

export const STATUS_TONE = {
  draft: 'unknown',
  ready: 'attention',
  live: 'connected',
  paused: 'attention',
  ended: 'not_set_up',
  failed: 'failing',
};

export const MODE_TEXT = {
  off: 'Off: nothing is sent to any platform.',
  prepare: 'Prepare: campaigns can be made and sent to the platforms switched off, but nothing goes live.',
  live: 'Live: a person may press Go live, inside the monthly limits.',
};

export function statusText(status) {
  return STATUS_TEXT[status] || status || '';
}

export function statusTone(status) {
  return STATUS_TONE[status] || 'unknown';
}

export function money(cents) {
  if (cents === null || cents === undefined || cents === '') return '—';
  const value = Number(cents) / 100;
  return '$' + value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function dollarsToCents(text) {
  const value = String(text ?? '').replace(/[$,\s]/g, '');
  if (value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return NaN;
  return Math.round(number * 100);
}

export function centsToDollars(cents) {
  if (cents === null || cents === undefined) return '';
  return (Number(cents) / 100).toFixed(2);
}

export function ratio(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toFixed(2) + 'x';
}

// What the campaign's buttons are, by its status and platform.
export function actionsFor(campaign) {
  const manual = campaign.method === 'manual';
  switch (campaign.status) {
    case 'draft':
    case 'failed':
      return ['edit', 'write', 'send', 'delete'];
    case 'ready':
      return ['live', 'budget', 'end', ...(manual ? ['record'] : [])];
    case 'live':
      return ['pause', 'budget', 'end', 'record'];
    case 'paused':
      return ['live', 'budget', 'end', 'record'];
    default:
      return ['record'];
  }
}

export const ACTION_TEXT = {
  edit: 'Edit',
  write: 'Write the text',
  send: 'Send (switched off)',
  delete: 'Delete',
  live: 'Go live',
  pause: 'Pause',
  budget: 'Budget',
  end: 'End',
  record: 'Record results',
};

export function emptyCampaign(platform = 'meta') {
  return {
    platform, name: '', product_ids: [], headline: '', body: '', description: '', link_url: '', image_url: '',
    budget: '', ends_on: '', options: {},
  };
}

export function formFromCampaign(c) {
  return {
    platform: c.platform, name: c.name || '', product_ids: c.product_ids || [], headline: c.headline || '', body: c.body || '',
    description: c.description || '', link_url: c.link_url || '', image_url: c.image_url || '',
    budget: centsToDollars(c.daily_budget_cents), ends_on: c.ends_on || '', options: c.options || {},
  };
}

// The body the backend takes from the form; throws a plain message when the budget is not a number.
export function campaignPayload(form) {
  const budget = dollarsToCents(form.budget);
  if (Number.isNaN(budget)) throw new Error('The daily budget must be a number of dollars.');
  return {
    platform: form.platform, name: form.name.trim(), product_ids: form.product_ids, headline: form.headline,
    body: form.body, description: form.description, link_url: form.link_url.trim(), image_url: form.image_url.trim(),
    daily_budget_cents: budget, ends_on: form.ends_on || null, options: form.options || {},
  };
}

// Characters left for a field with a platform limit; null when the platform has no such field.
export function charsLeft(text, limit) {
  if (!limit) return null;
  return limit - String(text || '').length;
}
