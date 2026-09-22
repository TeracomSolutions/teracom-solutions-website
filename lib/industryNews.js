// Industry headlines from SEN.news (Security Electronics & Networks) for
// /resources/industry-news. Only the headline, date, link and a short preview
// of the feed's own summary are used -- the article itself always opens on
// sen.news.

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
  const match = itemXml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? stripCdata(match[1]) : '';
}

const EXCERPT_MAX = 200;

/**
 * Turn a WordPress feed <description> into a short plain-text preview:
 * first real paragraph only (the "The post ... appeared first on" footer is
 * dropped), tags stripped, the trailing "[…]" removed, SEN's repeated
 * headline before the first " – " dropped, then cut to ~200 characters.
 */
export function toExcerpt(description) {
  if (!description) return '';
  let html = stripCdata(description);
  const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi);
  if (paragraphs) {
    html = paragraphs.find((p) => !/appeared first on/i.test(p)) || '';
  } else {
    html = html.split(/The post /i)[0];
  }

  let text = decodeHtmlEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
  text = text.replace(/\s*\[(?:…|\.\.\.)\]\s*$/, '').trim();

  const dash = text.indexOf(' – ');
  if (dash !== -1 && dash < 250) {
    text = text.slice(dash + 3).trim();
  }

  if (text.length > EXCERPT_MAX) {
    const cut = text.lastIndexOf(' ', EXCERPT_MAX);
    text = `${text.slice(0, cut > 0 ? cut : EXCERPT_MAX).replace(/[\s,;:.–-]+$/, '')}…`;
  }
  return text;
}

/**
 * Parse RSS <item>s into { title, link, date, excerpt }. Only https links on
 * allowedHost (or its subdomains) are kept.
 */
export function parseRssItems(xml, { allowedHost = 'sen.news', limit = 12 } = {}) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const itemXml = match[1];
    const title = decodeHtmlEntities(readTag(itemXml, 'title'));
    const link = readTag(itemXml, 'link');
    const pubDate = readTag(itemXml, 'pubDate');

    let url;
    try {
      url = new URL(link);
    } catch {
      continue;
    }
    const hostOk = url.hostname === allowedHost || url.hostname.endsWith(`.${allowedHost}`);
    if (url.protocol !== 'https:' || !hostOk || !title) continue;

    const parsedDate = new Date(pubDate);
    items.push({
      title,
      link,
      date: Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString(),
      excerpt: toExcerpt(readTag(itemXml, 'description')),
    });
  }

  return items;
}

/**
 * Latest SEN.news headlines. Re-fetched at most once an hour (Next data cache),
 * so the page stays current with no cron job. Never throws -- an unreachable
 * feed just means an empty list.
 */
export async function getSenNews(limit = 12) {
  try {
    const response = await fetch('https://sen.news/feed/', {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'TeracomSolutionsWebsite/1.0 (+https://www.teracomsolutions.com.au)',
      },
    });
    if (!response.ok) return [];
    return parseRssItems(await response.text(), { limit });
  } catch {
    return [];
  }
}

// Topic tag for a headline, used for the coloured tag and icon artwork on the
// news page. Whole-word matches only; first topic that matches wins, so the more
// specific topics come first.
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
