// Teracom AI as the platform under everything Teracom does (Robert's CTO
// action brief, 2026-10-01): the services it powers, the eight pillars, the
// outcomes it is sold on, how it differs from general AI assistants and the
// security it is built with. Shared by the homepage and /teracom-ai so
// the message reads the same everywhere.

export const PLATFORM_SERVICES = [
  { title: 'Consulting', text: 'System design, architecture reviews and independent advice.', href: '/services/security-design-consulting' },
  { title: 'Integration Development', text: 'Access, video, alarms and business software working as one.', href: '/services/integration-development' },
  { title: 'Installation', text: 'Security, networking and building systems installed and commissioned.', href: '/services' },
  { title: 'Support', text: 'Maintenance, health checks and technical support for the life of the system.', href: '/services/maintenance-support' },
  { title: 'Managed Services', text: 'Alarm monitoring and managed systems, looked after for you.', href: '/monitoring' },
];

export const PLATFORM_PILLARS = [
  { title: 'Organisational Memory', text: 'What your people know, kept and easy to find.' },
  { title: 'Departments', text: 'Seven Departments, each with its own digital workers, deployed one at a time.' },
  { title: 'Data Sovereignty', text: 'Your data stays yours, in Australia or on your own servers.' },
  { title: 'Organisation Protection', text: 'Knowledge and systems protected as the assets they are.' },
  { title: 'Industry Expertise', text: 'Built from real field work in security, building and IT.' },
  { title: 'Human-Governed AI Execution', text: 'AI does the work. People approve what matters.' },
  { title: 'Enterprise Security', text: 'Roles, encryption and audit logs as standard.' },
  { title: 'On-Premise AI Deployment', text: 'Run the platform and its models on your own hardware.' },
];

export const MEMORY_STEPS = [
  { lead: 'Capture', accent: 'Knowledge.', text: 'Procedures, product know-how, past projects and the answers your best people give every day, captured as the work happens.' },
  { lead: 'Protect', accent: 'Knowledge.', text: 'Kept inside your organisation and under your control, with access by role and every use logged.' },
  { lead: 'Transform Knowledge', accent: 'Into Labour.', text: 'Turned into digital specialists that answer questions, draft documents and take routine work off your team.' },
];

export const MEMORY_THEMES = ['Organisational Memory', 'Digital Workers', 'Knowledge Retention', 'Workforce Augmentation', 'AI-Powered Operational Excellence'];

export const BUSINESS_OUTCOMES = [
  { title: 'Reduce documentation creation time', text: 'Scopes, reports and handover documents drafted in minutes, then checked by your team.' },
  { title: 'Improve tender response accuracy', text: 'Compliance and technical answers drawn from what you have already written and won.' },
  { title: 'Preserve organisational knowledge', text: 'Know-how stays when people retire, resign or change roles.' },
  { title: 'Accelerate staff onboarding', text: 'New starters can ask the organisation, not just the person next to them.' },
  { title: 'Reduce technical support escalations', text: 'Technicians find the answer on site instead of calling the senior engineer.' },
  { title: 'Improve estimation consistency', text: 'Every estimator starts from the same structure and the same assumptions.' },
  { title: 'Capture expert knowledge before it is lost', text: 'Your most experienced people’s answers recorded while they are still here.' },
  { title: 'Increase workforce productivity', text: 'Routine work handled by digital workers, so people spend their time where people are needed.' },
];

export const GENERAL_AI_TRAITS = [
  'Generic: built for everyone',
  'Session based: context lives in each chat',
  'Designed around the individual user',
  'Limited organisational context',
];

export const TERACOM_AI_TRAITS = [
  'Organisation specific',
  'Persistent organisational memory',
  'A digital workforce',
  'Department specialists',
  'Industry knowledge built in',
  'Data sovereignty',
  'On-premise deployment',
  'Enterprise governance',
];

export const TRUST_POINTS = [
  'Australian Owned',
  'Australian Hosted Options',
  'On-Premise Deployment Available',
  'Customer Data Sovereignty',
  'Role-Based Access Control',
  'Encrypted Communications',
  'Audit Logging',
  'Secure Update Distribution',
  'Organisational Memory Protection',
  'Enterprise Security Architecture',
];

export const AI_SECURITY = [
  { title: 'Customer data sovereignty', text: 'Your data stays under your control, hosted in Australia or on your own servers.' },
  { title: 'Local AI processing', text: 'Models can run on local hardware, so questions and documents need not leave your network.' },
  { title: 'On-premise deployment', text: 'The whole platform can run inside your own environment.' },
  { title: 'Organisational memory protection', text: 'Your organisation’s memory is access-controlled and managed by your own administrators.' },
  { title: 'Role-based security', text: 'People see and do only what their role allows.' },
  { title: 'Encryption in transit', text: 'Every connection to and within the platform is encrypted.' },
  { title: 'Encryption at rest', text: 'Stored data is encrypted on disk.' },
  { title: 'Secure update delivery', text: 'Updates arrive through a secure channel and are applied under your control.' },
  { title: 'Audit logging', text: 'Actions are recorded, so you can see who did what and when.' },
];

// The Departments and Industry Packs in early access (Robert, 2026-10-28: Departments replace the old
// operating-system names). Each links to the contact form with its name filled in, so interest is captured.
export const EARLY_ACCESS_MODULES = ['Finance Department', 'Operations Department', 'Trades and Field Services Pack', 'IT and Managed Services Pack'];

// The product model (Teracom Product Model V1, 27 October 2026): an organisation is a set of Departments,
// specialised by Industry Packs, extended by governed Extensions, on one organisational memory.
export const PRODUCT_TAGLINE = 'Deploy a Department. Or build an entire AI organisation.';
export const PRODUCT_CATEGORY = 'The organisational continuity platform: memory, digital workers and protection, deployed a Department at a time.';

export const DEPARTMENTS = [
  { name: 'Executive', purpose: 'Know where the organisation stands, decide, and keep its commitments: goals, decisions, meetings, actions and risks in one picture.', workers: ['Chief of Staff', 'Meeting Scribe', 'Goal Tracker'] },
  { name: 'Finance', purpose: 'Know what you owe, own and expect, and stay solvent. Bills, budgets, reconciliation and cash forecasts; it prepares payments and never makes them.', workers: ['Accounts Payable', 'Reconciliation', 'Cash Forecaster', 'Month-end Closer'] },
  { name: 'Sales', purpose: 'Find, win and keep revenue, with a pipeline kept honest by evidence and follow-through, from first lead to tender.', workers: ['Lead Qualifier', 'Quote Builder', 'Tender Scout', 'Follow-up Coach'] },
  { name: 'Marketing', purpose: 'Be found and chosen: audiences, campaigns, content and brand, with spend and enquiries tracked to what works.', workers: ['Campaign Planner', 'Content Writer', 'Brand Guard'] },
  { name: 'Operations', purpose: 'Deliver the work: jobs, suppliers, resources, schedules and quality, with the late and the stretched shown first.', workers: ['Scheduler', 'Supplier Chaser', 'Dispatcher', 'Maintenance Planner'] },
  { name: 'Customer', purpose: 'Resolve problems and keep customers. Answers come with their sources, and what could not be answered is learned.', workers: ['Triage', 'Answer Engine', 'Knowledge Curator', 'Success Manager'] },
  { name: 'Technology and Protection', purpose: 'Keep the organisation running and safe: systems, security, patching, backups that restore, and continuity.', workers: ['Patch Planner', 'Cyber Expert', 'Backup Verifier', 'Continuity Officer'] },
];

export const INDUSTRY_PACKS = [
  { name: 'Household and Family Office', text: 'Property, vehicles, policies, trusts and super, renewals and advisers.' },
  { name: 'Trades and Field Services', text: 'Jobs, quotes, certificates and licences, crew scheduling and site records.' },
  { name: 'Professional Services', text: 'Engagements, utilisation, work in progress, proposals and billing milestones.' },
  { name: 'Government and Tender Supply', text: 'Tender sources, closing calendar, win themes and compliance checklists.' },
  { name: 'Retail and Ecommerce', text: 'Catalogue, orders, returns, campaign pace and customer feedback.' },
  { name: 'IT and Managed Services', text: 'Tickets, service levels, asset registers, patch windows and client environments.' },
];

export const EXTENSION_TYPES = [
  { name: 'Data connectors', text: 'Read from accounting, banking, email, calendars and monitoring, read-only first, with your own credentials.' },
  { name: 'Actions', text: 'Do something outside, such as sending a quote, always through an approval.' },
  { name: 'Model providers', text: 'Local AI models first; outside providers only if you switch them on, with spending caps.' },
  { name: 'Components', text: 'New kinds of chart or screen element, design-reviewed before use.' },
  { name: 'Adapters', text: 'New kinds of record mapped into your organisation’s memory.' },
];

export const PRODUCT_RULE = 'If what you want can be built from existing screens and data, the AI arranges it for you straight away. If it needs your industry’s words or worker behaviour, it comes in an Industry Pack. If it needs a new data source or action, it comes as an Extension, built and reviewed before anyone uses it. The AI arranges; it never writes software.';

export const JOURNEY_STEPS = [
  { title: 'Deploy a Department', text: 'Choose the function that needs help most, and the Industry Pack that fits your organisation.' },
  { title: 'Connect', text: 'Connect accounting, email, banking or devices with your own credentials, read-only first.' },
  { title: 'Memory builds', text: 'Documents, suppliers, customers and obligations become one organised picture, with sources shown.' },
  { title: 'Workers propose, you approve', text: 'A morning brief and an Inbox of questions, approvals and opportunities, each with evidence.' },
  { title: 'Add the next Department', text: 'The same memory serves every Department, so each one makes the others better.' },
  { title: 'Protect and continue', text: 'Backups that restore, patch status and a key-person map, so the organisation keeps working when people change.' },
];

export const CUSTOMER_PROMISES = [
  'You own your data, and it stays where you put it.',
  'Nothing happens without your say-so.',
  'Everything the AI tells you shows where it came from.',
  'You can leave, and your memory leaves with you.',
  'Your organisation keeps working when people, software or models change.',
];
