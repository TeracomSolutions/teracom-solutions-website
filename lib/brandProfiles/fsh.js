// The deeper FSH by Schlage brand page (Robert, 2026-10-01: build the brand
// pages out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from allegion.com.au and allegion.co.nz
// (October 2026; fshlocking.com.au refused our fetches); figures are
// Allegion’s own. Drawings are specs drawn by lib/brandArt.

const fsh = {
  heroArt: {
    type: 'hero',
    alt: 'An FSH electric lock at the centre, switched by the access controller on one side and reporting door and lock status on the other',
    device: 'lock',
    left: { title: 'Controller', sub: 'Any system', foot: 'Switches 12 or 24 V DC', icon: 'switch' },
    right: { title: 'Monitoring', sub: 'DSS and LSS', foot: 'Door and lock status', icon: 'sensor' },
    tags: [
      { text: 'Released', tone: 'ok', icon: 'card' },
      { text: 'Door closed', tone: 'ok', icon: 'door' },
      { text: 'Fire trip', tone: 'warn', icon: 'alarm' },
    ],
    chips: [
      { text: 'SCEC approved FES20', tone: 'accent' },
      { text: 'Fail safe or secure', tone: 'ok' },
    ],
  },

  stats: [
    { value: '1490 kg', label: 'holding strength on the FES20 Series electric strike' },
    { value: 'SCEC', label: 'approval for FES20 strikes on secure areas' },
    { value: '400,000', label: 'test cycles on the VE1260 EcoLock drop bolt' },
    { value: '5 years', label: 'warranty on FES strikes, FEM maglocks and the VE1260 drop bolt' },
  ],

  platformsEyebrow: 'Two ways to lock a door',
  platformsHeading: 'Release the latch, or hold the door',
  platformsIntro: 'FSH is the Allegion brand for the electric part of a door: the hardware that locks or lets go when the access control system says so. Which family we use depends on the door, the frame and what must happen in a fire.',
  platforms: [
    {
      name: 'Electric strikes',
      kicker: 'FES10, FES15 and FES20',
      art: {
        type: 'lock',
        alt: 'An FES20 electric strike opened up, showing the stainless faceplate, the barbell mechanism, the keeper and the monitoring sensors',
        variant: 'electronic',
        parts: [
          { label: 'Stainless faceplate', tone: 'muted' },
          { label: 'Barbell lock change', tone: 'accent' },
          { label: 'Keeper frees latch', tone: 'ok' },
          { label: 'DSS and LSS sensors', tone: 'accent' },
        ],
        caption: 'FES20: power to lock or release, set on site',
      },
      body: 'A strike goes in the frame and lets the door\'s own latch through when it is powered or unpowered, so the mechanical lock and key stay in place. The locking mode is changed on site, without loose pins or springs.',
      points: [
        'FES10 Series mortice strikes, up to 1300 kg, IP56 on non-monitored models',
        'FES15 Series surface strikes for rim locks, up to 1250 kg',
        'FES20 Series high-security strikes, up to 1490 kg, SCEC approved',
        'Monitored M models report door, lock and strike status',
      ],
    },
    {
      name: 'Maglocks and drop bolts',
      kicker: 'FEM4300, FEM6600 and VE1260',
      art: {
        type: 'power',
        alt: 'A fire panel trip cutting power from the door supply so two maglocks and a drop bolt release and the doors open freely',
        source: 'Fire panel',
        sourceSub: 'Tripped',
        unit: 'Door PSU, 24 V',
        charge: 100,
        loads: [
          { label: 'FEM6600', sub: 'Released', icon: 'lock' },
          { label: 'FEM4300 double', sub: 'Released', icon: 'door' },
          { label: 'VE1260 bolt', sub: 'Released', icon: 'lock' },
        ],
        status: 'Locks off, doors free',
        statusTone: 'warn',
      },
      body: 'Maglocks and drop bolts hold the door itself rather than the latch. They suit glass doors, double doors and doors with no lock of their own, and set up as power to lock they release the moment a fire trip cuts their supply.',
      points: [
        'FEM4300 maglocks up to 280 kg, single or double door',
        'FEM6600 maglocks up to 580 kg, with no residual magnetism',
        'Both maglocks fire rated up to two hours to AS 1905.1',
        'VE1260 EcoLock motorised drop bolt, up to 1000 kg',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Locks that report back',
  capabilitiesIntro: 'An electric lock is only as good as the way it is wired, powered and watched. These are the FSH features that matter most once the door is in use.',
  capabilities: [
    {
      title: 'Monitored at the door',
      art: {
        type: 'panel',
        alt: 'A monitoring screen after hours showing locked doors, a held stair door and a forced comms room door',
        mode: 'After hours',
        modeTone: 'accent',
        status: 'Comms door forced',
        zones: [
          { name: 'Foyer strike', state: 'secure', label: 'Closed, locked' },
          { name: 'Comms room', state: 'alarm', label: 'Door forced' },
          { name: 'Rear maglock', state: 'secure', label: 'Closed, locked' },
          { name: 'Stair door', state: 'open', label: 'Held open' },
          { name: 'Store bolt', state: 'secure', label: 'Bolt thrown' },
          { name: 'Plant room', state: 'bypassed', label: 'Isolated' },
        ],
      },
      body: 'Monitored FSH models carry a door position sensor and a lock status sensor, and the FES20M also senses that the strike is in its frame. Wired to the controller, that turns a door forced or a door held open into an alarm.',
    },
    {
      title: 'Opens for the right person',
      art: {
        type: 'door',
        alt: 'A card, a phone, a fob and an exit button at a door, with the card releasing the strike and each event logged',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Fob', icon: 'fob' },
          { label: 'Exit', icon: 'door' },
        ],
        active: 0,
        result: 'Door released',
        resultTone: 'ok',
        log: ['08:14 Card, Foyer', '08:09 Exit, Rear', '07:52 Phone, Lab', '07:40 Denied, Cage'],
      },
      body: 'The reader decides who may enter and the FSH hardware does the physical work. Low current draw and a choice of locking modes let the same strike or maglock suit the controller already on site.',
    },
    {
      title: 'Doors that do not line up',
      art: {
        type: 'lock',
        alt: 'A VE1260 EcoLock drop bolt opened up, showing the motorised bolt, the pre-load release, the built-in reed switch and misalignment tolerance',
        variant: 'electronic',
        parts: [
          { label: 'Motorised bolt', tone: 'accent' },
          { label: 'Frees under 35 kg', tone: 'ok' },
          { label: 'Built-in door reed', tone: 'accent' },
          { label: '±4 mm misalignment', tone: 'muted' },
        ],
        caption: 'VE1260 EcoLock: 400,000 test cycles, 12 to 30 V DC',
      },
      body: 'The VE1260 EcoLock still releases with up to 35 kg of pressure on the bolt, so a crowd pushing on the door does not jam it. It copes with up to 4 mm of misalignment, or 12 mm with a special strike plate.',
    },
    {
      title: 'A lock for each door',
      art: {
        type: 'map',
        alt: 'An office floor plan with a different FSH lock marked on each door, including a strike on the comms room and a maglock on the glass entry',
        markers: [
          { x: 14, y: 22, icon: 'lock', tone: 'accent', label: 'FEM6600' },
          { x: 48, y: 18, icon: 'door', tone: 'accent', label: 'FES10' },
          { x: 84, y: 24, icon: 'lock', tone: 'ok', label: 'FES20' },
          { x: 20, y: 70, icon: 'lock', tone: 'accent', label: 'VE1260' },
          { x: 52, y: 80, icon: 'door', tone: 'accent', label: 'FEL990' },
          { x: 84, y: 72, icon: 'door', tone: 'accent', label: 'FES15' },
        ],
        caption: 'Hardware matched to each door',
      },
      body: 'Glass entries suit a maglock or drop bolt, timber office doors a mortice strike, rim-locked doors a surface strike, and stair doors an electric mortice lock such as the FEL990, tested to four hours on fire door assemblies.',
    },
    {
      title: 'Sized for the power supply',
      art: {
        type: 'dashboard',
        alt: 'A power budget for one floor of doors showing the current drawn by a strike, a maglock, a sleeping drop bolt and a mortice lock',
        title: 'PSU load · level 2 doors',
        tiles: [
          { label: 'FES20 at 24 V', value: '100 mA', tone: 'ok' },
          { label: 'FEM6600 at 24 V', value: '250 mA', tone: 'accent' },
          { label: 'VE1260 asleep', value: '15 mA', tone: 'ok' },
          { label: 'FEL990 running', value: '100 mA', tone: 'ok' },
        ],
        bars: [465, 465, 1300, 465, 465, 1030, 465, 465],
        chart: 'Supply load, mA',
        eventsTitle: 'Sizing notes',
        events: [
          { text: 'VE1260 sleeps at 15 mA', tone: 'ok' },
          { text: 'Peak when bolts cycle', tone: 'warn' },
          { text: 'Maglocks draw all day', tone: 'accent' },
          { text: 'Battery sized to suit', tone: 'ok' },
        ],
      },
      body: 'FSH publishes the current each lock draws at 12 and 24 V. We add them up per supply, allow for the drop bolt peaks, and size the battery so doors behave as designed when the mains drops.',
    },
    {
      title: 'Works with any access system',
      art: {
        type: 'network',
        alt: 'A door controller and power supply feeding a strike, a maglock, a drop bolt, a mortice lock, a reader and an exit button',
        uplink: 'Controller',
        switchLabel: 'Door power supply',
        switchSub: '12 or 24 V DC, fire input',
        ports: [
          { label: 'FES20', icon: 'lock', tone: 'ok' },
          { label: 'FEM6600', icon: 'lock', tone: 'ok' },
          { label: 'VE1260', icon: 'lock', tone: 'ok' },
          { label: 'FEL990', icon: 'door', tone: 'ok' },
          { label: 'Reader', icon: 'reader', tone: 'accent' },
          { label: 'Exit', icon: 'door', tone: 'accent' },
        ],
        caption: 'Locks run from 12 or 24 V DC, so they suit most door controllers',
      },
      body: 'FSH makes the locking hardware, not the access control software, so it drops into whichever system runs the site. Surge protection on the maglocks and reverse polarity protection on the FEL990 help them survive the wiring faults that do happen.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What FSH makes',
  range: [
    {
      title: 'Electric strikes',
      items: ['FES10 Series mortice strikes', 'FES15 Series surface strikes for rim locks', 'FES20 Series high-security strikes', 'Monitored M versions'],
    },
    {
      title: 'Electromagnetic locks',
      items: ['FEM4300 Series, up to 280 kg', 'FEM6600 Series, up to 580 kg', 'Single and double door models', 'Monitored M models with a bicolour LED'],
    },
    {
      title: 'Bolts and mortice locks',
      items: ['VE1260 EcoLock drop bolt', 'FEL990 and FEL990M electric mortice locks'],
    },
    {
      title: 'Door holders and sensors',
      items: ['Electromagnetic door holders', 'High-security door position sensors', 'Electric cabinet locks'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'FSH hardware in a Teracom system',
  architectureArt: {
    type: 'architecture',
    alt: 'Readers, exit buttons and FSH locks at each door connect to the access controller, door power supply and fire panel, which serve staff, the desk and monitoring',
    columns: ['At the door', 'Control', 'People'],
    devices: [
      { label: 'Reader', sub: 'Card, phone, fob', icon: 'reader' },
      { label: 'Exit button', sub: 'Request to exit', icon: 'door' },
      { label: 'FES20 strike', sub: 'Monitored', icon: 'lock' },
      { label: 'FEM6600 maglock', sub: 'Power to lock', icon: 'lock' },
      { label: 'VE1260 drop bolt', sub: 'Glass doors', icon: 'lock' },
    ],
    platforms: [
      { label: 'Access control', sub: 'Your door controller', icon: 'server' },
      { label: 'Door power', sub: '12 or 24 V DC', icon: 'battery' },
      { label: 'Fire panel', sub: 'Releases on a trip', icon: 'alarm' },
    ],
    people: [
      { label: 'Staff', sub: 'Card or phone', icon: 'person' },
      { label: 'Security desk', sub: 'Forced and held', icon: 'laptop' },
      { label: 'Fire services', sub: 'Doors free to open', icon: 'shield' },
      { label: 'Monitoring centre', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'The right lock on each door, switched by the access system and released by the fire panel',
  },
  architectureCaption: 'Each door gets the FSH hardware that suits it, wired to the access controller with door and lock monitoring, powered from a battery-backed supply and released by the fire panel when it must be. Forced and held doors can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Government', 'Healthcare', 'Schools and universities', 'Aged care', 'Apartment buildings', 'Hotels', 'Retail'],

  teracomHeading: 'What Teracom does on an FSH job',
  teracom: [
    { title: 'Specify', body: 'Every door surveyed, with the strike, maglock or bolt chosen for the door, the frame, the fire rating and the security level before anything is ordered.' },
    { title: 'Install', body: 'Hardware fitted and aligned, cabled back to the controller and power supply, and the locking mode set for each door.' },
    { title: 'Integrate with access control', body: 'Door and lock monitoring wired in, fire release tested, and forced or held door alarms able to come through to our monitoring centre.' },
    { title: 'Service', body: 'Locks, power supplies and batteries checked on a maintenance plan, with warranty replacements arranged through Allegion.' },
  ],

  links: [
    { label: 'FSH by Schlage at Allegion Australia', href: 'https://www.allegion.com.au/en/brands/fsh.html' },
    { label: 'FSH FES20 Series electric strikes', href: 'https://www.allegion.co.nz/en/products/all/fsh-fes20-series-electric-strikes.html' },
    { label: 'Allegion Australia warranties', href: 'https://www.allegion.com.au/en/resource-hub/warranty.html' },
  ],
};

export default fsh;