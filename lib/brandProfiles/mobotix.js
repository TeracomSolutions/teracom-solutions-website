// The deeper MOBOTIX brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from mobotix.com (October 2026); figures are
// MOBOTIX's own. Drawings are specs drawn by lib/brandArt.

const mobotix = {
  heroArt: {
    type: 'hero',
    alt: 'A MOBOTIX camera analysing and recording on board, picking out a person, a vehicle and a hot spot, with MOBOTIX HUB above it',
    device: 'camera',
    left: { title: 'Camera DVR', sub: 'M ONE: 1 TB', foot: 'No recording server', icon: 'server' },
    right: { title: 'HUB', sub: 'Central VMS', foot: '16,000+ devices', icon: 'laptop' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Hot spot', tone: 'alert', icon: 'thermo' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
    ],
    chips: [
      { text: 'Made in Germany', tone: 'accent' },
      { text: 'Apps on the camera', tone: 'ok' },
    ],
  },

  stats: [
    { value: 'Since 1999', label: 'designing and building cameras in Langmeil, Germany' },
    { value: '5 years', label: 'warranty on MOBOTIX ONE cameras, rated at over 10 years MTBF' },
    { value: 'Up to 60 m', label: 'thermal fire detection range, often before flames appear' },
    { value: '16,000+', label: 'cameras and devices supported by MOBOTIX HUB' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'Decentralised on the camera, or MOBOTIX HUB',
  platformsIntro: 'MOBOTIX cameras can analyse, record and raise alarms by themselves, so a small site may need no server at all. Larger sites add MOBOTIX HUB for central control. We help you choose on camera numbers, sites and how your operators work.',
  platforms: [
    {
      name: 'MxManagementCenter',
      kicker: 'Decentralised',
      art: {
        type: 'storage',
        alt: 'Footage kept on the camera’s own storage and a NAS, viewed in MxManagementCenter with no recording server',
        tiers: [
          { label: 'Camera’s own storage', sub: 'microSD, or 1 TB built into M ONE', icon: 'camera' },
          { label: 'NAS on the network', sub: 'Longer retention, still no server', icon: 'server' },
          { label: 'MxManagementCenter', sub: 'Free viewing on Windows or Mac', icon: 'laptop' },
        ],
        active: 0,
        stat: '0',
        statLabel: 'recording servers',
        badge: 'Decentralised',
        points: ['Records on the camera', 'Alarms on the camera', 'Free viewing software'],
        caption: 'Each camera records and decides for itself',
      },
      body: 'Each camera is a small computer that runs its own analytics, records to its own storage or a NAS, and handles its own alarms. MxManagementCenter, free for MOBOTIX cameras, brings them together for live view and playback.',
      points: [
        'Recording on the camera, to a NAS, or both',
        'MxManagementCenter free for MOBOTIX cameras, on Windows or Mac',
        'Smart Data Search finds plates and app events across cameras',
        'MOBOTIX LIVE app for phones and door stations',
      ],
    },
    {
      name: 'MOBOTIX HUB',
      kicker: 'Central VMS',
      art: {
        type: 'onPrem',
        alt: 'MOBOTIX and third-party cameras, doors and sensors feeding a MOBOTIX HUB server for one view across sites',
        devices: [
          { label: 'MOBOTIX', icon: 'camera' },
          { label: 'ONVIF cams', icon: 'camera' },
          { label: 'Access', icon: 'door' },
          { label: 'Sensors', icon: 'sensor' },
        ],
        server: 'HUB server',
        badge: 'Levels L2 to L5',
        title: 'MOBOTIX HUB',
        sub: 'One view of every site',
        points: ['Failover recording', 'Video wall, L4-L5', 'LPR add-on'],
      },
      body: 'An open VMS that brings MOBOTIX and third-party cameras, access control and sensors onto one screen. It comes in four levels, from a single shop to an airport, with desk, web and mobile clients.',
      points: [
        'L2 for up to 48 cameras at one site',
        'L3 for unlimited cameras across several sites',
        'L4 and L5 add failover recording and video walls',
        'Add-ons for plate recognition, access control and transactions',
      ],
    },
  ],

  capabilitiesEyebrow: 'Apps and analytics',
  capabilitiesHeading: 'What a MOBOTIX camera can do',
  capabilitiesIntro: 'Analytics run as apps on the camera itself, chosen to suit each site. Certified Apps come pre-installed with a 30-day trial, and these are the ones that do the most work.',
  capabilities: [
    {
      title: 'Early fire detection',
      art: {
        type: 'thermal',
        alt: 'A thermal camera over a waste bunker picking out a hot spot well above its surroundings',
        temp: '96 °C',
        alert: 'Waste pile hot',
      },
      body: 'Thermal radiometry cameras measure heat across the whole picture and raise an alarm when a threshold is passed, often before any flame appears and from up to 60 m away. Models carry VdS, EN 54-10 and CNPP approvals.',
    },
    {
      title: 'Number plates',
      art: {
        type: 'plate',
        alt: 'A car at a boom gate has its plate read on the camera and checked against an allow list',
        plate: '1HG 7KT',
        confidence: 'Confidence 97%',
        status: 'Gate opened',
        statusTone: 'ok',
        lines: ['On allow list', 'Logged 07:58'],
      },
      body: 'The Vaxtor plate recognition app reads plates on the camera and checks them against allow and block lists, so it can open a gate or raise an alert. A companion app adds make, model and colour.',
    },
    {
      title: 'Intrusion detection',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a site boundary alerts on a person entering and ignores wildlife',
        lineLabel: 'Site boundary',
        alert: 'Person in zone',
        ignored: 'Wildlife · ignored',
      },
      body: 'ActivitySensor ONE and the Irisity Intrusion app use AI to follow people and vehicles, even when they fill only a small part of the picture, so alarms come from real intruders rather than general movement.',
    },
    {
      title: 'Fall alerts in care',
      art: {
        type: 'mobile',
        alt: 'A phone alert from NurseAssist showing a fall in a ward room, with buttons to view the room or respond',
        app: 'NurseAssist',
        icon: 'person',
        tone: 'alert',
        notice: 'Fall detected',
        sub: 'Room 12 · Ward 3',
        time: 'Now · 03:12',
        actions: ['View room', 'On my way'],
        side: [
          { label: 'Camera', sub: 'c71 ceiling', icon: 'camera' },
          { label: 'Nurse', sub: 'Night shift', icon: 'person' },
          { label: 'Bed', sub: 'Left bed 03:10', icon: 'alarm' },
        ],
      },
      body: 'Kepler NurseAssist runs on the c71 ceiling camera and alerts staff when a resident falls or gets out of bed, so the night team knows which room needs them.',
    },
    {
      title: 'Counting and heat maps',
      art: {
        type: 'dashboard',
        alt: 'A dashboard with visitor counts, the busiest zone, an hourly trend and a restricted-area event',
        title: 'Store floor today',
        tiles: [
          { label: 'People in', value: '1,284' },
          { label: 'In store now', value: '86' },
          { label: 'Busiest zone', value: 'Aisle 4', tone: 'accent' },
          { label: 'Restricted area', value: '1', tone: 'warn' },
        ],
        bars: [12, 30, 55, 80, 64, 70, 90, 40],
        chart: 'Visitors per hour',
        eventsTitle: 'Events',
        events: [
          { text: 'Stockroom entered', tone: 'warn' },
          { text: 'Count reset 09:00', tone: 'muted' },
        ],
      },
      body: 'The Analytics AI app counts people and objects, maps where people spend time and watches restricted areas, giving retail and building managers numbers as well as pictures.',
    },
    {
      title: 'Video door stations',
      art: {
        type: 'door',
        alt: 'A MOBOTIX T26 door station opened by a phone, with code and RFID tag entries in the log',
        credentials: [
          { label: 'Code', icon: 'pin' },
          { label: 'RFID tag', icon: 'fob' },
          { label: 'Phone', icon: 'phone' },
        ],
        active: 2,
        result: 'Door opened',
        resultTone: 'ok',
        log: ['08:14 Visitor rang', '08:15 App opened', '07:52 RFID · Sam', '07:30 Code · Jo'],
      },
      body: 'The T26 door station pairs a 360° hemispheric camera with modules for codes and RFID tags, and the MOBOTIX LIVE app rings on staff phones so the door can be answered and opened from anywhere.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What MOBOTIX makes',
  range: [
    {
      title: 'MOBOTIX 7 cameras',
      items: ['M73 and S74 with swappable sensor modules', 'v71 dome, p71 turret and c71 ceiling camera', 'Q71 hemispheric 360°', 'Thermal and thermal radiometry modules'],
    },
    {
      title: 'MOBOTIX ONE and MOVE',
      items: ['M ONE fixed and varifocal 4K', 'c ONE hemispheric and S ONE Dual', 'MOVE domes, bullets, turrets and speed domes'],
    },
    {
      title: 'Software',
      items: ['MxManagementCenter', 'MOBOTIX HUB, levels L2 to L5', 'MOBOTIX CLOUD', 'MOBOTIX LIVE app', 'Certified Apps for the camera'],
    },
    {
      title: 'Access and system parts',
      items: ['T26 video door station and access modules', 'NAS and NVR storage', 'Interface boxes and IR lighting'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom MOBOTIX system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'MOBOTIX cameras and door stations analyse and record on board, viewed through MxManagementCenter, HUB or the cloud by the desk, phones and Teracom monitoring',
    devices: [
      { label: 'MOBOTIX 7 / ONE', sub: 'Analyse and record', icon: 'camera' },
      { label: 'Thermal cameras', sub: 'Heat and fire', icon: 'thermo' },
      { label: 'MOVE cameras', sub: 'Domes and PTZ', icon: 'camera' },
      { label: 'T26 door station', sub: 'Code, RFID, phone', icon: 'door' },
    ],
    platforms: [
      { label: 'On the camera', sub: 'Apps and storage', icon: 'camera' },
      { label: 'MxMC or HUB', sub: 'Viewing and alarms', icon: 'laptop' },
      { label: 'MOBOTIX CLOUD', sub: 'Cloud or hybrid', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'MxMC or HUB client', icon: 'laptop' },
      { label: 'Phones', sub: 'MOBOTIX LIVE app', icon: 'phone' },
      { label: 'Site staff', sub: 'Fire and fall alerts', icon: 'person' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Each camera analyses and records on its own; the software above it is for viewing, alarms and scale',
  },
  architectureCaption: 'Cameras and door stations do their own analysis and recording. MxManagementCenter or MOBOTIX HUB brings them together for the security desk, the LIVE app puts them on phones, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Manufacturing and industry', 'Waste and recycling', 'Warehousing and logistics', 'Healthcare and aged care', 'Retail', 'Schools and universities', 'Government', 'Energy and utilities'],

  teracomHeading: 'What Teracom does on a MOBOTIX job',
  teracom: [
    { title: 'Design', body: 'Camera and thermal positions planned from the site drawings, with the apps, storage and software level chosen for each area.' },
    { title: 'Install and commission', body: 'Every camera mounted, cabled and tuned, apps licensed and set up, and thermal thresholds tested so alarms mean something from the first day.' },
    { title: 'Connect to monitoring', body: 'Camera alarms and thermal events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, app licences and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'MOBOTIX download centre', href: 'https://www.mobotix.com/en/support/download-center' },
    { label: 'MOBOTIX Certified Apps', href: 'https://www.mobotix.com/en/mobotix-certified-apps' },
    { label: 'MOBOTIX HUB levels', href: 'https://www.mobotix.com/en/vms/mobotix-hub' },
  ],
};

export default mobotix;