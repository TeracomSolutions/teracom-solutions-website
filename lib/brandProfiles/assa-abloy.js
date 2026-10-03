// The deeper ASSA ABLOY brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from assaabloy.com/au (October 2026); figures are
// ASSA ABLOY's own. Drawings are specs drawn by lib/brandArt.

const assaAbloy = {
  heroArt: {
    type: 'hero',
    alt: 'A wireless lock linked to Aperio and Incedo, accepting a card, blocking a lost electronic key and flagging a low battery',
    device: 'lock',
    left: { title: 'Aperio', sub: 'Wireless locks', foot: 'Hub to your access panel', icon: 'wifi' },
    right: { title: 'Incedo', sub: 'Business Cloud', foot: 'Run doors from anywhere', icon: 'cloud' },
    tags: [
      { text: 'Card accepted', tone: 'ok', icon: 'card' },
      { text: 'Key blocked', tone: 'alert', icon: 'key' },
      { text: 'Battery low', tone: 'warn', icon: 'battery' },
    ],
    chips: [
      { text: 'Wired or wireless', tone: 'accent' },
      { text: 'SCEC approved range', tone: 'ok' },
    ],
  },

  stats: [
    { value: '1994', label: 'the year ASSA in Sweden and Abloy in Finland merged' },
    { value: '~51,000', label: 'people working across the ASSA ABLOY group' },
    { value: '32 doors', label: 'and 1,000 people on Incedo Business Lite, which is free' },
    { value: 'SL4', label: 'top SCEC level reached by ABLOY and Lockwood approved products' },
  ],

  platformsEyebrow: 'Two ways to add electronic access',
  platformsHeading: 'Aperio into your system, or Incedo as the system',
  platformsIntro: 'Most of our ASSA ABLOY work starts with a door that needs control but has no cable to it. Aperio adds wireless locks to the access control you already run; Incedo is ASSA ABLOY’s own platform for sites starting fresh or wanting one maker for locks and software.',
  platforms: [
    {
      name: 'Aperio',
      kicker: 'Wireless locks for your panel',
      art: {
        type: 'network',
        alt: 'One Aperio hub linking six kinds of wireless lock, from escutcheons to padlocks, back to the access control panel',
        switchLabel: 'Aperio hub',
        switchSub: 'RS-485 to the access panel',
        ports: [
          { label: 'Escutcheon', icon: 'lock' },
          { label: 'Cylinder', icon: 'key' },
          { label: 'Handle', icon: 'door' },
          { label: 'Cabinet', icon: 'lock' },
          { label: 'Padlock', icon: 'lock' },
          { label: 'Strike', icon: 'door' },
        ],
        caption: 'Encrypted short-range radio from each lock to a hub wired to the panel',
      },
      body: 'Each Aperio lock carries its own reader and batteries and talks by encrypted short-range radio to a small hub. The hub wires to the existing access control panel, so every decision still comes from that system, live, and changes to someone’s access apply straight away.',
      points: [
        'Escutcheons, knob cylinders, handles and padlocks',
        'Cabinet locks and the 3773E sliding door lock',
        'Works with the RFID cards people already carry',
        'An open standard, so it suits panels from other makers',
      ],
    },
    {
      name: 'Incedo',
      kicker: 'ASSA ABLOY’s own platform',
      art: {
        type: 'cloud',
        alt: 'A head office, a warehouse and a gym with wired readers, Aperio locks and SMARTair doors, all run from Incedo Business Cloud in a browser or on a phone',
        title: 'Incedo Cloud',
        sub: 'Incedo Business Cloud',
        badge: 'Manage from anywhere',
        sites: [
          { label: 'Head office', sub: 'Wired readers', icon: 'reader' },
          { label: 'Warehouse', sub: 'Aperio locks', icon: 'lock' },
          { label: 'Gym', sub: 'SMARTair doors', icon: 'door' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'Phone', icon: 'phone' },
        ],
      },
      body: 'Locks, controllers and software from one maker. A Cluster Controller Module sits at the heart, with door reader modules and hubs around it, and wired doors and wireless locks are managed side by side. The software grows with the site rather than being replaced.',
      points: [
        'Incedo Business Lite: built in and free, up to 32 doors',
        'Incedo Business Plus when a site outgrows Lite',
        'Incedo Business Cloud for many sites and remote admin',
        'Runs Aperio, SMARTair and digital cam locks too',
      ],
    },
  ],

  capabilitiesEyebrow: 'Beyond the wired door',
  capabilitiesHeading: 'What the rest of the range does',
  capabilitiesIntro: 'ASSA ABLOY makes electronic locking for places a cabled reader never reaches: offices fitted out years ago, lockers, server racks and remote padlocks. These are the parts we specify most.',
  capabilities: [
    {
      title: 'SMARTair battery locks',
      art: {
        type: 'door',
        alt: 'A phone is accepted at a SMARTair door, with recent card and phone entries logged beside it',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Fob', icon: 'fob' },
        ],
        active: 1,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:05 Openow · L2', '07:52 Card · Gym', '07:31 Card updated', '07:10 Door locked'],
      },
      body: 'Escutcheons, cylinders, padlocks, cabinet locks and wall readers that run on batteries and read RFID cards or Bluetooth phones through the Openow app. A site can start offline and move to Update on Card or Wireless Online later, all under the same TS1000 software.',
    },
    {
      title: 'eCLIQ electronic keys',
      art: {
        type: 'keying',
        alt: 'CLIQ Web Manager at the top of a key tree, giving cleaners, contractors and managers access to different cylinders',
        top: 'CLIQ Web Manager',
        middle: ['Cleaners', 'Contractors', 'Managers'],
        leaves: ['Gate', 'Plant', 'Office', 'Comms', 'Store', 'Pump'],
        caption: 'Access rights live in each key and can change from day to day',
      },
      body: 'The battery sits in the key, not the door, and wakes the cylinder in about a tenth of a second. Keys carry access rights, time schedules and an audit trail, lost keys can be blocked, and holders update their keys at a wall programmer or through a paired phone.',
    },
    {
      title: 'Integral Wireless',
      art: {
        type: 'lock',
        alt: 'An Integral Wireless escutcheon opened up to show its card reader, AA batteries, mortice lock and programming cards',
        variant: 'electronic',
        parts: [
          { label: 'RFID reader' },
          { label: '4 x AA batteries', tone: 'ok' },
          { label: 'Mortice lock' },
          { label: 'Programming cards' },
        ],
        caption: 'Up to 60,000 operations on one set of batteries',
      },
      body: 'A standalone escutcheon with a proximity reader built in, set up with cards from a plug-in USB encoder. Wall readers, lift control, energy savers and a handheld NFC programmer can be added as the building needs them.',
    },
    {
      title: 'Server rack locks',
      art: {
        type: 'map',
        alt: 'A comms room plan with a KS210 lock on every rack door and one rack flagged for tamper',
        markers: [
          { x: 10, y: 22, icon: 'reader', label: 'Comms door' },
          { x: 44, y: 18, icon: 'lock', label: 'Rack A1' },
          { x: 62, y: 18, icon: 'lock', label: 'Rack A2' },
          { x: 82, y: 22, icon: 'lock', tone: 'alert', label: 'Tamper' },
          { x: 44, y: 76, icon: 'lock', label: 'Rack B1' },
          { x: 62, y: 76, icon: 'lock', label: 'Rack B2' },
          { x: 88, y: 80, icon: 'camera', label: 'Camera' },
        ],
        caption: 'A KS210 on every rack, on OSDP',
      },
      body: 'The KS210 fits standard server cabinet cut-outs and joins the access control system over OSDP, reading HID cards or phones and reporting tamper, cam rotation and locked state for each rack door.',
    },
    {
      title: 'Digital cam locks',
      art: {
        type: 'panel',
        alt: 'A PIN keypad on a locker bank, with lockers in use on private or shared codes and others free',
        mode: 'Locker 12',
        modeTone: 'ok',
        status: 'Enter your PIN',
        zones: [
          { name: 'Locker 11', state: 'secure', label: 'Private code' },
          { name: 'Locker 12', state: 'open', label: 'Free' },
          { name: 'Locker 13', state: 'secure', label: 'Public code' },
          { name: 'Locker 14', state: 'open', label: 'Free' },
          { name: 'Locker 15', state: 'secure', label: 'Private code' },
          { name: 'Locker 16', state: 'bypassed', label: 'Battery LED on' },
        ],
      },
      body: 'The ML55PA PIN keypad cam lock suits lockers and cabinets in schools, offices and gyms. It runs either one private code or a code the user sets each time, like a hotel safe, on three AAA batteries with a USB back-up.',
    },
    {
      title: 'SCEC approved locking',
      art: {
        type: 'storage',
        alt: 'Three SCEC security levels, from high threat padlocks down to low threat cabinet locks, with SL4 highlighted',
        tiers: [
          { label: 'SL4 high threat', sub: 'Lockwood high security padlocks', icon: 'shield' },
          { label: 'SL3 medium threat', sub: 'ABLOY deadbolts and Lockwood MT5', icon: 'lock' },
          { label: 'SL1 low threat', sub: 'ABLOY Protec2 cabinet and cam locks', icon: 'key' },
        ],
        active: 0,
        stat: 'SL4',
        statLabel: 'Highest SCEC level',
        badge: 'SEEPL listed',
        points: ['Evaluated for SCEC', 'For Commonwealth sites', 'ABLOY and Lockwood'],
        caption: 'Approved locking from padlocks to electric strikes',
      },
      body: 'For Commonwealth sites, ABLOY and Lockwood products are evaluated and listed for the security level each area needs, from SL4 padlocks through SL3 deadbolts, cylinders, electric strikes and mortice locks to SL1 cabinet locks.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What ASSA ABLOY makes',
  range: [
    {
      title: 'Wireless access control',
      items: ['Aperio escutcheons, cylinders and handles', 'SMARTair i-max, i-gate and i-reader', 'Integral Wireless escutcheons and encoders', 'Incedo controllers and door modules'],
    },
    {
      title: 'Keys and cabinets',
      items: ['eCLIQ cylinders, padlocks and cam locks', 'CLIQ Web Manager and CLIQ Go', 'ML55PA digital cam locks', 'KS210 server cabinet locks'],
    },
    {
      title: 'Electromechanical',
      items: ['ES8100 V-Lock', 'Glass door brackets for swing-through doors', 'Egress buttons and actuators', 'Trimec strikes, maglocks and bolts'],
    },
    {
      title: 'Brands in Australia',
      items: ['Lockwood', 'ABLOY high security', 'Yale', 'Traka asset control', 'PC Henderson, Whitco and Lorient'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom ASSA ABLOY system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Wireless locks, wired readers, eCLIQ cylinders and rack locks report to Incedo, an access panel or CLIQ Web Manager, used by managers, staff and monitoring',
    devices: [
      { label: 'Aperio locks', sub: 'Doors and cabinets', icon: 'lock' },
      { label: 'SMARTair doors', sub: 'Offline or online', icon: 'door' },
      { label: 'Wired readers', sub: 'Incedo door modules', icon: 'reader' },
      { label: 'eCLIQ cylinders', sub: 'Powered by the key', icon: 'key' },
      { label: 'Rack locks', sub: 'KS210 on OSDP', icon: 'server' },
    ],
    platforms: [
      { label: 'Incedo Business', sub: 'Lite, Plus or Cloud', icon: 'cloud' },
      { label: 'Access panel', sub: 'Aperio hubs, OSDP', icon: 'server' },
      { label: 'CLIQ Web Manager', sub: 'Key rights and audits', icon: 'key' },
    ],
    people: [
      { label: 'Facility manager', sub: 'Browser or desktop', icon: 'laptop' },
      { label: 'Staff and visitors', sub: 'Card, fob or phone', icon: 'person' },
      { label: 'Monitoring centre', sub: 'Forced and held doors', icon: 'headset' },
    ],
    footer: 'Wired doors, wireless locks, electronic keys and rack locks, run through Incedo, your own panel or CLIQ',
  },
  architectureCaption: 'Wireless locks, wired readers, electronic keys and rack locks report to Incedo, to the access control panel you already have through Aperio hubs, or to CLIQ Web Manager. Managers work from a browser, staff use a card or phone, and door alarms can come through to our monitoring centre.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Schools and universities', 'Healthcare', 'Government', 'Hospitality', 'Mining', 'Data centres', 'Retail'],

  teracomHeading: 'What Teracom does on an ASSA ABLOY job',
  teracom: [
    { title: 'Specify', body: 'Each door surveyed and matched to Aperio, SMARTair, eCLIQ or wired hardware, based on the door, how busy it is and the system you already run.' },
    { title: 'Install and commission', body: 'Locks fitted, hubs placed within radio range, credentials enrolled and every door tested before handover.' },
    { title: 'Integrate and monitor', body: 'Wireless doors linked into your access control platform, with forced and held-open door alarms able to come through to our monitoring centre.' },
    { title: 'Service', body: 'Battery changes, firmware, key updates and credential changes handled on a maintenance plan.' },
  ],

  links: [
    { label: 'ASSA ABLOY Australia catalogue centre', href: 'https://www.assaabloy.com/au/en/resources/catalogue-centre' },
    { label: 'Aperio wireless locking', href: 'https://www.assaabloy.com/au/en/solutions/products/aperio-technology' },
    { label: 'Incedo access control platform', href: 'https://www.assaabloy.com/au/en/solutions/topics/access-control/incedo' },
  ],
};

export default assaAbloy;