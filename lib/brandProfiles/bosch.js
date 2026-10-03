// The deeper Bosch brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from radionix.com, iqsight.com and
// keenfinity-group.com (October 2026); figures are the manufacturers’ own.
// Drawings are specs drawn by lib/brandArt.

const bosch = {
  heroArt: {
    type: 'hero',
    alt: 'Bosch security at the centre, with Solution Series alarm panels on one side and the Access Management System on the other, handling an intruder and a card',
    device: 'shield',
    left: { title: 'Solution', sub: 'Alarm + access', foot: 'Homes to businesses', icon: 'alarm' },
    right: { title: 'AMS', sub: 'Access control', foot: 'Up to 10,000 doors', icon: 'server' },
    tags: [
      { text: 'Intruder', tone: 'alert', icon: 'motion' },
      { text: 'Card granted', tone: 'ok', icon: 'card' },
      { text: 'Area armed', tone: 'accent', icon: 'alarm' },
    ],
    chips: [
      { text: 'Now Keenfinity Group', tone: 'accent' },
      { text: 'Solution: AU and NZ', tone: 'ok' },
    ],
  },

  stats: [
    { value: '144 zones', label: 'plus 16 doors and 990 users on one Solution 6000-IP panel' },
    { value: '10,000', label: 'doors and 400,000 cardholders on Access Management System' },
    { value: '60+ patents', label: 'behind Bosch motion detectors, with a five-year standard warranty' },
    { value: 'NDAA, TAA', label: 'compliant IQSIGHT video, formerly Bosch Video Systems' },
  ],

  platformsEyebrow: 'Two families',
  platformsHeading: 'Solution panels, or a full access system',
  platformsIntro: 'The Bosch security range is now run by Keenfinity Group: Radionix looks after the alarm panels and detectors, MiCOS looks after Bosch access control, and IQSIGHT carries on the video line. Most of our Bosch work falls into one of these two families.',
  platforms: [
    {
      name: 'Bosch Solution Series',
      kicker: 'Alarm and access',
      art: {
        type: 'panel',
        alt: 'A Solution 6000-IP keypad with the shop area armed, the office door locked, the shared car park open and one zone isolated',
        mode: 'Area 1 armed',
        modeTone: 'accent',
        status: 'Common area open',
        zones: [
          { name: 'Shop entry', state: 'armed', label: 'Area 1' },
          { name: 'Shop PIR', state: 'armed', label: 'Area 1' },
          { name: 'Office door', state: 'secure', label: 'Area 2 locked' },
          { name: 'Office PIR', state: 'armed', label: 'Area 2' },
          { name: 'Car park', state: 'open', label: 'Common area' },
          { name: 'Stock room', state: 'bypassed', label: 'Isolated' },
        ],
      },
      body: 'Solution panels are sold only in Australia and New Zealand. The same panel handles the alarm and the doors, wired or wireless, so a home or business gets one keypad, one set of users and one event log instead of two separate systems.',
      points: [
        'Solution 2000 with up to 8 zones, Solution 3000 with up to 16 and RADION wireless',
        'Solution 6000-IP: 144 zones, 8 areas, 16 doors and 990 users',
        'Smart card keypads arm the alarm and open a door in one touch',
        'Site Manager software for running several panels over the network',
      ],
    },
    {
      name: 'Access Management System',
      kicker: 'Larger sites',
      art: {
        type: 'network',
        alt: 'Access Management System reaching AMC door controllers and an alarm panel through a Master Access Controller, with one gate controller offline',
        uplink: 'AMS server',
        switchLabel: 'Master controller',
        switchSub: 'Takes over if server fails',
        ports: [
          { label: 'AMC Foyer', icon: 'door', tone: 'ok' },
          { label: 'AMC Lifts', icon: 'reader', tone: 'ok' },
          { label: 'AMC Lab', icon: 'lock', tone: 'ok' },
          { label: 'AMC Dock', icon: 'door', tone: 'ok' },
          { label: 'AMC Gate', icon: 'vehicle', tone: 'warn' },
          { label: 'Alarm', icon: 'alarm', tone: 'ok' },
        ],
        caption: 'An AMC keeps deciding at its doors and stores events while offline',
      },
      body: 'Access Management System is the Bosch software for medium and large sites, running Access Modular Controllers at the doors. Master Access Controllers sit between the server and the doors, so anti-passback and area rules keep working if the server goes down.',
      points: [
        'Lite licence from 16 doors, Enterprise up to 10,000 doors',
        'AES-256 from server to controller, OSDP v2 to the readers',
        'Up to 2 million events kept while the server link is down',
        'Visitor Management and Bosch Mobile Access as add-ons',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Detection, doors and video',
  capabilitiesIntro: 'Bosch built its name on detectors that catch people and ignore everything else. These are the features our customers notice once the system is in.',
  capabilities: [
    {
      title: 'TriTech detection',
      art: {
        type: 'sensor',
        alt: 'A TriTech motion detector flagging an intruder on the first step while ignoring a ceiling fan and car headlights',
        icon: 'motion',
        target: 'person',
        label: 'TriTech detector',
        sub: 'PIR plus microwave',
        coverage: 'Commercial Series, up to 15 m',
        events: [
          { text: 'Intruder', sub: 'First step, 02:14', tone: 'alert' },
          { text: 'Ceiling fan', sub: 'Ignored', tone: 'muted' },
          { text: 'Headlights', sub: 'Ignored', tone: 'muted' },
        ],
      },
      body: 'TriTech detectors only alarm when the heat sensor and the microwave sensor agree. They respond to the first step into a room, adjust for room temperature and filter out fans, hanging signs and bright light, so the alarm at night is a person.',
    },
    {
      title: 'The panel on your phone',
      art: {
        type: 'mobile',
        alt: 'The RSC+ app showing a Solution 3000 disarmed after school, with buttons to arm it or open the garage',
        app: 'RSC+',
        icon: 'alarm',
        tone: 'ok',
        notice: 'Disarmed',
        sub: 'House · user 4, Jess',
        time: 'Today 3:42 pm',
        actions: ['Arm away', 'Open garage'],
        side: [
          { label: 'Sensors', sub: 'Isolate one', icon: 'motion' },
          { label: 'Outputs', sub: 'Up to 20', icon: 'bolt' },
          { label: 'History', sub: 'Full log', icon: 'chart' },
        ],
      },
      body: 'The free RSC+ app arms and disarms a Solution 2000 or 3000, shows which sensors are open, isolates them and runs up to 20 outputs such as a garage door. Push alerts tell you when the alarm goes off or when the kids get home.',
    },
    {
      title: 'Lockdown in one step',
      art: {
        type: 'map',
        alt: 'A school floor plan in lockdown, with every door locked except a responder entry',
        markers: [
          { x: 14, y: 24, icon: 'lock', tone: 'accent', label: 'Foyer' },
          { x: 50, y: 18, icon: 'lock', tone: 'accent', label: 'Library' },
          { x: 86, y: 26, icon: 'lock', tone: 'accent', label: 'Staff room' },
          { x: 48, y: 50, icon: 'alarm', tone: 'alert', label: 'Level 3' },
          { x: 16, y: 78, icon: 'lock', tone: 'accent', label: 'Gym' },
          { x: 52, y: 82, icon: 'door', tone: 'ok', label: 'Responders' },
          { x: 86, y: 76, icon: 'lock', tone: 'accent', label: 'Car park' },
        ],
        caption: 'Lockdown: responder cards only',
      },
      body: 'Access Management System supports up to 15 threat levels. One action can lock every door, open them all, or lock most and leave a few for first responders only. Lower levels suit open days and parent evenings.',
    },
    {
      title: 'Phones, cards and two factors',
      art: {
        type: 'door',
        alt: 'A card, a phone, a PIN and a face at a reader, with the phone opening the door and each entry logged',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'PIN', icon: 'key' },
          { label: 'Face', icon: 'face' },
        ],
        active: 1,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:02 Phone, Foyer', '07:58 Card+PIN Lab', '07:41 Face, Store', '07:30 Denied, Dock'],
      },
      body: 'Bosch Mobile Access puts the credential on a phone, sent by email or QR code and revoked from the same system as cards. Doors that need more can ask for two factors, such as a card and a PIN or a fingerprint.',
    },
    {
      title: 'Perimeter video analytics',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a rear fence flagging a person crawling towards it and ignoring trees moving in the wind',
        lineLabel: 'Rear fence line',
        alert: 'Person crawling, 01:40',
        ignored: 'Swaying trees ignored',
      },
      body: 'IQSIGHT, the former Bosch video business, offers IVA Pro Perimeter for long fence lines. It picks up people, even crawling, and vehicles at range while filtering out rain, snow and moving trees.',
    },
    {
      title: 'Plates read on the camera',
      art: {
        type: 'plate',
        alt: 'A vehicle at a loading dock has its plate read on the camera and found on the allow list',
        plate: '1RX 5KT',
        confidence: 'Read on the camera',
        status: 'On allow list',
        statusTone: 'ok',
        lines: ['Loading dock · 06:12', 'Sent to the VMS live'],
      },
      body: 'IVA Pro License Plate runs on selected IQSIGHT cameras, with no separate analytics server. It reads plates in stop-start traffic and passes them straight to the video management system.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Bosch makes',
  range: [
    {
      title: 'Alarm panels',
      items: ['Solution 2000 and 3000', 'Solution 6000-IP alarm and access', 'Icon, text and touchscreen keypads', 'RSC+ app and MyAlarm cloud service'],
    },
    {
      title: 'Detectors',
      items: ['Blue Line, Commercial and Professional Series motion detectors', 'TriTech PIR and microwave detectors', 'RADION wireless detectors', 'Glass break, seismic and shock sensors', 'Door contacts and request-to-exit detectors'],
    },
    {
      title: 'Access control',
      items: ['Access Management System, Lite and Enterprise', 'Access Modular Controllers', 'Card, PIN and biometric readers', 'Bosch Mobile Access and Visitor Management'],
    },
    {
      title: 'Video (now IQSIGHT)',
      items: ['FLEXIDOME, AUTODOME and MIC cameras', 'Fixed, moving, panoramic and thermal models', 'IVA Pro analytics', 'Rugged models up to IP68'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Bosch system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Detectors, keypads, readers and cameras report to a Solution panel, AMS and the video system, reaching the desk, owners, staff and monitoring',
    columns: ['On site', 'Platform', 'People'],
    devices: [
      { label: 'Motion detectors', sub: 'TriTech and RADION', icon: 'motion' },
      { label: 'Keypads', sub: 'Smart card reader', icon: 'alarm' },
      { label: 'Door readers', sub: 'Card, phone, PIN', icon: 'reader' },
      { label: 'AMC controllers', sub: 'At every door', icon: 'switch' },
      { label: 'IQSIGHT cameras', sub: 'IVA Pro analytics', icon: 'camera' },
    ],
    platforms: [
      { label: 'Solution panel', sub: 'Alarm and doors', icon: 'alarm' },
      { label: 'AMS', sub: 'Access Management', icon: 'server' },
      { label: 'Video system', sub: 'Your chosen VMS', icon: 'camera' },
    ],
    people: [
      { label: 'Security desk', sub: 'AMS operator', icon: 'laptop' },
      { label: 'Owners', sub: 'RSC+ or iFob Control', icon: 'phone' },
      { label: 'Staff', sub: 'Card, PIN or phone', icon: 'person' },
      { label: 'Monitoring centre', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Alarm zones, doors and video working together, from a house to a multi-site estate',
  },
  architectureCaption: 'Detectors and keypads report to a Solution panel, doors run from AMC controllers under Access Management System on larger sites, and IQSIGHT cameras record to the video system. Owners use the app, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Homes and townhouses', 'Retail', 'Commercial offices', 'Banks', 'Schools', 'Government', 'Museums and galleries', 'Warehousing'],

  teracomHeading: 'What Teracom does on a Bosch job',
  teracom: [
    { title: 'Design', body: 'Zones, areas, detectors and doors planned from the site drawings, and the right platform chosen, a Solution panel or Access Management System, before anything is ordered.' },
    { title: 'Install and commission', body: 'Panels, detectors, readers and locks installed and wired, every zone walk-tested, and users, areas and access levels programmed before handover.' },
    { title: 'Connect to monitoring', body: 'Alarm and door events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Battery checks, firmware, software maintenance and detector tests handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Bosch Solution Series alarm panels', href: 'https://www.radionix.com/us/en/intrusion-alarm-panels/bosch-solution-series/' },
    { label: 'Bosch intrusion and access warranty', href: 'https://www.radionix.com/us/en/service-support/warranty-repairs/' },
    { label: 'IQSIGHT video analytics', href: 'https://www.iqsight.com/en/products/analytics' },
  ],
};

export default bosch;