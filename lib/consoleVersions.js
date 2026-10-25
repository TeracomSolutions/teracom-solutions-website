// The console's own version history: what changed in the staff console (the front end of the
// backend), newest first, in plain English. Every change that reaches the console adds an entry
// here and a new top version, the same way the backend's CHANGELOG.md does. The About page shows
// this list next to the backend's, because the two are released separately.

export const CONSOLE_VERSIONS = [
  {
    version: '1.14.2',
    date: '2026-10-25',
    notes: [
      "Help > Luneva: going online now follows the current Cloudflare, Vercel and Crazy Domains instructions, with the Access protection set up before the tunnel.",
    ],
  },
  {
    version: '1.14.1',
    date: '2026-10-25',
    notes: [
      'Help: Luneva: going online, the call sheet for putting Luneva\'s admin console online (Teracom\'s console only).',
    ],
  },
  {
    version: '1.14.0',
    date: '2026-10-25',
    notes: [
      'A new sign-in page: one of the website\'s photos beside the form, a different one each day, with the sign-in on the right. A copy of the console for another business shows no Teracom picture.',
    ],
  },
  {
    version: '1.13.1',
    date: '2026-10-25',
    notes: [
      'A copy of the console run for another business on its own address (ADMIN_ONLY=true) shows only the console: public website pages go to the console and the website\'s other API calls are not found.',
    ],
  },
  {
    version: '1.13.0',
    date: '2026-10-25',
    notes: [
      'Sales: Carts and unfinished checkouts shows saved carts of signed-in customers, abandoned value, the products left behind most and expired or failed checkouts, with a CSV. Off until an Administrator switches it on after the privacy policy covers it.',
    ],
  },
  {
    version: '1.12.1',
    date: '2026-10-25',
    notes: [
      'Operator permissions: the tick boxes sit beside each section name and the form uses the full width.',
    ],
  },
  {
    version: '1.12.0',
    date: '2026-10-25',
    notes: [
      'Account > Operator permissions: make named permission sets with a tick box per section and Read only or Read and write, including parts of Store, Website Data and Connections, then give a set to any Limited access user under Users.',
    ],
  },
  {
    version: '1.11.2',
    date: '2026-10-25',
    notes: [
      'Account permissions: Marketing and Website code changes can each be set to No access, Read only or Read and write for a Limited access user, and Marketing is hidden from the menu for someone without it.',
      'Coupons now obey the Coupons permission: Read only may look but not create or change codes, and No access cannot open them.',
    ],
  },
  {
    version: '1.11.1',
    date: '2026-10-25',
    notes: [
      'Connections: Stripe and Cloudflare Turnstile no longer drop back to Not checked yet. When their last check is more than a day old the page checks them again and keeps the answer.',
    ],
  },
  {
    version: '1.11.0',
    date: '2026-10-25',
    notes: [
      'Marketing (new menu item): add the specials and offers that are on; they show in a banner across the website while they run, and a weekly specials update for customers and every social network is made in Social > Posting (off until you switch it on, and a draft to check unless Send it automatically is on).',
    ],
  },
  {
    version: '1.10.0',
    date: '2026-10-25',
    notes: [
      'Orders: every order shows where it is up to, from Paid to Complete, as a strip on the orders list and in full on the order page, with times, Zoho links, problems and the button that moves it on. Filter by stage, or show only orders stuck for a day.',
      'Connections > Zoho order flow: a How the flow works list shows every stage ON, OFF or PREVIEW and what happens to the next paid order; new switches for Prices on items, Mark invoices sent and Send purchase orders; each switch says what off means.',
    ],
  },
  {
    version: '1.9.1',
    date: '2026-10-25',
    notes: [
      'Where to find everything fits the screen without scrolling sideways, and the Where to find, Help and View website links sit together at the top right.',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-10-25',
    notes: [
      'Where to find everything (top right): every console page, how to get to it, what it shows and where the information comes from, with links.',
      'Every page has an About this page button with the same details and a link to its help.',
      'The Overview shows the latest changes under What\'s new.',
      'A new console page cannot be released without its entry in the page list.',
    ],
  },
  {
    version: '1.8.2',
    date: '2026-10-25',
    notes: [
      'Behind the scenes: every change is now checked in a real browser on a desktop and a phone, with screenshots; a page that loses its styling or spills off the screen stops the change.',
    ],
  },
  {
    version: '1.8.1',
    date: '2026-10-25',
    notes: [
      'The Overview page opens with a red wave behind the heading and Tera the mascot on the right (not on a copy of the console for another business).',
      'The logo at the top of the console is 30% bigger.',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-10-25',
    notes: [
      'The Overview blocks now match the top menu: the same areas in the same order, with new blocks for Audit log, Sales, Build progress and About (Help stays at the top right).',
      'The Overview page has colour behind the blocks.',
    ],
  },
  {
    version: '1.7.5',
    date: '2026-10-25',
    notes: [
      'A copy of the console for another business shows its own name in the Help guide from the first load, and the Assistant reads the help with that name.',
    ],
  },
  {
    version: '1.7.4',
    date: '2026-10-25',
    notes: [
      'The Help page for the Assistant describes the new chat window and the card that follows a front-end change request.',
    ],
  },
  {
    version: '1.7.3',
    date: '2026-10-24',
    notes: [
      'The page-not-found screen of a copy of the console for another business no longer carries the public site wording.',
    ],
  },
  {
    version: '1.7.2',
    date: '2026-10-24',
    notes: [
      'A copy of the console for another business no longer carries the public site header, footer or Ask Tera widget in its page source, and its share-image text uses the business name.',
    ],
  },
  {
    version: '1.7.1',
    date: '2026-10-24',
    notes: [
      'A copy of the console for another business now has that business name in every page title from the first load, not only after the page opens.',
    ],
  },
  {
    version: '1.7.0',
    date: '2026-10-24',
    notes: [
      'The Assistant is a proper chat: replies are formatted (lists, code blocks with a Copy button, links), your messages sit on the right, the message box is a rounded composer at the bottom, and starting prompts are cards.',
      'Asking for a change to the website front end in the chat shows a card that follows the request from waiting to a pull request.',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-10-24',
    notes: [
      'About shows both the console versions and the backend versions, each with its own history of changes and a filter.',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-10-24',
    notes: [
      'A copy of the console for another business (Luneva) can set its own name, logo, website link and staff sign-in domain; help, guide and page text then use that name instead of Teracom, and the page source carries no Teracom details.',
      'The AI Connections table is one line per provider; click a row for the key, the full status and the last message.',
      'The front end and back end AI lists refresh each other.',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-10-23',
    notes: [
      'Assistant: ask for a change to the public website in plain English, either in the chat or in Code changes; OpenHands writes it, it is tested and arrives as a pull request.',
      'Security update: React 19.3.1, Node 22, packages installed without scripts.',
      'Admin Guide passages for Build progress, the two AI assistants, the Zoho switches, making prices live and the new audit events.',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-10-22',
    notes: [
      'Build progress page: where each build item stands, the coding factory, jobs with percent, time and tokens, sessions, and Up, Down, Do next and Do first to choose what is coded first.',
      'AI Connections is split into the AI assistant for the front end (Tera) and the back end, each with its own connections and governance rules; each connection and rule has a Used for setting.',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-10-21',
    notes: [
      'Pricing: Make prices live now, with what changed, when prices last changed and when they were last made live.',
      'Connections: Zoho order flow switches (order flow, send to Zoho, preview or test mode, and a switch for customers, items, invoices, payments and purchase orders); the Zoho card steps now say to use a Server-based client.',
      'AI Connections: automatic checks with retries and Check all now.',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-10-20',
    notes: [
      'About section: which version of the backend the console talks to, and the history of its changes.',
      'Marketplace: supplier search, drafts, approval and supplier orders, with CJ Dropshipping and AliExpress connectors, a spreadsheet import, and settings and keys on the Connections page.',
      'Audit log: filters by person, kind and date, search by name, CSV export and many more recorded events.',
      'Users and permissions: Limited access with No access, Read only or Read and write per section.',
      'Orders moved into Sales, with an Orders dashboard.',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-10-19',
    notes: [
      'The console as it stood when versions began: store catalogue and pricing, supplier price lists, Scout, Resources, Leads, Social, Support (Ask Tera), website data, connections and the Assistant.',
    ],
  },
];

export const CONSOLE_VERSION = CONSOLE_VERSIONS[0];
