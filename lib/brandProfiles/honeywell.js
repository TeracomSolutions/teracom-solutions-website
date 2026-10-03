// The deeper Honeywell brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from resideo.com (October 2026), which now makes
// and supports the VISTA range under the Honeywell Home and First Alert
// names; figures are Resideo's own. Drawings are specs drawn by lib/brandArt.

const honeywell = {
  heroArt: {
    type: 'hero',
    alt: 'A VISTA panel dealing with an armed house, a motion alarm and a locked door, fed by keypads on one side and AlarmNet on the other',
    device: 'alarm',
    left: { title: 'Keypads', sub: 'Tuxedo Touch', foot: 'Arm, disarm and Z-Wave', icon: 'pin' },
    right: { title: 'AlarmNet', sub: 'IP and LTE', foot: 'Monitoring and the app', icon: 'cloud' },
    tags: [
      { text: 'Away armed', tone: 'ok', icon: 'shield' },
      { text: 'Zone 7 alarm', tone: 'alert', icon: 'motion' },
      { text: 'Door locked', tone: 'accent', icon: 'lock' },
    ],
    chips: [
      { text: 'Wired and wireless', tone: 'accent' },
      { text: 'Alarms to monitoring', tone: 'ok' },
    ],
  },

  stats: [
    { value: '250 zones', label: 'on a VISTA-250BPT, across 8 partitions with 250 user codes' },
    { value: '48 zones', label: 'on a VISTA-21iP, with an AlarmNet internet communicator on board' },
    { value: '232', label: 'Z-Wave devices run from one Tuxedo Touch controller' },
    { value: '100+', label: 'locations on one Total Connect 2.0 account, with 90 days of history' },
  ],

  platformsEyebrow: 'Two panel families',
  platformsHeading: 'VISTA for homes, VISTA for business',
  platformsIntro: 'Every VISTA panel mixes hardwired and wireless detection and sends its alarms through AlarmNet. Today the range is made and supported by Resideo, under the Honeywell Home name it uses under licence and its own First Alert brand. We choose the panel on zone count, how many areas need to arm separately and what is already on the wall.',
  platforms: [
    {
      name: 'VISTA hybrid panels',
      kicker: 'Homes and small business',
      art: {
        type: 'panel',
        alt: 'A VISTA keypad in stay mode with the lounge detector bypassed, wired and wireless zones armed and an alarm on the back slider',
        mode: 'Stay armed',
        modeTone: 'ok',
        status: 'Partition 1 · home',
        zones: [
          { name: 'Front door', state: 'secure', label: 'Closed' },
          { name: 'Lounge PIR', state: 'bypassed', label: 'Stay · bypassed' },
          { name: 'Garage roller', state: 'armed', label: 'Armed' },
          { name: 'Laundry window', state: 'armed', label: '5800 wireless' },
          { name: 'Back slider', state: 'alarm', label: 'Alarm 23:41' },
          { name: 'Hall smoke', state: 'secure', label: 'Normal' },
          { name: 'Shed PIR', state: 'armed', label: 'PROSIX wireless' },
        ],
      },
      body: 'One panel takes hardwired zones on the board and wireless detectors on top, with keypads, sirens and a communicator added as the job needs. Two partitions on the smaller panels let a house and a granny flat, or a shop and the office behind it, arm on their own.',
      points: [
        'VISTA-15P, 20P and 21iP: up to 48 zones and two partitions',
        'VISTA-21iPLTE: internet on board, with a snap-in LTE radio',
        'First Alert VISTA H3: 64 zones, with Wi-Fi and LTE modules',
        'Hardwired, 5800 and PROSIX wireless detectors on one panel',
      ],
    },
    {
      name: 'Commercial VISTA',
      kicker: 'Partitioned panels',
      art: {
        type: 'panel',
        alt: 'A commercial VISTA keypad with the warehouse, offices and comms room armed, the showroom open for trade and an alarm at the dock',
        mode: 'Part armed',
        modeTone: 'warn',
        status: '4 partitions set',
        zones: [
          { name: 'P1 Showroom', state: 'open', label: 'Open 07:58' },
          { name: 'P2 Warehouse', state: 'armed', label: 'Armed 18:10' },
          { name: 'P3 Offices', state: 'armed', label: 'Armed 17:45' },
          { name: 'P4 Dock', state: 'alarm', label: 'Alarm · roller' },
          { name: 'P5 Comms room', state: 'armed', label: 'Armed' },
          { name: 'P6 Lunchroom', state: 'open', label: 'Open' },
        ],
      },
      body: 'One panel splits a building into as many as eight partitions, each armed and disarmed by its own users from its own keypads. It suits a showroom, warehouse and offices under one roof, and the larger panels can tie in with CCTV and access control as well as burglary detection.',
      points: [
        'VISTA-128BPT: 128 zones, 8 partitions and 150 user codes',
        'VISTA-250BPT: 250 zones, 250 users and a 1,000-event log',
        'Hardwired, V-Plex and wireless zones on the one panel',
        'Fire and burglary versions: V32FBPT, V128FBPT and V250FBPT',
      ],
    },
  ],

  capabilitiesEyebrow: 'Around the panel',
  capabilitiesHeading: 'What a VISTA system does day to day',
  capabilitiesIntro: 'The panel does the detecting. These are the parts that change how people live with it, from the keypad by the door to the monitoring centre.',
  capabilities: [
    {
      title: 'Tuxedo Touch by the door',
      art: {
        type: 'dashboard',
        alt: 'A Tuxedo Touch home screen showing the alarm armed, the front door locked, the thermostat, the lights and the scenes run this week',
        title: 'Tuxedo Touch · home',
        tiles: [
          { label: 'Security', value: 'Armed', tone: 'ok' },
          { label: 'Front door', value: 'Locked', tone: 'ok' },
          { label: 'Thermostat', value: '21°C' },
          { label: 'Lights on', value: '3' },
        ],
        bars: [4, 6, 3, 7, 5, 8, 6, 4],
        chart: 'Scenes run this week',
        eventsTitle: 'Today',
        events: [
          { text: 'Away scene · 08:05', tone: 'ok' },
          { text: 'Garage door closed', tone: 'ok' },
          { text: 'Camera 2 · motion', tone: 'warn' },
          { text: 'Lights off · 23:00', tone: 'ok' },
        ],
      },
      body: 'A 7-inch touchscreen keypad with a Z-Wave controller inside, so locks, lights, thermostats and the garage door sit alongside the alarm. Scenes run on a time, a day or a system event, cameras can be watched on the screen, and it reads the system status aloud.',
    },
    {
      title: 'Total Connect 2.0 on the phone',
      art: {
        type: 'mobile',
        alt: 'A Total Connect 2.0 alert for an alarm on a rear roller door in Geelong, with buttons to view the camera or disarm',
        app: 'Total Connect 2.0',
        icon: 'alarm',
        tone: 'alert',
        notice: 'Alarm zone 7',
        sub: 'Rear roller · Geelong',
        time: 'Today 02:14',
        actions: ['View camera', 'Disarm'],
        side: [
          { label: 'Partitions', sub: 'Up to 8', icon: 'shield' },
          { label: 'Video', sub: '7 or 30 days', icon: 'camera' },
          { label: 'Locations', sub: '100+ sites', icon: 'map' },
        ],
      },
      body: 'Arm and disarm up to eight partitions, watch live and recorded video, and get push, text and email alerts as events happen. One login can cover more than 100 locations, with geofence reminders if you leave without setting the alarm.',
    },
    {
      title: 'Two paths off site',
      art: {
        type: 'network',
        alt: 'A VISTA-21iPLTE sending alarms through AlarmNet to the monitoring centre, the Total Connect app and the installer',
        uplink: 'AlarmNet',
        switchLabel: 'VISTA-21iPLTE',
        switchSub: 'Internet and LTE on board',
        ports: [
          { label: 'Monitoring', icon: 'headset' },
          { label: 'TC 2.0 app', icon: 'phone' },
          { label: 'Installer', icon: 'laptop' },
        ],
        caption: 'Alarm signals and app traffic carried over IP and LTE',
      },
      body: 'VISTA panels get their alarms off site through AlarmNet communicators, over the internet, LTE or both. The VISTA-21iP has one built in, and plug-in communicators add internet and cellular paths to the other VISTA panels.',
    },
    {
      title: 'Programming from anywhere',
      art: {
        type: 'cloud',
        alt: 'A home, a pharmacy and an office with VISTA panels connected to AlarmNet 360, reached through the installer portal and the app',
        title: 'AlarmNet 360',
        sub: 'Program and check panels',
        badge: 'Upload and download',
        sites: [
          { label: 'Home', sub: 'VISTA-21iP', icon: 'alarm' },
          { label: 'Pharmacy', sub: 'VISTA-20P', icon: 'alarm' },
          { label: 'Office', sub: 'VISTA-15P', icon: 'alarm' },
        ],
        clients: [
          { label: 'Portal', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'AlarmNet 360 is Resideo’s installer platform in the cloud. It lets the installer program, troubleshoot and manage supported VISTA panels without a site visit, and it is where Total Connect accounts are set up.',
    },
    {
      title: 'Smoke, heat and CO',
      art: {
        type: 'sensor',
        alt: 'A smoke and heat detector on a VISTA zone covering the kitchen, hallway and garage, with one smoke event and normal CO and heat readings',
        icon: 'sensor',
        target: 'thermo',
        label: 'Smoke and heat',
        sub: 'On a VISTA zone',
        coverage: 'Kitchen, hallway and garage',
        events: [
          { text: 'Smoke', sub: 'Kitchen · 18:52', tone: 'alert' },
          { text: 'CO normal', sub: 'Garage', tone: 'ok' },
          { text: 'Heat normal', sub: 'Plant room', tone: 'ok' },
        ],
      },
      body: 'Smoke, heat and carbon monoxide detectors can sit on the panel beside the burglary zones, so an early warning reaches the same keypads, app and monitoring as an intruder alarm.',
    },
    {
      title: 'Upgrading an older system',
      art: {
        type: 'map',
        alt: 'A floor plan where existing wired and 5800 wireless detectors stay in place around a new First Alert VISTA H3 panel and keypad',
        markers: [
          { x: 10, y: 22, icon: 'door', label: 'Wired reed' },
          { x: 30, y: 76, icon: 'motion', label: '5800 PIR' },
          { x: 50, y: 20, icon: 'pin', label: 'Keypad' },
          { x: 68, y: 78, icon: 'sensor', label: 'PROSIX' },
          { x: 88, y: 24, icon: 'alarm', tone: 'accent', label: 'VISTA H3' },
          { x: 88, y: 80, icon: 'motion', label: 'Kept PIR' },
        ],
        caption: 'Old detectors kept, new VISTA H3 fitted',
      },
      body: 'The VISTA H3 is built for takeovers. It keeps existing hardwired detectors and 5800 series or other brands’ wireless sensors, and adds PROSIX two-way wireless and expansion modules as needed, so an older site moves forward without rewiring every room.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What the VISTA range covers',
  range: [
    {
      title: 'Control panels',
      items: ['VISTA-15P, VISTA-20P and VISTA-21iP', 'VISTA-21iPLTE', 'First Alert VISTA H3 hybrid panel', 'VISTA-128BPT and VISTA-250BPT commercial', 'Fire and burglary: V32FBPT, V128FBPT, V250FBPT'],
    },
    {
      title: 'Keypads and controllers',
      items: ['Tuxedo Touch security and smart controller', '6290W 7-inch colour touchscreen with voice', 'Wireless 7-inch touchscreen for VISTA H3', 'Hardwired keypads, portrait or landscape'],
    },
    {
      title: 'Detection and expansion',
      items: ['5800 series wireless sensors', 'PROSIX two-way wireless sensors', 'Hardwired zone expanders and relay modules', 'V-Plex expansion', 'Smoke, heat and CO detection'],
    },
    {
      title: 'Communications and software',
      items: ['AlarmNet internet and LTE communicators', 'Total Connect 2.0 app', 'AlarmNet 360 installer platform', 'Wi-Fi and Z-Wave modules'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom VISTA system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Detectors, keypads, smoke and CO detectors and Z-Wave devices report to a VISTA panel, which sends alarms through AlarmNet to the app and monitoring',
    devices: [
      { label: 'Detectors', sub: 'Wired and wireless', icon: 'motion' },
      { label: 'Keypads', sub: 'Including Tuxedo', icon: 'pin' },
      { label: 'Smoke and CO', sub: 'Life safety zones', icon: 'sensor' },
      { label: 'Z-Wave devices', sub: 'Locks, lights, HVAC', icon: 'lock' },
      { label: 'IP cameras', sub: 'Seen on the keypad', icon: 'camera' },
    ],
    platforms: [
      { label: 'VISTA panel', sub: 'On site', icon: 'alarm' },
      { label: 'AlarmNet', sub: 'IP and LTE comms', icon: 'cloud' },
      { label: 'Total Connect', sub: 'App and remote access', icon: 'phone' },
    ],
    people: [
      { label: 'Owners and staff', sub: 'Keypad and app', icon: 'person' },
      { label: 'Installer', sub: 'Remote programming', icon: 'laptop' },
      { label: 'Monitoring centre', sub: 'Alarms after hours', icon: 'headset' },
    ],
    footer: 'Detectors and keypads report to the VISTA panel; AlarmNet carries alarms to monitoring and the app',
  },
  architectureCaption: 'Wired and wireless detectors, keypads and Z-Wave devices connect to a VISTA panel on site. AlarmNet carries alarms over the internet or LTE, Total Connect puts the system on your phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Homes', 'Apartments and townhouses', 'Retail shops', 'Small offices', 'Pharmacies and medical clinics', 'Warehouses', 'Showrooms and dealerships', 'Light industrial'],

  teracomHeading: 'What Teracom does on a Honeywell job',
  teracom: [
    { title: 'Design', body: 'Panel, zones and partitions planned from the floor plan, with the wired and wireless mix chosen to suit the building and any detectors already in place.' },
    { title: 'Install and commission', body: 'Panel, keypads and detectors installed, every zone walk-tested, and Tuxedo scenes and Total Connect users set up before handover.' },
    { title: 'Connect to monitoring', body: 'Alarms can come through to our monitoring centre for after-hours response, over the internet or a cellular path.' },
    { title: 'Look after it', body: 'Battery tests, user changes and keypad or communicator upgrades handled on a maintenance plan, including moving older VISTA sites forward.' },
  ],

  links: [
    { label: 'VISTA panels at Resideo', href: 'https://www.resideo.com/us/en/pro/solutions/vista/' },
    { label: 'Total Connect 2.0', href: 'https://www.resideo.com/us/en/pro/solutions/security/total-connect/' },
    { label: 'First Alert VISTA H3', href: 'https://www.resideo.com/us/en/pro/vistah/' },
  ],
};

export default honeywell;