// The deeper Lockwood brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from lockweb.com.au (October 2026); figures are
// Lockwood's own. Drawings are specs drawn by lib/brandArt.

const lockwood = {
  heroArt: {
    type: 'hero',
    alt: 'A Lockwood key between restricted keying and monitored electric locks, with a door deadlatched, a key override and a door left open',
    device: 'key',
    left: { title: 'Keying', sub: 'TWIN X · MT5', foot: 'Patented restricted keys', icon: 'key' },
    right: { title: 'Electric', sub: 'Mortice locks', foot: 'Reports to the panel', icon: 'lock' },
    tags: [
      { text: 'Deadlatched', tone: 'ok', icon: 'lock' },
      { text: 'Key override', tone: 'warn', icon: 'key' },
      { text: 'Door open', tone: 'alert', icon: 'door' },
    ],
    chips: [
      { text: 'Made here since 1934', tone: 'accent' },
      { text: 'Restricted keying', tone: 'ok' },
    ],
  },

  stats: [
    { value: '1934', label: 'Australian made since, with a production facility in Melbourne' },
    { value: '2036', label: 'patent protection in Australia for TWIN X restricted keys' },
    { value: 'SL3', label: 'SCEC endorsement for the 3570 series electric mortice lock' },
    { value: '2 hours', label: 'fire testing on fire doorsets for the Cortex digital lockset' },
  ],

  platformsEyebrow: 'Two sides of a Lockwood door',
  platformsHeading: 'The key in the cylinder, and the lock that talks to the panel',
  platformsIntro: 'On an access control job, Lockwood usually turns up twice: the restricted key system that controls who can copy a key, and the electric mortice lock that the reader releases. We plan both together so the keyed override and the card reader never work against each other.',
  platforms: [
    {
      name: 'Keying platforms',
      kicker: 'Restricted keys',
      art: {
        type: 'keying',
        alt: 'A master key system with a grand master at the top, three building keys below and individual room keys at the bottom',
        top: 'Grand master',
        middle: ['Admin', 'Plant', 'Stores'],
        leaves: ['Office', 'Foyer', 'Boiler', 'Pump', 'Dock', 'Cage'],
        caption: 'Restricted keyways, so copies come only from authorised dealers',
      },
      body: 'Restricted key systems where the blanks are controlled and patents stop copying. Master key systems are first assembled by ASSA ABLOY Australia, and the records can then sit with an authorised service centre, which only cuts keys on a signatory’s say-so.',
      points: [
        'TWIN X: six pins plus a three-pin sidebar, patented to 2036',
        'MT5 and MT5+ for high security restricted keying',
        'GEN6T and GEN6TX for economical key control',
        'Twelve colour-coded key heads to tell keys apart',
      ],
    },
    {
      name: 'Electric mortice locks',
      kicker: 'For access control',
      art: {
        type: 'lock',
        alt: 'A 3570 electric mortice lock opened up to show its key override monitor, door position reed, fail mode setting and request-to-exit switch',
        variant: 'electronic',
        parts: [
          { label: 'Key override monitor' },
          { label: 'Door position reed' },
          { label: 'Fail safe or secure', tone: 'ok' },
          { label: 'Request to exit' },
        ],
        caption: '3570 series: 12 to 24 V DC, SCEC endorsed SL3',
      },
      body: 'Locks that take their orders from the access control system and report back: whether the door is shut, whether it is deadlatched and locked, and whether someone used a key instead of a card. Fail safe or fail secure is set on site.',
      points: [
        '3570 series in 60, 89 and 127 mm backsets',
        'Selector 3782EL for narrow stile aluminium doors',
        'SL8 security and D8 durability on the 3570',
        'Padde series electric strikes and bolts',
      ],
    },
  ],

  capabilitiesEyebrow: 'On the door',
  capabilitiesHeading: 'What the hardware actually does',
  capabilitiesIntro: 'Lockwood hardware rarely gets noticed until a door fails to lock or will not let people out. These are the features we rely on to make sure neither happens.',
  capabilities: [
    {
      title: 'Readers on both sides',
      art: {
        type: 'door',
        alt: 'With power lost, the outside of a Selector door stays locked while the inside still lets people out',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'pin' },
          { label: 'Inside', icon: 'person' },
        ],
        active: 2,
        result: 'Free egress',
        resultTone: 'ok',
        log: ['Power lost 02:14', 'Outside: locked', 'Inside: releases', 'Selector 3782EL'],
      },
      body: 'Where a door has a reader on each side, the Selector 3782EL can keep the outside locked when power drops while the inside still releases, so the room stays secure and people can always get out.',
    },
    {
      title: 'Monitored doors',
      art: {
        type: 'panel',
        alt: 'An access panel showing each door’s lock state, with one door unlocked for business hours and one opened with a key',
        mode: 'Door status',
        modeTone: 'accent',
        status: '3570 monitoring',
        zones: [
          { name: 'Main entry', state: 'open', label: 'Unlocked 07:30' },
          { name: 'Comms room', state: 'secure', label: 'Deadlatched' },
          { name: 'Plant room', state: 'alarm', label: 'Key override' },
          { name: 'Store', state: 'armed', label: 'Locked' },
          { name: 'Rear exit', state: 'secure', label: 'Door closed' },
          { name: 'Office 2', state: 'secure', label: 'Exit used 09:12' },
        ],
      },
      body: 'Monitored 3570 locks report deadlatched and locked, door position, key override and request to exit, so the access system knows when a key bypassed the reader rather than just that the door opened.',
    },
    {
      title: 'Fire service keys',
      art: {
        type: 'keying',
        alt: 'One 003 fire service key opening Lockwood padlocks, rim and oval cylinders and cam locks',
        top: '003 fire key',
        middle: ['Padlocks', 'Cylinders', 'Cam locks'],
        leaves: ['325', '201/570', '670'],
        caption: 'One compliant 003 key across fire service locks, to AS 4428.17',
      },
      body: 'The 003 system, also called the AU Fire Key, puts one key code across padlocks, rim and oval cylinders and cam locks, so fire crews carry a single key. Lockwood’s 003 products comply with AS 4428.17:2024.',
    },
    {
      title: 'Digital locksets',
      art: {
        type: 'lock',
        alt: 'A Cortex digital lockset labelled with free egress, a two-hour fire test, an SL8 rating and the option to link it to a system',
        variant: 'electronic',
        parts: [
          { label: 'Free egress inside', tone: 'ok' },
          { label: '2 hr fire tested' },
          { label: 'SL8 strength rating' },
          { label: 'Standalone or linked' },
        ],
        caption: 'Cortex on a 530 latch or a Lockwood mortice',
      },
      body: 'Cortex is a commercial digital lockset that works on its own or ties into an existing system. It was the first Australian digital lockset fire rated on Lockwood mortice and 530 latch variants, and it meets the AS1428.1 access standard.',
    },
    {
      title: 'Smart locks at home',
      art: {
        type: 'mobile',
        alt: 'The Lockwood Home app showing the front door unlocked, linked to the Home Hub, a smart lock and the lights',
        app: 'Lockwood Home',
        icon: 'lock',
        tone: 'ok',
        notice: 'Door unlocked',
        sub: 'Front door',
        time: 'Just now',
        actions: ['Lock door', 'Activity'],
        side: [
          { label: 'Home Hub', sub: 'Wi-Fi, Zigbee', icon: 'wifi' },
          { label: 'Smart lock', sub: 'Latitude Slim', icon: 'lock' },
          { label: 'Lights', sub: 'On at unlock', icon: 'bolt' },
        ],
      },
      body: 'The Lockwood Home Hub links up to 16 Lockwood and Yale Bluetooth smart locks and 30 Zigbee devices to the Lockwood Home app, for control from anywhere and simple automations such as lights coming on when the door unlocks.',
    },
    {
      title: 'The right lock on every door',
      art: {
        type: 'map',
        alt: 'A floor plan with a mortice lock, strike, maglock, bolt, panic exit device and keyed cylinder each placed on a different door',
        markers: [
          { x: 10, y: 20, icon: 'door', label: 'Mortice' },
          { x: 34, y: 74, icon: 'lock', label: 'Strike' },
          { x: 54, y: 18, icon: 'lock', label: 'Maglock' },
          { x: 66, y: 76, icon: 'lock', label: 'Bolt' },
          { x: 86, y: 22, icon: 'door', label: 'Panic exit' },
          { x: 90, y: 80, icon: 'key', label: 'Keyed' },
        ],
        caption: 'The right Lockwood hardware on each door',
      },
      body: 'Electric strikes for timber and steel frames, maglocks for glass and busy doors, bolts where a strike will not fit, and panic exit devices and door operators on the paths people use to leave.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Lockwood makes',
  range: [
    {
      title: 'Keying and cylinders',
      items: ['TWIN X and GEN6T restricted keying', 'MT5 and MT5+ high security', 'MTL800 keying', '003 fire service key system'],
    },
    {
      title: 'Electromechanical',
      items: ['3570 series electric mortice locks', 'Selector 3782EL for narrow stile doors', 'Padde series strikes and bolts', 'Electromagnetic locks', 'Electric door operators'],
    },
    {
      title: 'Mechanical hardware',
      items: ['Selector and Synergy mortice locks', 'Deadbolts, rimlocks and levers', 'Padlocks', 'Door closers and panic exit devices'],
    },
    {
      title: 'Keyless and smart',
      items: ['Cortex commercial digital lockset', 'SecureTouch digital deadbolt and lever', '001Touch Plus smart deadlatch', 'Latitude Slim smart mortice lock', 'Lockwood Home Hub and app'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Lockwood door, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Electric locks, strikes, readers, keyed cylinders and exit devices connect to the access panel and the key register, used by managers, staff and monitoring',
    devices: [
      { label: 'Electric mortice', sub: '3570 and Selector', icon: 'lock' },
      { label: 'Strikes and bolts', sub: 'Padde series', icon: 'lock' },
      { label: 'Readers', sub: 'Card, fob or PIN', icon: 'reader' },
      { label: 'Keyed cylinders', sub: 'TWIN X, MT5', icon: 'key' },
      { label: 'Exit devices', sub: 'Panic bars, REX', icon: 'door' },
    ],
    platforms: [
      { label: 'Access control', sub: 'Your existing panel', icon: 'server' },
      { label: 'Key records', sub: 'Signatory controlled', icon: 'key' },
    ],
    people: [
      { label: 'Facility manager', sub: 'Doors and key holders', icon: 'laptop' },
      { label: 'Staff and visitors', sub: 'Card in, free exit', icon: 'person' },
      { label: 'Monitoring centre', sub: 'Forced and held doors', icon: 'headset' },
    ],
    footer: 'Electric locks take power and commands from the access panel and report door, latch and key status back',
  },
  architectureCaption: 'Electric mortice locks, strikes and exit devices are wired to the reader and controller, so the access system sees every door, latch and key override. The key system runs alongside it on controlled records, and door alarms can come through to our monitoring centre.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Schools', 'Healthcare and aged care', 'Government', 'Retail', 'Apartments and strata', 'Industrial and warehousing', 'Homes'],

  teracomHeading: 'What Teracom does on a Lockwood job',
  teracom: [
    { title: 'Specify', body: 'Each door matched to the right lock, backset, keying platform and fire rating, using the door schedule and the Australian standards it has to meet.' },
    { title: 'Install', body: 'Locks fitted, power transfer leads run, fail safe or fail secure set to suit the door, and every monitoring contact tested.' },
    { title: 'Integrate with access control', body: 'Locks wired to the reader and controller so the system sees door position, latch and key override, with door alarms able to reach our monitoring centre.' },
    { title: 'Service', body: 'Lock servicing, faults and changes handled on a maintenance plan, with restricted keys ordered through the proper authorised channel.' },
  ],

  links: [
    { label: 'Lockwood catalogue centre', href: 'https://www.lockweb.com.au/au/en/catalogue-centre' },
    { label: 'Lockwood keying platforms', href: 'https://www.lockweb.com.au/au/en/products/keying-and-cylinders' },
    { label: 'Lockwood electromechanical solutions', href: 'https://www.lockweb.com.au/au/en/products/electromechanical-solutions' },
  ],
};

export default lockwood;