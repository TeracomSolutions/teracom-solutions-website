// The deeper Teraudio brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Teraudio is Teracom's own range, so there is no manufacturer site: written
// in our own words from the Teraudio entry in brands.js and the live page
// teracomsolutions.com.au/brands/teraudio (October 2026). No specifications
// or figures beyond those. Drawings are specs drawn by lib/brandArt.

const teraudio = {
  heroArt: {
    type: 'hero',
    alt: 'A Teraudio in-ceiling speaker fed by a digital amplifier on one side and Wi-Fi on the other, playing into the rooms below',
    device: 'speaker',
    left: { title: 'Amplifier', sub: 'Digital power', foot: 'Bluetooth models too', icon: 'bolt' },
    right: { title: 'Wi-Fi', sub: '8-inch speaker', foot: 'Amplifier built in', icon: 'wifi' },
    tags: [
      { text: 'Living room', tone: 'accent', icon: 'speaker' },
      { text: 'Kitchen', tone: 'ok', icon: 'speaker' },
      { text: 'Main bedroom', tone: 'muted', icon: 'speaker' },
    ],
    chips: [
      { text: 'Teraudio', tone: 'accent' },
      { text: 'Paintable grilles', tone: 'ok' },
    ],
  },

  stats: [
    { value: '8-inch', label: 'in-ceiling speaker with its own built-in Wi-Fi amplifier' },
    { value: 'Kevlar', label: 'or polypropylene woofer options, each with a silk dome tweeter' },
    { value: 'Paintable', label: 'grilles that take on the ceiling colour and drop out of sight' },
    { value: 'Bluetooth', label: 'built into selected Teraudio digital power amplifiers' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'Wired from an amplifier, or Wi-Fi in the ceiling',
  platformsIntro: 'Most rooms are wired back to a Teraudio digital amplifier. Where a speaker cable cannot sensibly be run, the 8-inch Wi-Fi model carries its own amplifier. We help choose room by room.',
  platforms: [
    {
      name: 'In-ceiling speakers and digital amplifiers',
      kicker: 'Wired',
      art: {
        type: 'audio',
        alt: 'A Teraudio digital amplifier playing music from a phone into a living room pair and a kitchen pair of in-ceiling speakers',
        source: 'Digital amp',
        sourceSub: 'Bluetooth model',
        sourceIcon: 'bolt',
        zones: [
          { name: 'Living room pair', note: 'Kevlar woofers', level: 70, live: true },
          { name: 'Kitchen pair', note: 'Polypropylene woofers', level: 55, live: true },
        ],
        announcement: 'Music played from a phone over Bluetooth',
      },
      body: 'In-ceiling speakers wired back to a Teraudio digital power amplifier. Pick polypropylene or Kevlar woofers to suit the room, each paired with a silk dome tweeter, and choose a Bluetooth-enabled amplifier to play straight from a phone.',
      points: [
        'Polypropylene or Kevlar woofer options',
        'Silk dome tweeters, adjustable towards the listening area',
        'Digital power amplifiers, including Bluetooth models',
        'Paintable grilles to match the ceiling',
      ],
    },
    {
      name: '8-inch Wi-Fi in-ceiling speaker',
      kicker: 'No speaker cable',
      art: {
        type: 'network',
        alt: 'Home Wi-Fi reaching 8-inch Teraudio speakers in a study, a bedroom, a rumpus room and an upstairs room where cable cannot be run',
        uplink: 'Router',
        switchLabel: 'Home Wi-Fi',
        switchSub: 'Audio to each speaker',
        ports: [
          { label: 'Study', icon: 'speaker', tone: 'accent' },
          { label: 'Bedroom 2', icon: 'speaker', tone: 'accent' },
          { label: 'Rumpus', icon: 'speaker', tone: 'accent' },
          { label: 'Upstairs', icon: 'speaker', tone: 'accent' },
        ],
        caption: 'Its own Wi-Fi amplifier means no speaker cable back to a rack',
      },
      body: 'The 8-inch in-ceiling model has a Wi-Fi amplifier built in, so it takes its audio over Wi-Fi rather than a speaker cable from an amplifier. It suits finished homes, extensions and rooms where running cable through walls and ceilings is not practical.',
      points: [
        '8-inch in-ceiling speaker',
        'Wi-Fi amplifier built into the speaker',
        'No speaker cable back to an amplifier',
        'Sits alongside wired Teraudio rooms',
      ],
    },
  ],

  capabilitiesEyebrow: 'Design details',
  capabilitiesHeading: 'Heard, not noticed',
  capabilitiesIntro: 'Teraudio is designed for home interiors, where the speaker should be heard and not noticed. Three details do most of the work.',
  capabilities: [
    {
      title: 'Out of sight',
      art: {
        type: 'map',
        alt: 'A floor plan of a home with in-ceiling speakers in the living room, kitchen, bedroom and study, and a Wi-Fi model in a hard-to-wire room',
        markers: [
          { x: 18, y: 28, icon: 'speaker', tone: 'accent', label: 'Living L' },
          { x: 40, y: 28, icon: 'speaker', tone: 'accent', label: 'Living R' },
          { x: 74, y: 22, icon: 'speaker', label: 'Kitchen' },
          { x: 20, y: 78, icon: 'speaker', label: 'Bedroom' },
          { x: 56, y: 74, icon: 'speaker', label: 'Study' },
          { x: 88, y: 76, icon: 'wifi', tone: 'ok', label: 'Wi-Fi 8in' },
        ],
        caption: 'Grilles painted to match each ceiling',
      },
      body: 'Paintable grilles let the speakers take on the ceiling colour, so they read as part of the room rather than equipment fixed to it. That suits living areas where a visible box speaker would spoil the look.',
    },
    {
      title: 'Drivers to suit the room',
      art: {
        type: 'sensor',
        alt: 'A Teraudio in-ceiling speaker with its adjustable tweeter aimed at a seating area, and the woofer and tweeter options listed',
        icon: 'speaker',
        target: 'person',
        label: 'Aimed tweeter',
        sub: 'Silk dome',
        coverage: 'Highs focused on the listening area',
        events: [
          { text: 'Kevlar', sub: 'Woofer option', tone: 'accent' },
          { text: 'Polypropylene', sub: 'Woofer option', tone: 'ok' },
          { text: 'Silk dome', sub: 'Tweeter', tone: 'muted' },
        ],
      },
      body: 'Each in-ceiling model pairs a polypropylene or Kevlar woofer with a silk dome tweeter. The tweeter can be adjusted to point the high frequencies at the listening area, which matters when the speaker is not directly above the couch.',
    },
    {
      title: 'Quick, clean installs',
      art: {
        type: 'prompt',
        alt: 'The three things in a Teraudio box that make fitting quick: a cut-out template, gold-plated spring-loaded terminals and a paintable grille',
        heading: 'In the box',
        prompt: 'Trace the template, cut the hole, clip in the speaker wire',
        cards: [
          { label: 'Cut-out', value: 'Template', sub: 'Marks the hole' },
          { label: 'Terminals', value: 'Spring-loaded', sub: 'Gold-plated' },
          { label: 'Grille', value: 'Paintable', sub: 'Match the ceiling' },
        ],
      },
      body: 'A cut-out template and gold-plated spring-loaded terminals come in the box, so the hole is the right size first time and the speaker wire clips straight in. Less time on the ladder, and a neater finish.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Teraudio includes',
  range: [
    {
      title: 'In-ceiling speakers',
      items: ['Polypropylene woofer models', 'Kevlar woofer models', 'Silk dome tweeters, adjustable towards the listening area', 'Paintable grilles'],
    },
    {
      title: 'Wi-Fi speaker',
      items: ['8-inch in-ceiling speaker', 'Built-in Wi-Fi amplifier', 'For rooms where speaker cable is not practical'],
    },
    {
      title: 'Amplifiers',
      items: ['Digital power amplifiers', 'Bluetooth-enabled models'],
    },
    {
      title: 'In the box',
      items: ['Cut-out template', 'Gold-plated spring-loaded terminals'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Teraudio system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'In-ceiling speakers in each room run from a digital or Bluetooth amplifier, with an 8-inch Wi-Fi model where cable cannot go',
    columns: ['In the ceiling', 'Amplifiers', 'People'],
    devices: [
      { label: 'Living room pair', sub: 'Kevlar woofers', icon: 'speaker' },
      { label: 'Kitchen pair', sub: 'Polypropylene', icon: 'speaker' },
      { label: 'Bedroom and study', sub: 'In-ceiling speakers', icon: 'speaker' },
      { label: 'Hard-to-wire room', sub: '8-inch Wi-Fi model', icon: 'speaker' },
    ],
    platforms: [
      { label: 'Digital amp', sub: 'Drives wired rooms', icon: 'bolt' },
      { label: 'Bluetooth amp', sub: 'Plays from a phone', icon: 'bolt' },
      { label: 'Wi-Fi amplifier', sub: 'Inside the 8-inch', icon: 'wifi' },
    ],
    people: [
      { label: 'Household', sub: 'Music around the home', icon: 'person' },
      { label: 'Phone or tablet', sub: 'Plays over Bluetooth', icon: 'phone' },
      { label: 'Teracom', sub: 'Design and install', icon: 'headset' },
    ],
    footer: 'In-ceiling speakers wired to a digital amplifier, plus 8-inch Wi-Fi models where cable cannot go',
  },
  architectureCaption: 'Most rooms are wired back to a Teraudio digital amplifier, with a Bluetooth model for playing from a phone. Rooms that cannot be cabled take the 8-inch Wi-Fi speaker, and Teracom designs and installs the whole layout.',

  industriesHeading: 'Where we put it to work',
  industries: ['New homes', 'Renovations and extensions', 'Apartments and townhouses', 'Living and dining areas', 'Kitchens', 'Bedrooms and studies', 'Home offices'],

  teracomHeading: 'What Teracom does with Teraudio',
  teracom: [
    { title: 'Design', body: 'Speaker positions planned room by room from the plans, with the woofer type, the amplifier and any Wi-Fi models chosen to suit how each space is used.' },
    { title: 'Supply', body: 'Teraudio is our own range, so speakers, amplifiers and the Wi-Fi model come straight from Teracom, chosen to work together and matched to the job.' },
    { title: 'Install', body: 'Holes cut from the template, cable run and terminated, tweeters aimed at the seating and grilles ready for painting, with every room tested before handover.' },
    { title: 'Support', body: 'Questions and faults come back to the team that designed and fitted the system, and we can extend it to new rooms as the home changes.' },
  ],

  links: [
    { label: 'Teracom Store', href: 'https://www.teracomsolutions.com.au/store' },
    { label: 'Teracom audio visual services', href: 'https://www.teracomsolutions.com.au/services/audio-visual' },
    { label: 'Talk to the Teracom team', href: 'https://www.teracomsolutions.com.au/contact' },
  ],
};

export default teraudio;