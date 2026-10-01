// The deeper Avigilon brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos; Avigilon first as the pilot).
// Written in our own words from avigilon.com (October 2026); figures are
// Avigilon's own. The graphics live in public/assets/brands/avigilon/.

const ART = '/assets/brands/avigilon';

const avigilon = {
  heroImage: `${ART}/hero.svg`,
  heroAlt: 'An AI camera picking out people and a vehicle and sending what it sees to Avigilon Unity on site or Avigilon Alta in the cloud',

  stats: [
    { value: '100+', label: 'camera models, from mini domes to 360° multisensors' },
    { value: 'Up to 10K', label: 'image detail (61 MP) on the top multisensor cameras' },
    { value: '2 platforms', label: 'Unity on your own servers, Alta fully in the cloud' },
    { value: 'NDAA', label: 'compliant, with SOC 2 Type II and ISO 27001 certification' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'Unity on site, or Alta in the cloud',
  platformsIntro: 'The same cameras and the same analytics, with two homes for the system. We help you choose on bandwidth, how long footage must be kept, your IT policy and how many sites you run.',
  platforms: [
    {
      name: 'Avigilon Unity',
      kicker: 'On-premise',
      image: `${ART}/platform-unity.svg`,
      imageAlt: 'Cameras, doors and alarms on site reporting to a Unity server and the security desk, with optional cloud services on top',
      body: 'Video, access control and alarms run on servers you own, with cloud services added for remote viewing, system health and managing users across sites.',
      points: [
        'Unity Video: video management with analytics that learn each scene',
        'Unity Access: on-premise access control tied to the video',
        'Decision Management: alarm workflows on a single screen',
        'Core, Standard and Enterprise editions to suit the site',
      ],
    },
    {
      name: 'Avigilon Alta',
      kicker: 'Cloud',
      image: `${ART}/platform-alta.svg`,
      imageAlt: 'Three sites connecting straight to Alta in the cloud, managed from a browser or a phone',
      body: 'A serverless platform run from a browser or a phone. Nothing to patch on site, updates arrive by themselves, and a new site joins in minutes.',
      points: [
        'Alta Video and Alta Access in one console',
        'Cloud Connectors bring the cameras you already have into Alta',
        'Alta Protect adds monitored, round-the-clock site protection',
        'Visitor and mailroom apps for the front desk',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics',
  capabilitiesHeading: 'What the AI actually does',
  capabilitiesIntro: 'Avigilon builds its analytics into the cameras and the software rather than selling them as an add-on. These are the ones our customers lean on every week.',
  capabilities: [
    {
      title: 'Appearance Search',
      image: `${ART}/appearance-search.svg`,
      imageAlt: 'A description finds the same person on several cameras and marks each sighting on a timeline',
      body: 'Describe someone, by clothing colour, a bag or a vehicle type, and see every camera that caught them across the site in seconds instead of hours of scrubbing through footage.',
    },
    {
      title: 'Unusual activity',
      image: `${ART}/unusual-activity.svg`,
      imageAlt: 'Everyday movement paths fade into the background while one path that breaks the pattern is flagged',
      body: 'The system learns what normal movement looks like in each scene and flags what does not fit: someone lingering at a door, a car going the wrong way, movement after hours.',
    },
    {
      title: 'Licence plate recognition',
      image: `${ART}/lpr.svg`,
      imageAlt: 'A car at a boom gate has its plate read and checked against an allow list',
      body: 'Reads and logs plates at gates and car parks, with allow lists and watch lists that can lift a boom gate or raise an alert.',
    },
    {
      title: 'Perimeter protection',
      image: `${ART}/perimeter.svg`,
      imageAlt: 'A virtual line along a fence alerts on a person crossing it and ignores an animal',
      body: 'Virtual lines and zones that tell a person from a vehicle or an animal, so the alert at 2 am is one worth acting on.',
    },
    {
      title: 'Alerts in plain language',
      image: `${ART}/natural-language.svg`,
      imageAlt: 'A typed sentence becomes an alert rule with a place, an object and a time',
      body: 'Set up an alert by typing what you want to know, such as a vehicle stopping at the loading dock after 10 pm, and the system builds the rule.',
    },
    {
      title: 'Smart sensors',
      image: `${ART}/sensors.svg`,
      imageAlt: 'A ceiling sensor reporting vape, air quality, noise and a spoken call for help',
      body: 'HALO sensors cover places cameras should not go, such as bathrooms, with vape, air quality, noise and spoken help-keyword alerts and no recording.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Avigilon makes',
  range: [
    {
      title: 'Cameras',
      items: ['Dome and mini dome', 'Bullet and box', 'PTZ, including the long-range H6A PTZ', '360° and panoramic multisensor', 'Specialty: thermal, explosion-protected, corridor'],
    },
    {
      title: 'Recording and infrastructure',
      items: ['Network video recorders and appliances', 'Cloud Connectors for existing cameras', 'Servers sized for Unity Video'],
    },
    {
      title: 'Access control',
      items: ['Door readers and video intercoms', 'Mobile, card and fob credentials', 'Controllers, boards and hubs', 'Wireless locks'],
    },
    {
      title: 'Sensors and safety',
      items: ['HALO smart sensors', 'Panic buttons', 'Remote video monitoring'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Avigilon system, end to end',
  architectureImage: `${ART}/architecture.svg`,
  architectureAlt: 'Cameras, door readers and sensors report to Avigilon Unity on site or Avigilon Alta in the cloud, and the security desk, phones and the Teracom monitoring centre act on what they see',
  architectureCaption: 'Cameras, readers and sensors report to Unity on site, Alta in the cloud, or both. Your team works from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Schools and universities', 'Healthcare', 'Retail', 'Commercial property', 'Government', 'Data centres', 'Warehousing and logistics', 'Construction sites'],

  teracomHeading: 'What Teracom does on an Avigilon job',
  teracom: [
    { title: 'Design', body: 'Camera positions and lenses planned from the site drawings, with storage and bandwidth worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'Every camera mounted, cabled and tuned, and the analytics zones set up so the alerts mean something from the first day.' },
    { title: 'Connect to monitoring', body: 'Alarms and analytics events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Avigilon product documentation', href: 'https://www.avigilon.com/product-documentation' },
    { label: 'Avigilon software downloads', href: 'https://www.avigilon.com/software-downloads' },
    { label: 'Avigilon warranty', href: 'https://www.avigilon.com/support/warranty' },
  ],
};

export default avigilon;