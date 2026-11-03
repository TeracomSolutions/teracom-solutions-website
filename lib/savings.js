// Selling Teracom AI on savings (Robert, 3 November 2026; teracom-ai-docs
// Workstreams/WEBSITE_VALUE_AND_SAVINGS_V1.md): "Do you want to save $250,000 a year?
// Here are your options." Every figure is the visitor's own input or labelled
// illustrative; nothing here is a fact about anyone's business, and nothing is
// guaranteed. Pure, with relative imports, so the plain Node test runner can load it.

// DRAFTS: the savings page and the Department pages stay hidden (404 without
// ?preview=1, never indexed) until Robert approves the wording.
export const SAVINGS_PAGES_LIVE = false;
// Prices stay hidden everywhere until Robert approves publishing them.
export const PRICES_PUBLISHED = false;

export const canShowSavingsDraft = (preview) => SAVINGS_PAGES_LIVE || preview === '1';

export const DISCLAIMER = 'Estimates only. Your results depend on your business.';
export const ILLUSTRATIVE = 'Illustrative, change it to match your business.';
// Said next to every headline figure, not only in small print (Australian Consumer Law: a
// qualification has to be as prominent as the claim it qualifies).
export const NOT_MEASURED = 'Every figure here is either yours or an example. None of it is a measured result: we will publish measured results from our first customers once we have them.';
// Teracom AI Departments are in early access (production readiness is not finished), so
// the pages never imply they can be bought and used today.
export const AVAILABILITY = 'Teracom AI Departments are in early access. Register your interest to take part.';
export const GST_RATE = 0.1;

// The starting figures in the calculator, every one labelled illustrative on screen.
export const DEFAULTS = { teamSize: 10, costPerPerson: 100000, sharePercent: 30 };

const num = (value, fallback = 0) => {
  const n = Number.parseFloat(String(value ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** One Department's yearly saving: team size x cost of one person x share handed over. */
export function rowSaving({ teamSize, costPerPerson, sharePercent }) {
  const team = clamp(num(teamSize), 0, 100000);
  const cost = clamp(num(costPerPerson), 0, 10000000);
  const share = clamp(num(sharePercent), 0, 100);
  const people = (team * share) / 100;
  return { team, cost, share, people, saving: Math.round(people * cost) };
}

export const money = (n) => `A$${Math.round(n).toLocaleString('en-AU')}`;
const peopleText = (p) => `${Number.isInteger(p) ? p : p.toFixed(1)} ${p === 1 ? 'person' : 'people'}`;

/** The working shown under a result: "10 people x 30% = 3 people x A$100,000 = A$300,000 a year". */
export function arithmetic(row) {
  const r = rowSaving(row);
  return `${peopleText(r.team)} x ${r.share}% = ${peopleText(r.people)} x ${money(r.cost)} = ${money(r.saving)} a year`;
}

// Bundle discounts from the pricing model (version 2): 3 to 5 Departments 10% off,
// 6 to 9 15%, 10 or more 20%.
export function bundleDiscount(count) {
  if (count >= 10) return 0.2;
  if (count >= 6) return 0.15;
  if (count >= 3) return 0.1;
  return 0;
}

/**
 * What the chosen Departments cost a year, ex GST, and what is left of the saving.
 * prices: { slug: monthly A$ } or null while prices are not published (then cost is null).
 */
export function costAndNet(slugs, saving, prices) {
  if (!prices) return { yearlyCost: null, net: null, paybackMonths: null, discount: 0 };
  const unique = [...new Set(slugs.filter((s) => prices[s] != null))];
  const list = unique.reduce((sum, s) => sum + prices[s], 0) * 12;
  const discount = bundleDiscount(unique.length);
  const yearlyCost = Math.round(list * (1 - discount));
  const net = saving - yearlyCost;
  const paybackMonths = saving > 0 ? Math.round((yearlyCost / (saving / 12)) * 10) / 10 : null;
  return { yearlyCost, net, paybackMonths, discount };
}

/**
 * Savings goals, each with two or three illustrative ways to reach it, for a business of a
 * stated size at A$100,000 a person. The arithmetic is shown with every option.
 */
export const GOALS = [
  {
    target: 250000,
    title: 'Reaching A$250,000 a year',
    options: [
      { title: 'If Finance took on half the work of a finance team of five', business: 'For example, a business with a finance team of five', rows: [{ department: 'finance', name: 'Finance', teamSize: 5, sharePercent: 50 }] },
      { title: 'If Technical Support took on a quarter of the support team\'s work', business: 'For example, a business with a support team of ten', rows: [{ department: 'technical-support', name: 'Technical Support', teamSize: 10, sharePercent: 25 }] },
      {
        title: 'If Sales and Service each took on a quarter of the work',
        business: 'For example, a business with four in sales and six in service',
        rows: [
          { department: 'sales', name: 'Sales', teamSize: 4, sharePercent: 25 },
          { department: 'service', name: 'Service', teamSize: 6, sharePercent: 25 },
        ],
      },
    ],
  },
  {
    target: 500000,
    title: 'Reaching A$500,000 a year',
    options: [
      { title: 'If Finance took on half the work of a finance team of ten', business: 'For example, a business with a finance team of ten', rows: [{ department: 'finance', name: 'Finance', teamSize: 10, sharePercent: 50 }] },
      {
        title: 'If Operations and Service each took on half the work',
        business: 'For example, a business with six in operations and four in service',
        rows: [
          { department: 'operations', name: 'Operations', teamSize: 6, sharePercent: 50 },
          { department: 'service', name: 'Service', teamSize: 4, sharePercent: 50 },
        ],
      },
      {
        title: 'If Finance, HR and Executive Leadership shared the back-office work',
        business: 'For example, a business with six in finance, two in HR and four in leadership support',
        rows: [
          { department: 'finance', name: 'Finance', teamSize: 6, sharePercent: 50 },
          { department: 'hr', name: 'HR', teamSize: 2, sharePercent: 50 },
          { department: 'executive-leadership', name: 'Executive Leadership', teamSize: 4, sharePercent: 25 },
        ],
      },
    ],
  },
  {
    target: 1000000,
    title: 'Reaching A$1 million a year',
    options: [
      {
        title: 'If Finance, Operations and HR each took on half the work',
        business: 'For example, a business with ten in finance, six in operations and four in HR',
        rows: [
          { department: 'finance', name: 'Finance', teamSize: 10, sharePercent: 50 },
          { department: 'operations', name: 'Operations', teamSize: 6, sharePercent: 50 },
          { department: 'hr', name: 'HR', teamSize: 4, sharePercent: 50 },
        ],
      },
      {
        title: 'If the customer-facing teams each handed over a quarter of their work',
        business: 'For example, a business with twenty in support, eight in service and twelve in sales',
        rows: [
          { department: 'technical-support', name: 'Technical Support', teamSize: 20, sharePercent: 25 },
          { department: 'service', name: 'Service', teamSize: 8, sharePercent: 25 },
          { department: 'sales', name: 'Sales', teamSize: 12, sharePercent: 25 },
        ],
      },
    ],
  },
];

/** A goal option's total: people handed over and the saving, at the given cost of one person. */
export function optionTotal(option, costPerPerson = DEFAULTS.costPerPerson) {
  const rows = option.rows.map((r) => ({ ...r, ...rowSaving({ ...r, costPerPerson }) }));
  return { rows, people: rows.reduce((s, r) => s + r.people, 0), saving: rows.reduce((s, r) => s + r.saving, 0) };
}

// Department pages ready as drafts; the rest follow once Robert approves the wording.
export const DRAFT_DEPARTMENT_PAGES = ['finance'];
