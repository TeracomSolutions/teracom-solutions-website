// Every page in the staff console, in one list: what it is, how to get there, what it shows and where that
// comes from (Robert, 2026-10-25: "for every part I need to know how to see and access the data").
// It drives the Where to find everything page, the About this page button on every page, and a test that
// fails the build when a new console page is added without an entry here.
//
// Fields (the same shape the other Teracom consoles use):
//   path    the address; [name] marks a part that changes, such as an order number
//   title   the page's name
//   menu    how to reach it: the top-menu item, then any tab or link ('' for pages outside the menu)
//   what    what the page is for, in one sentence
//   shows   what you see on it
//   source  where that information comes from
//   access  who can open it: 'Administrator', 'Staff' or 'Anyone (sign-in page)'
//   guide   the Help section that explains it (an id in lib/adminGuide), or ''
//   listed  false for pages that only forward to another page or are part of signing in

const BACKEND = "the website's own backend and database";

export const ADMIN_PAGES = [
  {
    path: '/admin', title: 'Overview', menu: 'Overview',
    what: 'The start page: one block per area of the console, the same as the top menu.',
    shows: 'A block for every area with a short description, and the latest changes to the console.',
    source: 'Written into the console itself; the latest changes come from the console version list.',
    access: 'Staff', guide: 'overview',
  },
  {
    path: '/admin/where', title: 'Where to find everything', menu: 'Help (top right) > Where to find everything',
    what: 'Every page and tool in the console, how to get to it, what it shows and where the information comes from.',
    shows: 'One row per page, grouped by the top-menu item, each with a link straight to it.',
    source: 'The console page list (lib/adminPages.js), checked by a test whenever the console changes.',
    access: 'Staff', guide: 'getting-started',
  },
  {
    path: '/admin/account', title: 'Your account', menu: 'Account',
    what: 'Your own sign-in: two-factor sign-in, backup codes and how soon you are signed out.',
    shows: 'Whether two-factor is on, your backup codes when you make them, and your sign-out time.',
    source: 'Your staff record in ' + BACKEND + '.',
    access: 'Staff', guide: 'account',
  },
  {
    path: '/admin/activity', title: 'Audit log', menu: 'Audit log',
    what: 'Who did what and when: sign-ins, changes made in the console, jobs that ran and system events.',
    shows: 'A list you can filter by person, kind of event and date, with a CSV export.',
    source: 'The audit log, job logs and system events recorded by ' + BACKEND + ' as things happen.',
    access: 'Administrator', guide: 'audit-log',
  },
  {
    path: '/admin/ai-connections', title: 'AI Connections', menu: 'AI Connections',
    what: 'The AI providers the Assistant, Scout and Ask Tera use, in order, and the rules they all follow.',
    shows: 'One line per provider with its status and last check (click a line for details), the front end and back end set-ups, the rules, and the check schedule.',
    source: 'Provider settings and check results in ' + BACKEND + '; keys are stored there, never shown in full.',
    access: 'Administrator', guide: 'ai-connections',
  },
  {
    path: '/admin/assistant', title: 'Assistant', menu: 'Assistant',
    what: 'A chat where you ask for anything in plain English: it looks things up, makes changes signed as you, or asks OpenHands to code a change to the website front end.',
    shows: 'The conversation, a card for each front-end change that follows it to a pull request, and the list of code change requests underneath.',
    source: 'Live answers from ' + BACKEND + ' and the AI provider chosen under AI Connections; code changes are written by OpenHands on VM 400 and reviewed on GitHub.',
    access: 'Staff', guide: 'assistant',
  },
  {
    path: '/admin/connections', title: 'Connections', menu: 'Connections',
    what: 'Every outside service (Zoho Books, Cloudflare, Vercel, Stripe, Google and others) and the servers and PCs we watch.',
    shows: 'Whether each one is working, when it was last checked, its settings and keys (hidden), and Test buttons.',
    source: 'Settings and check results in ' + BACKEND + '; server and PC check-ins arrive from each machine.',
    access: 'Administrator', guide: 'connections',
  },
  {
    path: '/admin/coupons', title: 'Coupons', menu: 'Coupons',
    what: 'Discount codes the checkout accepts.',
    shows: 'Every code with its discount, limits, expiry and how often it has been used, with Create and Edit.',
    source: 'The coupon table in ' + BACKEND + '.',
    access: 'Staff', guide: 'coupons',
  },
  {
    path: '/admin/leads', title: 'Leads', menu: 'Leads',
    what: 'Enquiries sent through the contact forms on the website and handed over from Ask Tera.',
    shows: 'Newest first, with the message, contact details, a drafted reply and Mark contacted.',
    source: 'The forms on the public website, saved in ' + BACKEND + '. Real customer enquiries.',
    access: 'Staff', guide: 'leads',
  },
  {
    path: '/admin/marketing', title: 'Marketing', menu: 'Marketing',
    what: 'The specials and offers that are on: the banner across the website and the weekly specials update.',
    shows: 'Each campaign with its dates and state, what the banner shows now, the weekly update settings and a preview of this week\'s update.',
    source: 'Campaigns in ' + BACKEND + '; the weekly update is made in Social > Posting and sent by it.',
    access: 'Administrator', guide: 'marketing',
  },
  {
    path: '/admin/resources', title: 'Resources', menu: 'Resources',
    what: 'Supplier and manufacturer websites we watch for manuals and data sheets, and files you upload.',
    shows: 'Each watched website with its schedule and last check, and how many documents it found.',
    source: 'Our crawler on ' + BACKEND + ' copies the PDFs to our server; they are shown on the store and the Resources pages.',
    access: 'Staff', guide: 'resources',
  },
  {
    path: '/admin/resources/[sourceId]', title: 'Resource documents', menu: 'Resources > a website in the list',
    what: 'The documents found on one watched website.',
    shows: 'Every document with its brand, type, product and when it was found.',
    source: 'The resource library in ' + BACKEND + '.',
    access: 'Staff', guide: 'resources',
  },
  {
    path: '/admin/sales', title: 'Sales', menu: 'Sales',
    what: 'What was sold, to whom and what it earned, with carts and abandoned carts.',
    shows: 'Totals and graphs, the orders list, carts and abandoned carts.',
    source: 'Live orders and carts from the online store in ' + BACKEND + '. Test and simulated orders are never counted.',
    access: 'Staff', guide: 'sales',
  },
  {
    path: '/admin/orders', title: 'Orders', menu: 'Sales > Orders',
    what: 'Every order placed in the online store.',
    shows: 'Each order with its customer, total, payment and where it is up to with Zoho Books and the supplier.',
    source: 'Orders saved by the checkout in ' + BACKEND + '; payment status from Stripe.',
    access: 'Staff', guide: 'sales',
  },
  {
    path: '/admin/orders/[orderId]', title: 'Order', menu: 'Sales > Orders > an order',
    what: 'One order in full.',
    shows: 'Items, prices, delivery, payment, and each step sent to Zoho Books and the supplier, with buttons for the next step.',
    source: 'The order in ' + BACKEND + ', Stripe for payment and Zoho Books for the paperwork.',
    access: 'Staff', guide: 'sales',
  },
  {
    path: '/admin/orders/test-tools', title: 'Test tools', menu: 'Sales > Orders > Test tools',
    what: 'Try the whole order flow without a real purchase, then clean up what it made.',
    shows: 'Buttons to make a test order and remove test orders.',
    source: 'Test orders in ' + BACKEND + '. Demo data only: never counted in Sales.',
    access: 'Administrator', guide: 'sales',
  },
  {
    path: '/admin/scout', title: 'Scout', menu: 'Scout',
    what: 'Research tasks for the website: an AI researcher and a critic write a report you approve or reject.',
    shows: 'Tasks with their schedule, past runs and their reports.',
    source: 'Tasks and reports in ' + BACKEND + '; the research uses the providers under AI Connections and the Internet.',
    access: 'Staff', guide: 'scout',
  },
  {
    path: '/admin/scout/review/[runId]', title: 'Scout research run', menu: 'Scout > a run',
    what: 'One research report, to approve or reject.',
    shows: 'The report, its sources and the critic\'s notes.',
    source: 'The run saved in ' + BACKEND + '.',
    access: 'Staff', guide: 'scout',
  },
  {
    path: '/admin/social', title: 'Social', menu: 'Social',
    what: 'LinkedIn, Facebook, Instagram, X and YouTube: accounts, posting, the calendar and customer email updates.',
    shows: 'Connected accounts, drafts and scheduled posts, the calendar and who gets updates by email.',
    source: 'Settings and posts in ' + BACKEND + '; posts go out through each network\'s own connection.',
    access: 'Staff', guide: 'social-accounts',
  },
  {
    path: '/admin/support', title: 'Support (Ask Tera)', menu: 'Support',
    what: 'Ask Tera, the AI assistant for signed-in customers: what it answers from, what it could not answer, and its conversations.',
    shows: 'The questions it could not answer, what you have taught it, and every conversation in the last 90 days.',
    source: 'Conversations saved in ' + BACKEND + '; answers come from our manuals, product pages and help pages.',
    access: 'Staff', guide: 'support',
  },
  {
    path: '/admin/suppliers', title: 'Store: Data Feeds', menu: 'Store',
    what: 'The businesses we buy from and their price lists.',
    shows: 'Each supplier with its last price list, how many products, and Import.',
    source: 'Price lists the suppliers send, imported into ' + BACKEND + '.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/suppliers/[supplierId]', title: 'Supplier data feed', menu: 'Store > a supplier',
    what: 'One supplier: its price list, columns and import history.',
    shows: 'The column mapping, the imports and what each one changed.',
    source: 'The supplier\'s price lists in ' + BACKEND + '.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/catalog', title: 'Store Catalog', menu: 'Store > Catalog',
    what: 'Every product the store sells.',
    shows: 'The product list, 100 rows at a time, with search, publish and edit.',
    source: 'The catalogue in ' + BACKEND + ', built from the supplier price lists.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/catalog/merge', title: 'Merge duplicate products', menu: 'Store > Catalog > Merge duplicates',
    what: 'Products two suppliers both sell, to keep one and hide the other.',
    shows: 'One pair at a time, each needing your approval.',
    source: 'The catalogue in ' + BACKEND + ' (same brand and maker part number).',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/pricing', title: 'Pricing', menu: 'Store > Pricing',
    what: 'What each customer tier pays on top of our cost, and Make prices live.',
    shows: 'Tier markups, cost-band markups per supplier, the whole price list at every tier, and when prices were last made live.',
    source: 'Markups in ' + BACKEND + ', applied to supplier costs.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/brands', title: 'Brands', menu: 'Store > Brands',
    what: 'The brands in the store: their pages, logos and spellings.',
    shows: 'Each brand with its logo, page and how many products.',
    source: 'Brands found in the catalogue in ' + BACKEND + '.',
    access: 'Staff', guide: 'brands',
  },
  {
    path: '/admin/freight', title: 'Freight', menu: 'Store > Freight',
    what: 'Delivery prices for the online store.',
    shows: 'The minimum charge, size and weight rules, and the Australia Post and StarTrack options.',
    source: 'Freight settings in ' + BACKEND + '; carrier prices from Australia Post and StarTrack.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/review', title: 'Needs review', menu: 'Store > Needs review',
    what: 'Price list rows held back because their recommended price is below cost.',
    shows: 'Each held row with its cost and price, to accept or reject.',
    source: 'Supplier price list imports in ' + BACKEND + '.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/content', title: 'Photos & text', menu: 'Store > Photos & text',
    what: 'Photos and descriptions found on manufacturers\' websites for products going on the store.',
    shows: 'Each product with the photos and text found, to approve.',
    source: 'Manufacturers\' websites, fetched by ' + BACKEND + '.',
    access: 'Staff', guide: 'store',
  },
  {
    path: '/admin/marketplace', title: 'Marketplace', menu: 'Store > Marketplace',
    what: 'Products from outside suppliers such as CJ Dropshipping and AliExpress.',
    shows: 'Each supplier\'s set-up, searches and imported drafts, and supplier orders to check.',
    source: 'The suppliers\' own systems, through keys under Connections; drafts saved in ' + BACKEND + '.',
    access: 'Staff', guide: 'marketplace',
  },
  {
    path: '/admin/website-data', title: 'Website Data', menu: 'Website Data',
    what: 'Who visits the website and how Google shows it.',
    shows: 'An overview, with tabs for visitors, searches, titles, indexing, health, Shopping, Analytics and redirects.',
    source: 'Our own visit records in ' + BACKEND + ', Google Search Console and Google Analytics.',
    access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/visitors', title: 'Website Data: Visitors', menu: 'Website Data > Visitors',
    what: 'Visitors and where they came from.', shows: 'Visits by day, page and source.',
    source: 'Our own visit records in ' + BACKEND + '.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/opportunities', title: 'Website Data: Opportunities', menu: 'Website Data > Opportunities',
    what: 'Searches worth working on.', shows: 'Searches where we show up but few people click, with what to do.',
    source: 'Google Search Console.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/titles', title: 'Website Data: Titles', menu: 'Website Data > Titles',
    what: 'Page titles and descriptions to approve.', shows: 'Suggested titles and descriptions next to the current ones.',
    source: 'Google Search Console and the AI writer under AI Connections.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/indexing', title: 'Website Data: Indexing', menu: 'Website Data > Indexing',
    what: 'Whether Google has each page.', shows: 'Each page with Google\'s answer and when it was checked.',
    source: 'Google Search Console URL inspection.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/health', title: 'Website Data: Health', menu: 'Website Data > Health',
    what: 'The health of the website\'s pages.', shows: 'Problems found on the website\'s pages, page by page.',
    source: 'Checks run by ' + BACKEND + '.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/shopping', title: 'Website Data: Shopping', menu: 'Website Data > Shopping',
    what: 'Our products in Google Shopping.', shows: 'Which products Google accepted or refused, and why.',
    source: 'Google Merchant Center.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/analytics', title: 'Website Data: Analytics', menu: 'Website Data > Analytics',
    what: 'Google Analytics figures.', shows: 'Users, sessions and top pages.',
    source: 'Google Analytics.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/website-data/redirects', title: 'Website Data: Redirects', menu: 'Website Data > Redirects',
    what: 'Old shop addresses sent to the right page.', shows: 'Each old address, where it goes and how often it is used.',
    source: 'Redirect rules in ' + BACKEND + '.', access: 'Staff', guide: 'website-data',
  },
  {
    path: '/admin/build-progress', title: 'Build progress', menu: 'Build progress',
    what: 'Every coding job, how far along it is, the time and tokens it took, and its priority.',
    shows: 'Jobs with percent done, stage, time and tokens, and priority buttons.',
    source: 'A snapshot of the coding queue sent from VM 400 every 10 minutes, and GitHub.',
    access: 'Administrator', guide: 'build-progress',
  },
  {
    path: '/admin/about', title: 'About', menu: 'About',
    what: 'Which versions of the console and the backend are running, and what changed in each.',
    shows: 'Version, commit and build time of each, and their version histories.',
    source: 'The console version list (lib/consoleVersions.js) and the backend changelog.',
    access: 'Staff', guide: 'about',
  },
  {
    path: '/admin/guide', title: 'Help', menu: 'Help (top right)',
    what: 'How every part of the console works, step by step.',
    shows: 'The guide, one section per area, with contents on the left.',
    source: 'Written into the console (lib/adminGuide).',
    access: 'Staff', guide: '',
  },
  {
    path: '/admin/login', title: 'Sign in', menu: '', listed: false,
    what: 'Staff sign-in.', shows: 'Email, password and two-factor code.',
    source: 'Staff accounts in ' + BACKEND + '.', access: 'Anyone (sign-in page)', guide: 'account',
  },
  {
    path: '/admin/forgot-password', title: 'Forgot password', menu: '', listed: false,
    what: 'Ask for a password reset link.', shows: 'An email box.',
    source: 'Staff accounts in ' + BACKEND + '.', access: 'Anyone (sign-in page)', guide: 'account',
  },
  {
    path: '/admin/reset-password', title: 'Choose a new password', menu: '', listed: false,
    what: 'Set a new password from the emailed link.', shows: 'Two password boxes.',
    source: 'Staff accounts in ' + BACKEND + '.', access: 'Anyone (sign-in page)', guide: 'account',
  },
  {
    path: '/admin/website-intelligence', title: 'Website Intelligence (old address)', menu: '', listed: false,
    what: 'An old address that forwards to Leads or Store.', shows: 'Nothing: it forwards.',
    source: 'None.', access: 'Staff', guide: '',
  },
];

// The page list entry for an address (an order number or other changing part matches its [name]).
export function pageFor(pathname) {
  const clean = String(pathname || '').split(/[?#]/)[0].replace(/[/]+$/, '') || '/admin';
  return ADMIN_PAGES.find((page) => {
    const pattern = '^' + page.path.replace(/\[[^\]]+\]/g, '[^/]+') + '$';
    return new RegExp(pattern).test(clean);
  }) || null;
}

// The entries to show on Where to find everything, grouped by their top-menu item.
export function pagesByMenu() {
  const groups = [];
  for (const page of ADMIN_PAGES.filter((entry) => entry.listed !== false)) {
    const top = page.menu.split(' > ')[0] || 'Other';
    let group = groups.find((entry) => entry.top === top);
    if (!group) {
      group = { top, pages: [] };
      groups.push(group);
    }
    group.pages.push(page);
  }
  return groups;
}
