// Trade account application, rebuilt from the Zoho form and the 2015 source
// document it came from.
//
// Three things the original gets wrong, fixed here:
//
//  1. ROUTING. The Zoho form shows every applicant both Part 1 (sole
//     traders) and Part 2 (companies), even though its own first page says
//     you complete one or the other. Here the entity type decides what you
//     see, which removes about a third of the questions for everyone.
//  2. THE GUARANTEE. The same first page says a Trade Cash account does not
//     require a personal guarantee -- and then the form demands a signature
//     on one anyway. Here the guarantee only ever applies to credit.
//  3. DIRECTORS. "Please attach a list for additional names" is replaced by
//     an Add director button.
//
// The guarantee itself is NOT collected here. Its wording, and the credit
// terms behind it, came from another company's document (different ABN, NSW
// jurisdiction) and are being redrafted as schedules of the Teracom terms.
// Collecting a legally operative guarantee through wording known to be wrong
// would be worse than collecting it on paper, so a credit applicant is told
// plainly that it follows separately.

import { abnProblem } from './abn.js';

const address = (prefix, label, required = true) => [
  { id: `${prefix}Street`, label: `${label} street address`, type: 'text', required, autoComplete: 'address-line1' },
  { id: `${prefix}Street2`, label: 'Address line 2', type: 'text' },
  { id: `${prefix}Suburb`, label: 'Suburb', type: 'text', required, width: 'half' },
  {
    id: `${prefix}State`,
    label: 'State',
    type: 'select',
    required,
    width: 'half',
    options: ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
  },
  { id: `${prefix}Postcode`, label: 'Postcode', type: 'text', required, width: 'half' },
];

export const ACCOUNT_TYPES = {
  credit: '30-day commercial credit account',
  cash: 'Trade cash account',
};

export const ENTITY_TYPES = {
  sole_trader: 'Sole trader',
  partnership: 'Partnership',
  company: 'Company',
  trust: 'Trust',
};

/** Companies and trusts give director details; sole traders and partnerships give personal ones. */
export function isCompanyLike(entityType) {
  return entityType === 'company' || entityType === 'trust';
}

/**
 * Who actually gives a personal guarantee.
 *
 * Terms v3.3 Schedule 7 clause 7.1(b): credit accounts held by a company or
 * trust only. Not cash customers, not sole traders, not partnerships -- they
 * are already personally liable for the debts of their own business, so a
 * guarantee adds nothing but a signature.
 */
export function needsGuarantee(values = {}) {
  return values.accountType === 'credit' && isCompanyLike(values.entityType);
}

/** Credit terms apply to any credit account, guarantee or not. */
export function isCreditAccount(values = {}) {
  return values.accountType === 'credit';
}

/**
 * Choices carry a stable key and a separate label.
 *
 * The first cut used the label as the value, so entityType came back as
 * "Company" while every branch compared it against 'company' -- picking
 * Company silently did nothing. Keys also mean the wording can be reworded
 * without breaking the logic behind it.
 */
export function choices(map) {
  return Object.entries(map).map(([value, label]) => ({ value, label }));
}

export const accountApplication = {
  slug: 'account-application',
  title: 'Trade account application',
  seoTitle: 'Open a Trade Account | Teracom Solutions',
  description:
    'Apply for a Teracom Solutions trade account: 30-day commercial credit, or a trade cash account with no personal guarantee.',
  lead: 'Open a trade account, on 30-day terms or cash. Ten minutes, and you only answer the questions that apply to you.',
  icon: 'account',
  intro: [
    'A trade cash account gives you account pricing and one place to see what you have bought, but everything is paid before it leaves us. A credit account lets you trade in arrears, on terms of 30 days from the end of the month the invoice falls in, and asks for trade references.',
    'Either way, approval is at our discretion and we will come back to you either way. You only see the questions that apply to the kind of business you are and the account you asked for.',
  ],
  steps: [
    {
      id: 'account-type',
      title: 'Account type',
      fields: [
        {
          id: 'accountType',
          label: 'Which account are you applying for?',
          type: 'radio',
          required: true,
          options: choices(ACCOUNT_TYPES),
          help: 'A credit account is payable by the last day of the month following the invoice month. A cash account is paid before delivery or at pickup. Where a company or trust holds a credit account, its directors give a personal guarantee.',
        },
        {
          id: 'entityType',
          label: 'What kind of business is applying?',
          type: 'radio',
          required: true,
          options: choices(ENTITY_TYPES),
          help: 'This decides which details we need. You will not be asked for the ones that do not apply.',
        },
      ],
    },
    {
      id: 'applicant',
      title: 'Applicant',
      // Sole traders and partnerships: the people are the business.
      when: (values) => !isCompanyLike(values.entityType),
      fields: [
        { id: 'p1Heading', label: 'Applicant', type: 'heading' },
        { id: 'p1Name', label: 'Full name', type: 'text', required: true, autoComplete: 'name' },
        ...address('p1Home', 'Home'),
        { id: 'p1Mobile', label: 'Mobile', type: 'tel', required: true },
        { id: 'p1Email', label: 'Email', type: 'email', required: true },

        {
          id: 'p2Heading',
          label: 'Second partner',
          type: 'heading',
          when: (values) => values.entityType === 'partnership',
        },
        {
          id: 'p2Name',
          label: 'Full name',
          type: 'text',
          required: true,
          when: (values) => values.entityType === 'partnership',
        },
        ...address('p2Home', 'Home').map((field) => ({
          ...field,
          when: (values) => values.entityType === 'partnership',
        })),
        {
          id: 'p2Mobile',
          label: 'Mobile',
          type: 'tel',
          when: (values) => values.entityType === 'partnership',
        },
        {
          id: 'p2Email',
          label: 'Email',
          type: 'email',
          when: (values) => values.entityType === 'partnership',
        },

        { id: 'stBizHeading', label: 'The business', type: 'heading' },
        { id: 'tradingAs', label: 'Trading as', type: 'text', required: true },
        { id: 'abn', label: 'ABN', type: 'text', required: true, validate: 'abn', help: '11 digits. We check the format here; we verify it on ABN Lookup before the account opens.' },
        ...address('biz', 'Business'),
        { id: 'bizPhone', label: 'Business phone', type: 'tel', required: true },
        { id: 'bizEmail', label: 'Business email', type: 'email', required: true },
        { id: 'purchasingName', label: 'Contact for purchasing', type: 'text' },
        { id: 'purchasingEmail', label: 'Purchasing email', type: 'email' },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      when: (values) => isCompanyLike(values.entityType),
      fields: [
        { id: 'coHeading', label: 'The entity', type: 'heading' },
        { id: 'companyName', label: 'Company or trust name', type: 'text', required: true },
        { id: 'tradingAs', label: 'Trading as', type: 'text' },
        { id: 'abn', label: 'ABN', type: 'text', required: true, validate: 'abn', help: '11 digits. We check the format here; we verify it on ABN Lookup before the account opens.' },
        {
          id: 'acn',
          label: 'ACN',
          type: 'text',
          when: (values) => values.entityType === 'company',
        },
        ...address('biz', 'Business'),
        { id: 'bizPhone', label: 'Business phone', type: 'tel', required: true },
        { id: 'bizEmail', label: 'Business email', type: 'email', required: true },
        { id: 'purchasingEmail', label: 'Purchasing email', type: 'email' },
        { id: 'directorsHeading', label: 'Directors', type: 'heading' },
      ],
      // Rendered as a repeatable group rather than two fixed slots.
      repeatable: {
        id: 'directors',
        singular: 'director',
        addLabel: 'Add another director',
        min: 1,
        fields: [
          { id: 'name', label: 'Full name', type: 'text', required: true },
          { id: 'home', label: 'Home address', type: 'text', required: true },
          { id: 'mobile', label: 'Mobile', type: 'tel', required: true },
          { id: 'email', label: 'Email', type: 'email' },
        ],
      },
    },
    {
      id: 'business',
      title: 'Trading details',
      fields: [
        { id: 'commenced', label: 'Date business commenced', type: 'date', required: true },
        {
          id: 'licence',
          label: 'Security licence number',
          type: 'text',
          help: 'If you hold one. It helps us process the application faster.',
        },
        {
          id: 'premises',
          label: 'Premises',
          type: 'radio',
          required: true,
          options: ['Owned', 'Mortgaged', 'Rented or leased'],
        },
        { id: 'mainBusiness', label: 'Main line of business', type: 'text', required: true },
        {
          id: 'creditLimit',
          label: 'Credit limit required',
          type: 'text',
          required: true,
          help: 'In dollars. An estimate is fine.',
          when: isCreditAccount,
        },
        { id: 'acctHeading', label: 'Accounts contact', type: 'heading' },
        { id: 'acctName', label: 'Contact name for accounts', type: 'text' },
        { id: 'acctPhone', label: 'Contact phone for accounts', type: 'tel', required: true },
        { id: 'acctEmail', label: 'Accounts email', type: 'email', required: true },
        {
          id: 'refHeading',
          label: 'Trade references',
          type: 'heading',
          when: isCreditAccount,
        },
        ...[1, 2, 3].flatMap((n) => [
          {
            id: `ref${n}Company`,
            label: `Trade reference ${n} — company`,
            type: 'text',
            required: true,
            when: isCreditAccount,
          },
          {
            id: `ref${n}Phone`,
            label: `Trade reference ${n} — phone`,
            type: 'tel',
            required: true,
            width: 'half',
            when: isCreditAccount,
          },
        ]),
      ],
    },
    {
      id: 'declarations',
      title: 'Confirm and sign',
      fields: [
        { id: 'signedBy', label: 'Your full name', type: 'text', required: true },
        { id: 'signedRole', label: 'Your position', type: 'text', required: true, help: 'Director, partner, owner.' },
      ],
      signature: true,
      declarations: [
        {
          id: 'accurate',
          required: true,
          text: 'The information in this application is true and correct to the best of my knowledge.',
        },
        {
          id: 'authorised',
          required: true,
          text: 'I am authorised to make this application on behalf of the applicant and to bind it.',
        },
        {
          id: 'terms',
          required: true,
          termsLink: true,
          text: 'I have read and accept the Teracom Solutions terms and conditions.',
        },
        {
          id: 'guarantee',
          required: true,
          when: needsGuarantee,
          text: 'I understand that a credit account held by a company or trust requires a personal guarantee from its directors, and that Teracom will send that to each guarantor to sign separately once this application has been reviewed.',
        },
      ],
    },
  ],
};

/** The steps this applicant actually sees, given what they have answered. */
export function visibleSteps(values) {
  return accountApplication.steps.filter((step) => !step.when || step.when(values));
}

/** The fields within a step that apply, given what they have answered. */
export function visibleFields(step, values) {
  return (step.fields || []).filter((field) => !field.when || field.when(values));
}

export function visibleDeclarations(step, values) {
  return (step.declarations || []).filter((d) => !d.when || d.when(values));
}

/** Everything still missing from a step, by label. */
// Format checks a field can ask for by name. Kept as a lookup rather than
// putting functions in the step data, so the step definitions stay plain
// serialisable data.
const VALIDATORS = {
  abn: abnProblem,
};

export function missingFrom(step, values, directors = []) {
  const fields = visibleFields(step, values).filter((field) => field.type !== 'heading');

  const missing = fields
    .filter((field) => field.required && !String(values[field.id] || '').trim())
    .map((field) => field.label);

  // A filled-in field can still be wrong. Reported alongside the blanks
  // because the caller shows this list as "what is stopping you continuing",
  // and a mistyped ABN stops you just as surely as a missing one -- the
  // difference being that a wrong ABN on a credit account is not discovered
  // until an invoice is queried.
  for (const field of fields) {
    const check = field.validate && VALIDATORS[field.validate];
    if (!check) continue;
    const problem = check(values[field.id]);
    if (problem) missing.push(`${field.label}: ${problem}`);
  }

  if (step.repeatable) {
    directors.forEach((row, i) => {
      step.repeatable.fields
        .filter((field) => field.required && !String(row[field.id] || '').trim())
        .forEach((field) => missing.push(`${step.repeatable.singular} ${i + 1} ${field.label.toLowerCase()}`));
    });
    if (directors.length < step.repeatable.min) missing.push(`at least one ${step.repeatable.singular}`);
  }

  return missing;
}

/** The application as a person reads it. */
export function formatApplication(values, directors = []) {
  const lines = ['TRADE ACCOUNT APPLICATION', ''];
  lines.push(`Account type: ${ACCOUNT_TYPES[values.accountType] || values.accountType || '(not stated)'}`);
  lines.push(`Entity type: ${values.entityType ? ENTITY_TYPES[values.entityType] || values.entityType : '(not stated)'}`);

  for (const step of visibleSteps(values)) {
    if (step.id === 'account-type') continue;
    lines.push('', `-- ${step.title} --`);
    for (const field of visibleFields(step, values)) {
      if (field.type === 'heading') {
        lines.push('', `${field.label}:`);
        continue;
      }
      const value = String(values[field.id] || '').trim();
      if (value) lines.push(`${field.label}: ${value}`);
    }
    if (step.repeatable && directors.length > 0) {
      directors.forEach((row, i) => {
        lines.push('', `${step.repeatable.singular} ${i + 1}:`);
        step.repeatable.fields.forEach((field) => {
          const value = String(row[field.id] || '').trim();
          if (value) lines.push(`  ${field.label}: ${value}`);
        });
      });
    }
    const accepted = visibleDeclarations(step, values).filter((d) => values[d.id]);
    if (accepted.length > 0) {
      lines.push('', 'Declarations accepted:', ...accepted.map((d) => `- ${d.text}`));
    }
  }

  return lines.join('\n').trim();
}
