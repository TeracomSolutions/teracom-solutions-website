// Marketing campaigns on the console (Robert, 2026-10-25): how a campaign's state reads, the weekday and
// channel names, and the empty form.

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CHANNEL_LABELS = {
  email: 'Email to customers who agreed to marketing',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram (needs a picture)',
  x: 'X',
};

const STATE_TEXT = { live: 'Live now', scheduled: 'Starts later', ended: 'Ended', draft: 'Draft', paused: 'Paused' };

export function campaignStateText(state) {
  return STATE_TEXT[state] || String(state || '');
}

export function campaignStateTone(state) {
  if (state === 'live') return 'good';
  if (state === 'scheduled') return 'warn';
  return 'muted';
}

export function hourLabel(hour) {
  const h = Number(hour) || 0;
  return (h % 12 || 12) + (h < 12 ? ' am' : ' pm');
}

export function todayIso(now = new Date()) {
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function emptyCampaign(now = new Date()) {
  return {
    title: '', offer: '', banner_text: '', link_url: '', coupon_code: '',
    starts_on: todayIso(now), ends_on: '', show_banner: true, in_weekly: true, status: 'draft', media_ids: [],
  };
}

// What is sent to the backend: blanks become null so optional fields stay empty.
export function campaignPayload(form) {
  const blank = (value) => (String(value || '').trim() ? String(value).trim() : null);
  return {
    title: String(form.title || '').trim(),
    offer: String(form.offer || '').trim(),
    banner_text: blank(form.banner_text),
    link_url: blank(form.link_url),
    coupon_code: blank(form.coupon_code),
    starts_on: form.starts_on,
    ends_on: blank(form.ends_on),
    show_banner: Boolean(form.show_banner),
    in_weekly: Boolean(form.in_weekly),
    status: form.status || 'draft',
    media_ids: Array.isArray(form.media_ids) ? form.media_ids : [],
  };
}
