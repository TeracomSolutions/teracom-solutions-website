// The deeper Akuvox brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from akuvox.com, akuvoxsmartplus.com and
// smartaccess.akuvox.com (October 2026); figures are Akuvox’s own.
// Drawings are specs drawn by lib/brandArt.

const akuvox = {
  heroArt: {
    type: 'hero',
    alt: 'An Akuvox door phone recognising a visitor at the gate and calling the resident’s SmartPlus app, which opens the door',
    device: 'reader',
    left: { title: 'Visitor', sub: 'At the gate', foot: 'Face, PIN, card or QR', icon: 'person' },
    right: { title: 'SmartPlus', sub: 'Resident app', foot: 'Video call, open door', icon: 'phone' },
    tags: [
      { text: 'Face matched', tone: 'ok', icon: 'face' },
      { text: 'Call answered', tone: 'ok', icon: 'phone' },
      { text: 'Door released', tone: 'accent', icon: 'door' },
    ],
    chips: [
      { text: 'SIP and Android', tone: 'accent' },
      { text: 'ISO/IEC 27001', tone: 'ok' },
    ],
  },

  stats: [
    { value: '80+', label: 'countries and regions where Akuvox intercoms are in daily use' },
    { value: '15+', label: 'ways to open the door on the S539 Android door phone' },
    { value: '300 m', label: 'between devices on the 2-wire IP intercom, over existing cable' },
    { value: 'ISO 27001', label: 'certified, plus ISO/IEC 27701 and CSA STAR Level 1' },
  ],

  platformsEyebrow: 'Two halves of one system',
  platformsHeading: 'Door phones on the wall, SmartPlus in the cloud',
  platformsIntro: 'Akuvox door phones and indoor monitors talk SIP, the standard behind IP phone systems, so they can call each other, phones and other systems. SmartPlus then puts the intercom in each resident’s or staff member’s pocket and lets the property manager run every door from a browser.',
  platforms: [
    {
      name: 'Door phones and indoor monitors',
      kicker: 'SIP intercom hardware',
      art: {
        type: 'door',
        alt: 'An Akuvox door phone accepting a face, a card, a PIN or a QR code and releasing the lobby door, with recent entries listed',
        credentials: [
          { label: 'Face', icon: 'face' },
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'key' },
          { label: 'QR code', icon: 'phone' },
        ],
        active: 0,
        result: 'Door released',
        resultTone: 'ok',
        log: ['08:02 Face · Lobby', '07:55 Card · Gate', '07:41 QR · Visitor', '07:30 PIN · Garage'],
      },
      body: 'Video door phones from the palm-sized R20K keypad unit to the 13-inch X916, with Android indoor monitors in each apartment or office. Most door phones read 13.56 MHz and 125 kHz cards, and the larger models add touch screens, face recognition and Bluetooth.',
      points: [
        'S539, X915 and X916 Android door phones with touch screens',
        'R29 and E18 door phones with face recognition',
        'R20K compact keypad door phone, rated for outdoor use',
        'S567 10-inch Android 12 indoor monitor with Wi-Fi 6',
      ],
    },
    {
      name: 'SmartPlus',
      kicker: 'App and cloud',
      art: {
        type: 'mobile',
        alt: 'A SmartPlus call from the front gate door phone, with buttons to open the door or send the visitor a QR key',
        app: 'SmartPlus',
        icon: 'person',
        tone: 'accent',
        notice: 'Front gate',
        sub: 'Video call from R29',
        time: 'Today 5:42 pm',
        actions: ['Open door', 'Send QR key'],
        side: [
          { label: 'Preview', sub: 'Before answer', icon: 'camera' },
          { label: 'Virtual key', sub: 'QR or PIN', icon: 'key' },
          { label: 'Logs', sub: 'Photo of entry', icon: 'chart' },
        ],
      },
      body: 'The SmartPlus app and cloud portal let residents see and talk to visitors, open doors and send guests time-limited keys. Property managers run access, logs and firmware updates for many buildings from a web portal, and residents without a smartphone can still answer on an ordinary phone call.',
      points: [
        'Video calls and door release from the phone',
        'Time-limited QR codes and guest PINs',
        'Door release logs with a photo of each entry',
        'Web portal for access across many sites',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'More than a buzzer at the gate',
  capabilitiesIntro: 'An Akuvox intercom is also a door controller, a credential reader and a link to cameras and alarms. These are the features our customers use most.',
  capabilities: [
    {
      title: 'Face recognition at the door',
      art: {
        type: 'search',
        alt: 'A face at the lobby door checked against the enrolled residents on the door phone itself, with one match found',
        query: 'Face at the lobby door, 8:02 am',
        badge: '1 match',
        results: [
          { label: 'Resident 4B', score: 'Match', highlight: true },
          { label: 'Resident 2A', score: 'No' },
          { label: 'Cleaner', score: 'No' },
          { label: 'Manager', score: 'No' },
        ],
        caption: 'The R29 matches faces on the device, with no cloud lookup',
      },
      body: 'The R29 and other face recognition models match a face against enrolled users on the door phone itself, so the door still opens when the internet is down. Touchless entry suits busy lobbies and staff with full hands.',
    },
    {
      title: 'Phones as keys',
      art: {
        type: 'lock',
        alt: 'A door phone opened up to show a Bluetooth credential, AES-256 encryption, wave-to-unlock and logging to ACMS',
        variant: 'electronic',
        parts: [
          { label: 'Bluetooth credential', tone: 'accent' },
          { label: 'AES-256 encrypted', tone: 'ok' },
          { label: 'Wave to unlock', tone: 'accent' },
          { label: 'Logged in ACMS', tone: 'muted' },
        ],
        caption: 'My MobileKey turns a phone into an encrypted door key',
      },
      body: 'My MobileKey is a Bluetooth credential for Akuvox door phones: wave the phone at the reader or tap the app to open the door. The credential is AES-256 encrypted and ties in with the ACMS access control software.',
    },
    {
      title: 'Upgrading old 2-wire intercoms',
      art: {
        type: 'network',
        alt: 'An NS-2 switch carrying video intercom over an old building’s existing 2-wire cable to a door phone and four apartment monitors',
        uplink: 'Building',
        switchLabel: 'NS-2 2-wire switch',
        switchSub: 'Old cable, up to 300 m',
        ports: [
          { label: 'R20A-2', icon: 'reader' },
          { label: 'Unit 1', icon: 'phone' },
          { label: 'Unit 2', icon: 'phone' },
          { label: 'Unit 3', icon: 'phone' },
          { label: 'Unit 4', icon: 'phone' },
        ],
        caption: 'Video calls and app access without rewiring the building',
      },
      body: 'The 2-wire IP range reuses an old building’s audio intercom cable, so apartments gain video calls and app access without rewiring. Devices can sit up to 300 m apart, and the NS-2 switch extends the system for larger blocks.',
    },
    {
      title: 'Smart Access for offices',
      art: {
        type: 'dashboard',
        alt: 'The Smart Access portal for an office showing staff on site, visitors, doors and late arrivals, with recent events',
        title: 'Smart Access · Office',
        tiles: [
          { label: 'Staff on site', value: '42', tone: 'ok' },
          { label: 'Visitors today', value: '6', tone: 'accent' },
          { label: 'Doors online', value: '8/8', tone: 'ok' },
          { label: 'Late arrivals', value: '3', tone: 'warn' },
        ],
        bars: [5, 18, 36, 41, 42, 40, 38, 12],
        chart: 'People on site',
        eventsTitle: 'Recent events',
        events: [
          { text: 'QR key used · Visitor', tone: 'accent' },
          { text: 'Face entry · Level 2', tone: 'ok' },
          { text: 'Shift report ready', tone: 'muted' },
        ],
      },
      body: 'Smart Access runs door access and intercom for small and medium businesses from one cloud portal or app. Staff can use faces, fingerprints, cards, PINs, phones or an Apple Watch, visitors get QR keys, and time and attendance is built in.',
    },
    {
      title: 'Emergency unlock',
      art: {
        type: 'map',
        alt: 'An office floor plan with every Akuvox-controlled door released during a fire alarm and staff alerted by the app',
        markers: [
          { x: 12, y: 20, icon: 'door', tone: 'ok', label: 'Front' },
          { x: 50, y: 15, icon: 'door', tone: 'ok', label: 'Lobby' },
          { x: 85, y: 25, icon: 'door', tone: 'ok', label: 'Fire exit' },
          { x: 20, y: 75, icon: 'door', tone: 'ok', label: 'Store' },
          { x: 60, y: 60, icon: 'alarm', tone: 'alert', label: 'Fire alarm' },
          { x: 88, y: 80, icon: 'door', tone: 'ok', label: 'Rear' },
          { x: 40, y: 45, icon: 'phone', tone: 'accent', label: 'Staff app' },
        ],
        caption: 'Emergency: all doors released, muster on',
      },
      body: 'In an emergency Smart Access unlocks every door, sends an alert to staff phones and produces a muster report so administrators can check who is still inside.',
    },
    {
      title: 'Run it on site',
      art: {
        type: 'onPrem',
        alt: 'Door phones, monitors, access terminals and cameras managed by Akuvox ACMS and SDMC software on a server in the building',
        devices: [
          { label: 'Door phones', icon: 'reader' },
          { label: 'Monitors', icon: 'phone' },
          { label: 'Terminals', icon: 'card' },
          { label: 'Cameras', icon: 'camera' },
        ],
        server: 'ACMS / SDMC',
        badge: 'On-premise option',
        title: 'Managed on site',
        sub: 'Access and intercom on PC',
        points: ['Batch deployment', 'Live video', 'Full access logs'],
      },
      body: 'Where a site would rather not use the cloud, ACMS and ACMS Pro manage staff, doors and access logs on a local PC, and SDMC manages a whole community’s intercoms with batch deployment, live video and notices to residents.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Akuvox makes',
  range: [
    {
      title: 'Door phones',
      items: ['S539, X915 and X916 Android door phones', 'R29 and E18 face recognition door phones', 'R20K compact keypad door phone', 'SIP emergency and single-button intercoms'],
    },
    {
      title: 'Indoor monitors',
      items: ['S567 10-inch Android 12 monitor with Wi-Fi 6', 'X933, and the 15.6-inch X937 that also shows NVR video', 'C313 compact 7-inch monitor and other S and C-series models'],
    },
    {
      title: 'Access control',
      items: ['A08 terminal with QR, NFC and Bluetooth', 'Other A-series access control units', 'UHF long-range readers for vehicle gates', 'MIFARE key fobs and cards'],
    },
    {
      title: 'Software and 2-wire',
      items: ['SmartPlus app and cloud portal', 'Smart Access cloud for offices', 'ACMS, ACMS Pro and SDMC on-premise software', 'My MobileKey Bluetooth credential', '2-wire kits with the R20A-2 and NS-2 switch'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Akuvox system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Door phones, access terminals, indoor monitors and cameras connect to SmartPlus in the cloud or ACMS on site, used by residents, managers and Teracom',
    devices: [
      { label: 'Door phones', sub: 'Face, card, PIN, QR', icon: 'reader' },
      { label: 'Access terminals', sub: 'A08 on inner doors', icon: 'card' },
      { label: 'Indoor monitors', sub: 'Each apartment', icon: 'phone' },
      { label: 'IP cameras', sub: 'Shown on monitors', icon: 'camera' },
    ],
    platforms: [
      { label: 'SmartPlus cloud', sub: 'Calls, keys and logs', icon: 'cloud' },
      { label: 'ACMS or SDMC', sub: 'On-site management', icon: 'server' },
    ],
    people: [
      { label: 'Residents', sub: 'Answer and open', icon: 'phone' },
      { label: 'Property manager', sub: 'Web portal', icon: 'laptop' },
      { label: 'Teracom', sub: 'Install and support', icon: 'headset' },
    ],
    footer: 'SIP door phones and monitors, managed in the cloud with SmartPlus or on site with ACMS and SDMC',
  },
  architectureCaption: 'Door phones and access terminals control the entries, indoor monitors and the SmartPlus app answer the calls, and cameras can be shown on the monitors. The property manager runs access from a browser, and we look after the system.',

  industriesHeading: 'Where we put it to work',
  industries: ['Apartment buildings', 'Townhouse developments', 'Single homes', 'Commercial offices', 'Coworking spaces', 'Retail stores', 'Aged care and hospitals'],

  teracomHeading: 'What Teracom does on an Akuvox job',
  teracom: [
    { title: 'Design', body: 'Door phones, monitors and credentials chosen for each entry, with the choice between new cabling and reusing 2-wire cable made before anything is ordered.' },
    { title: 'Install and commission', body: 'Door phones and monitors mounted and wired to the locks, SIP calling tested, and residents or staff set up in SmartPlus or ACMS.' },
    { title: 'Integrate', body: 'Cameras shown on the indoor monitors, and the intercom tied in with the site’s access control and alarm system where needed.' },
    { title: 'Look after it', body: 'Firmware, user changes and faults handled on a maintenance plan, with most changes made remotely through the portal.' },
  ],

  links: [
    { label: 'Akuvox intercom software', href: 'https://www.akuvox.com/productsSoftwareForIntercom' },
    { label: 'Akuvox security and compliance', href: 'https://www.akuvox.com/securitycompliance/overview' },
    { label: 'Akuvox warranty and RMA', href: 'https://www.akuvox.com/warranty-and-rma' },
  ],
};

export default akuvox;