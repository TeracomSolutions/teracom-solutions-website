import { BUSINESS } from './seo.js';

// Whether Teracom is open right now, in Melbourne time, from the opening
// hours in lib/seo.js: the Ask Tera window offers "Send to the team" while
// open, and a callback outside those hours (Robert, 2026-10-04).
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function minutes(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + (m || 0);
}

export function melbourneTime(date) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || '';
  return { day: get('weekday'), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function isOpenNow(date = new Date(), hours = BUSINESS.openingHours) {
  const { day, minutes: now } = melbourneTime(date);
  if (!DAY_NAMES.includes(day) || !hours.days.includes(day)) return false;
  return now >= minutes(hours.opens) && now < minutes(hours.closes);
}