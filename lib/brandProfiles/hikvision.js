// The deeper Hikvision brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from hikvision.com/au-en (October 2026); figures
// are Hikvision's own. Drawings are specs drawn by lib/brandArt.

const hikvision = {
  heroArt: {
    type: 'hero',
    alt: 'A Hikvision AcuSense camera picking out people and vehicles and sending alerts to HikCentral Professional on site or to the Hik-Connect app',
    device: 'camera',
    left: { title: 'HCP', sub: 'On-site server', foot: 'Video, doors and alarms', icon: 'server' },
    right: { title: 'Hik-Connect', sub: 'App and portal', foot: 'Alerts to your phone', icon: 'phone' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Line crossed', tone: 'warn', icon: 'person' },
    ],
    chips: [
      { text: 'AcuSense on camera', tone: 'accent' },
      { text: 'Guanlan AI Encoding', tone: 'ok' },
    ],
  },

  stats: [
    { value: '55,000', label: 'devices and 50,000 channels on one HikCentral Professional cluster' },
    { value: '30–50%', label: 'less storage on average with Guanlan AI Encoding, still H.265' },
    { value: '7 seconds', label: 'of video sent with each AX PRO alarm: 5 before the trigger, 2 after' },
    { value: '180+', label: 'countries and regions served, by a company founded in 2001' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'HikCentral on a server, or Hik-Connect in the cloud',
  platformsIntro: 'Larger sites and estates run everything from HikCentral Professional on their own server. Smaller sites with a recorder and an alarm panel are often better served by the Hik-Connect app and portal. We help you pick on size, number of sites and how you want to manage it.',
  platforms: [
    {
      name: 'HikCentral Professional',
      kicker: 'On-premise',
      art: {
        type: 'onPrem',
        alt: 'Hikvision cameras, doors, alarm panels and number plate cameras all managed by a HikCentral Professional server on site',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'Doors', icon: 'door' },
          { label: 'Alarms', icon: 'alarm' },
          { label: 'ANPR', icon: 'vehicle' },
        ],
        server: 'HCP server',
        badge: 'Video + access',
        title: 'On your premises',
        sub: 'Master plus 5 sub-servers',
        points: ['50,000 channels', 'AcuSeek search', '20+ add-ons'],
      },
      body: 'Video, access control, intercom and alarms on one server you own. The core runs on a modest PC with an i3 and 4 GB of RAM, and grows into a cluster of one master and up to five sub-servers for large multi-site estates.',
      points: [
        'Clustering for up to 55,000 devices and 50,000 video channels',
        'AcuSeek search by typed text, an image or set attributes',
        'More than 20 add-ons, from parking to visitors and attendance',
        'Third-party cameras, alarm panels and building systems over ONVIF, SIA and BACnet',
      ],
    },
    {
      name: 'Hik-Connect',
      kicker: 'Cloud app and portal',
      art: {
        type: 'cloud',
        alt: 'A café, a workshop and a home with Hikvision recorders, alarms and intercoms connecting to Hik-Connect, managed from a browser or phone',
        title: 'Hik-Connect',
        sub: 'App and web portal',
        badge: 'No router ports opened',
        sites: [
          { label: 'Café', sub: 'NVR, 6 cameras', icon: 'camera' },
          { label: 'Workshop', sub: 'AX PRO alarm', icon: 'alarm' },
          { label: 'Home', sub: 'Video intercom', icon: 'door' },
        ],
        clients: [
          { label: 'Web', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'Built for homes, small businesses and companies with several small sites. Video, intrusion alarms, intercom calls, access control and attendance sit in one app and web portal, with encrypted links and nothing to open on the router.',
      points: [
        'Team mode for multi-site businesses, personal mode for one site',
        'Give your installer limited access for remote maintenance',
        'Arm and disarm cameras and AX PRO alarm areas from the app',
        'HikCentral Connect adds cloud storage and a cloud VMS',
      ],
    },
  ],

  capabilitiesEyebrow: 'AI analytics',
  capabilitiesHeading: 'What the AI and alarms actually do',
  capabilitiesIntro: 'Hikvision runs deep-learning analytics on its cameras and recorders, and ties the video to its alarm and access ranges. These are the features we set up most often.',
  capabilities: [
    {
      title: 'AcuSeek search',
      art: {
        type: 'search',
        alt: 'A typed description of a person with a handbag finds them on three cameras in a shopping strip, best match first',
        query: 'Woman with a brown handbag, near the lifts',
        badge: '3 matches',
        results: [
          { label: 'Lifts · 11:20', score: '94%', highlight: true },
          { label: 'Level 1 · 11:16', score: '85%' },
          { label: 'Car park · 11:05', score: '70%' },
        ],
        caption: 'Search by words, a photo or set attributes across cameras',
      },
      body: 'HikCentral Professional with AcuSeek searches people and vehicles across cameras, door events and plate reads in one timeline. Type a description in plain words, drop in an image, or pick attributes such as clothing, bag or vehicle type.',
    },
    {
      title: 'AcuSense perimeter alarms',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a depot fence alerts on a person crossing it and ignores a fox',
        lineLabel: 'Depot fence',
        alert: 'Person · line crossed',
        ignored: 'Fox · ignored',
      },
      body: 'AcuSense picks out people and vehicles from everything else that moves in the picture, so line crossing and intrusion alarms at a fence or yard fire for the things worth a response, not for every passing shadow.',
    },
    {
      title: 'Number plate recognition',
      art: {
        type: 'plate',
        alt: 'A car at a car park boom gate has its plate read and is let in automatically',
        plate: 'ZQR 274',
        confidence: 'Plate read 98%',
        status: 'Gate opened',
        statusTone: 'ok',
        lines: ['Tenant parking list', 'Entry 2 · 08:31'],
      },
      body: 'ANPR cameras read plates at gates and car parks. In HikCentral Professional the reads drive touch-free entry, guidance screens showing free bays and parking payments, and every plate is kept for searching later.',
    },
    {
      title: 'Live Guard cameras',
      art: {
        type: 'mobile',
        alt: 'A phone alert from a Live Guard camera with buttons to play a warning or view the clip, beside its strobe, speaker and arming',
        app: 'Hik-Connect',
        icon: 'person',
        tone: 'alert',
        notice: 'Person seen',
        sub: 'Driveway · Live Guard',
        time: 'Today 2:14 am',
        actions: ['Play warning', 'View clip'],
        side: [
          { label: 'Strobe', sub: 'Flashing light', icon: 'bolt' },
          { label: 'Speaker', sub: 'Voice warning', icon: 'speaker' },
          { label: 'Arming', sub: 'Up to 4 areas', icon: 'shield' },
        ],
      },
      body: 'Cameras with a built-in speaker and strobe that warn intruders off the moment a person or vehicle is detected, then send the clip to your phone. Arm and disarm them in Hik-Connect alongside an AX PRO alarm.',
    },
    {
      title: 'Video-verified alarms',
      art: {
        type: 'panel',
        alt: 'An AX PRO alarm keypad armed away with one zone in alarm and a short video clip sent for verification',
        mode: 'Away armed',
        modeTone: 'accent',
        status: 'Alarm · clip sent',
        zones: [
          { name: 'Front door', state: 'armed', label: 'Armed' },
          { name: 'Office PIR', state: 'alarm', label: 'Alarm · 7 s clip' },
          { name: 'Warehouse', state: 'armed', label: 'Armed' },
          { name: 'Rear roller', state: 'secure', label: 'Closed' },
          { name: 'Kitchen', state: 'bypassed', label: 'Bypassed' },
        ],
      },
      body: 'AX PRO wireless alarms link to cameras so each alarm comes with a 7-second clip, 5 seconds before the trigger and 2 after. The clip is held at the panel, so it survives even if the camera or detector is damaged.',
    },
    {
      title: 'Guanlan AI Encoding',
      art: {
        type: 'storage',
        alt: 'Standard H.265 compared with Guanlan AI Encoding, which keeps people and vehicles sharp and roughly halves the storage needed',
        tiers: [
          { label: 'Standard H.265', sub: 'Whole scene at one quality', icon: 'server' },
          { label: 'Guanlan AI Encoding', sub: 'Full detail on people and vehicles', icon: 'camera' },
        ],
        active: 1,
        stat: '30–50%',
        statLabel: 'less storage, average',
        badge: 'Still H.265',
        points: ['Background squeezed', 'People kept sharp', 'Plays on H.265 kit'],
        caption: '2,000 cameras for 90 days: 403 drives down to 202',
      },
      body: 'An AI model inside the encoder finds people and vehicles and keeps them at full detail, while the still background is compressed much harder. Footage stays standard H.265, so existing recorders and software play it.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Hikvision makes',
  range: [
    {
      title: 'Cameras',
      items: ['Network cameras with AcuSense and ColorVu', 'DeepinView AI cameras', 'PTZ and multi-lens panoramic', 'Thermal cameras', 'Turbo HD analogue cameras and DVRs'],
    },
    {
      title: 'Recording and software',
      items: ['Network video recorders and servers', 'HikCentral Professional and HikCentral Lite', 'Hik-Connect app and portal', 'Hik-Partner Pro for installers'],
    },
    {
      title: 'Access, intercom and alarms',
      items: ['Access terminals with face, card and QR', 'Video intercoms', 'AX PRO and AX Hybrid PRO alarms', 'Live Guard cameras with strobe and speaker'],
    },
    {
      title: 'Beyond cameras',
      items: ['Millimetre-wave radar', 'Audio products', 'Parking management and ANPR', 'Displays and video walls', 'Onboard security for vehicles'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Hikvision system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Hikvision cameras, plate cameras, door terminals and AX PRO alarms report to HikCentral Professional or Hik-Connect, and people act from a desk or phone',
    devices: [
      { label: 'AcuSense cameras', sub: 'ColorVu, DeepinView', icon: 'camera' },
      { label: 'ANPR cameras', sub: 'Car park gates', icon: 'vehicle' },
      { label: 'Access terminals', sub: 'Face, card, QR', icon: 'reader' },
      { label: 'AX PRO alarm', sub: 'Wireless detectors', icon: 'alarm' },
    ],
    platforms: [
      { label: 'HCP', sub: 'Server on site', icon: 'server' },
      { label: 'Hik-Connect', sub: 'Cloud app and portal', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'HCP control client', icon: 'laptop' },
      { label: 'Phones', sub: 'Hik-Connect app', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Cameras sort people and vehicles themselves; HCP or Hik-Connect brings video, doors and alarms into one place',
  },
  architectureCaption: 'Hikvision cameras, plate readers, door terminals and alarms report to HikCentral Professional on site or to Hik-Connect in the cloud. Your team works from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Small and medium businesses', 'Apartments and strata', 'Schools', 'Warehousing and logistics', 'Construction sites', 'Car parks', 'Hospitality'],

  teracomHeading: 'What Teracom does on a Hikvision job',
  teracom: [
    { title: 'Design', body: 'Camera positions, lenses and recorders planned from the site drawings, with storage and bandwidth worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'Cameras, doors and alarm detectors mounted, cabled and tested, with AcuSense lines and zones set so alerts mean something from day one.' },
    { title: 'Connect to monitoring', body: 'AX PRO alarms and camera analytics can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, security updates, licences and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'HikCentral Professional', href: 'https://www.hikvision.com/au-en/products/software/HikCentral-Professional-series/hikcentral-professional/' },
    { label: 'Hikvision firmware downloads', href: 'https://www.hikvision.com/au-en/support/download/firmware/' },
    { label: 'Hikvision resource centre', href: 'https://www.hikvision.com/au-en/support/download/resource-center/' },
  ],
};

export default hikvision;