import { getAllIndustryNews, NEWS_SOURCES } from './industryNews.js';

// Homepage hero banner.
//
// Robert, 2026-09-23: the first two slides are always Teracom's own -- new
// products, store news, Teracom AI announcements. Everything after them is
// industry news, so the banner stays current without anyone editing it.
//
// The Teracom slides below the first two are fallbacks. They only appear when
// there isn't enough news to fill the carousel, which happens more often than
// you'd think: several publishers' firewalls reject requests from cloud
// servers (see lib/industryNews.js), so a production render can legitimately
// come back with nothing.

/** Always first, always Teracom's. Edit these directly to run an announcement. */
export const PINNED_SLIDES = [
  {
    id: 'industry-ai',
    eyebrow: 'AI.Technology',
    headline: 'Industry expertise and AI innovation, built for the real world.',
    body: 'Teracom combines deep industry knowledge across security, audio visual, electrical, automation, networking and systems integration with modern consulting, software and AI-powered solutions to help organisations design, deliver and support smarter systems.',
    image: '/assets/hero-tera-intelligence.webp',
    imageAlt: 'Tera, the Teracom mascot -- real intelligence builds a safer tomorrow',
    ctaHref: '/securityos-ai',
    ctaLabel: 'Explore Teracom AI',
    secondaryHref: '#what-we-do',
    secondaryLabel: 'View What We Do',
  },
  {
    id: 'store-account',
    eyebrow: 'Teracom Store',
    headline: 'Create a free account for member pricing.',
    body: 'Prices are shown to everyone -- sign up in a couple of minutes to unlock additional member discounts across the store.',
    image: '/assets/store-preview.svg',
    imageAlt: 'Teracom Store product preview',
    ctaHref: '/account/signup',
    ctaLabel: 'Create your account',
    secondaryHref: '/store',
    secondaryLabel: 'Browse the Store',
  },
];

/** Used only to fill slots the news couldn't. */
export const FALLBACK_SLIDES = [
  {
    id: 'brands',
    eyebrow: 'Our Partners',
    headline: "Backed by the industry's leading technology manufacturers.",
    body: 'Teracom works with Gallagher, Inner Range, Genetec, HID, Axis and more -- see the full list of brands we support.',
    image: '/assets/hero-bigger-together.webp',
    imageAlt: 'Tera looking out over a city at sunset -- bigger together',
    ctaHref: '/brands',
    ctaLabel: 'View All Brands',
    secondaryHref: null,
    secondaryLabel: null,
  },
  {
    id: 'free-tools',
    eyebrow: 'Free Tools',
    headline: 'Twelve calculators for the jobs you quote every week.',
    body: 'Storage, bandwidth, lens choice, PoE budgets, battery standby, voltage drop, UPS runtime and more -- free, no sign-up.',
    image: '/assets/hero-technology.svg',
    imageAlt: 'Teracom free tools for the industry',
    ctaHref: '/tools',
    ctaLabel: 'Open the Tools',
    secondaryHref: '/store',
    secondaryLabel: 'Shop the Parts',
  },
  {
    id: 'support',
    eyebrow: 'Resources',
    headline: 'Manuals, datasheets and product videos in one place.',
    body: 'The resource library collects the documentation our customers ask for most, across every brand we support.',
    image: '/assets/hero-stronger-together.webp',
    imageAlt: 'Tera training -- stronger, smarter, safer together',
    ctaHref: '/resources',
    ctaLabel: 'Browse Resources',
    secondaryHref: null,
    secondaryLabel: null,
  },
  {
    id: 'new-arrivals',
    eyebrow: 'New Arrivals',
    headline: 'Fresh stock, newly listed in the Teracom Store.',
    body: 'Browse newly added products across our full range of technology categories.',
    image: '/assets/store-preview.svg',
    imageAlt: 'New arrivals in the Teracom Store',
    ctaHref: '/store/new-arrivals',
    ctaLabel: 'Browse New Arrivals',
    secondaryHref: null,
    secondaryLabel: null,
  },
  {
    id: 'contact',
    eyebrow: 'Talk to us',
    headline: 'Technical advice before you buy, not after.',
    body: 'Our team has specified and commissioned these systems on real sites. Ask us before you order.',
    image: '/assets/teracom-on-site.webp',
    imageAlt: 'Teracom mascot on a building site reviewing plans',
    ctaHref: '/contact',
    ctaLabel: 'Get in Touch',
    secondaryHref: null,
    secondaryLabel: null,
  },
];

/** Without any news at all, the banner is still a full, sensible carousel. */
export const heroSlides = [...PINNED_SLIDES, ...FALLBACK_SLIDES];

const NEWS_IMAGES = {
  security: ['/assets/hero-security-command-centre.webp', 'Tera at a security command centre'],
  electrical: ['/assets/teracom-on-site.webp', 'Teracom mascot on a building site reviewing plans'],
  plumbing: ['/assets/teracom-on-site.webp', 'Teracom mascot on a building site reviewing plans'],
  construction: ['/assets/teracom-on-site.webp', 'Teracom mascot on a building site reviewing plans'],
  av: ['/assets/hero-stronger-together.webp', 'Tera training -- stronger, smarter, safer together'],
  it: ['/assets/hero-technology.svg', 'Teracom technology illustration'],
  ai: ['/assets/teracom-ai-command-centre.webp', 'Tera at a Teracom AI command centre desk'],
  marketing: ['/assets/hero-bigger-together.webp', 'Tera looking out over a city at sunset'],
  'smart-home': ['/assets/hero-bigger-together.webp', 'Tera looking out over a city at sunset'],
};

// Which industries are allowed on the homepage hero, in the order they get
// first pick of the slots. /resources/industry-news still carries all nine --
// but the hero is the front door, and a plumbing or advertising headline
// there reads as someone else's website. These are the trades whose news
// actually lands on a Teracom customer's desk.
const HERO_INDUSTRIES = ['security', 'electrical', 'av', 'it', 'ai', 'smart-home', 'construction'];

// A hero headline is an h1 in display type. Anything much longer than this
// wraps to four or five lines and pushes the buttons off a phone screen, so
// long headlines are skipped rather than truncated -- a story cut mid-sentence
// reads as a bug, and there is always another story.
const MAX_HEADLINE = 95;

function newsSlide(item, source) {
  const [fallbackImage, fallbackAlt] = NEWS_IMAGES[source.id] || NEWS_IMAGES.security;
  // The picture has to match the story. Where the feed gives us the
  // article's own image we use it, and fall back to Teracom artwork only
  // when it doesn't -- a mascot beside someone else's headline reads as a
  // stock-photo website.
  const image = item.imageUrl || fallbackImage;
  // Deliberately empty alt text. The image illustrates the headline sitting
  // immediately beside it, and we have no idea what it actually depicts, so
  // announcing the headline twice would be worse than announcing nothing.
  const imageAlt = item.imageUrl ? '' : fallbackAlt;
  return {
    id: `news-${source.id}-${item.link}`,
    // The publisher is credited in the eyebrow, on the slide, next to their
    // headline -- not buried in a link target.
    eyebrow: `${source.label} news · ${item.source || source.source}`,
    headline: item.title,
    body: item.excerpt || `The latest from ${item.source || source.source}.`,
    image,
    imageAlt,
    imageExternal: Boolean(item.imageUrl),
    isNews: true,
    ctaHref: item.link,
    ctaLabel: 'Read the story',
    ctaExternal: true,
    secondaryHref: '/resources/industry-news',
    secondaryLabel: 'More Industry News',
  };
}

/**
 * Build the banner: the two pinned Teracom slides, then the newest usable
 * story from each industry, then Teracom fallbacks for anything still empty.
 *
 * One story per industry rather than the freshest N overall, because a single
 * busy publisher would otherwise take every slot and the banner would read as
 * a feed from one magazine instead of a view across the trades.
 */
export function buildHeroSlides(newsBySource = {}, { total = 7 } = {}) {
  const newsSlots = Math.max(0, total - PINNED_SLIDES.length);
  const news = [];

  for (const id of HERO_INDUSTRIES) {
    if (news.length >= newsSlots) break;
    const source = NEWS_SOURCES.find((s) => s.id === id);
    if (!source) continue;
    const item = (newsBySource[id] || []).find(
      (candidate) => candidate.title && candidate.title.length <= MAX_HEADLINE
    );
    if (item) news.push(newsSlide(item, source));
  }

  const slides = [...PINNED_SLIDES, ...news];
  for (const fallback of FALLBACK_SLIDES) {
    if (slides.length >= total) break;
    slides.push(fallback);
  }
  return slides.slice(0, total);
}

/**
 * What the homepage calls. Feeds are cached for an hour, so this is almost
 * always instant -- but on a cold cache it is nine third-party RSS requests,
 * and the homepage must never wait on someone else's server to paint. Past
 * the deadline we render the Teracom slides and let the fetch finish in the
 * background, warming the cache for the next visitor.
 */
export async function getHeroSlides({ total = 7, timeoutMs = 2500 } = {}) {
  let timer;
  const news = await Promise.race([
    getAllIndustryNews(4).catch(() => ({})),
    new Promise((resolve) => {
      timer = setTimeout(() => resolve({}), timeoutMs);
    }),
  ]);
  clearTimeout(timer);
  return buildHeroSlides(news, { total });
}
