// The deeper IDIS brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from idisglobal.com (October 2026); figures are
// IDIS's own. Drawings are specs drawn by lib/brandArt.

const idis = {
  heroArt: {
    type: 'hero',
    alt: 'An IDIS camera classifying people and cars, recording to a DirectIP NVR it paired with by itself and reporting to IDIS Solution Suite',
    device: 'camera',
    left: { title: 'DirectIP', sub: 'NVR', foot: 'Pairs itself over PoE', icon: 'server' },
    right: { title: 'ISS', sub: 'Solution Suite', foot: 'Control room, video wall', icon: 'laptop' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Car', tone: 'accent', icon: 'vehicle' },
      { text: 'Intrusion', tone: 'alert', icon: 'person' },
    ],
    chips: [
      { text: 'Plug and play', tone: 'accent' },
      { text: 'Made in South Korea', tone: 'ok' },
    ],
  },

  stats: [
    { value: '1997', label: 'founded near Seoul, where IDIS still designs and makes its products' },
    { value: '5 yrs 3 mths', label: 'standard warranty on H.265 DirectIP NVRs' },
    { value: '1,024', label: 'channels of 4K at 30 fps on one IDIS Solution Suite system' },
    { value: 'Up to 90%', label: 'less storage and bandwidth with Intelligent Codec, against H.264' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'DirectIP recorders, or IDIS Solution Suite',
  platformsIntro: 'Smaller sites run on DirectIP cameras and recorders alone. Larger and multi-site jobs add IDIS Solution Suite over the top. The cameras are the same either way, so a site can start small and grow.',
  platforms: [
    {
      name: 'IDIS DirectIP',
      kicker: 'Plug and play',
      art: {
        type: 'network',
        alt: 'IDIS cameras plugging into the PoE ports of a DirectIP NVR and pairing with it automatically',
        uplink: 'Network',
        switchLabel: 'DirectIP NVR',
        switchSub: 'PoE ports · auto pairing',
        ports: [
          { label: 'Dome', icon: 'camera' },
          { label: 'Bullet', icon: 'bullet' },
          { label: 'PTZ', icon: 'camera' },
          { label: 'Fisheye', icon: 'camera' },
          { label: 'ONVIF cam', icon: 'camera', tone: 'muted' },
        ],
        caption: 'Cameras plug into the recorder and pair themselves, with no IP set-up',
      },
      body: 'IDIS cameras plug into a DirectIP recorder and find it, authenticate with it and start recording on their own, with no IP addressing to work out. Power and video share one cable.',
      points: [
        'DR-series NVRs from the DR-1000 up to the DR-8000',
        'Cameras and recorders authenticate each other automatically',
        'ONVIF support for third-party cameras',
        'IDIS Center VMS, free of licence fees',
      ],
    },
    {
      name: 'IDIS Solution Suite',
      kicker: 'Enterprise VMS',
      art: {
        type: 'map',
        alt: 'An IDIS Solution Suite site map with cameras, a door and a recorder placed on it and one intrusion event highlighted',
        markers: [
          { x: 12, y: 24, icon: 'camera', label: 'Gate 1' },
          { x: 36, y: 72, icon: 'camera', label: 'Dock' },
          { x: 56, y: 30, icon: 'door', label: 'Lobby' },
          { x: 78, y: 64, icon: 'camera', tone: 'alert', label: 'Intrusion' },
          { x: 90, y: 20, icon: 'server', label: 'NVR 3' },
        ],
        caption: 'Events pop up on the site map',
      },
      body: 'A modular VMS for large single sites and multi-site estates. It adds central event handling, maps, video walls and failover servers over the top of DirectIP recorders and cameras.',
      points: [
        'ISS Expert for mid-size to large single sites',
        'ISS Federation to run many sites as one system',
        'IDIS Wall Station for control rooms and video walls',
        'Failover and redundant recording servers',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics and resilience',
  capabilitiesHeading: 'What the system actually does',
  capabilitiesIntro: 'IDIS splits its effort between AI that cuts false alarms and engineering that stops footage going missing. These are the features that matter most day to day.',
  capabilities: [
    {
      title: 'Deep Learning Analytics',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a yard fence alerts on a person crossing it and ignores a fox',
        lineLabel: 'Yard fence',
        alert: 'Person crossed',
        ignored: 'Fox · ignored',
      },
      body: 'IDIS Deep Learning Analytics classifies people, cars and bicycles and flags intrusion and loitering, and keeps working in snow, heavy rain and low light. It is a one-off licence with no annual fee.',
    },
    {
      title: 'A-Cut and AI Search',
      art: {
        type: 'search',
        alt: 'A search for a woman in a hat and glasses carrying a bag finds her on four cameras, best match first',
        query: 'Woman, hat, glasses, carrying a bag',
        badge: '4 matches',
        results: [
          { label: 'Entry · 10:12', score: '95%', highlight: true },
          { label: 'Lifts · 10:14', score: '89%' },
          { label: 'Car park · 10:21', score: '76%' },
          { label: 'Exit · 10:40', score: '58%' },
        ],
        caption: 'Edge AI Plus cameras tag every person and vehicle they see',
      },
      body: 'Edge AI Plus cameras tag people by gender, age range, glasses, hats, masks and bags, and vehicles by type and colour. A-Cut crops each sighting so a search across cameras is quick to read.',
    },
    {
      title: 'Fall and object alerts',
      art: {
        type: 'mobile',
        alt: 'A phone alert from IDIS Mobile showing a fall detected in an aged care corridor, with buttons to view the camera or acknowledge',
        app: 'IDIS Mobile',
        icon: 'person',
        tone: 'alert',
        notice: 'Fall detected',
        sub: 'Aged care · Wing B',
        time: 'Just now · 02:14',
        actions: ['View camera', 'Acknowledge'],
        side: [
          { label: 'Camera', sub: 'Corridor 3', icon: 'camera' },
          { label: 'Staff', sub: 'Night nurse', icon: 'person' },
          { label: 'Event', sub: 'Fall', icon: 'alarm' },
        ],
      },
      body: 'Edge AI Plus cameras also watch for a person falling, a crowd building, or an object left behind or taken away, and push the alert to the IDIS Mobile app.',
    },
    {
      title: 'No gaps in recording',
      art: {
        type: 'storage',
        alt: 'Recording tiers from the camera SD card to the main NVR and a standby NVR, with 24 hours kept on the camera during a network drop',
        tiers: [
          { label: 'Camera SD card', sub: 'Records if the network drops', icon: 'camera' },
          { label: 'DirectIP NVR', sub: 'Main recording, RAID 1 or 5', icon: 'server' },
          { label: 'Standby NVR', sub: 'Takes over if a recorder fails', icon: 'server' },
        ],
        active: 0,
        stat: '24 h',
        statLabel: 'on a 32 GB camera card',
        badge: 'Smart Failover',
        points: ['Backfills the NVR', 'Standby NVR on watch', 'Dual power supplies'],
        caption: 'Footage copies back to the recorder when the link returns',
      },
      body: 'If a camera loses its link, it records to its own SD card and copies the footage back to the NVR once the link returns. Critical Failover adds a standby recorder that takes over if a primary one fails.',
    },
    {
      title: 'Intelligent Codec',
      art: {
        type: 'dashboard',
        alt: 'A dashboard showing camera bit rate dropping in quiet periods and rising when there is movement',
        title: 'Bandwidth per camera',
        tiles: [
          { label: 'Cameras', value: '32' },
          { label: 'Codec', value: 'H.265' },
          { label: 'Quiet scenes', value: 'MAT on', tone: 'accent' },
          { label: 'Saving vs H.264', value: '≤90%', tone: 'ok' },
        ],
        bars: [80, 72, 30, 18, 22, 64, 78, 40],
        chart: 'Bit rate, 24 hours',
        eventsTitle: 'Codec events',
        events: [
          { text: 'Quiet scene · MAT on', tone: 'ok' },
          { text: 'Motion · full detail', tone: 'accent' },
          { text: 'Night · low bit rate', tone: 'muted' },
        ],
      },
      body: 'Intelligent Codec trims the bit rate on top of H.265, and Motion Adaptive Transmission sends less when nothing moves. IDIS puts the combined saving at up to 90% against H.264, depending on the scene.',
    },
    {
      title: 'IDIS Cloud Manager',
      art: {
        type: 'cloud',
        alt: 'A head office and two branches with IDIS recorders reporting to IDIS Cloud Manager, checked from a browser or a phone',
        title: 'Cloud Manager',
        sub: 'All sites in one browser',
        badge: 'Remote set-up',
        sites: [
          { label: 'Head office', sub: 'DirectIP NVR', icon: 'server' },
          { label: 'Branch 1', sub: '12 cameras', icon: 'camera' },
          { label: 'Branch 2', sub: 'Offline alert', icon: 'camera' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'Mobile', icon: 'phone' },
        ],
      },
      body: 'Check that every branch and device is online, set up recorders and cameras remotely, and view or search up to 64 channels at once from a web browser.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What IDIS makes',
  range: [
    {
      title: 'Network cameras',
      items: ['Dome, bullet, turret and box', 'PTZ, including LightMaster IR models', 'Fisheye and multi-imager', 'Edge AI and Edge AI Plus cameras'],
    },
    {
      title: 'Recorders',
      items: ['DirectIP NVRs, DR-1000 to DR-8000 series', 'DirectCX HD-over-coax recorders (TR series)', 'External storage expansion'],
    },
    {
      title: 'Software',
      items: ['IDIS Center, a licence-free VMS', 'IDIS Solution Suite', 'IDIS Cloud Manager', 'IDIS Mobile and IDIS Web clients', 'IDIS Deep Learning Analytics'],
    },
    {
      title: 'AI and accessories',
      items: ['AI in the Box units for existing cameras', 'Encoders, decoders and PoE switches', 'Security monitors', 'Lenses, mounts and junction boxes'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom IDIS system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'IDIS cameras record to DirectIP NVRs run through Solution Suite and Cloud Manager, with the control room, phones and Teracom monitoring acting on events',
    devices: [
      { label: 'DirectIP cameras', sub: 'Dome, bullet, PTZ', icon: 'camera' },
      { label: 'Edge AI cameras', sub: 'Attributes and falls', icon: 'camera' },
      { label: 'Other cameras', sub: 'ONVIF', icon: 'camera' },
      { label: 'HD analogue', sub: 'DirectCX', icon: 'bullet' },
    ],
    platforms: [
      { label: 'DirectIP NVR', sub: 'Records on site', icon: 'server' },
      { label: 'Solution Suite', sub: 'Enterprise VMS', icon: 'shield' },
      { label: 'Cloud Manager', sub: 'All sites, one browser', icon: 'cloud' },
    ],
    people: [
      { label: 'Control room', sub: 'Wall Station', icon: 'laptop' },
      { label: 'Managers', sub: 'Cloud Manager', icon: 'chart' },
      { label: 'Phones', sub: 'IDIS Mobile alerts', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'DirectIP cameras pair with the recorder on their own; Solution Suite and Cloud Manager sit above them',
  },
  architectureCaption: 'Cameras plug into DirectIP recorders on site. Solution Suite brings larger sites into one control room, Cloud Manager keeps an eye on every branch, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Banking and finance', 'Schools and universities', 'Healthcare and aged care', 'Warehousing and logistics', 'Commercial property', 'Government', 'Transport'],

  teracomHeading: 'What Teracom does on an IDIS job',
  teracom: [
    { title: 'Design', body: 'Camera positions, recorder sizing and retention worked out from the site drawings, with DirectIP or Solution Suite matched to the size of the job.' },
    { title: 'Install and commission', body: 'Cameras mounted, cabled to the recorder, paired and focused, with analytics zones set up and failover tested before handover.' },
    { title: 'Connect to monitoring', body: 'Alarms and analytics events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, licence changes and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'IDIS Solution Suite', href: 'https://idisglobal.com/index/iss' },
    { label: 'IDIS AI solutions', href: 'https://www.idisglobal.com/index/aisolution' },
    { label: 'IDIS warranty', href: 'https://www.idisglobal.com/index/warranty' },
  ],
};

export default idis;