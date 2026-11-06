// Returns (RMA) request, rebuilt from Teracom's "Return Merchandise Authorization Form" (2019,
// Z:\Teracom Solution Pty Ltd\RMA). Robert, 6 November 2026: every form on the website.
// Differences from the paper form: the return shipping box is left to us (the 2019 form still
// names another company, Ineda Systems, as the place to send goods); photos can be attached;
// and the conditions are the form's own warranty-determination list, with the customer's
// rights under the Australian Consumer Law stated rather than excluded.

export default {
  key: 'return-request',
  version: '1',
  live: true,
  title: 'Returns (RMA) request',
  shortTitle: 'Returns request',
  referencePrefix: 'RMA',
  eyebrow: 'Support',
  lead: 'Ask to return a faulty or incorrect product. We check the details and email you a return number and where to send it.',
  intro: [
    'Please do not send anything back until you have our return number: goods sent without one can be delayed or refused.',
    'List each product on its own line with its serial or batch number. Photos of the fault, the label or any damage help us decide faster.',
    'You sign at the end. We email you a signed copy, and our team replies with the return number and shipping details, usually within one business day.',
  ],
  identity: { name: 'name', email: 'email', company: 'company', phone: 'phone' },
  sections: [
    {
      id: 'you',
      title: 'Your details',
      fields: [
        { id: 'company', label: 'Company', type: 'text', required: true, autoComplete: 'organization', help: 'Or your full name if you bought as an individual.' },
        { id: 'name', label: 'Contact person', type: 'text', required: true, autoComplete: 'name' },
        { id: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel', width: 'half' },
        { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
        { id: 'invoices', label: 'Invoice or order number(s)', type: 'text', required: true, help: 'From your Teracom invoice or store order confirmation.' },
        { id: 'dealer', label: 'Who you bought it from, if not Teracom', type: 'text', help: 'If you bought through an installer or dealer.' },
      ],
    },
    {
      id: 'products',
      title: 'What you want to return',
      fields: [
        {
          id: 'items',
          label: 'Products',
          type: 'repeater',
          rowLabel: 'product',
          required: true,
          min: 1,
          max: 20,
          fields: [
            { id: 'product', label: 'Product name or part number', required: true },
            { id: 'serial', label: 'Serial or batch number', width: 'half' },
            { id: 'quantity', label: 'Quantity', required: true, width: 'half' },
            { id: 'reason', label: 'Reason', required: true, help: 'For example: faulty on arrival, stopped working, wrong item sent, ordered in error.' },
          ],
        },
        {
          id: 'outcome',
          label: 'What would you like?',
          type: 'radio',
          required: true,
          options: ['Repair', 'Replacement', 'Refund or credit', 'Not sure, please advise'],
        },
        { id: 'details', label: 'More about the problem', type: 'textarea', rows: 4, help: 'What happens, when it started, and anything you have already tried.' },
        { id: 'photos', label: 'Photos or documents', type: 'file', help: 'Optional: photos of the fault, the serial label or any damage. PDF or photo, up to 3 MB together.' },
      ],
    },
  ],
  agreement: {
    statement: 'The details I have given are correct, and I have read the returns conditions above.',
    document: {
      title: 'Teracom Solutions Returns Conditions',
      version: '1, November 2026',
      clauses: [
        {
          heading: 'Your consumer rights',
          text: 'Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if they fail to be of acceptable quality and the failure does not amount to a major failure. Nothing in these conditions limits those rights.',
        },
        {
          heading: 'Return number first',
          text: 'Send goods back only after we have given you a return number, and show that number on the outside of the parcel and on the shipping documents. Goods must be returned with the serial number we authorised.',
        },
        {
          heading: 'What a warranty claim does not cover',
          text: 'Unless the Australian Consumer Law says otherwise, a warranty repair, replacement or credit is not available for: damage from an accident, misuse, neglect or not following the product instructions; incorrect voltage or wiring; rain, excessive humidity, corrosion or other contaminants; installation or use outside the maker\'s guidelines, or damage from tools or the surroundings; cosmetic marks that do not affect how the product works; items returned incomplete or defaced; and items specially ordered or configured for you, unless they are faulty.',
        },
        {
          heading: 'Change of mind',
          text: 'Returns for change of mind are at our discretion, must be unused and in their original packaging, and may attract a restocking fee that we tell you about before you send them.',
        },
        {
          heading: 'Packing and freight damage',
          text: 'Please pack returns carefully, ideally in the original packaging. If a delivery from us arrives damaged, note the damage on the carrier\'s delivery record, keep the box and packing, and tell us straight away so we can arrange a carrier inspection.',
        },
        {
          heading: 'If no fault is found',
          text: 'If we test a returned product and find no fault, or find the fault is not covered, we will tell you before doing any chargeable work, and you can choose to have it sent back.',
        },
      ],
    },
  },
};
