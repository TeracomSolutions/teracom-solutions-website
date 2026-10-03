// The deeper Trimec brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from trimec.com.au and the ASSA ABLOY Australia
// ES8100 page (October 2026); figures are Trimec's own. Drawings are specs
// drawn by lib/brandArt.

const trimec = {
  heroArt: {
    type: 'hero',
    alt: 'An electric strike releasing a door under load, driven by the access controller on one side and reporting latch and door status on the other',
    device: 'lock',
    left: { title: 'Controller', sub: '12 or 24 V DC', foot: 'Releases on a valid card', icon: 'reader' },
    right: { title: 'Monitoring', sub: 'Latch and door', foot: 'Status back to the panel', icon: 'alarm' },
    tags: [
      { text: 'Pre-load 25 kg', tone: 'warn', icon: 'door' },
      { text: 'Latch home', tone: 'ok', icon: 'lock' },
      { text: 'Door closed', tone: 'accent', icon: 'sensor' },
    ],
    chips: [
      { text: 'Fire rated to 4 hours', tone: 'ok' },
      { text: 'Fail mode set on site', tone: 'accent' },
    ],
  },

  stats: [
    { value: '1300 kg', label: 'static strength on the ES9000 and ES9100 pre-load strikes' },
    { value: '2.5 million', label: 'test cycles on the ES9100, or 1.2 million under a 25 kg pre-load' },
    { value: '4 hours', label: 'fire rating on fire door assemblies for the ES9100 and Z series locks' },
    { value: '12 mm', label: 'of door misalignment the ES8100 V-Lock can take up' },
  ],

  platformsEyebrow: 'Two ways to hold a door',
  platformsHeading: 'Release the latch, or lock the door itself',
  platformsIntro: 'Trimec, part of ASSA ABLOY Australia, makes the electrified hardware that an access control system switches. A strike works with the lock already in the door; a maglock or bolt does the holding itself. We choose on the door, the frame, the fire rating and how the door has to behave when power is lost.',
  platforms: [
    {
      name: 'Electric strikes',
      kicker: 'Release the latch',
      art: {
        type: 'lock',
        alt: 'An ES9100 strike opened up to show its solenoid and latch monitors, the door position reed and the fail mode set on site',
        variant: 'electronic',
        parts: [
          { label: 'Solenoid monitor' },
          { label: 'Latch monitor' },
          { label: 'Door position reed', tone: 'accent' },
          { label: 'Fail safe or secure', tone: 'ok' },
        ],
        caption: 'ES9100: 1300 kg static strength, IP54, door position reed',
      },
      body: 'The lock in the door stays as it is, and the strike in the frame lets the latch go when the access system says so. Switches inside tell the controller whether the strike is locked and the latch is home, and fail safe or fail secure is set on site.',
      points: [
        'ES9000 and ES9100 pre-load strikes, 10 to 30 V DC',
        'ES2000, ES2100 and ES3000 monitored strikes',
        'ES2600 surface strike for panic bars with Pullman latches',
        'ES150 surface strike for rim latches, with an IP56 version',
      ],
    },
    {
      name: 'Maglocks and bolts',
      kicker: 'Lock the door itself',
      art: {
        type: 'door',
        alt: 'A card at a reader switches off a Z series maglock on a glass door, and the bond sensor confirms it is holding again once the door shuts',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'pin' },
          { label: 'Exit', icon: 'person' },
        ],
        active: 0,
        result: 'Door released',
        resultTone: 'ok',
        log: ['Bond off 08:02', 'Door open 08:02', 'Door shut 08:03', 'Bond on 08:03'],
      },
      body: 'Where a strike will not suit the door, the lock goes on the door and frame instead. Maglocks hold glass and aluminium doors with no moving parts, and motorised and solenoid bolts throw into the frame. Each one reports its own state, from magnet bond to bolt position.',
      points: [
        'Z series maglocks, 250 to 1160 kg, single or double',
        'ES8000 V-Lock and its ASSA ABLOY successor, the ES8100',
        'TB25 drop bolts, 1000 kg, for swing-through doors',
        'ES6000 hook lock for sliding and swinging doors',
      ],
    },
  ],

  capabilitiesEyebrow: 'On the door',
  capabilitiesHeading: 'What a Trimec device does on the door',
  capabilitiesIntro: 'A reader only decides who may enter. The strike, maglock or bolt is what actually holds the door or lets it go, and these are the details that make it dependable.',
  capabilities: [
    {
      title: 'Doors under pressure',
      art: {
        type: 'lock',
        alt: 'An ES8100 V-Lock opened up to show its motorised bolt, V-shaped strike, status LED and door position monitoring',
        variant: 'electronic',
        parts: [
          { label: 'Motorised bolt' },
          { label: 'V-shaped strike' },
          { label: 'Status and fault LED' },
          { label: 'Door position', tone: 'accent' },
        ],
        caption: 'ES8100: unlocks with up to 100 kg pushing on the door',
      },
      body: 'Seals, warped leaves, people pulling and air pressure all leave load on a lock, and an ordinary strike can jam. Pre-load strikes such as the ES9000 release with up to 25 kg on them, the ES8100 V-Lock with up to 100 kg in 3-wire mode, and the ES6000 hook lock with 300 kg of side pressure.',
    },
    {
      title: 'Monitored, not just shut',
      art: {
        type: 'panel',
        alt: 'An access panel showing each door’s lock state, with the foyer maglock bonded, the dock bolt thrown and a comms room latch not home',
        mode: 'Door status',
        modeTone: 'accent',
        status: 'Lock monitoring',
        zones: [
          { name: 'Front entry', state: 'secure', label: 'Latched, locked' },
          { name: 'Glass foyer', state: 'secure', label: 'Bond sensed' },
          { name: 'Comms room', state: 'alarm', label: 'Latch not home' },
          { name: 'Dock door', state: 'armed', label: 'Bolt thrown' },
          { name: 'Stairwell', state: 'open', label: 'Released 08:00' },
          { name: 'Plant room', state: 'secure', label: 'Door closed' },
        ],
      },
      body: 'A closed door is not always a locked one. Monitored strikes report solenoid and latch state, Z series maglocks sense the bond with the armature, and bolts report their position, so the access system knows the door is truly secure.',
    },
    {
      title: 'Fire doors and safe exit',
      art: {
        type: 'mobile',
        alt: 'An access control alert after a fire trip, showing the stairwell and foyer released while the fail secure comms room stays locked',
        app: 'Access control',
        icon: 'door',
        tone: 'warn',
        notice: 'Fire trip',
        sub: 'Fail safe doors free',
        time: 'Today 14:32',
        actions: ['View doors'],
        side: [
          { label: 'Stairwell', sub: 'Free to exit', icon: 'door' },
          { label: 'Foyer', sub: 'Maglock off', icon: 'lock' },
          { label: 'Comms room', sub: 'Stays locked', icon: 'lock' },
        ],
      },
      body: 'Fail safe or fail secure is chosen door by door on site, so exit paths open when lock power is cut while a comms room can stay locked. Much of the range is fire rated on fire door assemblies to AS 1905.1, up to four hours for the ES9100 strike and the Z series maglocks.',
    },
    {
      title: 'Glass, sliding and panic doors',
      art: {
        type: 'map',
        alt: 'A floor plan with a pre-load strike, a double maglock, a drop bolt, a panic bar strike, a sliding door hook lock and a cabinet lock placed',
        markers: [
          { x: 10, y: 22, icon: 'door', label: 'ES9100' },
          { x: 30, y: 78, icon: 'lock', label: 'Z8 double' },
          { x: 50, y: 20, icon: 'lock', label: 'TB25' },
          { x: 66, y: 76, icon: 'door', label: 'ES2600' },
          { x: 86, y: 22, icon: 'door', label: 'ES6000' },
          { x: 88, y: 80, icon: 'lock', label: 'EL110' },
        ],
        caption: 'A Trimec device matched to each door',
      },
      body: 'Swing-through glass doors take TB25 drop bolts, double doors take Z series double maglocks, panic bars with Pullman latches take the ES2600, sliding doors take the ES6000 hook lock, and cabinets with swing or sliding doors take the EL110.',
    },
    {
      title: 'Held open or forced',
      art: {
        type: 'sensor',
        alt: 'A door position reed built into a strike reporting a forced comms room door, a dock door held open and the front entry latched',
        icon: 'sensor',
        target: 'door',
        label: 'Door position',
        sub: 'Reed built into ES9100',
        coverage: 'Door, latch and strike all reported',
        events: [
          { text: 'Door forced', sub: 'Comms room 02:14', tone: 'alert' },
          { text: 'Held open', sub: 'Dock door · 3 min', tone: 'warn' },
          { text: 'Latched', sub: 'Front entry', tone: 'ok' },
        ],
      },
      body: 'Door position sensing is built into the ES9100 strike and the ES8100 V-Lock, and the TB25 bolt has a magnet in its strike plate. The controller can raise door forced and held open alarms from it, and those alarms can come through to our monitoring centre.',
    },
    {
      title: 'High security doors',
      art: {
        type: 'door',
        alt: 'A card and PIN at a reader draw the bolt of an ES8200 Technilock on a high security door, with the bolt and door logged',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'pin' },
          { label: 'Key', icon: 'key' },
        ],
        active: 1,
        result: 'Bolt drawn',
        resultTone: 'ok',
        log: ['ES8204 Technilock', 'Card + PIN 07:00', 'Bolt drawn 07:00', 'Bolt thrown 07:01'],
      },
      body: 'The ES8200 Technilock was first developed for custodial use. It holds beyond 2500 kg, still releases with 70 kg of side pressure, and reports bolt position and door closed, with key override monitoring on request. It suits banks, jewellers and government sites.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Trimec makes',
  range: [
    {
      title: 'Electric strikes',
      items: ['ES9000 and ES9100 pre-load strikes', 'ES2000, ES2100 and ES3000 monitored strikes', 'ES100, ES110, ES200 and ES300 series', 'ES150 and ES2600 surface mounted strikes'],
    },
    {
      title: 'Electromagnetic locks',
      items: ['Z series single maglocks, Z4 and Z8', 'Z series double maglocks', 'Z4 recessed maglocks', 'Armature plates and brackets'],
    },
    {
      title: 'Electromechanical bolts',
      items: ['ES8000 V-Lock and glass door bracket', 'TB25 and TB25KO drop bolts', 'ES6000 hook lock', 'ES8200 Technilock'],
    },
    {
      title: 'Cabinets and paperwork',
      items: ['EL110 electric cabinet lock', 'Declarations of conformance', 'Fire certificates'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Trimec door, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Strikes, maglocks and bolts take power and commands from the door controller and report their state back, for staff, managers and monitoring',
    columns: ['On the door', 'Control', 'People'],
    devices: [
      { label: 'Electric strikes', sub: 'ES9000, ES2000', icon: 'door' },
      { label: 'Maglocks', sub: 'Z series', icon: 'lock' },
      { label: 'Bolts', sub: 'TB25, ES8000, ES6000', icon: 'lock' },
      { label: 'Readers', sub: 'Card, PIN or phone', icon: 'reader' },
      { label: 'Exit buttons', sub: 'Request to exit', icon: 'person' },
    ],
    platforms: [
      { label: 'Door controller', sub: 'Any access system', icon: 'server' },
      { label: 'Lock power', sub: '12 or 24 V DC supply', icon: 'bolt' },
    ],
    people: [
      { label: 'Staff and visitors', sub: 'Card in, free exit', icon: 'person' },
      { label: 'Facility manager', sub: 'Door status and alarms', icon: 'laptop' },
      { label: 'Monitoring centre', sub: 'Forced and held doors', icon: 'headset' },
    ],
    footer: 'The controller powers each lock and reads back its strike, latch, bond or bolt status',
  },
  architectureCaption: 'Trimec strikes, maglocks and bolts are wired to the door controller and its lock power supply. The controller releases them on a valid credential and reads back their monitoring, so forced and held-open doors can come through to our monitoring centre.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Government', 'Banks and jewellers', 'Healthcare', 'Schools and universities', 'Data centres and comms rooms', 'Industrial and warehousing', 'Retail'],

  teracomHeading: 'What Teracom does on a Trimec job',
  teracom: [
    { title: 'Specify', body: 'Each door matched to a strike, maglock or bolt by its frame, latch, fire rating and the load it carries, with fail safe or fail secure chosen for its role.' },
    { title: 'Install', body: 'Hardware fitted and wired back to the controller, the fail mode set on site, and every monitoring switch and door position contact tested.' },
    { title: 'Integrate with access control', body: 'Locks connected to the reader and controller so the system sees latch, bond and door status, with door alarms able to reach our monitoring centre.' },
    { title: 'Service', body: 'Faults, worn hardware and door alignment handled on a maintenance plan, with replacements matched to the original Trimec part.' },
  ],

  links: [
    { label: 'Trimec electric strikes', href: 'https://www.trimec.com.au/au/en/products/electric-strikes' },
    { label: 'Trimec electromechanical bolts', href: 'https://www.trimec.com.au/au/en/products/electromechanical-bolts' },
    { label: 'Trimec product certification', href: 'https://www.trimec.com.au/au/en/products/product-certification' },
  ],
};

export default trimec;