// The deeper Aritech brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from aritech.com.au (October 2026); figures are
// Aritech's own. Drawings are specs drawn by lib/brandArt.

const aritech = {
  heroArt: {
    type: 'hero',
    alt: 'An Aritech panel handling an armed area, a forced door and a lift, fed by door controllers on one side and UltraSync on the other',
    device: 'alarm',
    left: { title: 'Door + lift', sub: 'TS1066 NAC', foot: '8 doors or lifts each', icon: 'door' },
    right: { title: 'UltraSync', sub: 'Encrypted link', foot: 'Monitoring and the app', icon: 'cloud' },
    tags: [
      { text: 'Area 2 armed', tone: 'ok', icon: 'shield' },
      { text: 'Door forced', tone: 'alert', icon: 'door' },
      { text: 'Lift to L4', tone: 'accent', icon: 'card' },
    ],
    chips: [
      { text: 'Intrusion and access', tone: 'accent' },
      { text: 'Alarms to monitoring', tone: 'ok' },
    ],
  },

  stats: [
    { value: '128 doors', label: 'on one ChallengerPlus panel, with 99 areas and 1,008 inputs' },
    { value: '250,000', label: 'users held in a Network Access Controller run from software' },
    { value: '600', label: 'controllers on one WMS Pro system, with up to 300 operators' },
    { value: '256 zones', label: 'on an Axon panel, wired, wireless or a mix of both' },
  ],

  platformsEyebrow: 'Two panel families',
  platformsHeading: 'Tecom and Axon, both on UltraSync',
  platformsIntro: 'Aritech sells two panel families in Australia. Tecom is the local range that Challenger sites have grown up on; Axon is Aritech’s newer intrusion and access panel, sold worldwide. We help you choose on site size, the hardware already on the wall and how you want to manage it.',
  platforms: [
    {
      name: 'Tecom',
      kicker: 'ChallengerPlus and Discovery',
      art: {
        type: 'panel',
        alt: 'A Tecom keypad showing a part-armed bank, with one alarm at the dock, an isolated detector and the rest of the site secure',
        mode: 'Part armed',
        modeTone: 'warn',
        status: 'Night areas set',
        zones: [
          { name: 'Banking hall', state: 'armed', label: 'Area 1 armed' },
          { name: 'Vault door', state: 'secure', label: 'Locked' },
          { name: 'Dock roller', state: 'alarm', label: 'Alarm 02:14' },
          { name: 'Comms room', state: 'secure', label: 'Secure' },
          { name: 'Staff room', state: 'open', label: 'Area 4 open' },
          { name: 'Rear PIR', state: 'bypassed', label: 'Isolated' },
          { name: 'Lift L4', state: 'secure', label: 'Floor locked' },
          { name: 'Plant room', state: 'armed', label: 'Area 3 armed' },
        ],
      },
      body: 'A ChallengerPlus or Discovery panel sits at the centre, with door, lift and input modules added on its data bus as the site grows. Users, start and end dates and door groups live in the panel itself, so access rules still apply when the software link is down.',
      points: [
        'ChallengerPlus: up to 99 areas, 128 doors and 98 lifts',
        'Discovery: the DIN-rail panel set up from a web browser',
        'Network Access Controllers for four or eight doors or lifts',
        'WMS Pro web software for up to 600 controllers',
      ],
    },
    {
      name: 'Axon',
      kicker: 'Intrusion, access and video',
      art: {
        type: 'cloud',
        alt: 'Three sites with Axon panels connecting through UltraSync, managed by the installer portal and a phone app',
        title: 'UltraSync',
        sub: 'VPN tunnel to every panel',
        badge: 'Servers in Australia',
        sites: [
          { label: 'Retail store', sub: 'Axon panel', icon: 'alarm' },
          { label: 'Medical', sub: '8 doors', icon: 'door' },
          { label: 'Warehouse', sub: 'Recorder', icon: 'camera' },
        ],
        clients: [
          { label: 'Portal', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'One panel for alarms, doors and links to video, set up from a browser on a phone, tablet or PC with guided wizards. It joins UltraSync out of the box over Ethernet or a SIM, so panels can be checked and supported remotely.',
      points: [
        '16 zones on the board, up to 256 in total',
        'Up to 8 doors on the panel, more with CDC4 controllers',
        'Wired and wireless detectors, with plug-on expanders',
        'Scheduled health checks through UltraSync',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'What an Aritech system does day to day',
  capabilitiesIntro: 'The panel is only the start. These are the parts of the range that change how a site actually runs, from the front door to the monitoring centre.',
  capabilities: [
    {
      title: 'Doors and lifts on one controller',
      art: {
        type: 'door',
        alt: 'A card at a reader is accepted for level 4, with a log of recent lift and door events beside it',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'Fob', icon: 'fob' },
          { label: 'PIN', icon: 'pin' },
        ],
        active: 0,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:02 Priya · L4', '07:55 Dock door', '07:41 Card expired', '07:30 Lift L2'],
      },
      body: 'A Network Access Controller runs up to eight doors or lifts and up to 100 floors. It takes OSDP v2 readers and Aperio or Salto wireless locks, and when run straight from software it holds 250,000 users on board.',
    },
    {
      title: 'Site maps',
      art: {
        type: 'map',
        alt: 'A floor plan with doors, a detector, a camera and a lift placed on it, and the dock door flagged',
        markers: [
          { x: 8, y: 18, icon: 'door', label: 'Entry' },
          { x: 30, y: 78, icon: 'motion', label: 'PIR 3' },
          { x: 52, y: 22, icon: 'camera', label: 'Cam 2' },
          { x: 72, y: 82, icon: 'door', tone: 'alert', label: 'Dock door' },
          { x: 92, y: 20, icon: 'reader', label: 'Lift L1' },
        ],
        caption: 'Click a door to lock or open it',
      },
      body: 'WMS Pro lets you upload a floor plan and place doors, areas and inputs on it, so guards, reception and managers can see what is happening and act on it from the drawing.',
    },
    {
      title: 'Alarm handling in the browser',
      art: {
        type: 'dashboard',
        alt: 'A WMS Pro screen with controller, door and cardholder counts, a week of alarms and the latest events',
        title: 'WMS Pro · alarms',
        tiles: [
          { label: 'Controllers', value: '14' },
          { label: 'Doors', value: '86' },
          { label: 'Open alarms', value: '2', tone: 'alert' },
          { label: 'Cardholders', value: '3,410' },
        ],
        bars: [12, 9, 14, 11, 16, 8, 13, 10],
        chart: 'Alarms this week',
        eventsTitle: 'Latest',
        events: [
          { text: 'Door forced · Dock', tone: 'alert' },
          { text: 'Area 2 armed', tone: 'ok' },
          { text: 'Mains fail · Panel 3', tone: 'warn' },
          { text: 'Weekly report sent', tone: 'ok' },
        ],
      },
      body: 'Alarms from one panel or many sites arrive in one web page, ranked and colour-coded, with sound, email and full-screen alerts. Reports run on a schedule and go out by email or as PDF and CSV.',
    },
    {
      title: 'Your system on your phone',
      art: {
        type: 'mobile',
        alt: 'The TecomPlus app showing an alarm in a warehouse area, with buttons to view the camera or isolate the input',
        app: 'TecomPlus',
        icon: 'alarm',
        tone: 'alert',
        notice: 'Alarm Area 2',
        sub: 'Dock PIR · Dandenong',
        time: 'Today 02:14',
        actions: ['View camera', 'Isolate input'],
        side: [
          { label: 'Areas', sub: 'Arm or disarm', icon: 'shield' },
          { label: 'Doors', sub: 'Open remotely', icon: 'door' },
          { label: 'Cameras', sub: 'TruVision live', icon: 'camera' },
        ],
      },
      body: 'The TecomPlus app reaches the panel through UltraSync. Arm and disarm areas, open doors, isolate inputs, add users and cards, and watch TruVision cameras live, with push alerts for alarms and power faults.',
    },
    {
      title: 'Cameras that ignore the wind',
      art: {
        type: 'perimeter',
        alt: 'A camera line along a yard fence flags a person crossing it and ignores an animal',
        lineLabel: 'Yard fence',
        alert: 'Person in yard',
        ignored: 'Animal · ignored',
      },
      body: 'TruVision M series cameras tell people and vehicles apart from animals, moving branches and shadows, so far fewer false events reach the recorder and the app. Up to 8 MP, with fixed or motorised lenses.',
    },
    {
      title: 'More than one place to report',
      art: {
        type: 'network',
        alt: 'A ChallengerPlus panel sending alarms to two monitoring centres, management software and the app at the same time',
        uplink: 'UltraSync',
        switchLabel: 'ChallengerPlus',
        switchSub: '10 reporting paths at once',
        ports: [
          { label: 'Monitoring', icon: 'headset' },
          { label: 'Tenant 2', icon: 'headset' },
          { label: 'WMS Pro', icon: 'laptop' },
          { label: 'TecomPlus', icon: 'phone' },
        ],
        caption: 'Each path filtered by area, event and time',
      },
      body: 'A ChallengerPlus panel can report down ten paths at once, each filtered by area, event and time. Tenants sharing one panel can each send alarms to their own monitoring provider.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Aritech makes',
  range: [
    {
      title: 'Panels and controllers',
      items: ['ChallengerPlus and ChallengerLEPlus', 'Discovery DIN-rail panel', 'Axon intrusion and access panel', 'Network Access Controller, 4 or 8 doors', 'Axon CDC4 four-door and lift controller'],
    },
    {
      title: 'Keypads, readers and detection',
      items: ['Arming stations and Axon touchscreen keypads', 'Card readers and credentials', 'Aritech motion sensors', 'ShatterPro glass-break detectors', 'Magnetic contacts, wired and wireless'],
    },
    {
      title: 'Software and connectivity',
      items: ['WMS Pro web management', 'UltraSync cloud and installer portal', 'TecomPlus mobile app', 'Discovery 4G comms module'],
    },
    {
      title: 'Video',
      items: ['TruVision M series IP cameras', 'TruVision PTZ, 360°, ANPR and thermal cameras', 'TruVision recorders and Navigator software', 'IFS network switches'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Aritech system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Detectors, doors, keypads and cameras report to a Tecom or Axon panel, WMS Pro and UltraSync, and on to the desk, staff phones and monitoring',
    devices: [
      { label: 'Detectors', sub: 'PIRs, reeds, glass', icon: 'motion' },
      { label: 'Doors and lifts', sub: 'NAC and CDC4', icon: 'door' },
      { label: 'Keypads', sub: 'Arming stations', icon: 'pin' },
      { label: 'TruVision cameras', sub: 'Recorder on site', icon: 'camera' },
    ],
    platforms: [
      { label: 'Tecom or Axon', sub: 'Panel on site', icon: 'alarm' },
      { label: 'WMS Pro', sub: 'Web management', icon: 'server' },
      { label: 'UltraSync', sub: 'Encrypted cloud link', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Maps and alarms', icon: 'laptop' },
      { label: 'Staff', sub: 'TecomPlus app', icon: 'phone' },
      { label: 'Monitoring centre', sub: 'Alarms after hours', icon: 'headset' },
    ],
    footer: 'Detectors, doors and cameras report to the panel; WMS Pro and UltraSync put it in front of the right people',
  },
  architectureCaption: 'Detectors, doors, lifts and cameras connect to a Tecom or Axon panel on site. WMS Pro runs the day-to-day from a browser, UltraSync carries alarms and the app securely, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Banks and financial institutions', 'Retail', 'Schools and universities', 'Offices and shared workspaces', 'Distribution centres', 'Councils', 'Transport', 'Apartment buildings'],

  teracomHeading: 'What Teracom does on an Aritech job',
  teracom: [
    { title: 'Design', body: 'Panel, expanders and door controllers sized from the site drawings, with areas, door groups and lift floors planned before anything is ordered.' },
    { title: 'Install and commission', body: 'Panels, readers and detectors installed and cabled, every input walk-tested, and WMS Pro set up with your floor plans and access groups.' },
    { title: 'Connect to monitoring', body: 'Alarms can come through to our monitoring centre for after-hours response, over UltraSync or a direct IP path.' },
    { title: 'Look after it', body: 'Firmware, battery tests and user changes handled on a maintenance plan, including staged upgrades from older Challenger hardware.' },
  ],

  links: [
    { label: 'Aritech product documentation', href: 'https://aritech.com.au/document-category/product-documentation/' },
    { label: 'Tecom range and compatibility', href: 'https://aritech.com.au/tecom-2/' },
    { label: 'Aritech product warranty', href: 'https://aritech.com.au/aritech-product-warranty/' },
  ],
};

export default aritech;