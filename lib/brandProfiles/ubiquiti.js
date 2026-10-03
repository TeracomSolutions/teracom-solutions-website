// The deeper Ubiquiti brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from ui.com, techspecs.ui.com and store.ui.com
// (October 2026); figures are Ubiquiti's own. Drawings are specs drawn by
// lib/brandArt.

const ubiquiti = {
  heroArt: {
    type: 'hero',
    alt: 'A UniFi access point between the UniFi console and UISP long-range links, while Protect and Access pick up a person, a door and a vehicle',
    device: 'wifi',
    left: { title: 'UniFi', sub: 'One console', foot: 'Network, Protect, Access', icon: 'server' },
    right: { title: 'UISP', sub: 'Wireless links', foot: 'airMAX and airFiber', icon: 'map' },
    tags: [
      { text: 'Person at gate', tone: 'warn', icon: 'person' },
      { text: 'Door unlocked', tone: 'ok', icon: 'door' },
      { text: 'Plate read', tone: 'accent', icon: 'vehicle' },
    ],
    chips: [
      { text: 'No licence fees', tone: 'ok' },
      { text: 'Wi-Fi 7', tone: 'accent' },
    ],
  },

  stats: [
    { value: '500 HD', label: 'cameras (or 300 in 4K) on a single UniFi network video recorder' },
    { value: 'Wi-Fi 7', label: 'across the U7 access points, indoor, in-wall and outdoor' },
    { value: '2150 W', label: 'PoE budget on the largest Enterprise Campus switch' },
    { value: '100+ km', label: 'rated range of an airFiber 5XHD point-to-point link' },
  ],

  platformsEyebrow: 'Two families',
  platformsHeading: 'UniFi for the site, UISP for the distance',
  platformsIntro: 'UniFi runs the network, cameras and doors inside a site from one console. UISP radios carry that network to buildings, gates and sheds that a cable cannot easily reach.',
  platforms: [
    {
      name: 'UniFi',
      kicker: 'One console for the site',
      art: {
        type: 'onPrem',
        alt: 'Cameras, doors, Wi-Fi and switches all reporting to a UniFi console on site, with footage stored locally',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'Doors', icon: 'door' },
          { label: 'Wi-Fi', icon: 'wifi' },
          { label: 'Switches', icon: 'switch' },
        ],
        server: 'Console',
        badge: 'Video stays local',
        title: 'Your own console',
        sub: 'Footage stored on site',
        points: ['No licence fees', 'Local control', 'Remote access free'],
      },
      body: 'Gateways, switches, Wi-Fi, cameras and door access all run from the same UniFi console and login. Recordings are kept on the console in the building, and Site Manager brings every site into one view on any device.',
      points: [
        'UniFi Network: gateways, switches and Wi-Fi',
        'UniFi Protect: cameras and recorders with on-camera AI',
        'UniFi Access: readers, door hubs and intercoms',
        'Site Manager for remote and multi-site management',
      ],
    },
    {
      name: 'UISP',
      kicker: 'Long-range wireless',
      art: {
        type: 'network',
        alt: 'An airFiber link carrying the network out to a remote building, where it feeds a gate camera, Wi-Fi, a reader and an intercom',
        uplink: 'Office',
        switchLabel: 'airFiber 5XHD',
        switchSub: '1+ Gbps · 100+ km rated',
        ports: [
          { label: 'Gate cam', icon: 'camera' },
          { label: 'Shed Wi-Fi', icon: 'wifi' },
          { label: 'Reader', icon: 'reader' },
          { label: 'Intercom', icon: 'speaker' },
        ],
        caption: 'One radio link brings a far building onto the network',
      },
      body: 'Point-to-point and point-to-multipoint radios that join buildings, gates and remote cameras without trenching cable. The airFiber 5XHD is rated beyond 100 km and over 1 Gbps, conditions permitting.',
      points: [
        'airMAX radios such as NanoStation, NanoBeam and PowerBeam',
        'airFiber point-to-point bridges in 5, 11 and 24 GHz',
        'LTU and Wave radios for larger point-to-multipoint networks',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Cameras, doors and network in one place',
  capabilitiesIntro: 'Because Protect, Access and Network share one console, a camera event, a door event and a network fault all land in the same place. These are the features our customers use most.',
  capabilities: [
    {
      title: 'AI detections and search',
      art: {
        type: 'search',
        alt: 'A search for vehicles at the front gate overnight returns matches from several UniFi cameras',
        query: 'Vehicles at the front gate, last night',
        badge: '4 matches',
        results: [
          { label: 'Front gate 01:12', score: 'Car', highlight: true, kind: 'vehicle' },
          { label: 'Driveway 01:13', score: 'Car', kind: 'vehicle' },
          { label: 'Car park 01:20', score: 'Car', kind: 'vehicle' },
          { label: 'Side gate 01:31', score: 'Car', kind: 'vehicle' },
        ],
        caption: 'Smart detections let you jump straight to what matters',
      },
      body: 'Protect cameras pick out people and vehicles on the camera itself, so you can jump straight to the moments that matter instead of scrolling through hours of footage.',
    },
    {
      title: 'Plates and faces',
      art: {
        type: 'plate',
        alt: 'A car at the staff gate has its plate read by a UniFi camera and matched as a known vehicle',
        plate: '1TC 4RA',
        confidence: 'AI camera read',
        status: 'Known vehicle',
        statusTone: 'ok',
        lines: ['Staff gate · 06:52', 'Logged in Protect'],
      },
      body: 'On the AI and G6 series cameras, Protect adds licence plate recognition and face recognition, with a real-time notification when a known face is recognised.',
    },
    {
      title: 'Alarm Manager',
      art: {
        type: 'mobile',
        alt: 'A Protect alert about a person at the loading dock after hours, with buttons to view the camera or play a warning',
        app: 'UniFi Protect',
        icon: 'person',
        tone: 'warn',
        notice: 'Person seen',
        sub: 'Loading dock · Cam 4',
        time: 'Tonight 11:42 pm',
        actions: ['View live', 'Play warning'],
        side: [
          { label: 'Camera', sub: 'G6 Bullet', icon: 'camera' },
          { label: 'Speaker', sub: 'Recorded msg', icon: 'speaker' },
          { label: 'Door', sub: 'Stays locked', icon: 'door' },
        ],
      },
      body: 'Alarm Manager links triggers to actions. Motion at the loading dock after hours can raise an alert and play a recorded warning through a loudspeaker.',
    },
    {
      title: 'Door access',
      art: {
        type: 'door',
        alt: 'A UniFi Access reader accepting a phone credential and unlocking the door, with recent entries listed',
        credentials: [
          { label: 'NFC card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Touch Pass', icon: 'phone' },
          { label: 'Fob', icon: 'fob' },
        ],
        active: 1,
        result: 'Door unlocked',
        resultTone: 'ok',
        log: ['08:02 Priya · Main', '07:55 Sam · Store', '07:41 Fob · Gate', '07:30 Card · Lab'],
      },
      body: 'UniFi Access readers take 13.56 MHz NFC cards and fobs, the UniFi Identity app or Apple Wallet Touch Pass. Door events sit next to the camera footage in the same console.',
    },
    {
      title: 'Switching and PoE',
      art: {
        type: 'network',
        alt: 'A UniFi switch powering cameras, an access point, a door reader and an intercom, with each port lit by colour',
        uplink: 'Gateway',
        switchLabel: 'UniFi Pro Max',
        switchSub: 'PoE to cameras and APs',
        ports: [
          { label: 'Camera', icon: 'camera' },
          { label: 'Camera', icon: 'bullet' },
          { label: 'U7 AP', icon: 'wifi' },
          { label: 'Reader', icon: 'reader' },
          { label: 'Intercom', icon: 'speaker' },
        ],
        caption: 'Etherlighting colours each port by VLAN or link speed',
      },
      body: 'UniFi switches run from compact models for tight spaces to campus cores, with PoE+, PoE++ and PoE+++ options. Port Manager sets VLANs and power per port, and Etherlighting lets a technician read the rack at a glance.',
    },
    {
      title: 'Every site in one view',
      art: {
        type: 'cloud',
        alt: 'Three Victorian sites listed in UniFi Site Manager and opened from a browser or the phone app',
        title: 'Site Manager',
        sub: 'Every site, one login',
        badge: 'No licence fees',
        sites: [
          { label: 'Melbourne', sub: 'Head office', icon: 'wifi' },
          { label: 'Bendigo', sub: 'Depot', icon: 'camera' },
          { label: 'Geelong', sub: 'Store', icon: 'door' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'Site Manager lists every UniFi site you look after and opens any of them on a computer or phone. Remote management is free, and the cameras carry no licence fee however many you add.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Ubiquiti makes',
  range: [
    {
      title: 'Gateways and switching',
      items: ['Cloud Gateway Ultra, Max and Fiber', 'Dream Machine Pro and Pro Max', 'Enterprise Firewall', 'Compact, Value, Professional and Enterprise switches'],
    },
    {
      title: 'Wi-Fi',
      items: ['U7 Wi-Fi 7 access points', 'In-wall access points', 'U7 Outdoor and U7 Pro Outdoor', 'Mesh access points', 'E7 enterprise access points'],
    },
    {
      title: 'Cameras and door access',
      items: ['G6 and G5 bullet, dome and turret cameras', 'PTZ cameras, including the AI PTZ Precision', 'Network video recorders up to the Enterprise NVR', 'Access readers, door hubs and intercoms'],
    },
    {
      title: 'UISP wireless',
      items: ['airMAX 2.4, 3 and 5 GHz radios', 'airFiber point-to-point bridges', 'LTU and Wave point-to-multipoint radios'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom UniFi system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, readers, access points and a radio link report to a UniFi console and Site Manager, used by the security desk, managers and Teracom',
    devices: [
      { label: 'G6 cameras', sub: 'AI detections', icon: 'camera' },
      { label: 'Access readers', sub: 'Card, fob, phone', icon: 'reader' },
      { label: 'U7 access points', sub: 'Wi-Fi 7', icon: 'wifi' },
      { label: 'airFiber link', sub: 'Remote buildings', icon: 'map' },
    ],
    platforms: [
      { label: 'UniFi console', sub: 'Runs every UniFi app', icon: 'server' },
      { label: 'Site Manager', sub: 'Remote, any device', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Live view and doors', icon: 'laptop' },
      { label: 'Managers', sub: 'Alerts on the phone', icon: 'phone' },
      { label: 'Teracom', sub: 'Monitoring and upkeep', icon: 'headset' },
    ],
    footer: 'Every UniFi app on one console, Site Manager for remote access, and UISP radios for far buildings',
  },
  architectureCaption: 'Cameras, readers and access points report to a UniFi console on site, and UISP radios bring outlying buildings onto the same network. Your team works from the desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Small and medium businesses', 'Schools', 'Retail', 'Hospitality', 'Farms and rural properties', 'Warehousing and logistics', 'Multi-site businesses', 'Residential estates'],

  teracomHeading: 'What Teracom does on a Ubiquiti job',
  teracom: [
    { title: 'Design', body: 'Gateway, switches, access point positions and camera views planned together, with PoE budgets and Wi-Fi coverage checked before anything is ordered.' },
    { title: 'Install and commission', body: 'Everything mounted, cabled and adopted into the console, with VLANs, detection zones, door schedules and radio links aligned and tested.' },
    { title: 'Connect to monitoring', body: 'Where the site needs it, alarms and camera events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware kept current, health checked and faults fixed on a maintenance plan, so the system stays supported.' },
  ],

  links: [
    { label: 'Ubiquiti software and firmware downloads', href: 'https://ui.com/download' },
    { label: 'Ubiquiti tech specs', href: 'https://techspecs.ui.com/' },
    { label: 'How UniFi works', href: 'https://ui.com/how-it-works' },
  ],
};

export default ubiquiti;