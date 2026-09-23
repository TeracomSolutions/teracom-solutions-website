// Industry headlines for /resources/industry-news, from one trade publication
// per industry (RSS). Only the headline, date, link and a short preview of the
// feed's own summary are shown -- every article opens on the publisher's site.

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * Decode HTML entities in one pass (so "&amp;#8217;" stays literal rather than
 * being decoded twice).
 */
function decodeHtmlEntities(str) {
  if (!str) return str;
  return str.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      if (n === 160) return ' ';
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    const named = NAMED_ENTITIES[code.toLowerCase()];
    return named === undefined ? match : named;
  });
}

function stripCdata(value) {
  const trimmed = value.trim();
  return trimmed.startsWith('<![CDATA[') && trimmed.endsWith(']]>') ? trimmed.slice(9, -3) : trimmed;
}

function readTag(itemXml, tag) {
  const match = itemXml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  return match ? stripCdata(match[1]) : '';
}

function readAllTags(itemXml, tag) {
  return [...itemXml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) =>
    decodeHtmlEntities(stripCdata(m[1])).trim()
  );
}

const EXCERPT_MAX = 200;

/**
 * Turn a feed <description> into a short plain-text preview: first real
 * paragraph only (the WordPress "The post ... appeared first on" footer is
 * dropped), tags stripped, the trailing "[…]" removed, then cut to ~200
 * characters. stripLeadDash drops SEN's repeated headline before the first
 * " – "; other publishers don't do that, so it is off for them.
 */
export function toExcerpt(description, { stripLeadDash = true } = {}) {
  if (!description) return '';
  let html = stripCdata(description);
  const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi);
  if (paragraphs) {
    html = paragraphs.find((p) => !/appeared first on/i.test(p) && p.replace(/<[^>]*>/g, '').trim()) || '';
  } else {
    html = html.split(/The post /i)[0];
  }

  let text = decodeHtmlEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
  text = text.replace(/\s*\[(?:…|\.\.\.)\]\s*$/, '').trim();

  if (stripLeadDash) {
    const dash = text.indexOf(' – ');
    if (dash !== -1 && dash < 250) {
      text = text.slice(dash + 3).trim();
    }
  }

  if (text.length > EXCERPT_MAX) {
    const cut = text.lastIndexOf(' ', EXCERPT_MAX);
    text = `${text.slice(0, cut > 0 ? cut : EXCERPT_MAX).replace(/[\s,;:.–-]+$/, '')}…`;
  }
  return text;
}

/**
 * Parse RSS <item>s into { title, link, date, excerpt }. Only https links on
 * allowedHost (or its subdomains) are kept; items in excludeCategories or whose
 * title matches excludeTitle are skipped.
 */
// Anything that is plainly not the article's photo: tracking pixels,
// spacers, sharing icons and author avatars all turn up in feed markup.
const NOT_AN_ARTICLE_IMAGE = /feedburner|gravatar|avatar|pixel|spacer|blank|1x1|icon|logo|badge|emoji/i;
const IMAGE_EXTENSION = /\.(jpe?g|png|webp|avif|gif)(?:$|\?)/i;

/**
 * The story's own picture. Publishers put it in one of three places and none
 * of them agree: <media:content>/<media:thumbnail> (the RSS media extension),
 * <enclosure type="image/..."> (ARN), or simply the first <img> inside the
 * article body (SEN, Connected Magazine, Electrical Connection). Tried in
 * that order, because the first two are declared as the article image while
 * the third is a guess that happens to be right most of the time.
 */
function readItemImage(itemXml, decode) {
  const candidates = [];

  for (const pattern of [/<media:(?:content|thumbnail)\b[^>]*>/gi, /<enclosure\b[^>]*>/gi]) {
    let match;
    while ((match = pattern.exec(itemXml)) !== null) {
      const tag = match[0];
      // A declared type or medium that isn't an image rules the tag out; an
      // undeclared one is left in, since some feeds omit both.
      if (/\btype=["'][^"']+["']/i.test(tag) && !/\btype=["']image\//i.test(tag)) continue;
      if (/\bmedium=["'][^"']+["']/i.test(tag) && !/\bmedium=["']image["']/i.test(tag)) continue;
      const url = /\b(?:url|src)=["']([^"']+)["']/i.exec(tag);
      if (url) candidates.push(url[1]);
    }
  }

  const inline = /<img\b[^>]*\bsrc=["']([^"']+)["']/i.exec(itemXml);
  if (inline) candidates.push(inline[1]);

  for (const candidate of candidates) {
    // Feeds escape the query string ("?quality=50&#038;strip=all"), so the
    // URL has to be decoded before it will load.
    const url = decode(candidate).trim();
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      continue;
    }
    // http images would be blocked as mixed content on an https page.
    if (parsed.protocol !== 'https:') continue;
    if (NOT_AN_ARTICLE_IMAGE.test(parsed.pathname)) continue;
    if (!IMAGE_EXTENSION.test(parsed.pathname)) continue;
    return url;
  }

  return null;
}

export function parseRssItems(
  xml,
  {
    allowedHost = 'sen.news',
    limit = 12,
    excludeCategories = [],
    excludeTitle = null,
    stripLeadDash = true,
    decodeTwice = false,
  } = {}
) {
  // Some feeds (ECD) encode entities twice ("&amp;#39;"); decode those twice.
  const decode = decodeTwice ? (s) => decodeHtmlEntities(decodeHtmlEntities(s)) : decodeHtmlEntities;
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const excluded = new Set(excludeCategories.map((c) => c.toLowerCase()));
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const itemXml = match[1];
    const title = decode(readTag(itemXml, 'title')).trim();
    const link = readTag(itemXml, 'link').trim();
    const pubDate = readTag(itemXml, 'pubDate');

    let url;
    try {
      url = new URL(link);
    } catch {
      continue;
    }
    const hostOk = url.hostname === allowedHost || url.hostname.endsWith(`.${allowedHost}`);
    if (url.protocol !== 'https:' || !hostOk || !title) continue;
    if (excludeTitle && excludeTitle.test(title)) continue;
    if (excluded.size && readAllTags(itemXml, 'category').some((c) => excluded.has(c.toLowerCase()))) continue;

    const parsedDate = new Date(pubDate);
    items.push({
      title,
      link,
      date: Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString(),
      excerpt: toExcerpt(decodeTwice ? decodeHtmlEntities(readTag(itemXml, 'description')) : readTag(itemXml, 'description'), {
        stripLeadDash,
      }),
      imageUrl: readItemImage(itemXml, decode),
    });
  }

  return items;
}

// One go-to trade publication per industry, researched and checked on
// 2026-09-22 (feeds valid and current). SEN.news is the original security
// source; the rest widen the page into a cross-industry snapshot.
export const NEWS_SOURCES = [
  { id: 'security', label: 'Security', source: 'SEN.news', site: 'https://sen.news', feed: 'https://sen.news/feed/', host: 'sen.news', stripLeadDash: true },
  // Electrical Connection's firewall rejects cloud servers (403 from Vercel);
  // ECD is the fallback when it does.
  {
    id: 'electrical',
    label: 'Electrical',
    source: 'Electrical Connection',
    site: 'https://electricalconnection.com.au',
    feed: 'https://electricalconnection.com.au/feed/',
    host: 'electricalconnection.com.au',
    excludeCategories: ['Transport', 'Contributors'],
    fallback: { source: 'ECD', site: 'https://www.ecdonline.com.au', feed: 'https://www.ecdonline.com.au/feed.rss', host: 'ecdonline.com.au', decodeTwice: true, excludeTitle: /^\[?(white paper|sponsored)/i },
  },
  { id: 'plumbing', label: 'Plumbing', source: 'Plumbing Connection', site: 'https://plumbingconnection.com.au', feed: 'https://plumbingconnection.com.au/feed/', host: 'plumbingconnection.com.au', excludeCategories: ['Transport', 'Contributors'] },
  { id: 'construction', label: 'Building & construction', source: 'Sourceable', site: 'https://sourceable.net', feed: 'https://sourceable.net/feed/', host: 'sourceable.net' },
  { id: 'av', label: 'Audio visual', source: 'Connected Magazine', site: 'https://connectedmag.com.au', feed: 'https://connectedmag.com.au/feed/', host: 'connectedmag.com.au' },
  { id: 'it', label: 'IT & cyber', source: 'ARN', site: 'https://www.arnnet.com.au', feed: 'https://www.arnnet.com.au/feed/', host: 'arnnet.com.au' },
  { id: 'ai', label: 'AI', source: 'TechCrunch', site: 'https://techcrunch.com/category/artificial-intelligence/', feed: 'https://techcrunch.com/category/artificial-intelligence/feed/', host: 'techcrunch.com', excludeTitle: /\b(disrupt|tickets?)\b/i },
  { id: 'marketing', label: 'Marketing', source: 'Mumbrella', site: 'https://mumbrella.com.au', feed: 'https://mumbrella.com.au/feed', host: 'mumbrella.com.au' },
  // The Ambient's firewall also rejects cloud servers; Residential Systems
  // (integrator trade news) is the fallback.
  {
    id: 'smart-home',
    label: 'Smart home',
    source: 'The Ambient',
    site: 'https://www.the-ambient.com',
    feed: 'https://www.the-ambient.com/feed/',
    host: 'the-ambient.com',
    fallback: { source: 'Residential Systems', site: 'https://www.residentialsystems.com', feed: 'https://www.residentialsystems.com/feed', host: 'residentialsystems.com' },
  },
];

export function findNewsSource(id) {
  return NEWS_SOURCES.find((s) => s.id === id);
}

// Browser-like but honest: some publishers' firewalls reject anything that
// says "bot".
export const FEED_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; TeracomSolutionsNews/1.0; +https://www.teracomsolutions.com.au)',
  Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
};

/**
 * Latest headlines for one source. Re-fetched at most once an hour (Next data
 * cache), so the page stays current with no cron job. Never throws -- an
 * unreachable or slow feed just means an empty list.
 */
async function fetchFeed(feed, limit) {
  try {
    const response = await fetch(feed.feed, {
      next: { revalidate: 3600 },
      headers: FEED_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    return parseRssItems(await response.text(), {
      allowedHost: feed.host,
      limit,
      excludeCategories: feed.excludeCategories || [],
      excludeTitle: feed.excludeTitle || null,
      stripLeadDash: Boolean(feed.stripLeadDash),
      decodeTwice: Boolean(feed.decodeTwice),
    });
  } catch {
    return [];
  }
}

export async function getSourceNews(source, limit = 12) {
  let feed = source;
  let items = await fetchFeed(source, limit);
  if (items.length === 0 && source.fallback) {
    feed = source.fallback;
    items = await fetchFeed(source.fallback, limit);
  }
  return items.map((item) => ({ ...item, sourceId: source.id, source: feed.source, industry: source.label }));
}

// Every publisher the page can credit, fallbacks included.
export const NEWS_PUBLISHERS = NEWS_SOURCES.flatMap((s) => [
  { source: s.source, site: s.site },
  ...(s.fallback ? [{ source: s.fallback.source, site: s.fallback.site }] : []),
]);

export async function getSenNews(limit = 12) {
  return getSourceNews(NEWS_SOURCES[0], limit);
}

/**
 * Every source at once: { [sourceId]: items[] }. Stories that appear in more
 * than one feed (the Connection titles share general tradie stories) are kept
 * only in the first source that has them.
 */
export async function getAllIndustryNews(limitPerSource = 8) {
  const lists = await Promise.all(NEWS_SOURCES.map((s) => getSourceNews(s, limitPerSource)));
  const seen = new Set();
  const bySource = {};
  NEWS_SOURCES.forEach((source, i) => {
    bySource[source.id] = lists[i].filter((item) => {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });
  return bySource;
}

// Topic tag for a security headline, used for the coloured tag and icon
// artwork on the news page. Whole-word matches only; first topic that matches
// wins, so the more specific topics come first.
export const NEWS_TOPICS = [
  { id: 'video', label: 'Video & CCTV', words: ['cctv', 'camera', 'cameras', 'video', 'vms', 'surveillance', 'lpr', 'anpr', 'thermal', 'nvr'] },
  { id: 'access', label: 'Access & locks', words: ['access control', 'door', 'doors', 'lock', 'locks', 'locking', 'credential', 'credentials', 'intercom', 'intercoms', 'biometric', 'biometrics', 'fingerprint', 'facial'] },
  { id: 'alarms', label: 'Alarms & monitoring', words: ['alarm', 'alarms', 'intrusion', 'monitoring', 'duress', 'detector', 'detectors', 'perimeter', 'sensor', 'sensors'] },
  { id: 'cyber', label: 'Cyber & tech', words: ['cyber', 'cybersecurity', 'network', 'networks', 'data', 'cloud', 'ai', 'software', 'app', 'apps'] },
];
export const DEFAULT_NEWS_TOPIC = { id: 'industry', label: 'Industry' };

const TOPIC_PATTERNS = NEWS_TOPICS.map((t) => ({
  ...t,
  pattern: new RegExp(`\\b(${t.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i'),
}));

export function categoriseHeadline(title = '', excerpt = '') {
  // The headline decides first; the preview text is only a fallback.
  const topic = TOPIC_PATTERNS.find((t) => t.pattern.test(title)) || TOPIC_PATTERNS.find((t) => t.pattern.test(excerpt));
  return topic ? { id: topic.id, label: topic.label } : DEFAULT_NEWS_TOPIC;
}
