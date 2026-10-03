// The deeper Eagle Eye brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from een.com and brivo.com (October 2026); the
// cloud VMS is now sold as Brivo Eagle Eye Video. Figures are Eagle Eye's
// and Brivo's own. Drawings are specs drawn by lib/brandArt.

const eagleEye = {
  heroArt: {
    type: 'hero',
    alt: 'A camera sending video through an on-site bridge to Brivo Eagle Eye Video in the cloud, flagging a person, a plate and a forced door',
    device: 'camera',
    left: { title: 'Bridge', sub: 'Or CMVR', foot: 'Buffers and encrypts', icon: 'server' },
    right: { title: 'Cloud VMS', sub: 'Eagle Eye', foot: 'Browser and mobile app', icon: 'cloud' },
    tags: [
      { text: 'Person at gate', tone: 'alert', icon: 'person' },
      { text: 'Plate on list', tone: 'warn', icon: 'vehicle' },
      { text: 'Door forced', tone: 'alert', icon: 'door' },
    ],
    chips: [
      { text: 'True cloud VMS', tone: 'accent' },
      { text: 'Part of Brivo', tone: 'ok' },
    ],
  },

  stats: [
    { value: '10 years', label: 'longest cloud retention, from one day up, set camera by camera' },
    { value: '250,000', label: 'cameras per account, across up to 10,000 locations' },
    { value: '65,000+', label: 'customers on the Brivo Security Suite that the video now sits in' },
    { value: 'SOC 2', label: 'Type 2 and ISO 27001, with video encrypted at rest and in transit' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'Eagle Eye Video alone, or inside the Brivo Security Suite',
  platformsIntro: 'Eagle Eye Networks is now part of Brivo, and its cloud VMS is sold as Brivo Eagle Eye Video. It can run on its own as a cloud video system, or as the video side of the Brivo Security Suite next to cloud access control and alarms. We help you choose on site count, bandwidth, retention and whether doors should live in the same system.',
  platforms: [
    {
      name: 'Brivo Eagle Eye Video',
      kicker: 'Cloud VMS',
      art: {
        type: 'cloud',
        alt: 'A head office, a warehouse and a shop sending video to Eagle Eye Video in the cloud through a bridge, a CMVR or straight from the camera',
        title: 'Eagle Eye Video',
        sub: 'Cloud VMS, no site servers',
        badge: 'Keep 1 day to 10 years',
        sites: [
          { label: 'Head office', sub: 'Bridge', icon: 'server' },
          { label: 'Warehouse', sub: 'CMVR', icon: 'server' },
          { label: 'Shop', sub: 'Camera Direct', icon: 'camera' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'A cloud VMS built for the cloud rather than a hosted copy of an on-site system. Existing cameras connect through a bridge or a recorder on site, or a camera can stream straight to the cloud, and every site is run from one browser dashboard or the mobile app.',
      points: [
        'Bridges send everything to the cloud; CMVRs also record on site',
        'Camera Direct needs no on-site box for small sites',
        'Retention set per camera, from one day to ten years',
        'Open API with more than 100 technology partners',
      ],
    },
    {
      name: 'Brivo Security Suite',
      kicker: 'Video, doors and alarms',
      art: {
        type: 'dashboard',
        alt: 'A Brivo Security Suite overview of sites, doors and cameras, with door events arriving alongside their video',
        title: 'Brivo Security Suite',
        tiles: [
          { label: 'Sites online', value: '48', tone: 'ok' },
          { label: 'Doors', value: '312' },
          { label: 'Cameras', value: '640', tone: 'accent' },
          { label: 'Open alerts', value: '2', tone: 'warn' },
        ],
        bars: [310, 342, 298, 355, 366, 349, 372, 381],
        chart: 'Door events, 8 wks',
        eventsTitle: 'Door events + video',
        events: [
          { text: 'Door forced, Dock 2', tone: 'alert' },
          { text: 'Held open, Lobby', tone: 'warn' },
          { text: 'Mobile unlock, Office', tone: 'ok' },
          { text: 'Alarm armed, Store 7', tone: 'muted' },
        ],
      },
      body: 'Brivo’s cloud platform for access control, video, intrusion alarms and visitors under one login. Door events arrive with the matching video, sites are added without servers, and Global View shows the health of hundreds of locations at once.',
      points: [
        'Cloud access control with mobile, card and fob credentials',
        'Arm and disarm intrusion alarms remotely or on site',
        'Visitor management in the same system',
        'Brivo Genius assistant for search and quick admin tasks',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics',
  capabilitiesHeading: 'What the AI actually does',
  capabilitiesIntro: 'The analytics run on cameras you already have, in the bridge or in the cloud. Basic search and alerts are included, and plate reading, precision detection and custom alerts can be added where a site needs them.',
  capabilities: [
    {
      title: 'Smart Video Search',
      art: {
        type: 'search',
        alt: 'A typed description of a white ute finds matching clips across cameras at several sites',
        query: 'White ute near the loading dock, yesterday',
        badge: '4 results',
        results: [
          { label: 'Dock · 07:41', score: '96%', highlight: true, kind: 'vehicle' },
          { label: 'Gate · 07:38', score: '91%', kind: 'vehicle' },
          { label: 'Car park · 07:30', score: '78%', kind: 'vehicle' },
          { label: 'Driver · Dock', score: '72%' },
        ],
        caption: 'Type what you are after, the way you would search the web',
      },
      body: 'Type a plain description, such as a person in a blue shirt or a white ute, and get matching clips from every camera and site, narrowed by date and time and ready to download or share.',
    },
    {
      title: 'Eeva custom alerts',
      art: {
        type: 'prompt',
        alt: 'A typed request to watch a warehouse fire exit becomes an Eeva alert that emails the site supervisor',
        heading: 'Eeva AI video agent',
        prompt: 'Tell me when boxes block the fire exit in the warehouse',
        cards: [
          { label: 'Watching', value: 'Fire exit', sub: 'Warehouse camera 4' },
          { label: 'Checked against', value: 'Past video', sub: 'Example hits shown' },
          { label: 'Then', value: 'Alert + email', sub: 'Site supervisor' },
        ],
      },
      body: 'Eeva turns a sentence into a custom alert, such as a blocked fire exit, a spill on the floor or missing safety gear. It shows examples from recorded video first, then watches live and fires alerts and automations.',
    },
    {
      title: 'Licence plate recognition',
      art: {
        type: 'plate',
        alt: 'A car at an entry gate has its plate read and matched to a watch list, with an alert sent to the site lead',
        plate: 'XKT 482',
        confidence: 'Read at entry gate',
        status: 'On watch list',
        statusTone: 'warn',
        lines: ['Alert to site lead', 'Logged across 3 sites'],
      },
      body: 'Plates are read at gates and car parks and checked against watch lists, so a vehicle of interest raises an alert and can be tracked across sites. It can also run parking access.',
    },
    {
      title: 'After-hours perimeter alerts',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a yard fence alerts on a person crossing after hours and filters out other motion',
        lineLabel: 'Yard fence',
        alert: 'Person crossed, 01:52',
        ignored: 'Other motion filtered',
      },
      body: 'Line crossing, loitering and intrusion zones, plus precision person and vehicle detection for long distances, mean an after-hours alert is about a real person or car rather than trees or weather.',
    },
    {
      title: 'Bridge, CMVR or straight to cloud',
      art: {
        type: 'storage',
        alt: 'Video buffered by an on-site bridge or recorded on a CMVR, then kept in the Eagle Eye cloud for up to ten years',
        tiers: [
          { label: 'Bridge', sub: 'Buffers and encrypts, all to cloud', icon: 'server' },
          { label: 'CMVR', sub: 'Records on site, copies to cloud', icon: 'server' },
          { label: 'Eagle Eye cloud', sub: 'Stored three times over', icon: 'cloud' },
        ],
        active: 2,
        stat: '10 yrs',
        statLabel: 'Max cloud retention',
        badge: 'Encrypted',
        points: ['Buffered in outages', 'Retention per camera', 'Safe if site is hit'],
        caption: 'Footage stays retrievable even if the site hardware is stolen',
      },
      body: 'A bridge buffers and encrypts video and sends it all to the cloud. A CMVR also records on site for sites with high-resolution cameras or thin internet. Either way the video is kept in triple-redundant cloud storage and survives a stolen recorder.',
    },
    {
      title: 'Act from a phone',
      art: {
        type: 'mobile',
        alt: 'A phone alert for a forced rear door with the matching video, and buttons to view it or lock the site down',
        app: 'Brivo Security Suite',
        icon: 'door',
        tone: 'alert',
        notice: 'Door forced',
        sub: 'Rear door, Store 12',
        time: 'Today 02:14',
        actions: ['View video', 'Lock down'],
        side: [
          { label: 'Clip', sub: 'Paired to door', icon: 'camera' },
          { label: 'Pass', sub: 'Disable pass', icon: 'card' },
          { label: 'Schedule', sub: 'Adjust hours', icon: 'chart' },
        ],
      },
      body: 'With doors in the same system, a forced or propped door arrives on a phone with its video. The manager can check it, unlock or lock doors, disable a pass or change a schedule without going to site.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Brivo Eagle Eye offers',
  range: [
    {
      title: 'Cloud video',
      items: ['Brivo Eagle Eye Video cloud VMS', 'Camera Direct for small sites', 'Camera Direct Complete subscription bundles', 'Browser and mobile app viewing'],
    },
    {
      title: 'On-site hardware',
      items: ['Bridges from 12 to 300 cameras', 'CMVRs with local recording', 'PoE switches with remote port power cycling', 'Dome, turret and bullet cameras'],
    },
    {
      title: 'AI analytics',
      items: ['Smart Video Search', 'Line crossing, loitering and tamper alerts', 'Licence plate recognition', 'Precision person and vehicle detection', 'Eeva custom AI alerts'],
    },
    {
      title: 'Brivo Security Suite',
      items: ['Cloud access control and mobile credentials', 'ACS300, ACS6000 and ACS6100 panels', 'Visitor management', 'Intrusion alarm management'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Eagle Eye system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, bridges, door controllers and alarm panels report to Eagle Eye Video and the Brivo Security Suite in the cloud, used by staff and Teracom',
    devices: [
      { label: 'Cameras', sub: 'IP, analog, HD coax', icon: 'camera' },
      { label: 'Bridge or CMVR', sub: 'Buffer and encrypt', icon: 'server' },
      { label: 'Door controllers', sub: 'ACS6000, Mercury', icon: 'door' },
      { label: 'Alarm panels', sub: 'Intrusion', icon: 'alarm' },
    ],
    platforms: [
      { label: 'Eagle Eye Video', sub: 'Cloud VMS and AI', icon: 'cloud' },
      { label: 'Security Suite', sub: 'Doors and alarms', icon: 'shield' },
    ],
    people: [
      { label: 'Security team', sub: 'Browser dashboard', icon: 'laptop' },
      { label: 'Site managers', sub: 'Mobile app', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Cameras in through a bridge, everything run from the cloud, and alarms to our monitoring centre after hours',
  },
  architectureCaption: 'Cameras connect through a bridge or CMVR, or straight to the cloud, and door controllers and alarm panels join through the Brivo Security Suite. Your team works from a browser or the mobile app, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail chains', 'Hotels', 'Car dealerships', 'Warehousing and logistics', 'Schools', 'Commercial property', 'Healthcare clinics', 'Car parks and EV charging'],

  teracomHeading: 'What Teracom does on an Eagle Eye job',
  teracom: [
    { title: 'Design', body: 'Camera positions, bridge or CMVR choice, upload bandwidth and retention worked out for each site before anything is ordered.' },
    { title: 'Install and commission', body: 'Cameras mounted and cabled, bridges or recorders connected, and analytics zones, alerts and user roles set up and tested on site.' },
    { title: 'Connect to monitoring', body: 'Alarms and analytics events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Camera health checks, subscription renewals and changes to users and retention handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Brivo Eagle Eye Video support', href: 'https://support.een.com/portal/en/home' },
    { label: 'Supported cameras', href: 'https://www.een.com/support/camera-compatibility-digital-ip/' },
    { label: 'Eagle Eye technical specifications', href: 'https://www.een.com/hardware/' },
  ],
};

export default eagleEye;