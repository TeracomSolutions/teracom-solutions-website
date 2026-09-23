// The request forms, rebuilt from Teracom's own Zoho forms.
//
// Three deliberate differences from the Zoho originals:
//
//  1. NO DOLLAR FIGURES. The Zoho forms quote rates set in 2021 ($160/$195
//     call-out, $80 bench diagnosis). Publishing a stale price is a
//     misleading pricing claim, not a typo, so the declarations say charges
//     are confirmed before work starts. Put the current rates in `charges`
//     below once Robert confirms them and they appear automatically.
//  2. No file upload, e-signature or captcha yet. Each needs somewhere to
//     put the file and a decision about what a signature means here; the
//     photo of the recorder label is genuinely useful, so it is the first
//     one to add.
//  3. The terms link points at /terms. The Zoho forms link to
//     /terms-conditions, which has never existed on this site -- that link
//     is dead in the live forms today.

const CONTACT_FIELDS = [
  { id: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
  { id: 'company', label: 'Company', type: 'text', help: 'If applicable', autoComplete: 'organization' },
  { id: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
  { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
];

const SITE_FIELDS = [
  { id: 'siteHeading', label: 'Site address', type: 'heading' },
  { id: 'street', label: 'Street address', type: 'text', required: true, autoComplete: 'address-line1' },
  { id: 'street2', label: 'Address line 2', type: 'text', autoComplete: 'address-line2' },
  { id: 'suburb', label: 'Suburb', type: 'text', required: true, autoComplete: 'address-level2' },
  {
    id: 'state',
    label: 'State',
    type: 'select',
    required: true,
    options: ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    width: 'half',
  },
  { id: 'postcode', label: 'Postcode', type: 'text', required: true, width: 'half', autoComplete: 'postal-code' },
];

const SCHEDULING_FIELDS = [
  {
    id: 'preferred',
    label: 'Preferred date and time',
    type: 'datetime-local',
    help: 'Please allow a minimum of 5 business days. We will confirm a time with you.',
  },
  { id: 'notes', label: 'Anything else we should know?', type: 'textarea', rows: 3 },
];

// Declarations, not tick-to-continue. Each is a separate, unticked checkbox,
// because "by submitting this form you agree" is not acceptance.
const DECLARATIONS = [
  {
    id: 'accurate',
    required: true,
    text: 'The information I have given is true and correct to the best of my knowledge.',
  },
  {
    id: 'charges',
    required: true,
    text: 'I understand that service charges apply, and that Teracom will confirm the charges with me before any chargeable work begins.',
  },
  {
    id: 'terms',
    required: true,
    text: 'I accept the Teracom Solutions terms and conditions.',
    termsLink: true,
  },
];

export const requestForms = [
  {
    slug: 'service-request',
    title: 'Service request',
    seoTitle: 'Request a Service Call | Teracom Solutions',
    description:
      'Request a service call, planned maintenance, an installation or a quote from Teracom Solutions. Tell us about the site and we will come back with a time.',
    lead: 'Something not working, or a job you need booked in. Tell us what is going on and we will come back with a time.',
    icon: 'wrench',
    intro: [
      'Use this for a fault on an existing system, scheduled maintenance, a new installation, or a quote. The more you can tell us about the site and the symptoms, the fewer visits it takes to fix.',
      'Fill in as much as you can in one go and we will come back to you to confirm a time -- that is usually faster than a round of phone tag, and nothing gets lost between the call and the job card.',
    ],
    inquiryType: 'service_request',
    fields: [
      ...CONTACT_FIELDS,
      ...SITE_FIELDS,
      { id: 'workHeading', label: 'What you need', type: 'heading' },
      {
        id: 'serviceRequired',
        label: 'Service required',
        type: 'radio',
        required: true,
        options: ['Service call', 'Planned maintenance', 'Installation', 'Quote'],
      },
      {
        id: 'work',
        label: 'Work required',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'What is the system, what is it doing, and when did it start?',
      },
      ...SCHEDULING_FIELDS,
    ],
    declarations: DECLARATIONS,
  },
  {
    slug: 'password-reset',
    title: 'Recorder password reset',
    seoTitle: 'DVR & NVR Password Reset Request | Teracom Solutions',
    description:
      'Request a password reset for a DVR, NVR or camera. Teracom can attend site or reset the device at our Carrum Downs workshop.',
    lead: 'Locked out of a recorder. It happens constantly, and it is fixable -- but not remotely, and not without proof the gear is yours.',
    icon: 'key',
    intro: [
      'Resetting a recorder or camera password is a physical job. It cannot be done over the phone, and every manufacturer requires proof of ownership before they will release a reset, which is why we ask for the model and the label details.',
      'We can either attend the site, or you can bring the device to us at Carrum Downs, which is usually quicker and cheaper.',
    ],
    inquiryType: 'password_reset',
    fields: [
      ...CONTACT_FIELDS,
      ...SITE_FIELDS,
      { id: 'deviceHeading', label: 'The device', type: 'heading' },
      {
        id: 'model',
        label: 'Model of recorder',
        type: 'text',
        required: true,
        help: 'On the label on the underside of the recorder.',
      },
      {
        id: 'serial',
        label: 'Serial number',
        type: 'text',
        help: 'On the same label. If you cannot read it, tell us and we will work it out on site.',
      },
      {
        id: 'devices',
        label: 'Devices needing a reset',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'One per line: what it is, where it is, and anything you already know about the login.',
      },
      {
        id: 'attendance',
        label: 'How would you like it done?',
        type: 'radio',
        required: true,
        options: ['Technician attends site', 'I will bring the device to Carrum Downs'],
      },
      ...SCHEDULING_FIELDS,
    ],
    declarations: [
      {
        id: 'ownership',
        required: true,
        text: 'I own this equipment, or I am authorised by the owner to request a password reset on it.',
      },
      ...DECLARATIONS,
    ],
  },
];

/**
 * Current service rates. Empty until Robert confirms them -- the figures in
 * the Zoho forms were set in 2021. Add entries as { label, price, note } and
 * they render on the form; leave it empty and the form simply says charges
 * are confirmed before work starts.
 */
export const charges = [];

export function findRequestForm(slug) {
  return requestForms.find((form) => form.slug === slug) || null;
}

/** Fields that carry a value, i.e. everything except section headings. */
export function valueFields(form) {
  return form.fields.filter((field) => field.type !== 'heading');
}

/**
 * The submission, rendered as the message a staff member reads. Kept here
 * rather than in the route so the same text can be shown back to the
 * customer if the submission cannot be delivered.
 */
export function formatSubmission(form, values) {
  const lines = [`${form.title.toUpperCase()}`, ''];
  for (const field of form.fields) {
    if (field.type === 'heading') {
      lines.push('', `${field.label}:`);
      continue;
    }
    const value = (values[field.id] || '').toString().trim();
    if (!value) continue;
    lines.push(`${field.label}: ${value}`);
  }
  const accepted = form.declarations.filter((d) => values[d.id]).map((d) => d.text);
  if (accepted.length > 0) {
    lines.push('', 'Declarations accepted:', ...accepted.map((text) => `- ${text}`));
  }
  return lines.join('\n').trim();
}
