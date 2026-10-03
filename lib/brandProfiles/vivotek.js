// The deeper Vivotek brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from vivotek.com and vortexcloud.com (October
// 2026); figures are Vivotek's own. Drawings are specs drawn by lib/brandArt.

const vivotek = {
  heroArt: {
    type: 'hero',
    alt: 'A Vivotek AI camera picking out people and vehicles and sending what it sees to VAST Security Station on site or VORTEX in the cloud',
    device: 'camera',
    left: { title: 'VSS', sub: 'On-site VMS', foot: 'Up to 22,400 cameras', icon: 'server' },
    right: { title: 'VORTEX', sub: 'Cloud platform', foot: 'Browser and phone', icon: 'cloud' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Loitering', tone: 'warn', icon: 'person' },
    ],
    chips: [
      { text: 'AI on the camera', tone: 'accent' },
      { text: 'Colour below 3 lux', tone: 'ok' },
    ],
  },

  stats: [
    { value: '22,400', label: 'cameras on one VAST Security Station system at its largest' },
    { value: '128', label: 'cloud channels included free when VSS connects to VORTEX' },
    { value: '5 years', label: 'warranty on most Vivotek network cameras and NVRs' },
    { value: 'NDAA', label: 'and TAA compliant, designed and manufactured in Taiwan' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'VAST Security Station on site, or VORTEX in the cloud',
  platformsIntro: 'The same AI cameras work with both, and the two connect, so a site can start on its own servers and add the cloud later. We help you choose on bandwidth, how long footage must be kept, your IT policy and how many sites you run.',
  platforms: [
    {
      name: 'VAST Security Station',
      kicker: 'On-premise',
      art: {
        type: 'onPrem',
        alt: 'Vivotek domes, panoramic cameras, bullets and network switches all managed by a VAST Security Station server on site',
        devices: [
          { label: 'Domes', icon: 'camera' },
          { label: 'Panoramic', icon: 'camera' },
          { label: 'Bullets', icon: 'bullet' },
          { label: 'Switches', icon: 'switch' },
        ],
        server: 'VSS server',
        badge: 'Health monitoring',
        title: 'On your premises',
        sub: 'Up to 22,400 cameras',
        points: ['Deep Search', 'Case Vault reports', 'Switch and drives'],
      },
      body: 'Vivotek’s video management software for anything from a small business to a large around-the-clock operation. It records on your own servers, takes in the metadata the AI cameras send, and watches the network switches and drives as well as the cameras.',
      points: [
        'Deep Search by person, vehicle, attribute, path or likeness',
        'Case Vault gathers clips into a report you can export',
        'Health checks on cameras, switches and drive S.M.A.R.T. data',
        'VORTEX Connect adds remote access with no VPN to set up',
      ],
    },
    {
      name: 'VORTEX',
      kicker: 'Cloud',
      art: {
        type: 'cloud',
        alt: 'A café with cloud cameras, a warehouse with a Core+ AI NVR and a head office running VSS all connecting to VORTEX, managed from a browser or phone',
        title: 'VORTEX',
        sub: 'Cloud VMS and AI Hub',
        badge: 'No port forwarding',
        sites: [
          { label: 'Café', sub: 'Cloud cameras', icon: 'camera' },
          { label: 'Warehouse', sub: 'Core+ AI NVR', icon: 'server' },
          { label: 'Head office', sub: 'VSS + Connect', icon: 'server' },
        ],
        clients: [
          { label: 'Web', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'A cloud platform run from a browser or a phone. VORTEX cameras from 5 MP to 12 MP connect straight to the cloud with the AI built in, and VORTEX Connect brings existing ONVIF cameras in through a Core+ AI NVR or VSS.',
      points: [
        'Plug-and-play cameras with no recorder needed on site',
        'Think Search finds events from a typed sentence',
        'Updates and remote fault-finding handled from the cloud',
        'ISO 27001 certified, with TLS 1.2 and AES-256 encryption',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics',
  capabilitiesHeading: 'What the AI actually does',
  capabilitiesIntro: 'Vivotek runs its analytics on the camera, so detection carries on even when the network drops and only events and metadata need to travel. These are the features we set up most often.',
  capabilities: [
    {
      title: 'Deep Search',
      art: {
        type: 'search',
        alt: 'A search for a woman in a white top with a backpack finds her on four cameras in an office building, best match first',
        query: 'Woman, white top, carrying a backpack',
        badge: '4 matches',
        results: [
          { label: 'Foyer · 14:02', score: '95%', highlight: true },
          { label: 'Lifts · 13:58', score: '89%' },
          { label: 'Car park · 13:41', score: '77%' },
          { label: 'Street · 13:35', score: '64%' },
        ],
        caption: 'Attributes logged by the camera make the search take seconds',
      },
      body: 'Vision Object Analytics cameras tag every person and vehicle with details such as clothing colour and vehicle type as they record. Deep Search then filters on those details, plots a path across cameras and finds similar-looking people, on Vivotek NVRs, VSS and VORTEX alike.',
    },
    {
      title: 'Think Alert',
      art: {
        type: 'prompt',
        alt: 'A typed sentence about someone crouching at the back door after 10 pm becomes an alert rule with a behaviour, a place and a time',
        heading: 'Think Alert · new rule',
        prompt: 'Tell me if anyone crouches by the back door after 10 pm',
        cards: [
          { label: 'Behaviour', value: 'Crouching', sub: 'Custom detection' },
          { label: 'Where', value: 'Back door', sub: 'Camera 6' },
          { label: 'When', value: 'After 10 pm', sub: 'Every night' },
        ],
      },
      body: 'In VORTEX you describe a behaviour, such as someone crouching, hands raised or a covered face, and Think Alert turns it into a detection rule with no coding. Advanced AI adds PPE checks and fall detection on supported cameras.',
    },
    {
      title: 'Smart VCA',
      art: {
        type: 'activity',
        alt: 'Everyday paths past a bank fade into the background while one person lingering at the walk-up ATM is flagged',
        place: 'Bank',
        alert: 'Loitering · 4 min',
        note: 'Walk-up ATM lane',
      },
      body: 'Analytics that run on the camera itself: intrusion, line crossing, loitering, running, crowding, objects left behind or taken, restricted zones and illegal parking. The people detector is trained to ignore small animals, light rain and changing light.',
    },
    {
      title: 'Perimeter protection',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a rural depot fence alerts on a person crossing it and ignores a kangaroo',
        lineLabel: 'Depot fence',
        alert: 'Person · PTZ tracking',
        ignored: 'Kangaroo · ignored',
      },
      body: 'AI or thermal cameras watch the fence line for people and vehicles. An alert can send a PTZ camera to follow the target, PTZs with Smart Tracking Advanced can track a person on their own, and a network speaker can play a warning.',
    },
    {
      title: 'Plate recognition',
      art: {
        type: 'plate',
        alt: 'A van at a depot gate has its plate, make and colour read and is let in through the access control system',
        plate: '1DX 5QT',
        confidence: 'Plate read 98%',
        status: 'Allowed, gate open',
        statusTone: 'ok',
        lines: ['Toyota · white · van', 'Lane 2 of 2 · 06:48'],
      },
      body: 'Plate cameras read Australian plates along with the make, colour and type of vehicle, and one camera can cover two lanes. Reads can open a gate through the access control system over Wiegand, and stay searchable by date, make or direction.',
    },
    {
      title: 'Panoramic coverage',
      art: {
        type: 'map',
        alt: 'A supermarket plan where one 180° multi-sensor camera and two single-sensor panoramics cover the floor, with one person flagged at the exit',
        markers: [
          { x: 50, y: 50, icon: 'camera', tone: 'accent', label: '180° quad' },
          { x: 14, y: 20, icon: 'camera', label: 'Tills' },
          { x: 86, y: 22, icon: 'camera', label: 'Lobby' },
          { x: 22, y: 80, icon: 'bag', label: 'Aisle 4' },
          { x: 80, y: 80, icon: 'person', tone: 'warn', label: 'Exit' },
          { x: 50, y: 12, icon: 'door', label: 'Dock' },
        ],
        caption: 'One 180° camera in place of three',
      },
      body: 'Single-sensor 180° cameras suit tills, lift lobbies and reception desks; dual and quad-sensor models cover warehouses, car parks and shopping centres. One panoramic camera can stand in for three standard ones, with the same analytics across the whole view.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Vivotek makes',
  range: [
    {
      title: 'Cameras',
      items: ['Dome, turret and bullet in S, V and C series', 'Chroma24 colour cameras for low light', '180° panoramic, single to quad sensor', 'PTZ with Smart Tracking Advanced', 'Thermal, box and VORTEX cloud cameras'],
    },
    {
      title: 'Recording and software',
      items: ['Core+ AI and Core+ series NVRs', 'Recording servers and video decoders', 'VAST Security Station and VORTEX', 'Plug-ins for Genetec, Milestone and Network Optix'],
    },
    {
      title: 'Onboard transport',
      items: ['Saloon and exterior cameras for trains and buses', 'Mobile NVRs'],
    },
    {
      title: 'Networking and accessories',
      items: ['Commercial, industrial and outdoor switches', 'PoE extenders and injectors', 'Illuminators, lenses and enclosures', 'Network audio devices'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Vivotek system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Vivotek AI, panoramic and plate cameras and network speakers report to VSS on site or VORTEX in the cloud, and people act from a desk, a phone or monitoring',
    devices: [
      { label: 'AI cameras', sub: 'Object analytics', icon: 'camera' },
      { label: 'Panoramic cameras', sub: '180° multi-sensor', icon: 'camera' },
      { label: 'Plate cameras', sub: 'Gates and car parks', icon: 'vehicle' },
      { label: 'Network speakers', sub: 'Voice warnings', icon: 'speaker' },
    ],
    platforms: [
      { label: 'VSS', sub: 'Video on site', icon: 'server' },
      { label: 'VORTEX', sub: 'Cloud and AI Hub', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'VSS client', icon: 'laptop' },
      { label: 'Phones', sub: 'VORTEX mobile', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Cameras do the AI work themselves; VSS keeps video on site and VORTEX Connect carries it to the cloud',
  },
  architectureCaption: 'Vivotek cameras report to VAST Security Station on site, to VORTEX in the cloud, or to both through VORTEX Connect. Your team works from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail and chain stores', 'Property management', 'Schools and universities', 'Small and medium businesses', 'Commercial buildings', 'Factories and warehouses', 'Public transport', 'Councils and city surveillance'],

  teracomHeading: 'What Teracom does on a Vivotek job',
  teracom: [
    { title: 'Design', body: 'Camera positions and lenses planned from the site drawings, with panoramic coverage, storage and bandwidth worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'Every camera mounted, cabled and tuned, with analytics rules and search set up so the alerts mean something from the first day.' },
    { title: 'Connect to monitoring', body: 'Alarms and analytics events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Signed firmware updates, licences and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'VAST Security Station', href: 'https://www.vivotek.com/products/software/vast_security_station' },
    { label: 'Vivotek product documents', href: 'https://www.vivotek.com/resource/download-center/product' },
    { label: 'Vivotek warranty policy', href: 'https://www.vivotek.com/resource/support/warranty_policy' },
  ],
};

export default vivotek;