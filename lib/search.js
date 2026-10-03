import { services } from './services.js';
import { brands } from './brands.js';
import { tools } from './tools.js';
import { productPath, products } from './products.js';
import { categories } from './categories.js';
import { aiCapabilities } from './aiCapabilities.js';
import { resourcesSections } from './resourcesSections.js';
import { helpCenterTopics } from './helpCenterTopics.js';

// Site search for /search. Everything is built from the same data files the
// pages render from, so a new service, brand, product or tool is searchable
// as soon as it exists -- nothing to keep in sync by hand. Products come
// from the live store catalogue the search page passes in (every product
// put live, searchable by name, part number, maker's part number or brand);
// without one, the built-in product list is used.

export const SEARCH_TYPES = {
  page: 'Pages',
  service: 'Services',
  product: 'Products',
  category: 'Store categories',
  brand: 'Brands',
  tool: 'Free tools',
  ai: 'Teracom AI',
  resource: 'Resources',
  help: 'Help centre',
};

const PAGES = [
  { title: 'Home', href: '/', description: 'Teracom Solutions -- technology, security and AI solutions.', keywords: 'teracom solutions homepage' },
  { title: 'Technology services', href: '/services', description: 'Every service we offer, from design and installation to software and support.', keywords: 'what we do services installation install' },
  { title: 'Teracom AI', href: '/securityos-ai', description: 'The AI operating system for modern organisations.', keywords: 'ai artificial intelligence platform securityos ask tera' },
  { title: 'Brands', href: '/brands', description: 'The manufacturers we supply, install and support.', keywords: 'manufacturers partners vendors' },
  { title: 'Teracom Store', href: '/store', description: 'Products, software, resources and Teracom AI subscriptions.', keywords: 'shop buy prices pricing store products order' },
  { title: 'Free tools', href: '/tools', description: 'Free calculators for engineers, technicians, installers and AV specialists.', keywords: 'calculators calculator tools' },
  { title: 'Resources', href: '/resources', description: 'Help centre, manuals, datasheets, videos and downloads.', keywords: 'documentation support help library' },
  { title: 'About Teracom Solutions', href: '/about', description: 'Who we are, our showroom and opening hours.', keywords: 'about company team history showroom hours' },
  { title: 'Contact us', href: '/contact', description: 'Phone, email, showroom address and enquiry form.', keywords: 'contact phone email address location map enquiry quote call showroom carrum downs' },
  { title: 'Warranty & returns', href: '/warranty', description: 'How to return a product, and manufacturer warranties by brand.', keywords: 'warranty returns return rma repair faulty refund' },
  { title: 'Your cart', href: '/cart', description: 'Review your cart and check out.', keywords: 'cart basket checkout' },
  { title: 'Sign in', href: '/account/login', description: 'Sign in to your Teracom account for member pricing.', keywords: 'login log in account sign in member' },
  { title: 'Create an account', href: '/account/signup', description: 'Create a free account for member pricing.', keywords: 'register sign up signup account member pricing' },
  { title: 'Privacy policy', href: '/privacy', description: 'How we handle personal information.', keywords: 'privacy personal information cookies data' },
  { title: 'Terms & conditions', href: '/terms', description: 'Terms and conditions of trade.', keywords: 'terms conditions legal trade' },
];

// Everyday words people type that the official names don't contain.
const SYNONYMS = {
  cctv: 'camera cameras surveillance video',
  'access-control': 'door doors card cards reader readers fob fobs swipe',
  'intrusion-alarms': 'alarm alarms burglar sensor sensors',
  intrusion: 'alarm alarms burglar sensor sensors',
  intercoms: 'doorbell door bell',
  networking: 'wifi wi fi network switch switches router routers',
  'audio-visual': 'av speakers speaker projector screen tv sound',
  audio: 'speakers speaker sound amplifier',
  electrical: 'electrician wiring power',
  automation: 'smart home zwave z wave',
  zwave: 'smart home z wave',
  ups: 'battery backup',
  'maintenance-support': 'service repair fix faulty',
};

// Services and things people buy rank above help articles for the same word.
const TYPE_BOOST = { service: 1.3, product: 1.2, category: 1.2, tool: 1.2, brand: 1.2, page: 1.2, ai: 1, resource: 1, help: 0.35 };

function buildIndex() {
  const items = [];
  const add = (type, title, href, description, keywords = '', body = '') =>
    items.push({ type, title, href, description, keywords, body });

  PAGES.forEach((p) => add('page', p.title, p.href, p.description, p.keywords));
  services.forEach((s) =>
    add(
      'service',
      s.title,
      `/services/${s.slug}`,
      s.lead,
      `${(s.tags || []).join(' ')} ${SYNONYMS[s.slug] || ''}`,
      `${s.description} ${s.includes.join(' ')}`
    )
  );
  categories.forEach((c) => add('category', c.title, `/store/${c.slug}`, c.description, `shop buy ${SYNONYMS[c.slug] || ''}`));
  brands.forEach((b) => add('brand', b.name, `/brands/${b.slug}`, b.tagline, '', (b.body || '').slice(0, 600)));
  tools.forEach((t) => add('tool', t.title, `/tools/${t.slug}`, t.description, 'calculator', t.howItWorks || ''));
  aiCapabilities.forEach((a) => add('ai', a.title, `/securityos-ai/${a.slug}`, a.summary, 'teracom ai', a.description || ''));
  resourcesSections.forEach((r) => add('resource', r.title, `/resources/${r.slug}`, r.description));
  // One result per help topic; its questions and answers are searchable text.
  helpCenterTopics.forEach((t) => {
    const faqs = (t.faqs || []).map((f) => `${f.q} ${f.a}`).join(' ');
    add('help', t.title, `/resources/help-centre#${t.slug}`, t.intro.split('\n')[0],'help faq explained', `${t.intro} ${faqs}`);
  });
  return items.map(withNormalised);
}

function withNormalised(item) {
  return {
    ...item,
    n: {
      title: normalise(item.title),
      keywords: normalise(item.keywords),
      description: normalise(item.description || ''),
      body: normalise(item.body),
      codes: (item.codes || []).filter(Boolean).map((code) => normalise(code).trim()),
    },
  };
}

// One search item per product, found by name, our part number, the maker's
// part number, brand or category, and linking to its own page.
function productItem(p) {
  return {
    type: 'product',
    title: p.name,
    href: productPath(p),
    description: String(p.description || '').slice(0, 300),
    keywords: `${p.category || ''} ${p.sku || ''} ${p.manufacturerSku || ''} ${p.brand || ''}`,
    body: (p.features || []).join(' '),
    // Typing a part number should bring that product first, ahead of
    // accessories that mention it.
    codes: [p.sku, p.manufacturerSku],
  };
}

// The store catalogue is the same list for minutes at a time, so its index
// is built once per list rather than once per search.
const PRODUCT_INDEXES = new WeakMap();

function productIndexFor(list) {
  if (!PRODUCT_INDEXES.has(list)) PRODUCT_INDEXES.set(list, list.map((p) => withNormalised(productItem(p))));
  return PRODUCT_INDEXES.get(list);
}

// A search like "ubiquiti" matches hundreds of products; the rest of the
// site keeps its place in the results.
const PRODUCT_LIMIT = 30;

const STOPWORDS = new Set(['a', 'an', 'and', 'the', 'for', 'of', 'to', 'in', 'on', 'with', 'my', 'i', 'how', 'do', 'is', 'what', 'can', 'you']);

export function normalise(text) {
  return ` ${String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()} `;
}

export function queryTokens(query) {
  return normalise(query)
    .trim()
    .split(' ')
    .filter((t) => t && !STOPWORDS.has(t))
    .map((t) => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t));
}

const FIELDS = [
  ['title', 10],
  ['keywords', 8],
  ['description', 3],
  ['body', 1],
];

let INDEX;

// Every query word has to appear (as the start of a word) somewhere in the
// item; the best field it appears in sets its weight. Whole-phrase and exact
// title matches rank first.
export function searchSite(query, { limit = 60, products: catalogue = products } = {}) {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];
  INDEX ||= buildIndex();
  const phrase = normalise(query).trim();
  const results = [];
  for (const item of [...INDEX, ...productIndexFor(catalogue)]) {
    let score = 0;
    let matchedAll = true;
    for (const token of tokens) {
      let best = 0;
      for (const [field, weight] of FIELDS) {
        if (item.n[field].includes(` ${token}`) && weight > best) best = weight;
      }
      if (!best) {
        matchedAll = false;
        break;
      }
      score += best;
    }
    if (!matchedAll) continue;
    const title = item.n.title.trim();
    if (title === phrase) score += 40;
    else if (phrase.length > 2 && title.includes(phrase)) score += 15;
    const codes = item.n.codes || [];
    if (codes.some((code) => code === phrase || code.endsWith(` ${phrase}`))) score += 40;
    else if (codes.some((code) => ` ${code} `.includes(` ${phrase} `))) score += 20;
    score = Math.round(score * (TYPE_BOOST[item.type] || 1) * 10) / 10;
    results.push({ type: item.type, title: item.title, href: item.href, description: item.description, score });
  }
  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  let productCount = 0;
  return results.filter((r) => r.type !== 'product' || ++productCount <= PRODUCT_LIMIT).slice(0, limit);
}

// Results grouped by type, groups ordered by their best match.
export function groupResults(results) {
  const groups = new Map();
  for (const r of results) {
    if (!groups.has(r.type)) groups.set(r.type, []);
    groups.get(r.type).push(r);
  }
  return [...groups.entries()].map(([type, items]) => ({ type, label: SEARCH_TYPES[type], items }));
}
