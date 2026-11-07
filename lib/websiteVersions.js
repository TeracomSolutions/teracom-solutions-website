// The website's own version history: what changed on the public website and the store (the
// customer-facing front end), newest first, in plain English. Every change that reaches the
// public site or the store adds an entry here and a new top version, the same way
// lib/consoleVersions.js does for the console. History starts with the last 50 changes before
// 4 November 2026, taken from the repository's merged changes; console releases stay in the
// console list. The About page shows this list as its own section.

export const WEBSITE_VERSIONS = [
  {
    "version": "1.61.0",
    "date": "2026-11-07",
    "notes": [
      "New Files page in the console (System): a read-only explorer of the live server folders (graphics library, website pictures and code, backend code, uploads) with picture and text previews and downloads. Keys, .env files, settings and installed packages are never shown.",
    ],
  },
  {
    "version": "1.60.1",
    "date": "2026-11-07",
    "notes": [
      "The dot grid and red light behind the pages are now clearly visible instead of almost invisible.",
    ],
  },
  {
    version: "1.60.0",
    date: "2026-11-06",
    notes: [
      'Tera moves: animated versions of the dinosaur jump with confetti after an order, walk across the empty cart, wink when checkout is cancelled, look puzzled on the page-not-found page and type while Ask Tera thinks. People who ask their device for less motion see the still pictures.',
      'A more polished look: a faint dot grid and red light behind the pages, a reading-progress line under the header, accent lines on the small red labels, a soft sheen on the big headings, red hairlines where shaded sections start, and content that rises gently into place as you scroll.',
    ],
  },
  {
    version: "1.59.1",
    date: "2026-11-06",
    notes: [
      "Added /.well-known/security.txt, the standard file that tells researchers and tools how to report a security problem with the website.",
    ],
  },
  {
    version: '1.59.0',
    date: "2026-11-06",
    notes: [
      'Header: one slim row in a modern style. Search, account and cart moved onto the navigation line as round icons beside Open Store; links get a soft pill hover, menus show a chevron and fade in, the page you are on is marked in red, and the bar tightens with a faint red edge as you scroll.',
    ],
  },
  {
    "version": "1.58.1",
    "date": "2026-11-06",
    "notes": [
      "Industry news: an industry can show headlines from several websites, mixed newest first and each credited to its own site."
    ]
  },
  {
    "version": "1.58.0",
    "date": "2026-11-06",
    "notes": [
      "Industry news: the publications shown are now the list staff keep on the console, so new industries and publications appear without a website change (the original list is the fallback).",
      "Articles: published articles from industry news appear under From the industry news, each crediting and linking the story that prompted it, and are in the sitemap."
    ]
  },
  {
    "version": "1.57.1",
    "date": "2026-11-06",
    "notes": [
      "The Monitoring menu (desktop and mobile) links straight to the monitoring sign-up form, which is also listed on Submit a request."
    ]
  },
  {
    "version": "1.57.0",
    "date": "2026-11-06",
    "notes": [
      "New forms you sign online: Returns (RMA) request and Contractor information form, both rebuilt from Teracom's own paperwork, listed on Submit a request.",
      "A Teracom confidentiality agreement (NDA) that can be signed online, ready as a preview while its wording is reviewed.",
      "Forms can now carry an agreement of their own; its full wording is shown before signing and printed in the signed copy."
    ]
  },
  {
    "version": "1.56.0",
    "date": "2026-11-06",
    "notes": [
      "Site Plan Designer: Parts and price. A finished plan becomes a parts list, with a store product suggested for each kind of device and each cable, your prices, quantities and a total; choose other products and the choices are saved with the plan.",
      "Add the whole list to the cart in one click, or send it to our team as a request for an installed quote (from your account, with the site and any notes)."
    ]
  },
  {
    "version": "1.55.1",
    "date": "2026-11-06",
    "notes": [
      "Store lists show the generic picture for each product's own kind (they showed the plain box for everything, because the list did not carry the category)."
    ]
  },
  {
    "version": "1.55.0",
    "date": "2026-11-06",
    "notes": [
      "Store: a product we have no photo of yet shows a generic picture of its kind (camera, access control reader, motion detector, network switch, cable, or a plain box), marked Illustration only, instead of Tera. The real photo replaces it as soon as one is found."
    ]
  },
  {
    "version": "1.54.0",
    "date": "2026-11-06",
    "notes": [
      "Security review: the limits on sign-in, sign-up, checkout, discount codes, forms, freight quotes and the read-aloud voice are now counted in one place on the server, so they hold however many copies of the site Vercel runs.",
      "The read-aloud voice has a daily limit per account, because it is charged by the character.",
      "An order delivered to a different postcode from the one its freight was priced for is held for a check, with that reason.",
      "Checkout no longer accepts a licence number from the browser, and a single product is limited to 20 at a time like the cart.",
      "Saved carts (Sales > Carts) are priced from the catalogue, not from what the browser sent.",
      "A stricter list of the sites that may supply scripts is reported in the browser for now; it is switched on once the live site shows no reports."
    ]
  },
  {
    "version": "1.53.1",
    "date": "2026-11-06",
    "notes": [
      "Store, brand and product pages refresh once a day instead of every hour (prices still update straight away when they are made live), and the growth pages hourly instead of every five minutes, to stay inside Vercel's free-plan limits.",
      "Making prices live now needs a checked staff session before the store pages are cleared, so nobody can force the whole store to rebuild."
    ]
  },
  {
    "version": "1.53.0",
    "date": "2026-11-05",
    "notes": [
      "The six placeholder products from the first version of the store (Sample Access Control Reader, Quad PIR Motion Detector, Wireless Door/Window Sensor, Security Scope of Works Template Pack, Security Design Review Consultation, System Integration Service) are gone from the store and the sitemap; their old pages go to the store. Every product now comes from the real catalogue.",
      "New pages for the growth tools, shown only while each tool is switched on in the console and something is published: /areas (areas we cover), /projects (case studies) and /questions (answers, with the FAQ data Google reads), plus /feeds/comparison.csv for price comparison sites and the IndexNow key file."
    ]
  },
  {
    "version": "1.52.0",
    "date": "2026-11-05",
    "notes": [
      "Teracom AI prices now come from the backend price list (the Teracom AI rows in the console, including the base platform fee), so a price changed there reaches the Department pages, the store and the savings calculator within the hour, or at once with Publish prices. The bundled price list version 3 is used only if the backend cannot be read.",
      "No more Starter, Enterprise, Platinum or Professional plans anywhere on the website: each pack now says how it is sold (a Department pack priced per Department, or an extension added to its Department). The old Subscribe to Teracom AI plans on the store home are gone, and the View Plans buttons are now View Departments, opening the Teracom AI Departments in the store."
    ]
  },
  {
    "version": "1.51.0",
    "date": "2026-11-05",
    "notes": [
      "Monitoring commissioning form on the website (/forms/monitoring-commissioning), replacing the Zoho form: the site, panel, connection, term, optional services, zone and area lists (typed or attached), contacts with voice codes, operating hours, patrol instructions and special instructions, then the customer accepts Schedule 3 of the terms (the version on show is recorded) and signs. They get a reference and a signed copy by email. No prices on the form: charges are as quoted. The monitoring pages' Complete your monitoring details button opens it.",
      "A 24/7 Monitoring sign-up form (AI or control room monitoring, what to watch, contacts, a response plan for each kind of alarm, approved actions) is built but not live: preview only, until the monitoring legal review is done."
    ]
  },
  {
    "version": "1.50.0",
    "date": "2026-11-04",
    "notes": [
      "About shows the website (public pages and store) as its own section, with its version, commit, build time and history, next to the console and the backend.",
      "The history starts with the last 50 website changes, from 24 October 2026; console releases stay in the console list."
    ]
  },
  {
    "version": "1.49.0",
    "date": "2026-11-04",
    "notes": [
      "Teracom AI store: Coming soon, price shown as an estimate.",
      "Robert, 4 November 2026: in the store the Teracom AI packs are not for sale yet. Each card and pack page now reads \"Coming soon\" with the price as an estimate (incl. GST, with the base platform split out). Register interest stays; there is no cart button. The price list itself is unchanged."
    ]
  },
  {
    "version": "1.48.0",
    "date": "2026-11-04",
    "notes": [
      "Teracom AI store shows the published prices, to the cent.",
      "The Teracom AI store cards and pack pages said \"pricing coming soon\" after the prices went live. They now show each price including the A$39 base platform and GST, with the ex-GST split, and fall back to \"pricing coming soon\" for any pack without a price. Monthly prices including GST show to the cent (monthlyMoney), so a Department page reads A$151.80, not a rounded A$152."
    ]
  },
  {
    "version": "1.47.0",
    "date": "2026-11-04",
    "notes": [
      "Teracom AI prices live: price list v3 with the A$39 base platform.",
      "Robert approved price list v3 on 4 November 2026 and asked for it to go live. PRICES_PUBLISHED is switched on. Every customer pays a A$39 a month base platform fee, which is never discounted. The bundle discount (10%) now starts at 2 Departments. Each Department page shows its price including the base platform, and the savings calculator and examples include the fee. Department prices are unchanged from v2."
    ]
  },
  {
    "version": "1.46.0",
    "date": "2026-11-03",
    "notes": [
      "Free tools: Data Rack Layout beside the Site Plan Designer.",
      "Robert could not find the rack tool: it was in IT & business, far down /tools. It now sits in the first area, renamed Plans & layouts, next to the Site Plan Designer."
    ]
  },
  {
    "version": "1.45.0",
    "date": "2026-11-03",
    "notes": [
      "Data Rack Layout: several racks in a comms room.",
      "The tool now holds a comms room of up to 12 racks, each with its own tab, name, size and depth: Add a rack, Copy rack, Remove rack (asks first when it has equipment), and All racks to see them side by side standing on the same floor, where clicking a rack opens it. Equipment can be sent to another rack (same position if free, else the highest free space)."
    ]
  },
  {
    "version": "1.44.0",
    "date": "2026-11-03",
    "notes": [
      "Free tools: Data Rack Layout.",
      "A new tool at /tools/data-rack-layout (IT & business area), separate from the site plans as Robert asked: pick a rack from 6RU to 48RU and a depth, add patch panels, fibre panels, cable management, brush panels, switches, routers, an NBN modem shelf, recorders, servers, NAS, UPS, power rails, shelves, fans and blanks at their usual heights, label each one, and drag it up or down (or use Up, Down and Position)."
    ]
  },
  {
    "version": "1.43.0",
    "date": "2026-11-03",
    "notes": [
      "Site plan: an inspection and test plan per system in the Excel workbook.",
      "Each system on the plan (CCTV, alarm, access control, intercom, fire, network, audio and display) now gets an ITP sheet for signing the site off at handover: every device with its checks (a camera's field of view, line and level, focus, night picture and recording; a door's card, exit, fire release and forced/held alarms), its cable's install, label and test checks, then the system's commissioning checks and the hand..."
    ]
  },
  {
    "version": "1.42.0",
    "date": "2026-11-03",
    "notes": [
      "Remove Build progress from the console.",
      "Robert: the Build progress page, its API routes, view helpers, guide section and menu, home tile and access entries are removed."
    ]
  },
  {
    "version": "1.41.0",
    "date": "2026-11-03",
    "notes": [
      "Savings pages live, with a page for every Department.",
      "Robert approved the wording and figures. /teracom-ai/savings and a page per business Department (/teracom-ai/departments/<slug>, from Global's catalogue) are public, saved copies refreshed hourly, in the sitemap and site search, linked from /teracom-ai, the Department cards and the store pack pages. Prices stay hidden."
    ]
  },
  {
    "version": "1.40.0",
    "date": "2026-11-03",
    "notes": [
      "Savings draft: designed-to wording in the opening line.",
      "Co-authored-by: Teracom Website Deploy <noreply@teracomsolutions.com.au> Co-authored-by: Claude Opus 5.5 <noreply@anthropic.com>"
    ]
  },
  {
    "version": "1.39.0",
    "date": "2026-11-03",
    "notes": [
      "Savings drafts: wording reviewed against the Australian Consumer Law.",
      "Headline and goals no longer read as promises (future matters, s4): conditional options, Example totals, a prominent qualifier that no figure is a measured result, early-access lines, designed-to wording for the Department, GST-inclusive prices when published. Review notes for the solicitor in docs/legal/SAVINGS_ACL_REVIEW_2026-11-03.md."
    ]
  },
  {
    "version": "1.38.0",
    "date": "2026-11-03",
    "notes": [
      "Teracom AI savings drafts: calculator, goals, Finance page; no worker counts.",
      "Drafts for Robert to review, hidden (404 without ?preview=1, never indexed): /teracom-ai/savings with a calculator the visitor controls, savings goals of A$250k, A$500k and A$1M with the arithmetic shown, and /teracom-ai/departments/finance on what the customer pays for and what it takes off the team. Prices exist server-side behind PRICES_PUBLISHED (off)."
    ]
  },
  {
    "version": "1.37.0",
    "date": "2026-11-03",
    "notes": [
      "Teracom AI packs in detail: a page per pack, grouped as Global says.",
      "Every Department and extension pack gets its own store page from Global's catalogue: what it does, how it works and what stays with a person, each screen and the question it answers, dashboards, reports, what each digital worker does, and what it works with. Packs are grouped by Global's group (Industry Extensions has its own heading). No prices."
    ]
  },
  {
    "version": "1.36.0",
    "date": "2026-11-03",
    "notes": [
      "Card fraud check: bank check from $500, holds shown in Sales.",
      "Checkout asks for 3D Secure on orders of $500 or more. After payment the webhook sends what Stripe found on the card to the backend check; a held payment is marked in Stripe, and the order in Sales shows the hold, its reasons and a release button with a note."
    ]
  },
  {
    "version": "1.35.0",
    "date": "2026-11-03",
    "notes": [
      "Store: Teracom AI section with every Department and extension pack.",
      "/store/teracom-ai (and its guest copy) lists every Department and extension pack from Global's live catalogue, with workers, plans and version, Pricing coming soon and Register interest until prices are approved. The store front gets a Teracom AI banner and category tile; site search finds it."
    ]
  },
  {
    "version": "1.34.0",
    "date": "2026-11-03",
    "notes": [
      "Teracom AI page lists Departments from Global's live catalogue.",
      "lib/departmentCatalogue.js reads Global's public catalogue (packs: name, what each does, tiers, version, workers; never prices), lib/api fetches it hourly and a failed refresh keeps the last good page, and /teracom-ai renders it with CatalogueDepartments. The old hard-coded Departments stay as the build-time fallback until the live page is proven."
    ]
  },
  {
    "version": "1.33.0",
    "date": "2026-11-03",
    "notes": [
      "Sign-up: phone, business details, role, email topics; account preferences.",
      "Sign-up asks for a phone number, business or personal (company and ABN for a business), what describes them and which emails they want. The account page lets customers change them. Posting can send to customers who asked for one topic; the specials email goes to specials only."
    ]
  },
  {
    "version": "1.32.0",
    "date": "2026-11-03",
    "notes": [
      "Free tools and downloads need a free account.",
      "Tool pages stay public (and indexable) but the tool itself is behind a sign-in panel until the visitor has an account; the project report too. /resources/file/<id> sends signed-in customers or staff to a ten-minute download link and everyone else to sign up first. Sign-up gets a specials opt-in box and keeps where the visitor was going."
    ]
  },
  {
    "version": "1.31.0",
    "date": "2026-11-03",
    "notes": [
      "Support: live progress for the library rebuild and product study.",
      "What Tera is learning: a card each with the overall bar, the step it is on with its count, what it is reading now, every step ticked off, the latest log lines and elapsed time, polled every two seconds while either runs, with a warning when nothing has moved for three minutes."
    ]
  },
  {
    "version": "1.30.0",
    "date": "2026-11-03",
    "notes": [
      "Ask Tera: a step-by-step guide for every free tool.",
      "lib/toolGuides.js gives each tool its how-to (the Site Plan Designer its own: upload, scale, add, move and turn, cabling, schedules, Excel, saving); the support library feed sends it with each tool."
    ]
  },
  {
    "version": "1.29.0",
    "date": "2026-11-03",
    "notes": [
      "Site plan: branded Excel workbook, branded picture, tool brand band.",
      "Download Excel on the equipment schedule (and Save as Excel) makes one workbook: Summary with cable to order and shop links, the plan picture, the equipment schedule with each device's cable and head end, and a cable schedule per system. Every sheet has the logo band, a quote banner, shop link and branded print footer; links carry utm tags. Written with a small in-folder xlsx writer, no new dependency."
    ]
  },
  {
    "version": "1.28.0",
    "date": "2026-11-03",
    "notes": [
      "Site plan: cable schedules per system, planner in its own folder.",
      "The Site Plan Designer moves to siteplan/ (model, cables, screen, styles, tests, README) with no imports from the rest of the site, so Teracom AI can take it as is."
    ]
  },
  {
    "version": "1.27.0",
    "date": "2026-11-03",
    "notes": [
      "Drop-down lists readable on Windows.",
      "The open list of a drop-down (the Site Plan device list and the rest) showed white text on the browser's white background, so most entries looked missing. Every list now gets a dark background."
    ]
  },
  {
    "version": "1.26.0",
    "date": "2026-11-03",
    "notes": [
      "Specials email to trade customers.",
      "Store > Specials gets Email trade customers: Social > Posting opens with an email listing every live special (price, was price, end date, link), email ticked and set to trade customers only. Posting gains the trade audience with its count."
    ]
  },
  {
    "version": "1.25.0",
    "date": "2026-11-03",
    "notes": [
      "Meta pixel, Meta catalogue feed and Post it for specials.",
      "The Meta pixel loads on public pages once a Pixel ID is saved on Connections > Meta. Every event already sent to Google Analytics goes to Meta too under its standard name (ViewContent, AddToCart, InitiateCheckout, Purchase, Lead, Contact). Purchases and enquiries are also sent from the server with the same event id. New feed /feeds/meta-catalog.xml for Facebook and Instagram shop ads."
    ]
  },
  {
    "version": "1.24.0",
    "date": "2026-11-02",
    "notes": [
      "Site Plan Designer: over 50 kinds of equipment in the Add list.",
      "The Add list is grouped (CCTV, alarm and intrusion, access control, intercom, fire, network and IT, audio and display, power and other): dome, bullet, PTZ, fisheye and LPR cameras, recorders, PIR, dual-tech, 360 ceiling, beam and glass-break detectors, contacts, panic buttons, panels, readers, exit buttons, locks, controllers, gates, turnstiles, door stations, monitors, smoke and heat detectors, call points, fire pan..."
    ]
  },
  {
    "version": "1.23.0",
    "date": "2026-11-02",
    "notes": [
      "Store specials and clearance: console page, store page, badges, Google sale price.",
      "Console Store > Specials: find a product, choose hot special or clearance, price and end date; margin and below-cost warning; change or remove. Store: /store/specials (signed-in and guest copies), a banner on the store front, badges and was-prices on tiles and product pages, and sale_price / sale_price_effective_date in the Google Shopping feed."
    ]
  },
  {
    "version": "1.22.0",
    "date": "2026-11-02",
    "notes": [
      "Free tools: Site Plan Designer in its own area, more devices, sample plan.",
      "The camera-only planner becomes the Site Plan Designer in a new Site plans area (first on /tools). Devices: cameras (DORI bands), motion detectors (range and angle), ceiling speakers (coverage from ceiling, listening height and angle), Wi-Fi access points and other devices (radius), doors, card readers, keypads, sirens and intercoms. A sample office and warehouse plan with devices loads on a first visit."
    ]
  },
  {
    "version": "1.21.0",
    "date": "2026-11-02",
    "notes": [
      "Free tools: Floor Plan Coverage Designer.",
      "Upload a floor plan (or use the 1 m grid), set the scale from two points, drop cameras, drag to move and turn them, and see each camera's field of view from its lens (or datasheet angle) in the four DORI bands. Camera schedule table; saved in the browser, as a PNG picture, or as a plan file that opens again to carry on."
    ]
  },
  {
    "version": "1.20.0",
    "date": "2026-11-02",
    "notes": [
      "Free tools: friendly disclaimer on the Alarms, fire & access calculators.",
      "Shown under the area on /tools and on each calculator page in it: the figures are a sound first answer, but a guide rather than the final word; check datasheets, the Australian Standard and, for fire and life-safety, the designer's calculation; no responsibility for decisions on the result alone; offer to check figures."
    ]
  },
  {
    "version": "1.19.0",
    "date": "2026-11-02",
    "notes": [
      "Free tools: Essential Eight self-check, fire alarm battery, IP intercom and PA coverage.",
      "New Cyber security area with a plain-English Essential Eight self-check (overall level = weakest strategy, three fixes to start with). Alarms & access becomes Alarms, fire & access, with a fire alarm battery calculator (AS 1670.1 style: 1.25 x (standby + derated alarm load)) and an IP intercom planner; Audio & display gets a PA ceiling speaker coverage calculator."
    ]
  },
  {
    "version": "1.18.0",
    "date": "2026-11-02",
    "notes": [
      "Free tools: eight new tools, coloured areas that fold up, Free Tools tab in Resources.",
      "New tools: AI Model Picker, AI Running Cost, AI Time Savings & Payback, Access Control Door Planner, False Alarm Cost, Wi-Fi Access Point, Backup Storage and Downtime Cost. Two new areas (Alarms & access, AI & automation). /tools now shows each area in its own colour, folding up, with Expand all / Collapse all, area chips and a search; ?category= opens just that area."
    ]
  },
  {
    "version": "1.17.0",
    "date": "2026-11-02",
    "notes": [
      "Monitoring customer login page, pre-launch and switched off.",
      "Monitoring customers will sign in through Teracom AI once the Global Platform team builds it; nothing is designed or scheduled yet and no monitoring service is offered online until the legal review is done."
    ]
  },
  {
    "version": "1.16.0",
    "date": "2026-11-02",
    "notes": [
      "Tools project report: one PDF from any calculator, import to change.",
      "* Tools project report: one PDF from any calculator, import to change"
    ]
  },
  {
    "version": "1.15.0",
    "date": "2026-11-02",
    "notes": [
      "Terms PDF download back; status page on.",
      "Terms v3.4 PDF (the live page printed to A4) in public/legal, download button on, test that the file exists. Status page on unless STATUS_PAGE=off, wording updated, Service status link in the footer. Tag: Shared Platform Service."
    ]
  },
  {
    "version": "1.14.0",
    "date": "2026-11-02",
    "notes": [
      "Code requests show Merged and Closed.",
      "Assistant code-change list and chat card show Merged and Closed. Console 1.25.0. Tag: Shared Platform Service."
    ]
  },
  {
    "version": "1.13.0",
    "date": "2026-11-02",
    "notes": [
      "Website majors: Next 16, Stripe 23, Stripe.js 10, ESLint 9 flat config, TypeScript 6.",
      "middleware.js becomes proxy.js (Next 16); .eslintrc replaced by eslint.config.mjs (next lint removed); two new React Compiler rules set to warn. Fixes the Assistant attachment counter (const reassigned, every file failed). ESLint 10 and TypeScript 7 held: eslint-config-next plugins stop at ESLint 9 and typescript-eslint at TS 6.0. Console 1.24.0. Tag: Technology and Protection."
    ]
  },
  {
    "version": "1.12.0",
    "date": "2026-11-02",
    "notes": [
      "Website packages: safe updates and qs advisory.",
      "Stripe React form 6.12, lucide-react 1.66, @types/node 22.20.5, Playwright 1.64.1; npm audit fix clears the qs advisory. Majors (Next 16, Stripe 23, Stripe.js 10, ESLint 10, TypeScript 7) left for a tested upgrade. Console 1.23.1. Tag: Technology and Protection."
    ]
  },
  {
    "version": "1.11.0",
    "date": "2026-11-01",
    "notes": [
      "Characterisation tests: 13 website libraries.",
      "Tests pinning current behaviour of admin navigation, sign-in scene, order stages, marketing view, admin-only mode, cart snapshot, staff access rules, social format, attachments, dictation, assistant voice, permission grid and the brand server name. Tag: Shared Platform Service."
    ]
  },
  {
    "version": "1.10.0",
    "date": "2026-10-28",
    "notes": [
      "Terms v3.4: Departments instead of operating systems.",
      "Generated from Teracom Terms and Conditions v3.4.docx (Z:): three clauses say Departments, Industry Packs and Extensions; effective 28 October 2026. v3.3 frozen at /terms/v3.3 with its own date and fingerprint (Robert)."
    ]
  },
  {
    "version": "1.9.0",
    "date": "2026-10-28",
    "notes": [
      "Teracom AI journey: three by two.",
      "The six journey steps sit in two rows of three instead of five and one."
    ]
  },
  {
    "version": "1.8.0",
    "date": "2026-10-28",
    "notes": [
      "Teracom AI: Departments replace operating systems.",
      "The public site describes Teracom AI by the Product Model V1: seven Departments, Industry Packs, Extensions, the journey and the five promises; no operating-system wording (Robert)."
    ]
  },
  {
    "version": "1.7.0",
    "date": "2026-10-27",
    "notes": [
      "Privacy policy: saved carts and unfinished checkouts (for Robert to approve).",
      "Co-authored-by: Teracom Website Deploy <noreply@teracomsolutions.com.au> Co-authored-by: Claude Opus 5.5 <noreply@anthropic.com>"
    ]
  },
  {
    "version": "1.6.0",
    "date": "2026-10-25",
    "notes": [
      "Order complete: recommend score and Google review.",
      "The order-complete page asks how likely the customer is to recommend us (0-10, optional comment) and offers a Google review to everyone; Marketing shows the results and holds the review link (Robert). Console 1.18.0."
    ]
  },
  {
    "version": "1.5.0",
    "date": "2026-10-25",
    "notes": [
      "Connections: Social tab with per-network Help.",
      "Move the social accounts from Social > Accounts to a Social tab on Connections, and give each network card a Help button with the exact credential steps (LinkedIn, Facebook, Instagram, X, YouTube), checked against the vendors' docs on 2026-10-25."
    ]
  },
  {
    "version": "1.4.0",
    "date": "2026-10-24",
    "notes": [
      "Tests: resources, AI capability pages, console versions, help centre, admin page list, guide sections.",
      "Written by OpenHands (Qwen3) from exact specs, reviewed by Claude."
    ]
  },
  {
    "version": "1.3.0",
    "date": "2026-10-24",
    "notes": [
      "Status page draft at /status behind STATUS_PAGE=on (roadmap 15).",
      "* Status page draft at /status behind STATUS_PAGE=on (roadmap 15)"
    ]
  },
  {
    "version": "1.2.0",
    "date": "2026-10-24",
    "notes": [
      "Security: zod 4.6.7 (GHSA-mrhx-c7xc-m3w5).",
      "zod below 4.6.6 can exhaust memory on oversized constrained collections; no 3.x fix exists. Records keyed by a fixed list use z.partialRecord, since zod 4 records with enum keys require every key."
    ]
  },
  {
    "version": "1.1.0",
    "date": "2026-10-24",
    "notes": [
      "Screenshot tests wait for page load, not network idle.",
      "The live site keeps analytics requests open, so network idle never comes and the nightly run against www timed out."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-10-24",
    "notes": [
      "Screenshot tests with Playwright (roadmap item 8), console 1.8.2.",
      "* Screenshot tests with Playwright (roadmap item 8), console 1.8.2"
    ]
  }
];

export const WEBSITE_VERSION = WEBSITE_VERSIONS[0];
