// The deeper Everki brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// everki.com and its regional sites refused every fetch (HTTP 403) in
// October 2026, so this is written in our own words from Everki’s current
// brands.js entry only; no new figures or product names were added.
// Drawings are specs drawn by lib/brandArt.

const everki = {
  heroArt: {
    type: 'hero',
    alt: 'An Everki laptop bag at the centre, protecting a laptop on one side and opening flat at airport security on the other',
    device: 'bag',
    left: { title: 'Laptop', sub: 'Padded pocket', foot: 'Moulded corner guards', icon: 'laptop' },
    right: { title: 'Checkpoint', sub: 'Opens 180°', foot: 'Laptop stays in the bag', icon: 'shield' },
    tags: [
      { text: 'Drops, knocks', tone: 'warn', icon: 'shield' },
      { text: 'Daily commute', tone: 'ok', icon: 'person' },
      { text: 'Long-haul', tone: 'accent', icon: 'map' },
    ],
    chips: [
      { text: 'Limited lifetime', tone: 'accent' },
      { text: 'Since 2005', tone: 'ok' },
    ],
  },

  stats: [
    { value: 'Since 2005', label: 'designing bags for people who carry a laptop for a living' },
    { value: '2M+', label: 'bags shipped since Everki launched' },
    { value: 'Lifetime', label: 'limited warranty on materials and workmanship, for the first owner' },
    { value: '41', label: 'countries the founder travelled as a mobile professional' },
  ],

  platformsEyebrow: 'Two ways to carry it',
  platformsHeading: 'On your back, or on wheels',
  platformsIntro: 'Everki started from one traveller’s frustrations with bags that were not built for the road. The range splits into bags you carry and trolleys you roll, and we help match the style to how far and how often the laptop travels.',
  platforms: [
    {
      name: 'Backpacks and laptop bags',
      kicker: 'Carry',
      art: {
        type: 'bag',
        alt: 'An Everki laptop bag opened flat, showing the laptop compartment, the moulded corners and the extra padding',
        pockets: ['Laptop compartment', 'Moulded corners', 'Opens flat, 180°', 'Extra padding'],
        caption: 'Checkpoint-friendly: the laptop stays in at X-ray',
      },
      body: 'Backpacks and laptop bags for the commute, the site visit and the flight. The airport designs open flat so the bag goes through the X-ray scanner with the laptop still inside, which saves unpacking at every security line.',
      points: [
        'Laptop backpacks and laptop bags',
        'Checkpoint-friendly airport designs',
        'Patented corner-guard system with moulded-to-fit corners',
        'Extra padding around the laptop pocket',
      ],
    },
    {
      name: 'Wheeled laptop trolleys',
      kicker: 'Roll',
      art: {
        type: 'bag',
        alt: 'An Everki wheeled laptop trolley with its laptop compartment, wheels and pull handle labelled',
        pockets: ['Laptop compartment', 'Rolling wheels', 'Pull handle'],
        caption: 'Rolls through the terminal instead of hanging off a shoulder',
      },
      body: 'Trolleys take the weight of a laptop and its kit off the shoulder for long walks through terminals and car parks. They suit people who fly often or carry more than a backpack comfortably holds.',
      points: [
        'Wheeled laptop trolleys for frequent travel',
        'Made for people who carry a laptop for work',
        'Covered by the same limited lifetime warranty',
      ],
    },
  ],

  capabilitiesEyebrow: 'Built for travel',
  capabilitiesHeading: 'What the design actually does',
  capabilitiesIntro: 'Everki designs around the moments that damage laptops and slow people down: security lines, drops and years of daily use.',
  capabilities: [
    {
      title: 'Through security, laptop in',
      art: {
        type: 'map',
        alt: 'An airport plan from check-in to the gate, with the bag going through the security scanner with the laptop still inside',
        markers: [
          { x: 12, y: 30, icon: 'person', tone: 'accent', label: 'Check-in' },
          { x: 38, y: 22, icon: 'shield', tone: 'ok', label: 'Security' },
          { x: 62, y: 34, icon: 'bag', tone: 'accent', label: 'Lies flat' },
          { x: 86, y: 26, icon: 'map', tone: 'accent', label: 'Gate 12' },
          { x: 30, y: 74, icon: 'laptop', tone: 'ok', label: 'Laptop in' },
          { x: 70, y: 76, icon: 'phone', tone: 'accent', label: 'Boarding' },
        ],
        caption: 'No unpacking at the X-ray belt',
      },
      body: 'On checkpoint-friendly designs the laptop compartment opens flat, 180 degrees, so the laptop can be scanned without taking it out of the bag. It is a small thing that adds up over a year of flights.',
    },
    {
      title: 'Corners that take the knocks',
      art: {
        type: 'bag',
        alt: 'A laptop sleeve with moulded corner guards and extra padding, absorbing a drop onto one corner',
        pockets: ['Moulded corners', 'Extra padding', 'Laptop held snug'],
        caption: 'Patented corner guards for the drops travel brings',
      },
      body: 'Drops and knocks come with travel. Everki’s patented corner-guard system uses corners moulded to fit the laptop, plus extra padding in the laptop pocket, to protect it from them.',
    },
    {
      title: 'Backed for life',
      art: {
        type: 'bag',
        alt: 'A bag with labels showing what the limited lifetime warranty covers: materials, workmanship, repair or replacement, for the original owner',
        pockets: ['Covers materials', 'Covers workmanship', 'Repair or replace', 'Original owner'],
        caption: 'Limited lifetime warranty against defects',
      },
      body: 'Every Everki bag carries a limited lifetime warranty against defects in materials and workmanship for the original owner. Everki decides whether to repair or replace, and we help with the claim if a bag bought from us fails.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Everki makes',
  range: [
    {
      title: 'Backpacks',
      items: ['Laptop backpacks', 'Backpacks for work travel'],
    },
    {
      title: 'Bags and cases',
      items: ['Laptop bags', 'Laptop cases', 'Checkpoint-friendly airport bags'],
    },
    {
      title: 'Trolleys',
      items: ['Wheeled laptop trolleys', 'Built for frequent flyers'],
    },
    {
      title: 'Travel accessories',
      items: ['Everki travel accessories', 'Current stock in the Teracom Store'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'An Everki bag in a working day',
  architectureArt: {
    type: 'architecture',
    alt: 'A laptop, a phone and chargers packed in an Everki backpack or trolley, carried by technicians, managers and frequent flyers',
    columns: ['What you carry', 'Everki', 'Who carries it'],
    devices: [
      { label: 'Laptop', sub: 'Padded compartment', icon: 'laptop' },
      { label: 'Phone', sub: 'Everyday carry', icon: 'phone' },
      { label: 'Chargers', sub: 'Cables and power', icon: 'battery' },
    ],
    platforms: [
      { label: 'Everki bag', sub: 'Backpack or bag', icon: 'bag' },
      { label: 'Everki trolley', sub: 'Wheeled', icon: 'bag' },
    ],
    people: [
      { label: 'Technicians', sub: 'Site to site', icon: 'person' },
      { label: 'Managers', sub: 'Office and meetings', icon: 'laptop' },
      { label: 'Frequent flyers', sub: 'Airport security', icon: 'map' },
    ],
    footer: 'The laptop and its kit in one protected bag, from the site van to the departure gate',
  },
  architectureCaption: 'A laptop, phone and chargers travel together in an Everki backpack, bag or trolley, chosen for how the person works: between sites, between meetings or between airports.',

  industriesHeading: 'Who carries them',
  industries: ['Field technicians', 'Sales teams', 'Consultants', 'Corporate travellers', 'IT support teams', 'Educators'],

  teracomHeading: 'What Teracom does with Everki',
  teracom: [
    { title: 'Advise', body: 'We help pick a style and size from how the laptop travels: daily commute, site visits or frequent flights.' },
    { title: 'Supply', body: 'A selection of Everki bags and cases is stocked alongside our security and networking products, with current stock in the Teracom Store.' },
    { title: 'Team orders', body: 'The same bag can be ordered for a whole team, so technicians and staff carry matching, protected kit.' },
    { title: 'Support', body: 'If a bag bought from us develops a defect, we help lodge the claim under Everki’s limited lifetime warranty.' },
  ],

  links: [
    { label: 'Everki in the Teracom Store', href: 'https://www.teracomsolutions.com.au/store' },
    { label: 'Ask Teracom about Everki', href: 'https://www.teracomsolutions.com.au/contact' },
  ],
};

export default everki;