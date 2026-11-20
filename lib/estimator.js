// Estimator (Robert, 20 November 2026): a signed-in customer estimates a job from the
// store's own products plus their labour, then drafts a proposal from it. Materials can
// only be products from the website: the server prices every product line from the
// catalogue at this customer's price whenever the estimate is saved
// (lib/estimatorPricing.js). Store prices include GST; the estimate works ex GST and adds
// GST at the end.
//
// Everything here is plain data in and out, so it is unit-tested; the browser parts are
// components/tools/Estimator*.js.

export const ESTIMATE_FORMAT = 'teracom-estimate';
export const ESTIMATE_VERSION = 1;
export const DRAFT_KEY = 'teracom-estimator-draft';
export const GST_RATE = 0.1;
export const MAX_SECTIONS = 40;
export const MAX_LINES = 150;
export const MAX_QTY = 99999;
export const MAX_HOURS = 9999;
export const MAX_MARKUP = 500;

const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;
export const text = (value, max = 200) => String(value ?? '').replace(CONTROL, '').slice(0, max);
const num = (value, min, max, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const cents = (value) => Math.round(num(value, 0, 1e11));
const optionalPct = (value) => (value === null || value === undefined || value === '' ? null : num(value, 0, MAX_MARKUP));

export function newId(taken = []) {
  let id;
  do {
    id = Math.random().toString(36).slice(2, 10).padEnd(8, '0');
  } while (taken.includes(id));
  return id;
}

// The proposal starts with general wording the customer edits to suit; it is theirs, not ours.
export const DEFAULT_PROPOSAL = {
  intro: 'Thank you for the opportunity to quote. This proposal sets out the work we will carry out, what is included and the price.',
  scope: '',
  inclusions: [
    'Supply of the equipment listed',
    'Installation, cabling and terminations as described',
    'Programming, testing and commissioning',
    'Handover and basic user training',
    'Removal of our packaging and rubbish from site',
  ].join('\n'),
  exclusions: [
    'Work outside normal business hours unless stated',
    'Patching, painting and making good beyond our own work',
    'Electrical work by a licensed electrician unless stated',
    'Lifts, scissor lifts or scaffolding unless stated',
    'Asbestos or other hazardous material',
    'Any work not listed in this proposal',
  ].join('\n'),
  terms: 'Prices are in Australian dollars and include GST where shown. Equipment remains our property until paid in full. Variations to the scope are quoted separately before work goes ahead.',
  payment: '50% deposit on acceptance, balance on completion.',
  showLinePrices: false,
};

export function emptyEstimate(now = new Date().toISOString(), business = {}) {
  return {
    format: ESTIMATE_FORMAT,
    version: ESTIMATE_VERSION,
    name: '',
    reference: '',
    site: '',
    date: now.slice(0, 10),
    validDays: 30,
    client: { name: '', company: '', email: '', phone: '', address: '' },
    business: { name: '', abn: '', licence: '', phone: '', email: '', address: '', ...cleanParty(business, BUSINESS_FIELDS) },
    settings: { labourRateCents: 0, markupPct: 0 },
    sections: [{ id: newId(), title: 'Equipment and installation', lines: [] }],
    proposal: { ...DEFAULT_PROPOSAL },
    updatedAt: now,
  };
}

const CLIENT_FIELDS = ['name', 'company', 'email', 'phone', 'address'];
const BUSINESS_FIELDS = ['name', 'abn', 'licence', 'phone', 'email', 'address'];

function cleanParty(raw, fields) {
  const out = {};
  for (const field of fields) out[field] = text(raw?.[field], field === 'address' ? 300 : 120);
  return out;
}

export function cleanLine(raw, taken = []) {
  const id = typeof raw?.id === 'string' && /^[a-z0-9]{4,12}$/.test(raw.id) && !taken.includes(raw.id) ? raw.id : newId(taken);
  if (raw?.type === 'labour') {
    return {
      id,
      type: 'labour',
      description: text(raw.description, 300),
      hours: Math.round(num(raw.hours, 0, MAX_HOURS) * 100) / 100,
      // null: the estimate's own labour rate
      rateCents: raw.rateCents === null || raw.rateCents === undefined || raw.rateCents === '' ? null : cents(raw.rateCents),
    };
  }
  if (raw?.type !== 'product' || !raw.productId) return null;
  return {
    id,
    type: 'product',
    productId: text(raw.productId, 120),
    sku: text(raw.sku, 60),
    name: text(raw.name, 300),
    brand: text(raw.brand, 80),
    href: typeof raw.href === 'string' && raw.href.startsWith('/') ? text(raw.href, 300) : '',
    qty: Math.round(num(raw.qty, 0, MAX_QTY, 1)),
    // The store price inc GST at this customer's price, set by the server from the catalogue.
    unitCents: raw.unitCents === null || raw.unitCents === undefined ? null : cents(raw.unitCents),
    markupPct: optionalPct(raw.markupPct),
    unavailable: raw.unavailable === true,
  };
}

/** Any stored or sent estimate back into the shape the Estimator uses; anything unknown is dropped. */
export function cleanEstimate(raw, now = new Date().toISOString()) {
  const base = emptyEstimate(now);
  if (!raw || typeof raw !== 'object') return base;
  const sectionIds = [];
  const lineIds = [];
  const sections = (Array.isArray(raw.sections) ? raw.sections : []).slice(0, MAX_SECTIONS).map((section) => {
    const id = typeof section?.id === 'string' && /^[a-z0-9]{4,12}$/.test(section.id) && !sectionIds.includes(section.id) ? section.id : newId(sectionIds);
    sectionIds.push(id);
    const lines = [];
    for (const rawLine of (Array.isArray(section?.lines) ? section.lines : []).slice(0, MAX_LINES)) {
      const line = cleanLine(rawLine, lineIds);
      if (!line) continue;
      lineIds.push(line.id);
      lines.push(line);
    }
    return { id, title: text(section?.title, 120), lines };
  });
  const proposal = raw.proposal && typeof raw.proposal === 'object' ? raw.proposal : {};
  return {
    ...base,
    name: text(raw.name, 200),
    reference: text(raw.reference, 60),
    site: text(raw.site, 300),
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(raw.date || '')) ? raw.date : base.date,
    validDays: Math.round(num(raw.validDays, 1, 365, 30)),
    client: cleanParty(raw.client, CLIENT_FIELDS),
    business: cleanParty(raw.business, BUSINESS_FIELDS),
    settings: {
      labourRateCents: cents(raw.settings?.labourRateCents),
      markupPct: num(raw.settings?.markupPct, 0, MAX_MARKUP),
    },
    sections: sections.length ? sections : base.sections,
    proposal: {
      intro: text(proposal.intro ?? base.proposal.intro, 3000),
      scope: text(proposal.scope ?? '', 8000),
      inclusions: text(proposal.inclusions ?? base.proposal.inclusions, 4000),
      exclusions: text(proposal.exclusions ?? base.proposal.exclusions, 4000),
      terms: text(proposal.terms ?? base.proposal.terms, 4000),
      payment: text(proposal.payment ?? base.proposal.payment, 1000),
      showLinePrices: proposal.showLinePrices === true,
    },
    updatedAt: typeof raw.updatedAt === 'string' ? text(raw.updatedAt, 40) : now,
  };
}

export const exGst = (incCents) => Math.round(incCents / (1 + GST_RATE));

/** One line's figures, all ex GST: what it costs the customer, and what they charge for it. */
export function lineFigures(line, settings) {
  if (line.type === 'labour') {
    const rate = line.rateCents ?? settings.labourRateCents ?? 0;
    const sell = Math.round(rate * line.hours);
    return { costCents: 0, sellCents: sell, unitSellCents: rate, priced: true };
  }
  if (typeof line.unitCents !== 'number') return { costCents: 0, sellCents: 0, unitSellCents: 0, priced: false };
  const unitCost = exGst(line.unitCents);
  const markup = line.markupPct ?? settings.markupPct ?? 0;
  const unitSell = Math.round(unitCost * (1 + markup / 100));
  return { costCents: unitCost * line.qty, sellCents: unitSell * line.qty, unitSellCents: unitSell, priced: true };
}

export function sectionTotals(section, settings) {
  const out = { materialsCostCents: 0, materialsSellCents: 0, labourCents: 0, labourHours: 0, unpriced: 0 };
  for (const line of section.lines) {
    const f = lineFigures(line, settings);
    if (line.type === 'labour') {
      out.labourCents += f.sellCents;
      out.labourHours += line.hours;
    } else if (f.priced) {
      out.materialsCostCents += f.costCents;
      out.materialsSellCents += f.sellCents;
    } else if (line.qty > 0) out.unpriced += 1;
  }
  out.sellCents = out.materialsSellCents + out.labourCents;
  return out;
}

/** The whole estimate's totals; snake_case so the backend can read total_cents for the saved list. */
export function estimateTotals(estimate) {
  const t = { materials_cost_cents: 0, materials_sell_cents: 0, labour_cents: 0, labour_hours: 0, unpriced: 0 };
  for (const section of estimate.sections) {
    const s = sectionTotals(section, estimate.settings);
    t.materials_cost_cents += s.materialsCostCents;
    t.materials_sell_cents += s.materialsSellCents;
    t.labour_cents += s.labourCents;
    t.labour_hours += s.labourHours;
    t.unpriced += s.unpriced;
  }
  t.subtotal_cents = t.materials_sell_cents + t.labour_cents;
  t.gst_cents = Math.round(t.subtotal_cents * GST_RATE);
  t.total_cents = t.subtotal_cents + t.gst_cents;
  t.materials_margin_cents = t.materials_sell_cents - t.materials_cost_cents;
  t.labour_hours = Math.round(t.labour_hours * 100) / 100;
  return t;
}

/** The estimate as it is saved: cleaned, with its totals. */
export function forSaving(estimate, now = new Date().toISOString()) {
  const clean = cleanEstimate({ ...estimate, updatedAt: now }, now);
  return { ...clean, totals: estimateTotals(clean) };
}

/** Every store product in the estimate with its total quantity, for the cart or a quote. */
export function materialsList(estimate) {
  const byId = new Map();
  for (const section of estimate.sections) {
    for (const line of section.lines) {
      if (line.type !== 'product' || line.qty <= 0) continue;
      const seen = byId.get(line.productId);
      if (seen) seen.qty += line.qty;
      else byId.set(line.productId, { productId: line.productId, sku: line.sku, name: line.name, qty: line.qty, unavailable: line.unavailable });
    }
  }
  return [...byId.values()];
}

export function money(centsValue, { dp = 2 } = {}) {
  const n = (Number(centsValue) || 0) / 100;
  return n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: dp, maximumFractionDigits: dp });
}

export function validUntil(estimate) {
  const d = new Date(`${estimate.date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  d.setUTCDate(d.getUTCDate() + estimate.validDays);
  return d.toISOString().slice(0, 10);
}

export function displayDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Non-empty lines of a text box, for inclusions and exclusions. */
export const listLines = (value) => String(value || '').split(/\r?\n/).map((s) => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);

/** A materials-only CSV the customer can keep (their prices, ex GST). */
export function estimateCsv(estimate) {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['Section', 'Type', 'Part number', 'Description', 'Qty / hours', 'Your cost ex GST', 'Sell ex GST', 'Line sell ex GST']];
  for (const section of estimate.sections) {
    for (const line of section.lines) {
      const f = lineFigures(line, estimate.settings);
      const unitCost = line.type === 'product' && typeof line.unitCents === 'number' ? exGst(line.unitCents) : '';
      rows.push([
        section.title,
        line.type === 'labour' ? 'Labour' : 'Material',
        line.type === 'product' ? line.sku : '',
        line.type === 'product' ? line.name : line.description,
        line.type === 'labour' ? line.hours : line.qty,
        unitCost === '' ? '' : (unitCost / 100).toFixed(2),
        (f.unitSellCents / 100).toFixed(2),
        (f.sellCents / 100).toFixed(2),
      ]);
    }
  }
  const t = estimateTotals(estimate);
  rows.push([], ['', '', '', 'Subtotal ex GST', '', '', '', (t.subtotal_cents / 100).toFixed(2)]);
  rows.push(['', '', '', 'GST', '', '', '', (t.gst_cents / 100).toFixed(2)]);
  rows.push(['', '', '', 'Total inc GST', '', '', '', (t.total_cents / 100).toFixed(2)]);
  return rows.map((r) => r.map(q).join(',')).join('\r\n');
}
