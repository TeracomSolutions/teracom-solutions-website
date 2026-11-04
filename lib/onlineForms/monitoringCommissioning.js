// The monitoring commissioning form: what we need to put a customer's alarm on monitoring.
// Rebuilt from Teracom's Zoho "Teracom Monitoring Commissioning Form B289" (Robert,
// 4 November 2026), with one deliberate difference: no dollar figures. The Zoho form quotes
// weekly rates per connection and per optional service; a stale price on a public page is a
// misleading pricing claim, so the charges are the ones quoted to the customer and confirmed
// before monitoring starts (lib/monitoring.js says the same).

const STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

export default {
  key: 'monitoring-commissioning',
  version: '1',
  live: true,
  title: 'Monitoring commissioning form',
  shortTitle: 'Commissioning form',
  referencePrefix: 'MC',
  eyebrow: 'Monitoring',
  lead: 'Everything we need to put your alarm on monitoring: the site, the panel, who to call and what to do when it goes off.',
  intro: [
    'Fill this in once you have agreed to monitoring with us. It takes about ten minutes; have your panel details and your contact list handy.',
    'The weekly price and any optional services are charged as quoted to you. We confirm them in writing before monitoring starts.',
    'You sign at the end. We email you a signed copy, and your site is programmed from what you send.',
  ],
  identity: { name: 'name', email: 'email', company: 'company', phone: 'phone' },
  sections: [
    {
      id: 'you',
      title: 'About you',
      fields: [
        { id: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
        { id: 'company', label: 'Client or company name', type: 'text', required: true, autoComplete: 'organization' },
        { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
        { id: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
        { id: 'clientCode', label: 'Client code', type: 'text', help: 'Only if we have already given you one.', width: 'half' },
      ],
    },
    {
      id: 'site',
      title: 'The site',
      fields: [
        { id: 'street', label: 'Street address', type: 'text', required: true, autoComplete: 'address-line1' },
        { id: 'street2', label: 'Address line 2', type: 'text', autoComplete: 'address-line2' },
        { id: 'suburb', label: 'Suburb', type: 'text', required: true, autoComplete: 'address-level2' },
        { id: 'state', label: 'State', type: 'select', required: true, options: STATES, width: 'half' },
        { id: 'postcode', label: 'Postcode', type: 'text', required: true, width: 'half', autoComplete: 'postal-code' },
        { id: 'nearestCorner', label: 'Nearest cross street', type: 'text', help: 'Helps a patrol find the site at night.' },
        { id: 'premisesPhone', label: 'Phone at the premises', type: 'tel' },
      ],
    },
    {
      id: 'panel',
      title: 'The alarm system',
      fields: [
        { id: 'panelBrand', label: 'Panel brand', type: 'text', required: true, help: 'For example Bosch, Inner Range, Hikvision AX PRO, Paradox.' },
        { id: 'panelModel', label: 'Panel model', type: 'text', required: true },
        { id: 'panelLocation', label: 'Where the control panel is', type: 'text', required: true },
        { id: 'powerLocation', label: 'Where its power point is', type: 'text' },
        { id: 'keypadLocation', label: 'Where the keypads are', type: 'text', required: true },
        {
          id: 'connection',
          label: 'How the panel connects to us',
          type: 'select',
          options: [
            'Dialler (phone line)',
            'Telstra Secure Wireless',
            'Permaconn dual SIM 4G',
            'Direct Wireless (SCSI) dual SIM',
            'Telstra Secure single SIM',
            'Inner Range Multipath',
            'IP monitoring (Bosch)',
            'IP monitoring (Honeywell)',
            'Other',
            'Not sure, please advise',
          ],
          help: 'As quoted to you. If you are not sure, choose Not sure and we will confirm it.',
        },
        { id: 'communicatorBrand', label: 'Communicator brand', type: 'text', help: 'The 4G or IP module, if there is one.', width: 'half' },
        { id: 'communicatorSerial', label: 'Communicator serial number', type: 'text', width: 'half' },
        {
          id: 'testReport',
          label: 'How often the panel sends a test report',
          type: 'select',
          options: ['Every hour', 'Every 12 hours', 'Every 24 hours', 'Every week (168 hours)'],
          help: 'If the test report does not arrive we treat it as a fault. Most sites use every 24 hours.',
        },
      ],
    },
    {
      id: 'service',
      title: 'Your monitoring service',
      fields: [
        { id: 'term', label: 'Monitoring term', type: 'select', required: true, options: ['12 months', '18 months', '24 months', '36 months', '48 months', '60 months'], help: 'The minimum term is 12 months.' },
        {
          id: 'options',
          label: 'Optional services',
          type: 'checkboxes',
          options: [
            { value: 'Late to close alerts', description: 'We let you know when the site is not armed by its closing time.' },
            { value: 'Patrol attendance when needed', description: 'A patrol is sent under the patrol instructions below; each attendance is charged.' },
            { value: 'Monthly reports', description: 'A report of openings, closings and alarms.' },
          ],
          help: 'Charged as quoted to you.',
        },
        { id: 'noCancelCodes', label: 'Cancel codes', type: 'checkboxes', options: [{ value: 'My panel is not programmed to send cancel codes', description: 'Without cancel codes we cannot tell a false alarm you have cancelled from a real one, so a small weekly charge applies.' }] },
        { id: 'billingEmail', label: 'Email for invoices', type: 'email', required: true, help: 'Monitoring is invoiced quarterly in advance.' },
      ],
    },
    {
      id: 'zones',
      title: 'Zones and areas',
      fields: [
        { id: 'zoneNote', label: 'Zones and areas', type: 'note', text: 'Type the zone list (zone number and what it covers, such as 1 Front door reed) or attach the list from your installer. Do the same for areas if the panel has more than one.' },
        { id: 'zoneList', label: 'Zone list', type: 'textarea', rows: 6 },
        { id: 'zoneFile', label: 'Zone list file', type: 'file' },
        { id: 'areaList', label: 'Area list', type: 'textarea', rows: 3 },
        { id: 'areaFile', label: 'Area list file', type: 'file' },
      ],
    },
    {
      id: 'contacts',
      title: 'Who we call',
      fields: [
        {
          id: 'contacts',
          label: 'Contact list',
          type: 'repeater',
          required: true,
          min: 1,
          max: 10,
          rowLabel: 'contact',
          help: 'In the order we should call them. The voice code is a single word or number the control room asks for to confirm who they are speaking to.',
          fields: [
            { id: 'name', label: 'First and last name', required: true },
            { id: 'phone', label: 'Mobile', required: true, type: 'tel' },
            { id: 'userNumber', label: 'User number in the panel', width: 'half' },
            { id: 'voiceCode', label: 'Voice code', width: 'half' },
          ],
        },
        { id: 'hours', label: 'Operating hours', type: 'hours', help: 'When the site is normally open (24-hour times, such as 0730 and 1730). Leave a day blank if it is closed.' },
      ],
    },
    {
      id: 'patrols',
      title: 'Patrols',
      fields: [
        { id: 'patrolRequired', label: 'Do you want patrols sent?', type: 'radio', required: true, options: ['Yes', 'No'] },
        {
          id: 'patrolInstruction',
          label: 'When to send a patrol',
          type: 'radio',
          showIf: { field: 'patrolRequired', equals: 'Yes' },
          options: [
            { value: 'Nearest patrol', description: 'Sent when no after-hours contact can be reached. This is what we do if you do not choose.' },
            { value: 'No patrol unless authorised by after-hours contacts', description: 'Only with the consent of one of your contacts.' },
            { value: 'Patrols on multi-hit alarms only', description: 'Only when the same zone alarms more than once and no contact can be reached.' },
            { value: 'Patrols on multi-zone alarms only', description: 'Only when more than one zone alarms and no contact can be reached.' },
            { value: 'No patrols for time-based events', description: 'Not when the site fails to arm on schedule or is opened out of hours.' },
            { value: 'Patrol only', description: 'A patrol for every event; after-hours contacts are for emergencies.' },
          ],
        },
        { id: 'patrolCompany', label: 'Your own patrol company', type: 'text', showIf: { field: 'patrolRequired', equals: 'Yes' }, help: 'If you use a nominated patrol company, who it is and whether they hold keys.' },
        { id: 'instructions', label: 'Special instructions', type: 'textarea', rows: 4, help: 'Anything the control room should know: dogs on site, access codes for gates, who never to call.' },
      ],
    },
  ],
  agreement: {
    schedules: [{ id: 'schedule-3', title: 'Schedule 3 (Monitoring services)' }],
    statement:
      'I have read and agree to the Teracom Terms and Conditions, including Schedule 3 (Monitoring services), and I am authorised to sign for the client named above.',
  },
};
