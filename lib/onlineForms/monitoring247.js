// 24/7 Monitoring sign-up (Global Platform session for Robert, 4 November 2026; teracom-ai-docs
// Workstreams/MONITORING_247_SCOPE_2026-11-04.md, decision SD-094): an AI answers the alarms
// for servers, switches, links, services and backups, or they are passed to a partner control
// room through our workflow. This collects what Global needs to set the site and its response
// plans up. Not live (live: false): the alarm, CCTV and human-response legal review still
// stands, so it opens only with ?preview=1 and is not indexed or linked.

const ACTIONS = [
  'Tell us only',
  'Try to fix it, then tell us',
  'Call contact 1, then contact 2',
  'Pass it to the control room',
];

export default {
  key: 'monitoring-247',
  version: '1',
  live: false,
  title: '24/7 Monitoring sign-up',
  shortTitle: '24/7 Monitoring',
  referencePrefix: 'MW',
  eyebrow: 'Monitoring',
  lead: 'Tell us what to watch, who to call and what to do when something goes wrong, day or night.',
  intro: [
    'Our AI watches your servers, network, internet links, services and backups around the clock. When something goes off it follows the response plan you set here, tells the people you name and keeps a log until it is closed.',
    'If you would rather a control room took your alarms, choose that service and we pass them to our partner control room through the same workflow.',
    'The AI never changes anything on your systems by itself, except the actions you approve below.',
  ],
  identity: { name: 'name', email: 'email', company: 'company', phone: 'phone' },
  sections: [
    {
      id: 'you',
      title: 'About you',
      fields: [
        { id: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
        { id: 'company', label: 'Business name', type: 'text', required: true, autoComplete: 'organization' },
        { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
        { id: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
        { id: 'orderRef', label: 'Order number', type: 'text', help: 'From your store order, if you have one.', width: 'half' },
      ],
    },
    {
      id: 'service',
      title: 'The service',
      fields: [
        {
          id: 'service',
          label: 'Which service',
          type: 'radio',
          required: true,
          options: [
            { value: 'AI monitoring', description: 'The AI answers every alarm, follows your plan and tells your contacts.' },
            { value: 'Control room monitoring', description: 'Alarms are passed to our partner control room, with the documentation we provide.' },
          ],
        },
      ],
    },
    {
      id: 'site',
      title: 'The site',
      fields: [
        { id: 'siteName', label: 'Site name', type: 'text', required: true, help: 'For example Head office or Warehouse.' },
        { id: 'street', label: 'Street address', type: 'text', required: true, autoComplete: 'address-line1' },
        { id: 'suburb', label: 'Suburb', type: 'text', required: true, autoComplete: 'address-level2' },
        { id: 'state', label: 'State', type: 'select', required: true, options: ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'], width: 'half' },
        { id: 'postcode', label: 'Postcode', type: 'text', required: true, width: 'half', autoComplete: 'postal-code' },
      ],
    },
    {
      id: 'watch',
      title: 'What to watch',
      fields: [
        { id: 'watchNote', label: 'What to watch', type: 'note', text: 'Roughly how many of each. We confirm the exact list when we connect them.' },
        { id: 'servers', label: 'Servers', type: 'number', width: 'half' },
        { id: 'switches', label: 'Network switches', type: 'number', width: 'half' },
        { id: 'firewalls', label: 'Firewalls', type: 'number', width: 'half' },
        { id: 'links', label: 'Internet links', type: 'number', width: 'half' },
        { id: 'services', label: 'Services and applications', type: 'number', width: 'half' },
        { id: 'backups', label: 'Backup jobs', type: 'number', width: 'half' },
        { id: 'other', label: 'Anything else', type: 'textarea', rows: 3 },
      ],
    },
    {
      id: 'contacts',
      title: 'Who we tell',
      fields: [
        {
          id: 'contacts',
          label: 'Contacts',
          type: 'repeater',
          required: true,
          min: 1,
          max: 10,
          rowLabel: 'contact',
          help: 'In the order we should call them.',
          fields: [
            { id: 'name', label: 'Name', required: true },
            { id: 'role', label: 'Role' },
            { id: 'phone', label: 'Mobile', required: true, type: 'tel' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'hours', label: 'When they may be called', help: 'For example any time, or 7am to 10pm.' },
          ],
        },
      ],
    },
    {
      id: 'plans',
      title: 'Response plans',
      fields: [
        {
          id: 'plans',
          label: 'What to do for each kind of alarm',
          type: 'grid',
          required: true,
          options: ACTIONS,
          rows: [
            { id: 'server', label: 'A server stops responding' },
            { id: 'switch', label: 'A switch or part of the network drops out' },
            { id: 'firewall', label: 'The firewall reports a threat' },
            { id: 'link', label: 'An internet link goes down' },
            { id: 'service', label: 'A service or application stops' },
            { id: 'backup', label: 'A backup fails' },
            { id: 'other', label: 'Anything else' },
          ],
          help: 'Pass it to the control room only works with control room monitoring.',
        },
        {
          id: 'approved',
          label: 'Actions the AI may take by itself',
          type: 'checkboxes',
          options: [
            { value: 'Restart a stopped service', description: 'On the servers we watch, then check it came back.' },
            { value: 'Restart a server that has stopped responding', description: 'Only through its management interface.' },
            { value: 'Switch to the backup internet link', description: 'Where you have one.' },
            { value: 'Re-run a failed backup', description: 'Once, then tell you if it fails again.' },
          ],
          help: 'Leave all unticked and the AI changes nothing by itself: it tells you and waits for your approval.',
        },
        { id: 'notes', label: 'Anything else we should know', type: 'textarea', rows: 4 },
      ],
    },
  ],
  agreement: {
    schedules: [
      { id: 'schedule-4', title: 'Schedule 4 (Teracom AI platform)' },
      { id: 'schedule-3', title: 'Schedule 3 (Monitoring services)', showIf: { field: 'service', equals: 'Control room monitoring' } },
    ],
    statement:
      'I have read and agree to the Teracom Terms and Conditions, including the schedules named here, and I am authorised to sign for the business named above.',
  },
};
