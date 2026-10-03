// The deeper i-PRO brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from i-pro.com (October 2026); figures are
// i-PRO's own. Drawings are specs drawn by lib/brandArt.

const iPro = {
  heroArt: {
    type: 'hero',
    alt: 'An i-PRO edge AI camera sorting people from vehicles on the camera itself and passing what it finds to a recorder and to i-PRO Active Guard',
    device: 'camera',
    left: { title: 'Recorder', sub: 'WJ-NX410K', foot: 'Up to 64 cameras', icon: 'server' },
    right: { title: 'Search', sub: 'Active Guard', foot: 'Genetec, Milestone, ASM', icon: 'laptop' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Loitering', tone: 'warn', icon: 'person' },
    ],
    chips: [
      { text: 'AI runs on the camera', tone: 'accent' },
      { text: 'FIPS 140-3 Level 3', tone: 'ok' },
    ],
  },

  stats: [
    { value: '250', label: 'edge AI camera models in the i-PRO range as of 2024' },
    { value: '60+ years', label: 'of camera engineering, carried on from the Panasonic years' },
    { value: 'FIPS 140-3', label: 'Level 3 secure element in current cameras, with signed firmware' },
    { value: 'NDAA', label: 'compliant, with ISO/IEC 27001 and ETSI EN 303 645 certification' },
  ],

  platformsEyebrow: 'Two ways to record it',
  platformsHeading: 'An i-PRO recorder on site, or straight to the cloud',
  platformsIntro: 'The analytics live in the camera either way, so the choice is about where the footage goes. We weigh up how many sites you run, the internet links, how long footage must be kept and the VMS you already use.',
  platforms: [
    {
      name: 'i-PRO network recorders',
      kicker: 'On site',
      art: {
        type: 'onPrem',
        alt: 'i-PRO cameras, PTZs and encoders recording to a WJ-NX410K recorder on site, with no PC needed to run it',
        devices: [
          { label: 'AI cameras', icon: 'camera' },
          { label: 'PTZ cameras', icon: 'camera' },
          { label: 'Fisheye', icon: 'camera' },
          { label: 'Encoders', icon: 'switch' },
        ],
        server: 'WJ-NX410K',
        badge: 'PC-less recording',
        title: 'On your premises',
        sub: 'Footage stays on site',
        points: ['Up to 64 cameras', 'RAID 1, 5 or 6', 'FIPS 140-2 Level 3'],
      },
      body: 'Cameras record to an embedded i-PRO recorder that runs without a PC, viewed on a local monitor, in ASM300 software or on the i-PRO mobile app. The same cameras also record into the major VMS platforms.',
      points: [
        'WJ-NX410K: up to 64 cameras and RAID 1, 5 or 6 storage',
        'ASM300 software for live view and playback across recorders',
        'i-PRO Mobile app for viewing away from site',
        'Cameras also record into Genetec, Milestone and other VMS',
      ],
    },
    {
      name: 'Camera direct to cloud',
      kicker: 'Cloud',
      art: {
        type: 'cloud',
        alt: 'Three sites with i-PRO cameras connecting straight to a cloud VMS, watched from a browser or a phone',
        title: 'Cloud VMS',
        sub: 'No recorder on site',
        badge: 'App runs on the camera',
        sites: [
          { label: 'Head office', sub: 'AI cameras', icon: 'camera' },
          { label: 'Warehouse', sub: 'Fisheye + PTZ', icon: 'camera' },
          { label: 'Branch', sub: 'U-series domes', icon: 'camera' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'A small application installed on the camera connects it straight to a cloud video service, so a site needs cameras and a network link and nothing else. It suits branches and small sites with no comms room.',
      points: [
        'i-PRO apps for Genetec Security Center SaaS',
        'i-PRO apps for Milestone Arcules and Brivo Eagle Eye',
        'Partner apps for QxControl, Uplink and 3dEYE',
        'Entry-level U-series cameras support it too',
      ],
    },
  ],

  capabilitiesEyebrow: 'Edge AI',
  capabilitiesHeading: 'What the AI on an i-PRO camera does',
  capabilitiesIntro: 'i-PRO puts the processing chip inside the camera, so detection happens where the picture is taken and only the results travel over the network. These are the functions that do the most work on a typical site.',
  capabilities: [
    {
      title: 'i-PRO Active Guard',
      art: {
        type: 'search',
        alt: 'A description of clothing and a backpack finds the same person on three cameras, best match first',
        query: 'Grey top, black backpack, near Gate 2',
        badge: '3 matches',
        results: [
          { label: 'Gate 2 · 14:06', score: '94%', highlight: true },
          { label: 'Car park · 14:02', score: '87%' },
          { label: 'Lobby · 13:58', score: '71%' },
        ],
        caption: 'Searches the attributes the cameras already logged',
      },
      body: 'Search recorded video by what someone looks like, using around 18 attributes such as age range, top colour and bag, or by vehicle type and colour. It runs inside Genetec, Milestone, ASM300 and Luxriot, and version 3.0 adds plain-text search.',
    },
    {
      title: 'Free-text detection',
      art: {
        type: 'prompt',
        alt: 'A typed description becomes a live detection running on an i-PRO X-series fisheye camera',
        heading: 'New detection on X-series',
        prompt: 'Alert me if a person is lying down in the car park',
        cards: [
          { label: 'Looking for', value: 'Person lying', sub: 'Described in words' },
          { label: 'Where', value: 'Car park', sub: '360° fisheye view' },
          { label: 'Then', value: 'Alert', sub: 'Runs on the camera' },
        ],
      },
      body: 'The new X-series fisheye cameras run generative AI on the camera itself. Type a description, such as a delivery truck or a person lying down, and the camera watches for it live with no fixed list of rules.',
    },
    {
      title: 'AI video motion detection',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a yard fence alerts on a person crossing it and ignores a wallaby',
        lineLabel: 'Yard fence',
        alert: 'Person crossed',
        ignored: 'Wallaby · ignored',
      },
      body: 'Motion alerts that fire only for people, cars, motorcycles or bicycles, with rules for line crossing, loitering, direction and speed. Movement from anything else no longer sets off the alarm.',
    },
    {
      title: 'Number plates',
      art: {
        type: 'plate',
        alt: 'A car arriving at a gate has its plate, make, colour and direction logged by i-PRO Active Guard',
        plate: '1AB 2CD',
        confidence: 'Confidence 96%',
        status: 'Vehicle logged',
        statusTone: 'ok',
        lines: ['White ute · inbound', 'Gate 1 · 07:42'],
      },
      body: 'Active Guard reads number plates and logs the make, model, colour and direction of each vehicle, so a car can be found later by its plate or by what it looks like.',
    },
    {
      title: 'Scene change detection',
      art: {
        type: 'map',
        alt: 'A floor plan with cameras placed on it and a bag left in the foyer flagged as a change to the scene',
        markers: [
          { x: 12, y: 24, icon: 'camera', label: 'Entry' },
          { x: 34, y: 72, icon: 'camera', label: 'Lifts' },
          { x: 56, y: 40, icon: 'bag', tone: 'alert', label: 'Bag left' },
          { x: 78, y: 70, icon: 'camera', label: 'Foyer' },
          { x: 90, y: 22, icon: 'camera', label: 'Loading' },
        ],
        caption: 'Changes to the scene flagged on the plan',
      },
      body: 'The camera remembers what the scene normally looks like and raises an alert when it changes, such as a bag left behind in a foyer or a car parked where it should not be.',
    },
    {
      title: 'AI for older cameras',
      art: {
        type: 'network',
        alt: 'One i-PRO X-series camera running AI analytics for three older cameras on the same network, including another brand',
        uplink: 'VMS',
        switchLabel: 'X-series camera',
        switchSub: 'AI Processing Relay',
        ports: [
          { label: 'Old cam 1', icon: 'camera', tone: 'muted' },
          { label: 'Old cam 2', icon: 'camera', tone: 'muted' },
          { label: 'Other make', icon: 'bullet', tone: 'muted' },
        ],
        caption: 'One AI camera analyses up to three older cameras',
      },
      body: 'AI Processing Relay lets one X-series camera run people, vehicle and motion analytics for up to three older cameras, including other brands, so existing cameras gain AI without being replaced.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What i-PRO makes',
  range: [
    {
      title: 'Cameras',
      items: ['Dome, compact dome and i-PRO mini', 'Bullet and box', 'PTZ, including multi-directional plus PTZ', 'Multi-sensor and 360° fisheye', 'U-series entry-level AI and X-series AI cameras'],
    },
    {
      title: 'Recording and software',
      items: ['WJ-NX embedded recorders', 'ASM300 video software', 'i-PRO Mobile app', 'Camera direct-to-cloud apps'],
    },
    {
      title: 'Analytics',
      items: ['i-PRO Active Guard', 'AI motion, people, face and vehicle detection', 'AI On-site Learning for custom objects', 'AI Privacy Guard', 'AI Processing Relay'],
    },
    {
      title: 'System products',
      items: ['Encoders and decoders', 'Joystick controllers', 'PoE injectors and coax-to-LAN converters', 'Audio devices', 'Mounts and housings'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom i-PRO system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'i-PRO cameras record to an i-PRO recorder, a VMS or the cloud, and the security desk, phones and Teracom monitoring act on the alerts',
    devices: [
      { label: 'AI cameras', sub: 'U and X-series', icon: 'camera' },
      { label: 'Multi-sensor', sub: '360° and PTZ', icon: 'camera' },
      { label: 'Older cameras', sub: 'Via AI relay', icon: 'camera' },
      { label: 'Encoders', sub: 'Analogue onto IP', icon: 'switch' },
    ],
    platforms: [
      { label: 'WJ-NX recorder', sub: 'On site, no PC', icon: 'server' },
      { label: 'Your VMS', sub: 'Genetec or Milestone', icon: 'laptop' },
      { label: 'Cloud VMS', sub: 'Camera direct to cloud', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Active Guard search', icon: 'laptop' },
      { label: 'Phones', sub: 'i-PRO Mobile app', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Analytics run on each camera; the recorder, VMS or cloud stores and shows what the cameras find',
  },
  architectureCaption: 'i-PRO cameras analyse the video themselves, then record to an i-PRO recorder, your existing VMS or a cloud service. Your team searches and responds from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Schools and universities', 'Healthcare', 'Retail', 'Banking and finance', 'Commercial property', 'Government', 'Manufacturing', 'Transport and car parks'],

  teracomHeading: 'What Teracom does on an i-PRO job',
  teracom: [
    { title: 'Design', body: 'Camera models, lenses and positions chosen from the site drawings, with the analytics each area needs and the storage to match.' },
    { title: 'Install and commission', body: 'Every camera mounted, cabled and focused, with detection lines, zones and attribute search set up and tested before handover.' },
    { title: 'Connect to monitoring', body: 'Analytics alarms can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, security updates and health checks handled on a maintenance plan, so the cameras stay current and supported.' },
  ],

  links: [
    { label: 'i-PRO documentation database', href: 'https://i-pro.com/products_and_solutions/apac-en/surveillance/documentation-database' },
    { label: 'i-PRO knowledge base', href: 'https://i-pro.com/products_and_solutions/apac-en/surveillance/learning-and-support/knowledge-base' },
    { label: 'i-PRO warranty and support policy', href: 'https://i-pro.com/products_and_solutions/apac-en/surveillance/learning-and-support/warranty' },
  ],
};

export default iPro;