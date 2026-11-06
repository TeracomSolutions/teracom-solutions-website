// Confidentiality agreement (NDA) signed on the website (Robert, 6 November 2026). The NDAs on
// file are other companies' documents (EGroup, Assa Abloy, NEXTDC), so this is Teracom's own,
// written in plain English for the things Teracom actually shares: quotes, designs, site plans,
// and security details of a customer's site. One agreement covers all three directions (both
// ways, Teracom to the other party, or the other party to Teracom); the form records which.
// NOT LIVE until Robert has had the wording reviewed (it opens with ?preview=1).

export default {
  key: 'confidentiality-agreement',
  version: '1',
  live: false,
  title: 'Confidentiality agreement (NDA)',
  shortTitle: 'Confidentiality agreement',
  referencePrefix: 'NDA',
  eyebrow: 'Agreements',
  lead: 'Sign a confidentiality agreement with Teracom Solutions online, before we share designs, pricing or site details, or before you share yours.',
  intro: [
    'Use this before a tender, a partnership discussion, a site survey or any project where either side will share information that is not public.',
    'Read the agreement below the form, fill in who you are and what the discussions are about, and sign at the end. We email you a signed copy straight away, and Teracom confirms it by email within one business day.',
  ],
  identity: { name: 'name', email: 'email', company: 'company', phone: 'phone' },
  sections: [
    {
      id: 'party',
      title: 'Who the agreement is with',
      fields: [
        { id: 'company', label: 'Company or organisation (legal name)', type: 'text', required: true, autoComplete: 'organization' },
        { id: 'abn', label: 'ABN or ACN', type: 'text', width: 'half', help: 'Leave blank if you are signing as an individual.' },
        { id: 'street', label: 'Street address', type: 'text', required: true, autoComplete: 'address-line1' },
        { id: 'suburb', label: 'Suburb or city', type: 'text', required: true, width: 'half', autoComplete: 'address-level2' },
        { id: 'stateCountry', label: 'State and postcode, or country', type: 'text', required: true, width: 'half' },
        { id: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
        { id: 'position', label: 'Your position', type: 'text', required: true, width: 'half', help: 'You must be authorised to sign for the organisation.' },
        { id: 'email', label: 'Email for notices', type: 'email', required: true, autoComplete: 'email' },
        { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', width: 'half' },
      ],
    },
    {
      id: 'scope',
      title: 'What it covers',
      fields: [
        {
          id: 'direction',
          label: 'Which way will confidential information go?',
          type: 'radio',
          required: true,
          options: [
            { value: 'Both ways (mutual)', description: 'Both of us will share information that is not public. The usual choice.' },
            { value: 'From Teracom to us', description: 'Teracom will share designs, pricing or site details with you.' },
            { value: 'From us to Teracom', description: 'You will share your plans, site or business information with Teracom.' },
          ],
        },
        {
          id: 'purpose',
          label: 'What are the discussions or the project about?',
          type: 'textarea',
          rows: 3,
          required: true,
          help: 'For example: "Quoting the CCTV and access control upgrade at our Dandenong warehouse" or "Discussing a distribution partnership". The information may only be used for this.',
        },
        { id: 'teracomContact', label: 'Your contact at Teracom', type: 'text', help: 'If someone at Teracom asked you to sign this.' },
      ],
    },
  ],
  agreement: {
    statement: 'I have read this confidentiality agreement and agree to it, and I am authorised to sign it for the organisation named above.',
    document: {
      title: 'Teracom Solutions Confidentiality Agreement',
      version: '1, November 2026',
      clauses: [
        {
          heading: '1. The parties and the purpose',
          text: 'This agreement is between Teracom Solutions Pty Ltd ABN 49 107 979 546 ("Teracom") and the organisation or person named in this form ("the Other Party"). It applies to Confidential Information shared for the purpose described in this form ("the Purpose"), in the direction chosen in this form. A party that receives Confidential Information under this agreement is the "Recipient" and the party it came from is the "Discloser".',
        },
        {
          heading: '2. What is confidential',
          text: 'Confidential Information is any information, in any form, that the Discloser shares with the Recipient for the Purpose and that is not public, including designs, drawings, site plans, specifications, pricing and quotes, supplier and customer details, business plans, software and system configurations, and the fact and content of the discussions. It also includes notes, analyses and copies the Recipient makes from it. It does not include information the Recipient can show was already public (other than through a breach of this agreement), was already lawfully known to it, was received from someone else who was free to share it, or was developed independently without using the Discloser\'s information.',
        },
        {
          heading: '3. Security information',
          text: 'Information about the security of a site or a system is the most sensitive kind of Confidential Information. This includes alarm codes and zones, camera positions and blind spots, access control and door schedules, network addresses and passwords, monitoring arrangements, key holders and response procedures. The Recipient must give it the highest level of care, share it with as few people as possible, and must never use or disclose it in a way that could help anyone defeat that security.',
        },
        {
          heading: '4. What the Recipient must do',
          text: 'The Recipient must: (a) use the Confidential Information only for the Purpose; (b) keep it secure, with at least the care it uses for its own confidential information and never less than reasonable care; (c) share it only with its employees, contractors and professional advisers who need it for the Purpose and who are bound to keep it confidential, and make sure they do; (d) not copy it except as needed for the Purpose; and (e) tell the Discloser promptly if it becomes aware of any loss, misuse or unauthorised disclosure, and help to stop it.',
        },
        {
          heading: '5. When disclosure is required by law',
          text: 'If the law, a court, a regulator or a stock exchange requires the Recipient to disclose Confidential Information, it may do so, but where it is allowed to it must first tell the Discloser, disclose only what is required, and give the Discloser reasonable help to protect the information.',
        },
        {
          heading: '6. Returning or destroying information',
          text: 'When the Discloser asks, or when the Purpose ends, the Recipient must return or securely destroy the Confidential Information and confirm in writing that it has done so. It may keep a copy only where the law or its professional obligations require, or in automatic electronic back-ups that are not accessed; anything kept stays confidential under this agreement.',
        },
        {
          heading: '7. No other rights',
          text: 'Sharing information under this agreement does not give the Recipient any ownership or licence of it, and does not oblige either party to go ahead with any project or transaction. Information is shared as it is; the Discloser does not promise that it is complete or accurate except as agreed in a later contract.',
        },
        {
          heading: '8. How long it lasts',
          text: 'This agreement starts when the Other Party signs it. The Recipient\'s obligations continue for three years after the last time Confidential Information is shared under it, except that obligations about security information (clause 3) continue for as long as that information could be used to compromise the site or system it relates to.',
        },
        {
          heading: '9. If the agreement is broken',
          text: 'Each party accepts that money alone may not be enough to make up for a breach of this agreement, and that the Discloser may seek an injunction or similar order to prevent or stop a breach, as well as any other remedy available to it.',
        },
        {
          heading: '10. Signing electronically',
          text: 'The Other Party signs this agreement by completing and signing this form on the Teracom website. Teracom records the version signed, the date and time and the details given, and signs by confirming the agreement by email. Signatures given this way have the same effect as signatures on paper under the Electronic Transactions (Victoria) Act 2000. Notices under this agreement may be sent by email to the addresses in this form (for the Other Party) and to sales@teracomsolutions.com.au (for Teracom).',
        },
        {
          heading: '11. General',
          text: 'This agreement is governed by the law of Victoria, and the parties submit to the non-exclusive jurisdiction of its courts. It is the whole agreement between the parties about confidentiality for the Purpose, unless they sign a later agreement that says otherwise. If any part of it cannot be enforced, the rest still applies. Neither party may transfer its rights under it without the other\'s written consent.',
        },
      ],
    },
  },
};
