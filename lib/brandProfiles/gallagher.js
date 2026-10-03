// The deeper Gallagher brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from security.gallagher.com/en-AU and
// products.security.gallagher.com (October 2026); figures are Gallagher's
// own. Drawings are specs drawn by lib/brandArt.

const gallagher = {
  heroArt: {
    type: 'hero',
    alt: 'A Gallagher reader granting a card while a Controller 7000 handles the door and Command Centre Mobile shows a fence alarm and an armed area',
    device: 'reader',
    left: { title: 'C7000', sub: 'Controller', foot: 'Runs on if server drops', icon: 'server' },
    right: { title: 'Mobile', sub: 'Command Centre', foot: 'Alarms on your phone', icon: 'phone' },
    tags: [
      { text: 'Card · granted', tone: 'ok', icon: 'card' },
      { text: 'Fence touched', tone: 'alert', icon: 'bolt' },
      { text: 'Area armed', tone: 'accent', icon: 'shield' },
    ],
    chips: [
      { text: 'Doors, alarms, fence', tone: 'accent' },
      { text: 'AES-256 encrypted', tone: 'ok' },
    ],
  },

  stats: [
    { value: '10,000', label: 'Controller 7000s in a single system, scaling up from one door' },
    { value: '200 ms', label: 'response at a T-Series reader, whether card or phone' },
    { value: 'Class 5', label: 'AS/NZS 2201 certification for Gallagher intruder alarms' },
    { value: 'Zone 1–5', label: 'Australian security zones the high-security system is endorsed for' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'Command Centre on a server, or Gallagher SMB in the cloud',
  platformsIntro: 'Larger and more complex sites run doors, alarms and perimeter from Command Centre on their own server. Shops, clinics, clubs and branch networks are often better served by Gallagher SMB, which needs no server at all. We help you choose on size, risk and how the site is managed.',
  platforms: [
    {
      name: 'Command Centre',
      kicker: 'Server-based',
      art: {
        type: 'map',
        alt: 'A Command Centre site plan with gates, readers, an alarm area, a car park and a dock camera, and one fence zone in alarm',
        markers: [
          { x: 10, y: 16, icon: 'door', tone: 'ok', label: 'Main gate' },
          { x: 42, y: 20, icon: 'reader', label: 'Lab 2' },
          { x: 78, y: 14, icon: 'alarm', label: 'Store' },
          { x: 92, y: 58, icon: 'bolt', tone: 'alert', label: 'Fence Z4' },
          { x: 62, y: 84, icon: 'camera', label: 'Dock cam' },
          { x: 22, y: 74, icon: 'vehicle', label: 'Car park' },
          { x: 50, y: 50, icon: 'person', label: 'Guard' },
        ],
        caption: 'Doors, alarms and fence on one site plan',
      },
      body: 'Gallagher’s site management software runs access control, intruder alarms and perimeter fencing as one system on your own server, with Command Centre Web and Mobile for running it away from the desk. It grows from one door to thousands, with new releases twice a year.',
      points: [
        'Site plans, alarms, reports and notifications built in',
        'Anti-passback, interlocking, zone counting and guard tours',
        'Licensed add-ons for video, lifts, intercoms, car parks and lockers',
        'AccessNow handles access requests from asking to approval',
      ],
    },
    {
      name: 'Gallagher SMB',
      kicker: 'Cloud, app-based',
      art: {
        type: 'mobile',
        alt: 'A Gallagher SMB phone alert for an alarm at a florist’s back door, with buttons to request a guard or lock the doors',
        app: 'Gallagher SMB',
        icon: 'alarm',
        tone: 'alert',
        notice: 'Alarm · rear',
        sub: 'Florist · back door',
        time: 'Today 11:52 pm',
        actions: ['Request guard', 'Lock all doors'],
        side: [
          { label: 'Arm', sub: 'From the app', icon: 'shield' },
          { label: 'Doors', sub: 'App or Key Tag', icon: 'door' },
          { label: 'Monitoring', sub: '24/7 response', icon: 'headset' },
        ],
      },
      body: 'A cloud system for smaller sites, with no server to install or look after. Alarms, doors and users are run from one phone app across as many locations as the business has, and the software updates itself.',
      points: [
        'Arm and disarm remotely from the SMB app',
        'Doors by phone or SMB Key Tag, with access schedules',
        'Add or remove staff and contractors in moments',
        'Ask a connected security provider for a guard check',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Doors, alarms and fences on one platform',
  capabilitiesIntro: 'Gallagher designs and builds its own controllers, readers, fence hardware and software, so the pieces are made to work together. These are the parts we set up most often.',
  capabilities: [
    {
      title: 'Controller 7000',
      art: {
        type: 'network',
        alt: 'A Controller 7000 linked to doors, readers, alarm inputs, a fence, lifts and the building management system',
        uplink: 'To server',
        switchLabel: 'Controller 7000',
        switchSub: 'Runs on if server drops',
        ports: [
          { label: 'Doors', icon: 'door', tone: 'ok' },
          { label: 'Readers', icon: 'reader', tone: 'ok' },
          { label: 'Alarms', icon: 'alarm', tone: 'accent' },
          { label: 'Fence', icon: 'bolt', tone: 'accent' },
          { label: 'Lifts', icon: 'switch', tone: 'muted' },
          { label: 'BMS', icon: 'thermo', tone: 'muted' },
        ],
        caption: 'Up to 10 wired doors per controller, 256-bit AES back to the server',
      },
      body: 'The C7000 makes access, alarm and perimeter decisions itself, so business rules keep running if the link to the server drops. Each one handles up to 10 wired doors and talks to the server and other controllers over 256-bit AES. Single-door, two-door, standard, enhanced and high-security versions suit each part of a site.',
    },
    {
      title: 'Readers and mobile access',
      art: {
        type: 'door',
        alt: 'A phone held to a T-Series reader opens an office door, with recent card, PIN and wallet entries logged',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Wallet', icon: 'phone' },
          { label: 'PIN', icon: 'pin' },
        ],
        active: 1,
        result: 'Door open',
        resultTone: 'ok',
        log: ['08:41 Phone · BLE', '08:39 Card · T11', '08:30 Card + PIN', '07:55 Wallet badge'],
      },
      body: 'T-Series readers answer in about 200 milliseconds and take MIFARE cards, Bluetooth phones through Mobile Connect, and employee badges in Apple Wallet. The T20 adds a keypad for card plus PIN, and the range is rated up to IP68 and IK09 for exposed spots.',
    },
    {
      title: 'Monitored pulse fencing',
      art: {
        type: 'perimeter',
        alt: 'A monitored pulse fence along a depot boundary alerts on someone climbing it and ignores a gust of wind',
        lineLabel: 'Pulse fence Z4',
        alert: 'Climb · wire tension',
        ignored: 'Wind gust · ignored',
      },
      body: 'An energised fence that deters, plus sensors that read wire tension and vibration and tell an intruder from wildlife or weather. Voltage and alerts are set zone by zone, the pulses meet AS/NZS 60335.2.76, and fence events land in Command Centre beside the doors and alarms.',
    },
    {
      title: 'Intruder alarms',
      art: {
        type: 'panel',
        alt: 'Alarm areas in Command Centre armed overnight, with the plant room in alarm, the kitchen bypassed for cleaners and the fence zone live',
        mode: 'Armed',
        modeTone: 'accent',
        status: 'Plant room alarm',
        zones: [
          { name: 'Reception', state: 'armed', label: 'Armed' },
          { name: 'Plant room', state: 'alarm', label: 'PIR · 02:14' },
          { name: 'Server room', state: 'armed', label: 'Armed' },
          { name: 'Loading dock', state: 'secure', label: 'Roller shut' },
          { name: 'Fence Z4', state: 'armed', label: 'Pulse on' },
          { name: 'Kitchen', state: 'bypassed', label: 'Cleaners in' },
        ],
      },
      body: 'Intruder detection runs on the same controllers and software as the doors and the fence, so every event sits in one view with one audit trail. It is certified to AS/NZS 2201 Class 5 and passes alarms to external monitoring stations over standard protocols.',
    },
    {
      title: 'AccessNow',
      art: {
        type: 'prompt',
        alt: 'A staff request for two weeks of access to a lab goes to the lab manager for approval and is then set up in Command Centre',
        heading: 'AccessNow · new request',
        prompt: 'I need access to Lab 2 for the next two weeks',
        cards: [
          { label: 'Requested', value: 'Lab 2', sub: 'Until 14 Nov' },
          { label: 'Approver', value: 'Lab manager', sub: 'Emailed instantly' },
          { label: 'Provisioned', value: 'Command Centre', sub: 'On approval' },
        ],
      },
      body: 'Staff ask for a card, a mobile credential, a secure area or a visitor pass from their phone. The request goes straight to the right approver, and once approved the access is set up in Command Centre automatically, with every decision logged.',
    },
    {
      title: 'Visitor management',
      art: {
        type: 'dashboard',
        alt: 'A visitor screen for a head office showing people on site, expected arrivals, contractors and inductions due, with front desk events',
        title: 'Visitors · Head office',
        tiles: [
          { label: 'On site now', value: '37', tone: 'accent' },
          { label: 'Expected', value: '12', tone: 'muted' },
          { label: 'Contractors', value: '6', tone: 'ok' },
          { label: 'Inductions due', value: '2', tone: 'warn' },
        ],
        bars: [5, 12, 20, 14, 9, 16, 11, 4],
        chart: 'Arrivals by hour',
        eventsTitle: 'Front desk',
        events: [
          { text: 'QR check-in · 09:12', tone: 'ok' },
          { text: 'Host notified · 09:12', tone: 'ok' },
          { text: 'Pass revoked · 10:45', tone: 'muted' },
          { text: 'Induction overdue', tone: 'warn' },
        ],
      },
      body: 'A cloud visitor system, powered by Kenai, handles pre-registration, QR or face check-in, host alerts and induction records. Through Command Centre it issues the right credential for the visit, takes it back when the visitor leaves, and can run an evacuation roll call.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Gallagher makes',
  range: [
    {
      title: 'Software',
      items: ['Command Centre, Web and Mobile', 'Gallagher SMB', 'AccessNow', 'Visitor management, powered by Kenai', 'OneLink for remote assets'],
    },
    {
      title: 'Access control hardware',
      items: ['Controller 7000 single door, two door, standard and enhanced', 'T-Series readers and terminals, T10 to T30', 'QuickSwitch boards for replacing older systems', 'Cards, tags and Mobile Connect credentials', 'Cabinets and power supplies'],
    },
    {
      title: 'Perimeter',
      items: ['F-Series fence controllers', 'Pulse fence and gate hardware', 'Perimeter sensors', 'Starter kits'],
    },
    {
      title: 'High security',
      items: ['High Security Controller 7000', 'High-security readers', 'High-security cabinets and end-of-line modules', 'PIV software'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Gallagher system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Gallagher readers, controllers, fencing and detectors report to Command Centre or Gallagher SMB, and people act from a desk, a phone or monitoring',
    devices: [
      { label: 'T-Series readers', sub: 'Card, phone, PIN', icon: 'reader' },
      { label: 'Controller 7000', sub: 'Doors and alarms', icon: 'server' },
      { label: 'Pulse fence', sub: 'Tension sensors', icon: 'bolt' },
      { label: 'Detectors', sub: 'Intruder zones', icon: 'motion' },
    ],
    platforms: [
      { label: 'Command Centre', sub: 'Server on site', icon: 'server' },
      { label: 'Gallagher SMB', sub: 'Cloud, for small sites', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Site plans, alarms', icon: 'laptop' },
      { label: 'Phones', sub: 'CC Mobile, SMB app', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Controllers decide at the door; Command Centre ties access, alarms and the fence into one view',
  },
  architectureCaption: 'Gallagher readers, controllers, fencing and detectors report to Command Centre on site, or to Gallagher SMB in the cloud for smaller sites. Your team works from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Schools and universities', 'Healthcare', 'Government', 'Data centres', 'Utilities and critical infrastructure', 'Mining', 'Airports', 'Small businesses and clubs'],

  teracomHeading: 'What Teracom does on a Gallagher job',
  teracom: [
    { title: 'Design', body: 'Doors, readers, alarm areas and fence zones planned from the site drawings, with controllers, cabling and power sized for the site to grow.' },
    { title: 'Install and commission', body: 'Controllers, readers and detectors installed and tested, with cardholders, access groups and alarm areas set up in Command Centre or the SMB app.' },
    { title: 'Connect to monitoring', body: 'Intruder and fence alarms can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Software releases, firmware and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Gallagher Command Centre', href: 'https://security.gallagher.com/en-AU/Product-Ranges/Command-Centre' },
    { label: 'Gallagher Controller 7000', href: 'https://products.security.gallagher.com/security/au/en_AU/products/access-control-hardware/controllers/controller-7000/p/C400100' },
    { label: 'Gallagher CarePlan and warranty', href: 'https://security.gallagher.com/en-AU/Services/CarePlan' },
  ],
};

export default gallagher;