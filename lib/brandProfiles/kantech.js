// The deeper Kantech brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from kantech.com (October 2026); figures are
// Kantech’s own. Drawings are specs drawn by lib/brandArt.

const kantech = {
  heroArt: {
    type: 'hero',
    alt: 'A door at the centre, controlled by a KT-4 controller and managed in EntraPass, handling a card at the reader, a held door and an armed area',
    device: 'door',
    left: { title: 'EntraPass', sub: 'Three editions', foot: 'Doors, video, alarms', icon: 'server' },
    right: { title: 'KT-4', sub: 'PoE and Wi-Fi', foot: '100,000 users on board', icon: 'switch' },
    tags: [
      { text: 'Card granted', tone: 'ok', icon: 'card' },
      { text: 'Door held', tone: 'warn', icon: 'door' },
      { text: 'Area armed', tone: 'accent', icon: 'alarm' },
    ],
    chips: [
      { text: 'AES-128 reader link', tone: 'ok' },
      { text: 'Video with Exacq', tone: 'accent' },
    ],
  },

  stats: [
    { value: '100,000', label: 'users held on a single KT-2 or KT-4 door controller' },
    { value: '128', label: 'KT controllers linked to EntraPass through one KT-NCC Gen 2' },
    { value: 'AES-128', label: 'encryption on the link between ioSmart readers and the controller' },
    { value: '150 m', label: 'line-of-sight range for ioSmart wireless gate and panic transmitters' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'On its own, or under EntraPass',
  platformsIntro: 'The same KT controllers and readers work either way. A small site can run a controller by itself from a browser, and move to EntraPass later without replacing the hardware on the doors.',
  platforms: [
    {
      name: 'KT-Standalone',
      kicker: 'Standalone',
      art: {
        type: 'onPrem',
        alt: 'A reader, a lock, an exit button and a door contact wired to one KT-2 controller that is set up from a web browser',
        devices: [
          { label: 'Reader', icon: 'reader' },
          { label: 'Door lock', icon: 'lock' },
          { label: 'Exit button', icon: 'door' },
          { label: 'Door reed', icon: 'sensor' },
        ],
        server: 'KT-2',
        badge: 'No server needed',
        title: 'Runs in a browser',
        sub: 'Cardholders and schedules',
        points: ['One or two doors', '100,000 users', 'Decides offline'],
      },
      body: 'KT-1 and KT-2 controllers have a web page built in, so cardholders, schedules and access rules are set up on the controller itself. There is no server and no software licence, and the controller keeps deciding at the door when the network is down.',
      points: [
        'KT-1 for a single door, powered over the network cable',
        'KT-2 for two doors, found on the network automatically',
        'Suits small offices, shops and remote doors',
        'Moves to EntraPass later on the same hardware',
      ],
    },
    {
      name: 'EntraPass',
      kicker: 'Networked',
      art: {
        type: 'network',
        alt: 'EntraPass reaching KT controllers at several sites, an Exacq recorder and an alarm panel through a KT-NCC Gen 2 gateway',
        uplink: 'EntraPass',
        switchLabel: 'KT-NCC Gen 2',
        switchSub: 'Up to 128 KT controllers',
        ports: [
          { label: 'KT-4 HQ', icon: 'switch', tone: 'ok' },
          { label: 'KT-4 L2', icon: 'switch', tone: 'ok' },
          { label: 'KT-2 Depot', icon: 'switch', tone: 'ok' },
          { label: 'KT-1 Gate', icon: 'door', tone: 'warn' },
          { label: 'Exacq NVR', icon: 'camera', tone: 'ok' },
          { label: 'DSC panel', icon: 'alarm', tone: 'ok' },
        ],
        caption: 'Remote sites keep running on their own if the link to the server drops',
      },
      body: 'EntraPass is the management software for networked Kantech systems. One edition fits a single controller and one workstation, and the largest runs unlimited doors and workstations across many sites, with video and alarm panels in the same screens.',
      points: [
        'Special Edition for one controller and one workstation',
        'Corporate Edition for growing, multi-site organisations',
        'Global Edition with load balancing, failover and a Redundancy Server',
        'Web App and EntraPass Go for browsers and phones',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Doors, alarms and video from one place',
  capabilitiesIntro: 'Kantech keeps the hardware simple to install and puts the rest in EntraPass. These are the parts our customers notice most.',
  capabilities: [
    {
      title: 'Encrypted ioSmart readers',
      art: {
        type: 'door',
        alt: 'An ioSmart card, a phone, an ioProx tag and an HID card at a reader, with the ioSmart card opening the door and the events logged',
        credentials: [
          { label: 'ioSmart', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'ioProx tag', icon: 'fob' },
          { label: 'HID card', icon: 'card' },
        ],
        active: 0,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:31 Card, Foyer', '08:12 Phone, L2', '07:55 Tag, Store', '07:40 Denied, Lab'],
      },
      body: 'ioSmart readers use MIFARE DESFire EV1 and EV2 cards that must prove themselves to the reader, which makes cloning far harder than with proximity cards. The link to the controller is AES-128 encrypted, OSDP is supported, and the same readers take Bluetooth phone credentials.',
    },
    {
      title: 'The system in your pocket',
      art: {
        type: 'mobile',
        alt: 'An EntraPass Go alert for a door held open, with buttons to lock it and view video, beside door, card and partition controls',
        app: 'EntraPass Go',
        icon: 'door',
        tone: 'warn',
        notice: 'Door held',
        sub: 'Rear exit · Dandenong',
        time: 'Just now',
        actions: ['Lock door', 'View video'],
        side: [
          { label: 'Doors', sub: 'Lock, unlock', icon: 'door' },
          { label: 'Cards', sub: 'Add, photo', icon: 'card' },
          { label: 'Partitions', sub: 'Arm, disarm', icon: 'alarm' },
        ],
      },
      body: 'The EntraPass Go app for iPhone and Android locks and unlocks doors, adds cards with a photo taken on the phone, arms and disarms alarm partitions and shows live and recorded video from Exacq recorders, on Corporate and Global Edition systems.',
    },
    {
      title: 'Commissioned from a phone',
      art: {
        type: 'dashboard',
        alt: 'The EntraPass Go Install app testing a KT-4 controller, showing supply voltage, a reader passing and one door contact still open',
        title: 'Go Install · KT-4 test',
        tiles: [
          { label: 'Supply', value: '13.7 V', tone: 'ok' },
          { label: 'Reader 1', value: 'OK', tone: 'ok' },
          { label: 'Door 2 contact', value: 'Open', tone: 'warn' },
          { label: 'Wi-Fi link', value: 'Good', tone: 'accent' },
        ],
        bars: [3, 5, 6, 8, 7, 8, 8, 9],
        chart: 'Wi-Fi signal',
        eventsTitle: 'Commissioning',
        events: [
          { text: 'KT-4 found on Wi-Fi', tone: 'ok' },
          { text: 'Reader 1 test passed', tone: 'ok' },
          { text: 'Door 2 contact open', tone: 'warn' },
          { text: 'Lock relay 1 tested', tone: 'ok' },
        ],
      },
      body: 'The EntraPass Go Install app connects to KT-1, KT-2 and KT-4 controllers over Wi-Fi so our technicians can set them up, test readers and doors, and check voltage and inputs at the door without a laptop. Wiring faults show up before handover, not after.',
    },
    {
      title: 'Alarm partitions at the door',
      art: {
        type: 'panel',
        alt: 'An alarm keypad showing the warehouse area armed, with door and detector zones and one alarm on the roller door',
        mode: 'Armed',
        modeTone: 'accent',
        status: 'Warehouse area',
        zones: [
          { name: 'Front door', state: 'secure', label: 'Locked 17:45' },
          { name: 'Office PIR', state: 'armed', label: 'Armed' },
          { name: 'Warehouse PIR', state: 'armed', label: 'Armed' },
          { name: 'Roller door', state: 'alarm', label: 'Opened 23:12' },
          { name: 'Rear exit', state: 'secure', label: 'Locked' },
          { name: 'Store room', state: 'bypassed', label: 'Bypassed' },
        ],
      },
      body: 'An alarm panel can connect straight to a KT-4, so partitions are armed and disarmed through the access control system. EntraPass also works with DSC PowerSeries, PowerSeries NEO and MAXSYS panels, putting door and alarm events on one screen.',
    },
    {
      title: 'Video beside every badge',
      art: {
        type: 'search',
        alt: 'A denied card at the rear exit brings up the matching Exacq clips from nearby cameras, lined up by time',
        query: 'Rear exit · access denied · last 24 hours',
        badge: '4 clips',
        results: [
          { label: 'Rear exit cam', score: '22:41', highlight: true, kind: 'camera' },
          { label: 'Car park PTZ', score: '22:39', kind: 'camera' },
          { label: 'Corridor 2', score: '22:42', kind: 'camera' },
          { label: 'Loading bay', score: '22:44', kind: 'vehicle' },
        ],
        caption: 'Exacq clips paired with the access event in EntraPass',
      },
      body: 'Video Vault links Exacq video to EntraPass, so every access event comes with its clip. Search by cardholder, door or time and play the footage in the same window, which makes an audit or an investigation a few clicks instead of two systems.',
    },
    {
      title: 'Gates and panic buttons',
      art: {
        type: 'sensor',
        alt: 'A four-button ioSmart transmitter opening a gate and a roller door from the car, and raising a panic alert',
        icon: 'fob',
        target: 'vehicle',
        label: 'ioSmart receiver',
        sub: 'Two or four buttons',
        coverage: 'Up to 150 m line of sight',
        events: [
          { text: 'Gate opened', sub: 'Button 1 · 07:42', tone: 'ok' },
          { text: 'Roller door', sub: 'Button 2 · 07:43', tone: 'ok' },
          { text: 'Panic alert', sub: 'Button 4 · 22:10', tone: 'alert' },
        ],
      },
      body: 'ioSmart wireless transmitters open gates, roller doors and boom gates from a car, and a button can be set aside as a panic or duress alert. Rolling codes stop the signal being copied, and the receiver wires into a KT controller like any other input.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Kantech makes',
  range: [
    {
      title: 'Controllers',
      items: ['KT-1 single-door controller', 'KT-2 two-door controller', 'KT-4 four-door controller with PoE and Wi-Fi', 'KT-NCC Gen 2 network gateway', 'Starter and expansion kits'],
    },
    {
      title: 'Readers and credentials',
      items: ['ioSmart smart card and multi-technology readers', 'ioProx proximity readers, cards, tags and stickers', 'ShadowProx and Indala proximity readers', 'Support for existing HID cards', 'EntraPass mobile credentials for phones and Apple Watch'],
    },
    {
      title: 'Software and apps',
      items: ['EntraPass Special, Corporate and Global Editions', 'EntraPass Web App', 'EntraPass Go and Go Install apps', 'Redundancy Server, Card Gateway, Active Directory and Video Vault'],
    },
    {
      title: 'Door hardware and wireless',
      items: ['ioSmart wireless receiver and transmitters', 'Electric strikes and electromagnetic locks', 'Input and output modules', 'Telephone entry systems', 'Salto wireless lock integration'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Kantech system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Readers, KT controllers, an Exacq recorder and an alarm panel report to EntraPass, which reaches the security desk, managers, staff and monitoring',
    columns: ['On site', 'Platform', 'People'],
    devices: [
      { label: 'ioSmart readers', sub: 'Card and phone', icon: 'reader' },
      { label: 'KT controllers', sub: 'KT-1, KT-2, KT-4', icon: 'switch' },
      { label: 'Exacq recorder', sub: 'Linked video', icon: 'camera' },
      { label: 'Alarm panel', sub: 'Partitions', icon: 'alarm' },
      { label: 'Transmitters', sub: 'Gates and panic', icon: 'fob' },
    ],
    platforms: [
      { label: 'EntraPass', sub: 'Three editions', icon: 'server' },
      { label: 'KT-NCC Gen 2', sub: 'Multi-site gateway', icon: 'switch' },
      { label: 'Web and Go apps', sub: 'Browser and phone', icon: 'phone' },
    ],
    people: [
      { label: 'Security desk', sub: 'EntraPass workstation', icon: 'laptop' },
      { label: 'Managers', sub: 'EntraPass Go app', icon: 'phone' },
      { label: 'Staff', sub: 'Card or phone', icon: 'person' },
      { label: 'Monitoring centre', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Doors, alarm partitions and video in one system, from a single door to many sites',
  },
  architectureCaption: 'Readers, KT controllers, an Exacq recorder and the alarm panel report to EntraPass, with KT-NCC Gen 2 gateways joining remote sites. Managers work from the desk or the EntraPass Go app, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Retail', 'Schools', 'Medical clinics', 'Apartment buildings', 'Warehousing and logistics', 'Local government', 'Car parks and depots'],

  teracomHeading: 'What Teracom does on a Kantech job',
  teracom: [
    { title: 'Design', body: 'Doors, controllers and readers planned from the site drawings, and the right setup chosen, standalone or EntraPass and which edition, before anything is ordered.' },
    { title: 'Install and commission', body: 'Controllers, readers and locks installed and wired, set up and tested door by door with the Go Install app, and access levels programmed before handover.' },
    { title: 'Connect to monitoring', body: 'Door and alarm events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Software updates, firmware, cards and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Kantech EntraPass software', href: 'https://www.kantech.com/software/entrapass-security-management-software' },
    { label: 'Kantech warranty and repair services', href: 'https://www.kantech.com/services-and-support/warranty-and-repair-services' },
    { label: 'EntraPass demo software', href: 'https://www.kantech.com/services-and-support/demo-software' },
  ],
};

export default kantech;