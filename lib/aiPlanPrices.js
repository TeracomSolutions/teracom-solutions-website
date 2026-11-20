// Teracom AI against paying for Claude, ChatGPT or Grok (Robert, 20 November 2026): the visitor
// picks how many people and which Departments, and sees what the same team would pay in chat
// seats or in per-token API charges, and what a 5-hour usage window does to a heavy day.
// Every price below was read from the provider's own page on CHECKED; each carries its source.
// Workloads, hours and the exchange rate are the visitor's own or labelled illustrative.
// Pure, with relative imports, so the plain Node test runner can load it.
import { basePlatform, bundleDiscount } from './savings.js';

export const CHECKED = '20 November 2026';
export const CHECKED_ISO = '2026-11-20';
export const DEFAULT_AUD_PER_USD = 1.55;
export const WORK_DAYS_PER_MONTH = 22;

const CLAUDE_PRICING = 'https://claude.com/pricing';
const CLAUDE_LIMITS = 'https://support.claude.com/en/articles/11647753';
const CHATGPT_PRICING = 'https://chatgpt.com/pricing';
const OPENAI_API = 'https://developers.openai.com/api/docs/pricing';
const XAI_API = 'https://docs.x.ai/docs/models';

// Chat subscriptions, per person per month. currency is what the provider lists; Claude lists
// US$ (before tax), ChatGPT lists A$ to Australian visitors. annual is the per-month price when
// billed yearly (null if there is no yearly option).
export const SEAT_PLANS = [
  { id: 'claude-pro', provider: 'Claude', name: 'Claude Pro', currency: 'USD', monthly: 20, annual: 17, window: true,
    limits: '5-hour usage sessions and a weekly limit', source: CLAUDE_PRICING },
  { id: 'claude-max', provider: 'Claude', name: 'Claude Max (5x)', currency: 'USD', monthly: 100, annual: null, window: true,
    limits: '5x Pro usage, still 5-hour sessions and a weekly limit', source: CLAUDE_PRICING },
  { id: 'claude-team', provider: 'Claude', name: 'Claude Team Standard', currency: 'USD', monthly: 25, annual: 20, window: false,
    limits: 'Usage limits apply', source: CLAUDE_PRICING },
  { id: 'claude-team-premium', provider: 'Claude', name: 'Claude Team Premium', currency: 'USD', monthly: 125, annual: 100, window: false,
    limits: 'More usage than Standard; usage limits apply', source: CLAUDE_PRICING },
  { id: 'chatgpt-plus', provider: 'OpenAI', name: 'ChatGPT Plus', currency: 'AUD', monthly: 30, annual: null, window: false,
    limits: 'Limits apply', source: CHATGPT_PRICING },
  { id: 'chatgpt-business', provider: 'OpenAI', name: 'ChatGPT Business Standard', currency: 'AUD', monthly: 35, annual: 28, window: true,
    limits: 'OpenAI says only the Premium seat has no 5-hour limit', source: CHATGPT_PRICING },
  { id: 'chatgpt-business-premium', provider: 'OpenAI', name: 'ChatGPT Business Premium', currency: 'AUD', monthly: 175, annual: 140, window: false,
    limits: 'No 5-hour limit; unlimited subject to abuse guardrails', source: CHATGPT_PRICING },
];

// xAI's own pages did not show Grok subscription prices on CHECKED (the plans page needs a
// sign-in), so Grok appears in the API comparison only. Say so rather than use a third-party figure.
export const GROK_SEATS_NOTE = `Grok subscription prices are not shown: xAI's own pages did not list them when we checked on ${CHECKED}.`;

// API prices, US$ per million tokens, standard tier, short prompts, no caching or batch discount.
export const API_MODELS = [
  { id: 'claude-sonnet-5-5', provider: 'Claude', name: 'Claude Sonnet 5.5', input: 2, output: 10, source: CLAUDE_PRICING },
  { id: 'claude-fable-5-2', provider: 'Claude', name: 'Claude Fable 5.2', input: 8, output: 40, source: CLAUDE_PRICING },
  { id: 'gpt-6-2-sol', provider: 'OpenAI', name: 'OpenAI GPT-6.2 Sol', input: 2, output: 10, source: OPENAI_API },
  { id: 'gpt-6-2-astra', provider: 'OpenAI', name: 'OpenAI GPT-6.2 Astra', input: 8, output: 40, source: OPENAI_API },
  { id: 'grok-4-7', provider: 'xAI', name: 'xAI Grok 4.7', input: 2, output: 6, source: XAI_API },
];

// How much one person sends and gets back on a working day, in tokens (about 750 words per
// 1,000 tokens). Illustrative starting points; the visitor can type their own.
export const WORKLOADS = [
  { id: 'light', name: 'Light', detail: 'A few questions and short documents', input: 100000, output: 10000 },
  { id: 'steady', name: 'Steady', detail: 'Email, documents and research through the day', input: 500000, output: 50000 },
  { id: 'heavy', name: 'Heavy', detail: 'Agents working through files and tools', input: 3000000, output: 300000 },
];

export const PRESETS = [
  { id: 'one', name: '1 person, 1 Department', users: 1, departments: ['technical-support'] },
  { id: 'five', name: '5 people, 3 Departments', users: 5, departments: ['sales', 'service', 'finance'] },
  { id: 'ten', name: '10 people, 2 Departments', users: 10, departments: ['operations', 'projects'] },
];

// The business Departments a team can pick here (Personal and the add-on packs are not Departments).
export const DEPARTMENT_NAMES = {
  'technical-support': 'Technical Support', marketing: 'Marketing', finance: 'Finance', operations: 'Operations',
  projects: 'Projects', sales: 'Sales', service: 'Service', 'executive-leadership': 'Executive Leadership', hr: 'HR',
  'legal-compliance': 'Legal and Compliance', 'analytics-and-reporting': 'Analytics and Reporting', consulting: 'Consulting',
  'facilities-and-fleet': 'Facilities and Fleet', procurement: 'Procurement', 'work-health-and-safety': 'Work Health and Safety',
  'customer-success': 'Customer Success', cybersecurity: 'Cybersecurity', it: 'IT',
};

const num = (value, fallback = 0) => {
  const n = Number.parseFloat(String(value ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export const cleanUsers = (v) => clamp(Math.round(num(v, 1)), 1, 10000);
export const cleanRate = (v) => clamp(num(v, DEFAULT_AUD_PER_USD), 0.5, 5);
export const cleanTokens = (v) => clamp(Math.round(num(v)), 0, 1e9);

/** Departments that have a price, in the order of DEPARTMENT_NAMES. */
export function pricedDepartments(prices) {
  if (!prices) return [];
  return Object.keys(DEPARTMENT_NAMES).filter((slug) => typeof prices[slug] === 'number' && prices[slug] > 0)
    .map((slug) => ({ slug, name: DEPARTMENT_NAMES[slug], monthly: prices[slug] }));
}

/** Teracom AI a month, A$ ex GST: the Departments less the bundle discount, plus the base platform. */
export function teracomMonthly(slugs, prices) {
  if (!prices) return null;
  const unique = [...new Set(slugs)].filter((s) => DEPARTMENT_NAMES[s] && typeof prices[s] === 'number');
  const list = unique.reduce((sum, s) => sum + prices[s], 0);
  const discount = bundleDiscount(unique.length);
  return { departments: unique.length, list, discount, total: Math.round((list * (1 - discount) + basePlatform(prices)) * 100) / 100 };
}

/** A seat plan for the whole team a month, in A$. */
export function seatMonthly(plan, users, billing, audPerUsd) {
  const each = billing === 'annual' && plan.annual != null ? plan.annual : plan.monthly;
  const aud = plan.currency === 'USD' ? each * cleanRate(audPerUsd) : each;
  return Math.round(aud * cleanUsers(users) * 100) / 100;
}

/** An API model for the whole team a month, in A$. */
export function apiMonthly(model, users, inputPerDay, outputPerDay, audPerUsd, days = WORK_DAYS_PER_MONTH) {
  const usd = (cleanTokens(inputPerDay) / 1e6) * model.input + (cleanTokens(outputPerDay) / 1e6) * model.output;
  return Math.round(usd * cleanRate(audPerUsd) * cleanUsers(users) * days * 100) / 100;
}

/**
 * A 10-hour working day on a plan with a 5-hour window. hoursPerWindow is how long heavy work
 * lasts before the limit (the visitor's own estimate; Anthropic and OpenAI publish no hours).
 * Returns the stretches of the day as [{ from, to, kind: 'work' | 'wait' }] and the hours worked.
 */
export function windowDay(hoursPerWindow, dayHours = 10, windowHours = 5) {
  const h = clamp(num(hoursPerWindow, 2), 0.25, windowHours);
  const parts = [];
  let worked = 0;
  for (let start = 0; start < dayHours; start += windowHours) {
    const workEnd = Math.min(start + h, dayHours);
    parts.push({ from: start, to: workEnd, kind: 'work' });
    worked += workEnd - start;
    const waitEnd = Math.min(start + windowHours, dayHours);
    if (waitEnd > workEnd) parts.push({ from: workEnd, to: waitEnd, kind: 'wait' });
  }
  return { parts, worked: Math.round(worked * 100) / 100, waiting: Math.round((dayHours - worked) * 100) / 100 };
}

export const aud = (n) => `A$${(Math.round(n * 100) / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const tokens = (n) => (n >= 1e6 ? `${(n / 1e6).toLocaleString('en-AU', { maximumFractionDigits: 2 })}M` : `${Math.round(n / 1000).toLocaleString('en-AU')}k`);
