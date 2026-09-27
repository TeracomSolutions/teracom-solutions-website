// Pure helpers for the Social area of the console: the networks and what
// each needs, the channels an update can go to, and the sentences the
// screens show. No React here so the plain Node test runner can load it.
import { formatDateTime } from './adminFormat.js';

export const NETWORKS = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    credentialFields: [
      ['access_token', 'Access token'],
      ['author_urn', 'Author URN (urn:li:organization:...)'],
    ],
    help: 'A LinkedIn Developer app with the w_organization_social permission; the author URN is the company page.',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    credentialFields: [
      ['access_token', 'Page access token'],
      ['page_id', 'Page ID'],
    ],
    help: 'A Meta for Developers app with pages_manage_posts and a long-lived Page token.',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    credentialFields: [
      ['access_token', 'Access token'],
      ['ig_user_id', 'Instagram business account ID'],
    ],
    help: 'An Instagram Business account linked to the Facebook page. Every Instagram post needs an image link.',
  },
  {
    key: 'x',
    label: 'X',
    credentialFields: [['access_token', 'Access token (OAuth 2.0, tweet.write)']],
    help: 'An X Developer app with a user token that has tweet.write. Posts are limited to 280 characters.',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    credentialFields: [],
    help: 'Link only: the channel icon in the footer.',
  },
];

export const CHANNELS = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'x', label: 'X' },
  { key: 'email', label: 'Customer email' },
];

export const X_LIMIT = 280;
// X shortens every link to 23 characters, plus the line break before it.
export const X_LINK_COST = 24;

const TONES = {
  ready: 'ok',
  sent: 'ok',
  failing: 'bad',
  failed: 'bad',
  sending: 'warn',
  scheduled: 'warn',
};

export function statusTone(status) {
  return TONES[status] || 'muted';
}

export function statusLabel(status) {
  if (!status) return '';
  if (status === 'not_configured') return 'Not set up';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function channelLabel(key) {
  return CHANNELS.find((c) => c.key === key)?.label || key;
}

// The characters X will count for this update.
export function xLength(body, linkUrl) {
  return (body || '').trim().length + (linkUrl && linkUrl.trim() ? X_LINK_COST : 0);
}

export function validateUpdate({ title, body, channels, image_url: imageUrl, link_url: linkUrl } = {}) {
  const errors = [];
  const chosen = Array.isArray(channels) ? channels : [];
  if (!title || !title.trim()) errors.push('Give the update a title.');
  if (!body || !body.trim()) errors.push('Write the update.');
  if (chosen.length === 0) errors.push('Choose at least one channel.');
  if (chosen.includes('x')) {
    const count = xLength(body, linkUrl);
    if (count > X_LIMIT) errors.push(`X allows ${X_LIMIT} characters including the link; this is ${count}.`);
  }
  if (chosen.includes('instagram') && !(imageUrl && imageUrl.trim())) errors.push('Instagram needs an image link.');
  return errors;
}

export function describeAudience(audience) {
  const tiers = Array.isArray(audience?.tiers) ? audience.tiers.filter(Boolean) : [];
  if (tiers.length) return `Tiers: ${tiers.join(', ')}`;
  return 'All customers who agreed to hear from us';
}

export function summariseDeliveries(deliveries = []) {
  if (!Array.isArray(deliveries) || deliveries.length === 0) return '';
  return deliveries
    .map((d) => {
      const label = channelLabel(d.channel);
      const detail = d.detail ? ` (${d.detail})` : '';
      return `${label} ${d.status}${detail}`;
    })
    .join('; ');
}

// The one date a history row shows: when it went, else when it will, else when it was written.
export function updateWhen(update) {
  return formatDateTime(update?.sent_at || update?.scheduled_at || update?.created_at, '');
}

// Which channels of an update still have work in flight.
export function isInFlight(update) {
  return update?.status === 'sending' || update?.status === 'scheduled';
}
