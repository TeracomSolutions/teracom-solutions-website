# SEO Improvements Register

Living record of search-visibility work on `teracomsolutions.com.au`. Update the
status column in the same commit as the change, not afterwards.

**Impact column** is an honest estimate of effect on organic visibility, not a
promise of position. Read §"Expectation setting" at the bottom before treating
any of it as a ranking forecast.

Last updated: 2026-09-15

---

## ✅ Completed

Landed in `c477d89` on branch `seo/technical-foundations-v1`. Verified against a
production build: `next build` clean, `next lint` clean, 27/27 tests passing, all
22 routes HTTP 200.

| # | Issue | Solution | Files | Impact |
|---|---|---|---|---|
| C1 | `@graph` serialised with **no `@context`** — the sitewide JSON-LD was invalid, so Google silently discarded the Organization + LocalBusiness graph entirely. Address, phone and contact data had never been machine-readable. | Added `'@context': 'https://schema.org'`; introduced `components/JsonLd.js` so no page can repeat the mistake. | `components/StructuredData.js`, `components/JsonLd.js` | **P1 — Critical.** Unlocks every entity/local signal the site was already trying to send. |
| C2 | `robots.txt` (a hand-rolled route handler) allowed everything except `/admin/` and `/private/` — a route that has never existed — leaving `/account/`, `/cart`, `/checkout/` and `/api/` fully crawlable. | Replaced with Next-native `app/robots.js` blocking the paths that actually exist. | `app/robots.js`, deleted `app/robots.txt/route.js` | **P1 — Critical.** Stops crawl budget going to non-indexable pages. |
| C3 | Sitemap declared the urlset namespace as `https://www.sitemaps.org/...` (the protocol specifies `http://`) and hardcoded the production origin, so preview deploys emitted production URLs. | Replaced with `app/sitemap.js`; Next serialises the XML, origin comes from `lib/seo.js`. 55 URLs, all derived from the same data modules the pages render from. | `app/sitemap.js`, deleted `app/sitemap.xml/route.js` | **P1 — Critical.** A namespace a strict parser can reject is a sitemap that may not be read at all. |
| C4 | **No robots directive anywhere** on `/admin`, `/account`, `/cart`, `/checkout` — including the order-confirmation page. `robots.txt` alone doesn't prevent indexing of a linked URL. | Pass-through `layout.js` per route group carrying `noindex, nofollow`. A layout rather than page metadata because several of those pages are `'use client'` and cannot export `metadata`. | `app/{account,admin,cart,checkout}/layout.js`, `lib/seo.js` | **P1 — Critical.** Also a privacy fix, not only SEO. |
| C5 | **Zero canonical tags** across the entire site. | Every indexable page emits one via `pageMetadata()`, which builds canonical + Open Graph + Twitter from one source so they can't drift. | `lib/seo.js` + 13 page files | **P1 — Critical.** Biggest effect on `/store/[category]`, the natural target for filter/sort query strings. |
| C6 | `/store` and `/securityos-ai` — two of the three most commercially important pages — had **no `metadata` export**, inheriting the homepage title verbatim. Three pages competing on one identical title. | Distinct, intent-targeted titles and descriptions within Google's render budget. | `app/store/page.js`, `app/securityos-ai/page.js` | **P1 — Critical.** Duplicate titles actively suppress all three pages. |
| C7 | Homepage hero image is the LCP element but had no `priority`, so Next lazy-loaded it and the browser only discovered it post-hydration. No `sizes`, so a 1400px asset was fetched for a ~55% column. | `priority` on the first slide only, plus a `sizes` hint. | `components/HeroBanner.js` | **P2 — High.** Direct, measurable LCP improvement on the most-linked page. |
| C8 | `globals.css` has always requested `font-family: Inter` but **nothing ever loaded Inter** — no `next/font`, no `@font-face`, no stylesheet link. Every visitor without it installed locally got the system-ui fallback. | Self-hosted via `next/font/google` with `display: swap` and a CSS variable. | `app/layout.js`, `app/globals.css` | **P2 — High.** Design intent met with no render-blocking request and no CLS. |
| C9 | No breadcrumbs anywhere — deep brand/category/capability pages had only an ad-hoc `← Back` link. | `components/Breadcrumbs.js` renders a visible trail **and** the matching `BreadcrumbList` schema, deliberately together (Google expects markup to describe a trail the user can see). Applied to all 3 dynamic routes + 5 resources subpages. | `components/Breadcrumbs.js` + 8 page files | **P2 — High.** Breadcrumb SERP treatment instead of a raw URL, plus real internal links up the hierarchy. |
| C10 | Only entity-level schema existed. No service, product, software or FAQ markup. | Added `Service` (homepage, from capabilities the page already describes), `SoftwareApplication` + capability `ItemList` (`/securityos-ai`), `CollectionPage` (`/store`), `FAQPage` over the **70 real Q&A pairs** in `lib/helpCenterTopics.js`. | `app/page.js`, `app/securityos-ai/page.js`, `app/store/page.js`, `app/resources/help-centre/page.js` | **P2 — High.** The 70-pair FAQPage is the densest keyword-relevant asset on the site and was previously invisible as data. |
| C11 | `Organization` carried no social profiles, no service area, no opening hours, no company identifier. | Added `sameAs` (the footer's four real profiles), `areaServed`, real opening hours sourced from `/about`, and the ABN published on `/terms`. Nodes given stable `@id`s so they link as one entity instead of three unrelated businesses sharing a name. | `lib/seo.js`, `components/StructuredData.js` | **P2 — High.** `sameAs` is one of the few signals that reliably consolidates a brand into a single Knowledge Panel. |
| C12 | Accessibility: no skip link (WCAG 2.4.1); focus indicators removed by the sitewide link reset (2.4.7); contact form used placeholders as its only labels (3.3.2); auto-advancing carousel and smooth scroll ignored `prefers-reduced-motion` (2.2.2, 2.3.3); `lang="en"` on an Australian site. | All six fixed. `id="main-content"` added to every page's `<main>`. | `app/layout.js`, `app/globals.css`, `app/page.js`, `components/HeroBanner.js`, all 24 page files | **P2 — High.** Accessibility is a ranking-adjacent quality signal and a legal exposure in AU. |
| C13 | Hero carousel tore down and recreated its `setInterval` on every slide change via an unnecessary `activeIndex` dependency. | Removed the dependency; the functional update never needed it. | `components/HeroBanner.js` | **P4 — Nice to have.** Wasted timer churn, not a user-visible defect. |

### Deliberately not done, with reasons

| Item | Why not |
|---|---|
| `Offer`/`price` nodes on product schema | The store nulls `priceCents` for anonymous visitors, and Googlebot crawls anonymously. Declaring prices a crawler-visiting user cannot see is a content mismatch and a Merchant policy problem, not a free rich result. Blocked on R4 below. |
| `WebSite` → `potentialAction` / sitelinks `SearchAction` | There is no `/search` route. Declaring a search box that resolves to nothing is a structured-data error. |
| Blocking AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended) | Left allowed. Assistant answers are a real discovery channel and a company selling an AI platform has an obvious interest in appearing in them. Reversible in `app/robots.js` — recorded here because an omission is invisible otherwise. |
| `geo` coordinates on `LocalBusiness` | Lat/long for 1B Yazaki Way could not be verified from anything in the repo. Inventing coordinates would be worse than omitting them. |

---

## 🚧 In progress

Nothing currently in flight.

---

## 📋 Remaining

Ordered by impact. Items marked **BLOCKED** need access or a decision that code cannot supply.

### P1 — Critical

| # | Issue | Solution | Impact |
|---|---|---|---|
| R1 | **BLOCKED (Vercel access).** The apex domain is broken in production. `http://teracomsolutions.com.au` → 308 → `https://teracomsolutions.com.au`, which then serves a cert whose only SAN is `www.teracomsolutions.com.au`. Anyone omitting `www` gets a full-page security warning. | Add the apex as a Vercel domain configured to 301 to `www`; Vercel then issues a covering cert. | Every inbound link, business card and directory citation to the bare domain currently fails. Authority accrued against the apex is stranded. |
| R2 | **BLOCKED (Vercel access).** `BACKEND_API_URL` is unset in production, so the contact form cannot submit. | Set it to the exposed website-backend origin once the reverse proxy lands. | The site's only working lead-capture path is dead. Directly caps lead generation at zero. |
| R3 | **BLOCKED (Google account).** No Search Console, and no analytics component found anywhere in the repo. | Verify GSC for `www` (and apex after R1), submit the sitemap, install GA4, and take a baseline rank snapshot **before** further changes. | Without this, every later claim about ranking movement is unfalsifiable. |

### P2 — High

| # | Issue | Solution | Impact |
|---|---|---|---|
| R4 | **DECISION NEEDED.** Store prices are hidden behind sign-in. A page with no visible price cannot rank for `"<product> price"` queries, cannot carry `Offer` schema, and gives visitors no reason to proceed. | Commercial decision: expose prices publicly (unlocks Product rich results + C-tier long tail), or accept the ceiling. | Gates the entire product-SEO and conversion surface. |
| R5 | **DECISION NEEDED.** No individual product pages exist. 8 products in `lib/products.js` render only as cards on `/store` and `/store/[category]`. No URL can rank for a model number — the highest-intent, lowest-competition long tail. | Design the `/store/product/[slug]` URL scheme now, build after the commerce data-feed pipeline lands so it is done once at catalogue scale (paginated sitemaps, ISR) rather than twice. | Largest single content-architecture gap. |
| R6 | The 9 help-centre topics (70 Q&As, recovered real content) live on one accordion page, so nine strong informational topics compete as a single URL. | Split to `/resources/help-centre/[topic]`. **Tradeoff:** the hub page currently renders all content, so naive splitting creates duplicate content — the hub must become intros + links, which is a UX change. | 9 new indexable pages targeting real queries, from content that already exists. |
| R7 | No location or service pages. Teracom is in Carrum Downs VIC with offices in Melbourne and Sydney; nothing targets any geography or individual service line. | A small set of genuinely useful per-service and per-area pages. Must be real content — templated doorway pages are penalised. | The main lever for local commercial intent. |
| R8 | **BLOCKED (Google account).** No Google Business Profile work. | Claim/verify GBP with NAP matching `lib/seo.js` exactly; add Bing Places; audit AU directory citations for NAP consistency. | Highest-ROI single action for local search, and free. |
| R9 | 20 brands in `lib/brands.js`, but no supplier backlink outreach. Manufacturer "where to buy" / authorised-reseller pages are high-authority, highly relevant and usually free for a stockist to request. | Systematic outreach to all 20. | Most underexploited link source available. Authority gaps are what actually move competitive head terms. |

### P3 — Medium

| # | Issue | Solution | Impact |
|---|---|---|---|
| R10 | No blog or editorial surface. Nothing can be updated frequently or earn links. (Note: handovers referenced a "blog backend PR" — it never existed in any repo. Treat as unbuilt.) | Add an editorial section with `Article` schema. | Feeds informational queries and the Teracom AI thought-leadership angle. |
| R11 | Heading hierarchy: several resources subpages have an `<h1>` and a stray `<h3>` with no intervening `<h2>`. | Normalise to sequential levels. | Minor structural clarity for crawlers and screen readers. |
| R12 | `partnerLogos` is hardcoded in `app/page.js`, duplicating slugs already in `lib/brands.js`. | Derive from `lib/brands.js`. | Prevents homepage/brand-page link drift, which silently breaks internal linking. |
| R13 | Resources documents may not be individually addressable. Datasheets and manuals are searched by model number and earn links naturally. | Audit whether each document has its own indexable URL. | Untapped long-tail surface. |
| R14 | No `llms.txt`. | Publish one describing what Teracom does, pointing at key pages. | Cheap positioning for AI answer engines, consistent with the C-tier crawler policy above. |

### P4 — Nice to have

| # | Issue | Solution |
|---|---|---|
| R15 | No `app/manifest.js` or PWA metadata. | Add a web manifest. |
| R16 | No OG images — social shares fall back to no preview image. | Add `opengraph-image.js` per key route. |
| R17 | Core Web Vitals are unmeasured, only reasoned about. Next on Vercel starts from a good place but that is an assumption. | Measure via GSC's CWV report and PageSpeed Insights once R3 lands. |

---

## Expectation setting

Worth restating, because it determines where effort should go:

- **Branded terms** ("Teracom Solutions", "Teracom AI", "Teracom Carrum Downs") — position 1 is achievable within weeks. Mostly C1–C11 above plus R8.
- **Long-tail / niche** ("Hikvision distributor Carrum Downs", "<model> datasheet", "security system design Frankston") — realistic within a few months via R5, R6, R7.
- **Competitive head terms** ("security cameras Melbourne", "CCTV installation", "AI security platform") — contested by national players with years of domain authority. This is a sustained 12–18 month programme driven far more by R9 (authority) and R7/R10 (content depth) than by anything in the codebase.

Technical foundations are a prerequisite, not a substitute. C1–C13 remove the
things actively holding the site back; R4–R9 are what actually compete.

## Related documents

- `teracom-ai-docs/Workstreams/SEO_AND_SEARCH_VISIBILITY_STRATEGY_V1.md` — full strategy incl. off-page and local
- `platform-ops/task_seo_technical_foundations_v1.md` — original Phase 1 task spec
