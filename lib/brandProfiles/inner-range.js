// The deeper Inner Range brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from innerrange.com (October 2026); figures are
// Inner Range's own. Drawings are specs drawn by lib/brandArt.

const innerRange = {
  heroArt: {
    type: 'hero',
    alt: 'An Inner Range system at the centre, fed by Integriti software and the IR Connect app, handling a door, an alarm zone and an armed area',
    device: 'shield',
    left: { title: 'Integriti', sub: 'Enterprise', foot: 'Pay once, use for life', icon: 'server' },
    right: { title: 'IR Connect', sub: 'App and web', foot: 'Alarms, doors, video', icon: 'phone' },
    tags: [
      { text: 'Door granted', tone: 'ok', icon: 'door' },
      { text: 'Zone 4 alarm', tone: 'alert', icon: 'motion' },
      { text: 'Area armed', tone: 'accent', icon: 'alarm' },
    ],
    chips: [
      { text: 'AES-128 encrypted', tone: 'ok' },
      { text: 'Access, alarms, video', tone: 'accent' },
    ],
  },

  stats: [
    { value: '150,000+', label: 'Inner Range systems installed around the world' },
    { value: '4 to 128', label: 'doors on one Inception controller, with 8 to 1,024 inputs' },
    { value: '10 s', label: 'fastest encrypted polling to the monitoring centre on a T4000' },
    { value: 'Class 5', label: 'AS/NZS 2201.1 high-security rating for Infiniti Integriti' },
  ],

  platformsEyebrow: 'Two platforms',
  platformsHeading: 'Inception for smaller sites, Integriti for the big ones',
  platformsIntro: 'Both run access control and intruder alarms as one system, use the same readers and keypads, and connect to IR Connect for remote control. The choice comes down to door count, how many sites you run and how far you want to integrate.',
  platforms: [
    {
      name: 'Inner Range Inception',
      kicker: 'Professional',
      art: {
        type: 'onPrem',
        alt: 'Doors, detectors and keypads wired to one Inception controller that is set up and run from a web browser',
        devices: [
          { label: 'Doors', icon: 'door' },
          { label: 'Detectors', icon: 'motion' },
          { label: 'Keypads', icon: 'pin' },
          { label: 'Readers', icon: 'reader' },
        ],
        server: 'Inception',
        badge: 'No software to buy',
        title: 'Runs in a browser',
        sub: 'Phone, tablet or computer',
        points: ['4 to 128 doors', 'Up to 32 lift cars', 'IR Connect app'],
      },
      body: 'A controller with its own web interface, so there is no software to install and no software licence to pay for. It handles doors, alarm areas and simple building automation for offices, shops, clinics and schools.',
      points: [
        'Four doors built in, expanding to 128, with lift control for up to 32 cars',
        'Eight inputs on board, expanding to 1,024 for detectors and door contacts',
        'IR Connect app for arming, doors and alerts away from site',
        'Integrations with Milestone, Hanwha WAVE and Control4, plus a REST API',
      ],
    },
    {
      name: 'Inner Range Integriti',
      kicker: 'Enterprise',
      art: {
        type: 'map',
        alt: 'A GateKeeper floor plan with doors, a reader, a camera and a detector placed, and the dock door in alarm',
        markers: [
          { x: 12, y: 22, icon: 'door', tone: 'ok', label: 'Foyer' },
          { x: 36, y: 72, icon: 'reader', tone: 'ok', label: 'Lift lobby' },
          { x: 62, y: 26, icon: 'camera', tone: 'ok', label: 'Cam 3' },
          { x: 50, y: 50, icon: 'motion', tone: 'ok', label: 'Zone 12' },
          { x: 86, y: 74, icon: 'door', tone: 'alert', label: 'Dock door' },
          { x: 86, y: 20, icon: 'server', tone: 'muted', label: 'Comms rm' },
        ],
        caption: 'GateKeeper shows every device live',
      },
      body: 'Software for multi-site estates with thousands of doors and cameras. System Designer is where the system is built and programmed; GateKeeper is where operators watch events, maps and alarms day to day.',
      points: [
        'Express, Professional, Business and Corporate editions to suit the site',
        'More than 300 integrations, including Active Directory, lifts, fire and intercoms',
        'Every programming change audited, with rollback',
        'Infiniti for Class 5 high-security areas on the same system',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'One system for doors, alarms and video',
  capabilitiesIntro: 'Inner Range supplies everything from the card reader to the controller to the software, so each part is designed to work with the rest. These are the features that matter most on our jobs.',
  capabilities: [
    {
      title: 'Access and alarms as one',
      art: {
        type: 'panel',
        alt: 'A keypad showing the warehouse armed, with door and detector zones and one alarm on the dock door',
        mode: 'Armed',
        modeTone: 'accent',
        status: 'Warehouse area',
        zones: [
          { name: 'Front door', state: 'secure', label: 'Locked 18:02' },
          { name: 'Office PIR', state: 'armed', label: 'Armed' },
          { name: 'Dock door', state: 'alarm', label: 'Forced 02:14' },
          { name: 'Store PIR', state: 'armed', label: 'Armed' },
          { name: 'Roller door', state: 'secure', label: 'Closed' },
          { name: 'Server room', state: 'bypassed', label: 'Bypassed' },
        ],
      },
      body: 'Doors, alarm areas and detectors sit in one system with one list of users. Inputs are universal, so the same controller takes PIRs, door reeds and lock sensors, and an operator has one screen to watch instead of two.',
    },
    {
      title: 'Encrypted SIFER readers',
      art: {
        type: 'door',
        alt: 'A SIFER card, a phone and a PIN offered at a reader, with the phone opening the door and the event logged',
        credentials: [
          { label: 'SIFER card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'PIN', icon: 'pin' },
        ],
        active: 1,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:02 Phone, Lab 2', '07:58 Card, Foyer', '07:41 PIN, Store', '07:30 Door held'],
      },
      body: 'SIFER readers use MIFARE DESFire EV1, EV2 and EV3 cards and encrypt to AES-128 from the card all the way to the door module, a big step up from plain Wiegand. Mobile Access readers add Bluetooth phone credentials on the same device.',
    },
    {
      title: 'Alarms that always get through',
      art: {
        type: 'dashboard',
        alt: 'A T4000 status screen showing the Ethernet path down, 4G carrying the polls and an alarm delivered to the monitoring centre',
        title: 'T4000 communicator',
        tiles: [
          { label: 'Ethernet path', value: 'Down', tone: 'alert' },
          { label: '4G path', value: 'Active', tone: 'ok' },
          { label: 'Poll interval', value: '10 s', tone: 'accent' },
          { label: 'Encryption', value: 'AES-128', tone: 'ok' },
        ],
        bars: [3, 1, 4, 2, 0, 5, 2, 1],
        chart: 'Alarms delivered',
        eventsTitle: 'Path events',
        events: [
          { text: 'Ethernet lost 01:52', tone: 'alert' },
          { text: 'Rerouted over 4G', tone: 'warn' },
          { text: 'Alarm received 02:14', tone: 'ok' },
          { text: 'Poll OK every 10 s', tone: 'ok' },
        ],
      },
      body: 'Multipath IP T4000 communicators send alarms over Ethernet and dual-SIM 4G, encrypted to AES-128 and polling as often as every 10 seconds. If one path drops the alarm takes the other, and a path that stays down raises its own alarm. They also suit other panels that report Contact ID.',
    },
    {
      title: 'IR Connect in your pocket',
      art: {
        type: 'mobile',
        alt: 'An IR Connect alert for a warehouse alarm, with buttons to view the camera and disarm, beside camera, door and area tiles',
        app: 'IR Connect',
        icon: 'alarm',
        tone: 'alert',
        notice: 'Alarm: Zone 4',
        sub: 'Warehouse · Dandenong',
        time: 'Just now',
        actions: ['View camera', 'Disarm area'],
        side: [
          { label: 'Cameras', sub: 'Live, recorded', icon: 'camera' },
          { label: 'Doors', sub: 'Lock or unlock', icon: 'door' },
          { label: 'Areas', sub: 'Arm or disarm', icon: 'alarm' },
        ],
      },
      body: 'The IR Connect app and web portal give alarm notifications, live and recorded video, arming and door control across every site. Operational data stays on the controller on site and the cloud carries the encrypted link. It replaces the SkyCommand app and still works with existing systems.',
    },
    {
      title: 'Built for high security',
      art: {
        type: 'network',
        alt: 'An Integriti controller feeding keypads, readers, expanders and detectors over an encrypted, supervised module network',
        uplink: 'Integriti',
        switchLabel: 'Integriti ISC',
        switchSub: 'AES-128 and MAC on the LAN',
        ports: [
          { label: 'Keypad', icon: 'pin', tone: 'ok' },
          { label: 'SIFER', icon: 'reader', tone: 'ok' },
          { label: 'Expander', icon: 'switch', tone: 'ok' },
          { label: 'EOL module', icon: 'sensor', tone: 'ok' },
          { label: 'Siren', icon: 'speaker', tone: 'ok' },
          { label: 'Tamper', icon: 'alarm', tone: 'alert' },
        ],
        caption: 'Modules are polled, so a cut cable or swapped part raises an alarm',
      },
      body: 'On sensitive sites the controller, expanders, keypads and SIFER readers talk over a network encrypted to AES-128 with message authentication, and end-of-line modules encrypt the link to each detector. Infiniti Integriti meets AS/NZS 2201.1 Class 5, and high and lower security areas can share one system.',
    },
    {
      title: 'Video in the same system',
      art: {
        type: 'search',
        alt: 'An alarm on the dock door brings up recorded clips from the nearby cameras, lined up by time',
        query: 'Door forced · Dock door · 02:14',
        badge: '4 clips',
        results: [
          { label: 'Dock camera', score: '02:14', highlight: true, kind: 'camera' },
          { label: 'Yard PTZ', score: '02:13', kind: 'camera' },
          { label: 'Car park', score: '02:11', kind: 'vehicle' },
          { label: 'Corridor 2', score: '02:15', kind: 'camera' },
        ],
        caption: 'Recorded video lined up with the alarm',
      },
      body: 'IR Video Pro cameras and video gateways record alongside the access and alarm system, so an event at a door comes with the footage around it. Integriti Business and Corporate editions also bring in CCTV from other video systems.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Inner Range makes',
  range: [
    {
      title: 'Controllers',
      items: ['Inception controller and starter kit', 'Integriti Security Controller (ISC)', 'Integriti Access Controller (IAC)', 'Expanders, end-of-line modules and power supplies'],
    },
    {
      title: 'Keypads and readers',
      items: ['PrismaX colour and EliteX OLED keypads', 'Inception 7-inch touchscreen', 'SIFER card and keypad readers', 'Mobile Access Bluetooth readers', 'HID Signo SIFER mullion reader'],
    },
    {
      title: 'Detection and video',
      items: ['IR Detect PIR, dual-tech and anti-mask tri-tech detectors', 'IR Video Pro PTZ, fisheye, bullet and turret cameras', 'IR Video Pro Gateways, 4 to 64 channels'],
    },
    {
      title: 'Monitoring and software',
      items: ['T4000 Ultralite, Lite, standard and PRO communicators', 'Integriti software editions', 'Infiniti high-security software', 'IR Connect app and portal'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Inner Range system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Readers, keypads, detectors and cameras report to Inception or Integriti, which reach the security desk, phones and the monitoring centre',
    columns: ['On site', 'Platform', 'People'],
    devices: [
      { label: 'SIFER readers', sub: 'Card and phone', icon: 'reader' },
      { label: 'Keypads', sub: 'PrismaX, EliteX', icon: 'pin' },
      { label: 'IR Detect', sub: 'PIR and tri-tech', icon: 'motion' },
      { label: 'IR Video Pro', sub: 'Cameras, gateways', icon: 'camera' },
    ],
    platforms: [
      { label: 'Inception', sub: 'Smaller sites', icon: 'shield' },
      { label: 'Integriti', sub: 'Multi-site estates', icon: 'server' },
      { label: 'IR Connect', sub: 'Encrypted remote link', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'GateKeeper', icon: 'laptop' },
      { label: 'Phones', sub: 'IR Connect app', icon: 'phone' },
      { label: 'Monitoring centre', sub: 'Via Multipath IP', icon: 'headset' },
    ],
    footer: 'Access control, intruder alarms and video in one system, with alarms sent over two encrypted paths',
  },
  architectureCaption: 'Readers, keypads, detectors and cameras report to an Inception controller or to Integriti. Staff work from GateKeeper or the IR Connect app, and T4000 communicators carry alarms to our monitoring centre over two paths.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Schools and universities', 'Healthcare', 'Retail and banking', 'Distribution centres', 'High-rise buildings', 'Critical infrastructure', 'Government'],

  teracomHeading: 'What Teracom does on an Inner Range job',
  teracom: [
    { title: 'Design', body: 'Doors, alarm areas and detector positions planned from the site drawings, and the right platform chosen, Inception or Integriti, before anything is ordered.' },
    { title: 'Install and commission', body: 'Controllers, readers, keypads and detectors installed and wired, areas and access levels programmed, and every door and zone tested before handover.' },
    { title: 'Connect to monitoring', body: 'A T4000 communicator sends alarms to our monitoring centre over Ethernet and 4G, so one dropped connection does not leave the site unwatched.' },
    { title: 'Look after it', body: 'Firmware, software maintenance and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Inner Range Integriti enterprise solution', href: 'https://www.innerrange.com/solutions/enterprise' },
    { label: 'IR Connect', href: 'https://www.innerrange.com/solutions/ir-connect' },
    { label: 'Inner Range technical support', href: 'https://www.innerrange.com/technicalsupport' },
  ],
};

export default innerRange;