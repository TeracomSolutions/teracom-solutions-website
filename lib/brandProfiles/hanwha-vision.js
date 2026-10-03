// The deeper Hanwha Vision brand page (Robert, 2026-10-01: build the brand
// pages out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from hanwhavision.com (October 2026); figures are
// Hanwha Vision's own. Drawings are specs drawn by lib/brandArt.

const hanwhaVision = {
  heroArt: {
    type: 'hero',
    alt: 'A Wisenet 9 AI camera classifying people and vehicles on the camera and sending what it finds to a BLAZE appliance on site or to OnCloud',
    device: 'camera',
    left: { title: 'BLAZE', sub: 'AI appliance', foot: 'On site, pre-licensed', icon: 'server' },
    right: { title: 'OnCloud', sub: 'Cloud VMS', foot: 'Browser and mobile app', icon: 'cloud' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Loitering', tone: 'warn', icon: 'person' },
    ],
    chips: [
      { text: 'Wisenet 9 dual NPU', tone: 'accent' },
      { text: 'AI on the camera', tone: 'ok' },
    ],
  },

  stats: [
    { value: '5 years', label: 'limited warranty on network hardware, shorter on wear parts' },
    { value: 'Since 2004', label: 'designing its own camera chips, now up to Wisenet 9' },
    { value: '90+', label: 'camera models that can record straight to the cloud with OnCloud' },
    { value: '12', label: 'purpose-built BLAZE appliances, delivered installed and licensed' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'BLAZE on site, or OnCloud with no recorder',
  platformsIntro: 'The AI runs on the Wisenet cameras either way; the choice is where the video is kept and managed. We weigh up site count, internet links, how long footage must be kept and whether you want hardware on site.',
  platforms: [
    {
      name: 'BLAZE',
      kicker: 'Hybrid AI VMS',
      art: {
        type: 'onPrem',
        alt: 'Hanwha cameras, thermal cameras, speakers and intercoms recording to a BLAZE appliance on site, with user management in the cloud',
        devices: [
          { label: 'AI cameras', icon: 'camera' },
          { label: 'Thermal', icon: 'thermo' },
          { label: 'Speakers', icon: 'speaker' },
          { label: 'Intercoms', icon: 'door' },
        ],
        server: 'BRR-P6410A4E',
        badge: 'Pre-licensed',
        title: 'On your premises',
        sub: 'Cloud for multi-site users',
        points: ['Up to 64 channels', 'Plain-text search', 'Hardened OS'],
      },
      body: 'Hanwha’s hybrid video management system runs on its own appliances, which arrive installed, licensed and ready to go. Video is recorded and searched on site, while the cloud links several sites and manages users in one place.',
      points: [
        '12 appliances, from 16-channel compact units to 64-channel AI models',
        'Compact models with a PoE switch built in',
        'Semantic Search on the AI models: describe what you want in plain words',
        'Works with Hanwha speakers, intercoms and thermal cameras',
      ],
    },
    {
      name: 'OnCloud',
      kicker: 'Cloud',
      art: {
        type: 'cloud',
        alt: 'Three sites with Hanwha cameras connecting straight to OnCloud, watched and searched from a browser or a phone',
        title: 'OnCloud',
        sub: 'Camera straight to cloud',
        badge: 'Record to SD or cloud',
        sites: [
          { label: 'Shop', sub: 'P series domes', icon: 'camera' },
          { label: 'Warehouse', sub: 'PTZ + fisheye', icon: 'camera' },
          { label: 'Office', sub: 'X series', icon: 'bullet' },
        ],
        clients: [
          { label: 'Web', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'A video service run entirely in the cloud. The CloudConnector app on each camera links it straight to OnCloud, so there is no recorder to buy or patch, and live and recorded video open in a browser or on a phone.',
      points: [
        'More than 90 Hanwha camera models supported, including PTZ and fisheye',
        'Record on the camera’s microSD card, in the cloud, or both',
        'Search clips by face, clothing or vehicle type',
        'Mobile apps for Android and iOS at no extra cost',
      ],
    },
  ],

  capabilitiesEyebrow: 'AI analytics',
  capabilitiesHeading: 'What the AI on a Wisenet camera does',
  capabilitiesIntro: 'Hanwha designs the chip inside its cameras, and the latest Wisenet 9 chip has one AI processor for the picture and a second for analytics. These are the functions that earn their keep on the sites we install.',
  capabilities: [
    {
      title: 'AI search',
      art: {
        type: 'search',
        alt: 'A description of a person in a red jacket finds them on three cameras around a shopping centre, best match first',
        query: 'Red jacket, black backpack, east entrance',
        badge: '3 matches',
        results: [
          { label: 'Entry · 15:42', score: '95%', highlight: true },
          { label: 'Foyer · 15:47', score: '86%' },
          { label: 'Car park · 15:58', score: '72%' },
        ],
        caption: 'Searches the attributes the cameras logged as they recorded',
      },
      body: 'WiseAI cameras tag every person and vehicle they see, so recordings can be searched by clothing, bags, face or vehicle type instead of scrubbing through hours of footage. The AI BLAZE appliances also take a plain-language description.',
    },
    {
      title: 'Behaviour detection',
      art: {
        type: 'activity',
        alt: 'Everyday foot traffic through a lobby fades into the background while one person lingering by the lifts is flagged',
        place: 'Lobby',
        alert: 'Loitering · 6 min',
        note: 'Usual paths ignored',
      },
      body: 'The WiseAI app adds rules for loitering, stopped vehicles, pedestrians, vehicles going the wrong way, fallen objects and forklifts, each set per zone so only the event you care about raises an alert.',
    },
    {
      title: 'Wisenet Road AI',
      art: {
        type: 'plate',
        alt: 'A van at a dock gate has its plate, make, model and colour read on the camera and logged',
        plate: 'XQV 518',
        confidence: 'Make, model, colour',
        status: 'Vehicle logged',
        statusTone: 'ok',
        lines: ['White van · LCV', 'Dock gate · 06:12'],
      },
      body: 'Selected P series cameras come with Road AI loaded and licensed. It reads number plates along with make, model, colour and vehicle type, and the log can be searched later by plate, date, brand or colour.',
    },
    {
      title: 'Radiometric thermal',
      art: {
        type: 'thermal',
        alt: 'A thermal view of a battery charging bay with one hot spot flagged above its set temperature',
        temp: '96°C',
        alert: 'Over 80°C zone 3',
      },
      body: 'Thermal cameras such as the TNO-C3020TRA measure temperature from -40 to 550°C across up to 10 zones and alarm when a reading climbs past a limit, which suits battery charging bays and waste sites. They also tell people from vehicles in the heat picture.',
    },
    {
      title: 'Vision Insight',
      art: {
        type: 'dashboard',
        alt: 'A dashboard showing people counted into a branch, queue length, occupancy and a queue alert',
        title: 'Branch overview',
        tiles: [
          { label: 'Visitors today', value: '842', tone: 'accent' },
          { label: 'In branch now', value: '31', tone: 'ok' },
          { label: 'Queue length', value: '7', tone: 'warn' },
          { label: 'Avg wait', value: '4 min', tone: 'muted' },
        ],
        bars: [30, 55, 90, 120, 105, 140, 95, 60],
        chart: 'Visitors by hour',
        eventsTitle: 'Latest events',
        events: [
          { text: 'Queue over 6 people', tone: 'warn' },
          { text: 'Second teller opened', tone: 'ok' },
          { text: 'Count reset 9:00 am', tone: 'muted' },
        ],
      },
      body: 'An on-site dashboard that turns what the P, X and Q series AI cameras already record into counts, queue figures and reports, for one site or many. It is aimed at retail, traffic and factory safety questions rather than security alone.',
    },
    {
      title: 'WiseDetector',
      art: {
        type: 'map',
        alt: 'A warehouse floor plan with cameras placed on it, a box left in an aisle and an open door flagged by trained detections',
        markers: [
          { x: 12, y: 26, icon: 'camera', label: 'Aisle 1' },
          { x: 34, y: 70, icon: 'camera', label: 'Aisle 4' },
          { x: 52, y: 38, icon: 'bag', tone: 'alert', label: 'Box left' },
          { x: 74, y: 72, icon: 'door', tone: 'warn', label: 'Door open' },
          { x: 90, y: 24, icon: 'camera', label: 'Dock' },
        ],
        caption: 'Objects you trained, flagged on the plan',
      },
      body: 'Teach a P series AI camera to recognise something specific to your site, such as boxes left on a shop floor, cones on a road or a door left open, from a set of example images. It runs on the camera with no licence fee.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Hanwha Vision makes',
  range: [
    {
      title: 'Cameras',
      items: ['Wisenet P, X and Q series', 'Dome, bullet, box and flateye', 'PTZ, multi-sensor and panoramic', 'Fisheye and corner mount', 'Thermal and explosion-proof'],
    },
    {
      title: 'Recording and software',
      items: ['BLAZE hybrid AI VMS and appliances', 'Wisenet WAVE VMS and WRN recorders', 'OnCloud direct-to-cloud VMS', 'Wisenet Viewer and Wisenet Mobile', 'Plug-ins for Milestone and Genetec'],
    },
    {
      title: 'Analytics',
      items: ['WiseAI object and behaviour detection', 'Wisenet Road AI number plates', 'WiseDetector custom objects', 'Vision Insight dashboards'],
    },
    {
      title: 'Audio, access and more',
      items: ['IP audio', 'Access control and Wisenet ACS', 'Intercom cameras', 'Analogue cameras for upgrades', 'Installation accessories'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Hanwha Vision system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Hanwha AI, thermal and number plate cameras and IP audio report to BLAZE, Wisenet WAVE or OnCloud, and people act from a desk or phone',
    devices: [
      { label: 'AI cameras', sub: 'Wisenet 9 P series', icon: 'camera' },
      { label: 'Thermal', sub: 'TNO radiometric', icon: 'thermo' },
      { label: 'Plate cameras', sub: 'Wisenet Road AI', icon: 'vehicle' },
      { label: 'IP audio', sub: 'Speakers, intercoms', icon: 'speaker' },
    ],
    platforms: [
      { label: 'BLAZE', sub: 'Appliance on site', icon: 'server' },
      { label: 'Wisenet WAVE', sub: 'Server or WRN NVR', icon: 'laptop' },
      { label: 'OnCloud', sub: 'Camera to cloud', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'BLAZE or WAVE client', icon: 'laptop' },
      { label: 'Phones', sub: 'Wisenet Mobile', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Analytics run on each camera; BLAZE, WAVE or OnCloud records, searches and shows what the cameras find',
  },
  architectureCaption: 'Hanwha cameras analyse the video themselves, then record to a BLAZE appliance or Wisenet WAVE on site, or straight to OnCloud. Your team searches and responds from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail and shopping centres', 'Banking and finance', 'Healthcare', 'Schools and universities', 'Transport and car parks', 'Manufacturing and warehousing', 'Waste and recycling', 'Commercial property'],

  teracomHeading: 'What Teracom does on a Hanwha Vision job',
  teracom: [
    { title: 'Design', body: 'Camera models, lenses and positions chosen from the site drawings, with the analytics each area needs and the storage to match.' },
    { title: 'Install and commission', body: 'Every camera mounted, cabled and focused, with detection zones, plate reading and temperature limits set up and tested before handover.' },
    { title: 'Connect to monitoring', body: 'Analytics and thermal alarms can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, software updates and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Hanwha Vision support portal', href: 'https://supportportal.hanwhavision.com/global' },
    { label: 'Wisenet WAVE video software', href: 'https://www.hanwhavision.com/global/products/product-details/Wisenet-WAVE' },
    { label: 'Hanwha Vision warranty', href: 'https://www.hanwhavision.com/global/support/warranty-repair' },
  ],
};

export default hanwhaVision;