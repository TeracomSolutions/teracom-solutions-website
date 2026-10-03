// The deeper HID brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from hidglobal.com and mercury-security.com
// (October 2026); figures are HID's own. Drawings are specs drawn by
// lib/brandArt.

const hid = {
  heroArt: {
    type: 'hero',
    alt: 'A Signo reader at the centre taking Seos cards, phones and fingerprints and passing each decision to a Mercury controller over OSDP',
    device: 'reader',
    left: { title: 'Seos', sub: 'Cards, phones', foot: 'Mutual authentication', icon: 'card' },
    right: { title: 'Mercury', sub: 'Controller', foot: 'OSDP secure channel', icon: 'server' },
    tags: [
      { text: 'Phone accepted', tone: 'ok', icon: 'phone' },
      { text: 'Finger matched', tone: 'accent', icon: 'person' },
      { text: 'Card denied', tone: 'alert', icon: 'card' },
    ],
    chips: [
      { text: '15+ credential types', tone: 'accent' },
      { text: 'Keys in secure element', tone: 'ok' },
    ],
  },

  stats: [
    { value: '2 billion', label: 'identities supported by HID technology every year' },
    { value: '15+', label: 'credential technologies read natively by Signo readers' },
    { value: '5 million+', label: 'Mercury controllers sold, the largest installed base in the industry' },
    { value: '4,000+', label: 'integrator and consultant partners around the world' },
  ],

  platformsEyebrow: 'The two halves of it',
  platformsHeading: 'Signo on the wall, Seos in your hand',
  platformsIntro: 'HID makes the reader at the door and the credential people carry, and the two are built to trust each other. Both sit under the access control system you already run, so the choice is about how people get in, not about changing platforms.',
  platforms: [
    {
      name: 'HID Signo readers',
      kicker: 'Readers',
      art: {
        type: 'door',
        alt: 'A Seos card, a phone, a Seos fob and a PIN offered at a Signo reader, with the phone opening the door and the event logged',
        credentials: [
          { label: 'Seos card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Seos fob', icon: 'fob' },
          { label: 'PIN', icon: 'pin' },
        ],
        active: 1,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:14 Phone, L3', '08:09 Card, Foyer', '07:52 Fob, Dock', '07:40 PIN, Plant'],
      },
      body: 'One reader that takes cards, fobs, phones and watches, so a site can change credentials without changing the hardware on every door. The keys sit in certified secure element hardware, and each reader can be updated and reconfigured without a technician standing in front of it.',
      points: [
        'Bluetooth and NFC built in, with Apple Wallet support',
        'OSDP for an encrypted two-way link to the controller, with Wiegand still available',
        'Surface detection retunes read range for the wall it is mounted on',
        'Mullion, wall switch, keypad, flush décor and fingerprint models',
      ],
    },
    {
      name: 'HID Seos and Mobile Access',
      kicker: 'Credentials',
      art: {
        type: 'cloud',
        alt: 'Badges issued to phones and watches from the cloud and used at the head office, the car park and a branch',
        title: 'Mobile Access',
        sub: 'Badges issued to phones',
        badge: 'Revoke a badge instantly',
        sites: [
          { label: 'Head office', sub: 'Signo readers', icon: 'door' },
          { label: 'Car park', sub: 'Boom gate', icon: 'vehicle' },
          { label: 'Branch', sub: 'iCLASS SE', icon: 'reader' },
        ],
        clients: [
          { label: 'Phone', icon: 'phone' },
          { label: 'Watch', icon: 'person' },
        ],
      },
      body: 'Seos is HID\'s current credential technology. Card and reader prove themselves to each other before anything is read, and the identity data has its own protective layer on top of the card. The same identity can live on a card, a fob, or a phone in an app or a digital wallet.',
      points: [
        'Seos cards, fobs and clamshells, including a bamboo card in place of PVC',
        'Combination cards carry Seos alongside Prox, iCLASS, MIFARE or DESFire',
        'Mobile badges in the HID app, Apple Wallet or Google Wallet',
        'Installed Signo and iCLASS SE readers can use existing Seos keys',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Getting the right people through the door',
  capabilitiesIntro: 'HID gear is usually the part of an access system people touch every day. These are the features that make the biggest difference on our jobs.',
  capabilities: [
    {
      title: 'Your badge in your wallet',
      art: {
        type: 'mobile',
        alt: 'A staff badge ready in the phone wallet, used with a tap of an iPhone, an Android phone or a watch',
        app: 'Staff badge',
        icon: 'card',
        tone: 'accent',
        notice: 'Badge ready',
        sub: 'Tap phone or watch',
        time: 'No app to open',
        actions: ['Add to Wallet', 'Use HID app'],
        side: [
          { label: 'iPhone', sub: 'Apple Wallet', icon: 'phone' },
          { label: 'Android', sub: 'Google Wallet', icon: 'phone' },
          { label: 'Watch', sub: 'Tap to enter', icon: 'person' },
        ],
      },
      body: 'Staff carry their badge in the phone or watch they already own. It works through the HID app or straight from Apple Wallet or Google Wallet with one tap, and a lost phone is dealt with by revoking the badge rather than chasing a plastic card.',
    },
    {
      title: 'OSDP instead of Wiegand',
      art: {
        type: 'network',
        alt: 'A Mercury controller feeding Signo readers, a keypad reader, a fingerprint reader, a lock and a door contact over OSDP',
        uplink: 'Access sys',
        switchLabel: 'Mercury controller',
        switchSub: 'OSDP secure channel',
        ports: [
          { label: 'Signo 20', icon: 'reader', tone: 'ok' },
          { label: 'Signo 40K', icon: 'pin', tone: 'ok' },
          { label: 'Signo 25B', icon: 'person', tone: 'ok' },
          { label: 'Door lock', icon: 'lock', tone: 'ok' },
          { label: 'Reed', icon: 'sensor', tone: 'ok' },
          { label: 'Tamper', icon: 'alarm', tone: 'alert' },
        ],
        caption: 'Readers talk both ways to the controller over an encrypted channel',
      },
      body: 'Old Wiegand wiring sends card data one way and in the clear. Every Signo reader speaks OSDP, which encrypts the link to the controller, lets the controller watch the reader, and allows settings and firmware to be pushed down the same cable.',
    },
    {
      title: 'Fingerprint at the door',
      art: {
        type: 'search',
        alt: 'A fingerprint at a lab door is checked against every enrolled template and one strong match opens the door',
        query: 'Fingerprint · Lab entry · 1:N identification',
        badge: '1 match',
        results: [
          { label: 'Staff 0412', score: '98%', highlight: true },
          { label: 'Staff 1187', score: '21%' },
          { label: 'Staff 0093', score: '12%' },
          { label: 'Contractor 77', score: '8%' },
        ],
        caption: 'Signo 25B compares the finger against enrolled templates',
      },
      body: 'The Signo Biometric Reader 25B adds a fingerprint to a card or phone for two-factor entry, or replaces the card altogether. Templates can sit on the card or on the reader, and it can check one person or pick the person out of everyone enrolled.',
    },
    {
      title: 'Every reader from one desk',
      art: {
        type: 'dashboard',
        alt: 'An HID Linq screen showing a building of Signo readers mostly on current firmware, with two still updating',
        title: 'HID Linq · Signo fleet',
        tiles: [
          { label: 'Signo readers', value: '48', tone: 'accent' },
          { label: 'Up to date', value: '46', tone: 'ok' },
          { label: 'Updating', value: '2', tone: 'warn' },
          { label: 'Mobile ready', value: '48', tone: 'ok' },
        ],
        bars: [6, 8, 7, 9, 6, 5, 4, 3],
        chart: 'Readers per floor',
        eventsTitle: 'Rollout',
        events: [
          { text: 'Level 5 updated', tone: 'ok' },
          { text: 'Level 6 updated', tone: 'ok' },
          { text: 'Level 7 in progress', tone: 'warn' },
          { text: 'Config backed up', tone: 'ok' },
        ],
      },
      body: 'HID Linq updates firmware and settings on many Signo readers at once, through Mercury controllers over OSDP or on the bench before install. It runs in the cloud or on site, and the HID Reader Manager app covers single readers from a phone.',
    },
    {
      title: 'Moving off old cards',
      art: {
        type: 'map',
        alt: 'A floor plan mid-upgrade, with most doors on Signo readers and two older Prox readers still to be replaced',
        markers: [
          { x: 12, y: 24, icon: 'reader', tone: 'ok', label: 'Foyer' },
          { x: 38, y: 72, icon: 'reader', tone: 'ok', label: 'Lift lobby' },
          { x: 60, y: 24, icon: 'reader', tone: 'ok', label: 'Office' },
          { x: 50, y: 50, icon: 'reader', tone: 'ok', label: 'Comms rm' },
          { x: 86, y: 72, icon: 'reader', tone: 'warn', label: 'Dock' },
          { x: 86, y: 20, icon: 'vehicle', tone: 'warn', label: 'Car park' },
        ],
        caption: 'Seos + Prox cards open old and new doors',
      },
      body: 'Few sites can swap every reader and card in one weekend. Combination cards carry Seos alongside the old Prox, iCLASS or DESFire technology, so people use one card on old and new readers while doors are upgraded in stages.',
    },
    {
      title: 'One card, more than doors',
      art: {
        type: 'door',
        alt: 'A Seos card used through the day at the front door, a computer login, the print room and the café',
        credentials: [
          { label: 'Seos card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Seos fob', icon: 'fob' },
        ],
        active: 0,
        result: 'Print released',
        resultTone: 'ok',
        log: ['08:01 Front door', '08:05 PC login', '09:12 Print room', '12:30 Café'],
      },
      body: 'Seos was designed to reach past the door. The same credential can release secure printing, record time and attendance, pay at vending machines and log people on to the network, so staff carry one card or phone for all of it.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What HID makes for access control',
  range: [
    {
      title: 'Readers',
      items: ['HID Signo 20 and 40 readers, and the flush Décor 30', 'Signo keypad readers 20K, 40K and 40T', 'Signo Biometric Reader 25B', 'iCLASS SE readers, including long-range models'],
    },
    {
      title: 'Credentials',
      items: ['Seos cards, fobs and clamshells', 'Seos + Prox, iCLASS, MIFARE and DESFire cards', 'Seos Bamboo eco card', 'HID Mobile Access in an app, Apple Wallet or Google Wallet'],
    },
    {
      title: 'Controllers',
      items: ['HID Mercury MP and LP intelligent controllers', 'Mercury MR series 4 reader and I/O panels', 'HID Aero controllers and modules', 'VertX EVO and EDGE EVO'],
    },
    {
      title: 'Management and printing',
      items: ['HID Linq reader management, cloud or on site', 'HID Reader Manager app', 'HID Biometric Manager', 'FARGO ID card printers'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom HID system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Signo readers and Seos credentials at the door report through Mercury controllers to the access system, which reaches the desk, staff and monitoring',
    columns: ['At the door', 'Behind it', 'People'],
    devices: [
      { label: 'Signo readers', sub: 'Card, phone, finger', icon: 'reader' },
      { label: 'Seos credentials', sub: 'Card, fob, wallet', icon: 'card' },
      { label: 'Door hardware', sub: 'Lock, reed, REX', icon: 'door' },
    ],
    platforms: [
      { label: 'Mercury', sub: 'Controllers on OSDP', icon: 'server' },
      { label: 'Access software', sub: 'The platform you run', icon: 'shield' },
      { label: 'HID Linq', sub: 'Reader updates', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Events and alarms', icon: 'laptop' },
      { label: 'Staff', sub: 'Badge in the wallet', icon: 'phone' },
      { label: 'Monitoring centre', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Readers and credentials that trust each other, under the access control platform you already run',
  },
  architectureCaption: 'Signo readers and Seos credentials sit at the door and report over OSDP to Mercury controllers and your access control software. Staff use cards or phones, the desk sees every event, and door alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Schools and universities', 'Healthcare', 'Government', 'Data centres', 'Multi-tenant buildings', 'Manufacturing and logistics', 'Hospitality'],

  teracomHeading: 'What Teracom does on an HID job',
  teracom: [
    { title: 'Design', body: 'Reader models chosen door by door, and a credential plan worked out, cards, phones or both, including how to move off older cards without locking anyone out.' },
    { title: 'Install and commission', body: 'Readers mounted and wired on OSDP, keys and settings loaded, and every door tested with each credential type before handover.' },
    { title: 'Connect to the system', body: 'Readers brought into your access control platform, and forced or held door alarms passed through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware kept current across the reader fleet, cards and mobile badges supplied as staff come and go, and faults fixed on a maintenance plan.' },
  ],

  links: [
    { label: 'HID Signo readers', href: 'https://www.hidglobal.com/product-mix/signo-readers' },
    { label: 'HID document library', href: 'https://www.hidglobal.com/documents' },
    { label: 'HID drivers and downloads', href: 'https://www.hidglobal.com/drivers' },
  ],
};

export default hid;