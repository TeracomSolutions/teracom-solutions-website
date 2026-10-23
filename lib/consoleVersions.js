// The console's own version history: what changed in the staff console (the front end of the
// backend), newest first, in plain English. Every change that reaches the console adds an entry
// here and a new top version, the same way the backend's CHANGELOG.md does. The About page shows
// this list next to the backend's, because the two are released separately.

export const CONSOLE_VERSIONS = [
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
