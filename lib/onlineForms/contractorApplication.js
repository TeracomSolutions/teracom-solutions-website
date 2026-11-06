// Contractor information form, rebuilt from Teracom's "Contractor Information Form" (2019,
// Z:\Teracom Solution Pty Ltd\Contractors). Robert, 6 November 2026: every form on the website.
// Differences from the paper form:
//  - No bank details. A web form that collects account numbers invites invoice fraud (anyone can
//    fill it in with someone else's ABN); accounts collects them once a contractor is approved,
//    and confirms them by phone.
//  - The witness signature is dropped: the online signature records who signed and when.
//  - Insurance certificates and licences are attached here instead of "please supply a copy".

const STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
const YES_NO = ['Yes', 'No'];

const SERVICES = [
  'Electrical', 'Alarm systems', 'Access control', 'CCTV', 'Intercom systems', 'Fire systems',
  'Data and network cabling', 'Fibre', 'Distributed audio', 'Distributed video and AV', 'Solar',
  'Auto doors', 'Locksmithing', 'Hydraulics or plumbing', 'HVAC or refrigeration', 'Lifts',
  'CAD or drawing services', 'General building repair or carpentry', 'Painting', 'Roofing',
  'Glazing', 'Cleaning', 'Grounds or landscaping',
];

const yesNoWithDetail = (id, label) => [
  { id, label, type: 'radio', required: true, options: YES_NO },
  { id: `${id}Detail`, label: 'Details', type: 'text', showIf: { field: id, equals: 'Yes' } },
];

export default {
  key: 'contractor-application',
  version: '1',
  live: true,
  title: 'Contractor information form',
  shortTitle: 'Contractor form',
  referencePrefix: 'CON',
  eyebrow: 'Work with us',
  lead: 'Want to do work for Teracom Solutions as a subcontractor? Tell us about your business, your people, your insurance and your safety systems.',
  intro: [
    'This is the first step to being engaged as a Teracom subcontractor. It takes about fifteen minutes; have your ABN, insurance certificates and licences handy.',
    'It must be completed by a director or a person a director has nominated. We email you a signed copy, and our team will be in touch about our contractor agreement and site induction.',
    'We do not ask for bank details here. If you are approved, our accounts team collects them separately and confirms them with you by phone.',
  ],
  identity: { name: 'name', email: 'email', company: 'legalName', phone: 'phone' },
  sections: [
    {
      id: 'business',
      title: 'Your business',
      fields: [
        { id: 'legalName', label: 'Legal entity name', type: 'text', required: true, autoComplete: 'organization' },
        { id: 'tradingAs', label: 'Trading as', type: 'text' },
        { id: 'abn', label: 'ABN', type: 'text', required: true, width: 'half' },
        { id: 'acn', label: 'ACN', type: 'text', width: 'half' },
        { id: 'street', label: 'Street address', type: 'text', required: true, autoComplete: 'address-line1' },
        { id: 'suburb', label: 'Suburb', type: 'text', required: true, autoComplete: 'address-level2' },
        { id: 'state', label: 'State', type: 'select', required: true, options: STATES, width: 'half' },
        { id: 'postcode', label: 'Postcode', type: 'text', required: true, width: 'half', autoComplete: 'postal-code' },
        { id: 'website', label: 'Website', type: 'text' },
        { id: 'areas', label: 'Areas you cover', type: 'text', help: 'For example: Melbourne metro and Geelong, or all of Victoria.' },
      ],
    },
    {
      id: 'contact',
      title: 'Main contact',
      fields: [
        { id: 'name', label: 'Full name', type: 'text', required: true, autoComplete: 'name' },
        { id: 'position', label: 'Position', type: 'text', required: true, width: 'half' },
        { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
        { id: 'phone', label: 'Mobile', type: 'tel', required: true, autoComplete: 'tel', width: 'half' },
        { id: 'afterHours', label: 'After-hours phone', type: 'tel', width: 'half' },
        { id: 'accountsEmail', label: 'Accounts email', type: 'email', help: 'Where purchase orders and remittances should go.' },
      ],
    },
    {
      id: 'services',
      title: 'What you do',
      fields: [
        { id: 'servicesDirect', label: 'Services you provide with your own staff', type: 'checkboxes', required: true, options: SERVICES },
        { id: 'servicesSub', label: 'Services you provide through your own subcontractors', type: 'checkboxes', options: SERVICES },
        { id: 'specialist', label: 'Specialist services, brands or systems you know well', type: 'textarea', rows: 3 },
        {
          id: 'projectSize',
          label: 'Largest job you would take on',
          type: 'radio',
          options: ['Under 20k', '20k to 50k', '50k to 100k', 'Over 100k'],
        },
      ],
    },
    {
      id: 'people',
      title: 'Your people',
      fields: [
        { id: 'staffManagement', label: 'Management and admin staff', type: 'number', width: 'half' },
        { id: 'staffTrade', label: 'Trade-qualified staff', type: 'number', width: 'half' },
        { id: 'staffSkilled', label: 'Skilled labour', type: 'number', width: 'half' },
        { id: 'staffOther', label: 'Other', type: 'number', width: 'half' },
        {
          id: 'workers',
          label: 'People who would work on Teracom jobs',
          type: 'repeater',
          rowLabel: 'person',
          max: 20,
          help: 'With the cards and licences each one holds, such as a White Card, police check, security licence, electrical or cabling registration, working at heights or EWP.',
          fields: [
            { id: 'name', label: 'Name', required: true },
            { id: 'cards', label: 'Cards, licences and checks held' },
          ],
        },
      ],
    },
    {
      id: 'insurance',
      title: 'Insurance and licences',
      fields: [
        {
          id: 'policies',
          label: 'Insurance policies',
          type: 'repeater',
          rowLabel: 'policy',
          min: 1,
          max: 8,
          help: 'At least public and product liability. Add workers compensation, professional indemnity and vehicle insurance if you hold them.',
          fields: [
            { id: 'type', label: 'Type of cover', required: true },
            { id: 'insurer', label: 'Insurer', required: true },
            { id: 'policyNumber', label: 'Policy number', width: 'half' },
            { id: 'amount', label: 'Amount covered', width: 'half' },
            { id: 'expiry', label: 'Expiry date', required: true, width: 'half' },
          ],
        },
        {
          id: 'licences',
          label: 'Business licences and registrations',
          type: 'repeater',
          rowLabel: 'licence',
          max: 10,
          help: 'For example a security business licence, electrical contractor licence or ACMA cabling registration.',
          fields: [
            { id: 'type', label: 'Licence or registration', required: true },
            { id: 'holder', label: 'Name on it' },
            { id: 'number', label: 'Number', required: true, width: 'half' },
            { id: 'expiry', label: 'Expiry date', width: 'half' },
          ],
        },
        { id: 'certificates', label: 'Insurance certificates and licences', type: 'file', required: true, help: 'Certificates of currency and copies of licences. PDF or photo, up to 3 MB together.' },
      ],
    },
    {
      id: 'safety',
      title: 'Health, safety and quality',
      fields: [
        ...yesNoWithDetail('whsPolicy', 'Do you have a health and safety policy?'),
        ...yesNoWithDetail('whsPlan', 'Do you have a WHS manual, procedures or plan (including SWMS)?'),
        ...yesNoWithDetail('riskProcess', 'Do you identify, assess and control the risks of each job?'),
        ...yesNoWithDetail('incidents', 'Do you record and investigate incidents?'),
        ...yesNoWithDetail('induction', 'Do you induct all your staff and subcontractors?'),
        ...yesNoWithDetail('consultation', 'Are workers and subcontractors consulted on safety matters?'),
        ...yesNoWithDetail('whsCert', 'Do you hold third-party safety certification (such as ISO 45001)?'),
        ...yesNoWithDetail('quality', 'Do you have a quality system or third-party certification (such as ISO 9001)?'),
        ...yesNoWithDetail('environment', 'Do you have an environmental policy or certification (such as ISO 14001)?'),
      ],
    },
    {
      id: 'compliance',
      title: 'Compliance',
      fields: [
        ...yesNoWithDetail('conflict', 'Is there any conflict of interest, real or perceived, in working with Teracom Solutions?'),
        ...yesNoWithDetail('proceedings', 'Are there any legal proceedings, investigations or disputes under way, pending or threatened against your business?'),
        ...yesNoWithDetail('notices', 'Have you received any WHS or environmental notices (improvement or prohibition) in the last 12 months?'),
        ...yesNoWithDetail('convictions', 'Has your business been convicted of a WHS or environmental offence in the last five years, or are proceedings pending?'),
        { id: 'rightToWork', label: 'Everyone you engage, directly or through subcontractors, has the legal right to work in Australia.', type: 'radio', required: true, options: ['Confirmed'] },
      ],
    },
  ],
  agreement: {
    statement: 'I am a director of this business or a person a director has nominated, and I make the declaration above.',
    document: {
      title: 'Teracom Solutions Contractor Declaration',
      version: '1, November 2026',
      clauses: [
        {
          heading: 'Declaration',
          text: 'I declare that the information in this contractor information form is true and accurate, and I will tell Teracom Solutions Pty Ltd in writing straight away if any of it changes, including if any insurance or licence lapses or is cancelled.',
        },
        {
          heading: 'What happens next',
          text: 'Sending this form does not engage the business as a contractor. Work is only offered under Teracom\'s contractor agreement, after a site induction, and under a purchase order for each job. Teracom may check the details given, including insurance and licences, with the issuers.',
        },
      ],
    },
  },
};
