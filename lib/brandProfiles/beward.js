// The deeper Beward brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from beward.net and beward.ru (October 2026);
// figures are Beward's own. Drawings are specs drawn by lib/brandArt.

const beward = {
  heroArt: {
    type: 'hero',
    alt: 'A Beward IP door station recognising a face, calling SIP phones and switching up to three locks, gates or barriers',
    device: 'reader',
    left: { title: 'SIP phones', sub: 'PBX or direct', foot: 'Desk phones, softphones', icon: 'phone' },
    right: { title: 'Locks', sub: 'Up to 3 relays', foot: 'Door, gate or barrier', icon: 'lock' },
    tags: [
      { text: 'Face matched', tone: 'ok', icon: 'face' },
      { text: 'Visitor call', tone: 'accent', icon: 'person' },
      { text: 'Motion', tone: 'warn', icon: 'motion' },
    ],
    chips: [
      { text: 'Works with no internet', tone: 'ok' },
      { text: 'SIP v2.0', tone: 'accent' },
    ],
  },

  stats: [
    { value: 'Since 2004', label: 'developing and making IP cameras, intercoms and software' },
    { value: '30 faces', label: 'stored on a DS06A door station and matched with no network needed' },
    { value: '9,999', label: 'apartments or subscribers on one DKS15135 multi-unit panel' },
    { value: 'Under 1%', label: 'defect rate, under an ISO 9001:2015 quality system' },
  ],

  platformsEyebrow: 'Two kinds of door station',
  platformsHeading: 'Single-entry door stations, or multi-apartment panels',
  platformsIntro: 'Both are SIP devices, so they ring desk phones, softphones and indoor monitors on the network you already have. The choice comes down to how many people each entrance has to call.',
  platforms: [
    {
      name: 'DS series door stations',
      kicker: 'One entrance',
      art: {
        type: 'door',
        alt: 'A Beward door station matching a face and opening the door, with card, app and visitor calls in the log',
        credentials: [
          { label: 'Face', icon: 'face' },
          { label: 'Card', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
          { label: 'Call', icon: 'speaker' },
        ],
        active: 0,
        result: 'Face matched',
        resultTone: 'ok',
        log: ['08:02 Jess · face', '07:55 Card 1042', '07:40 App unlock', '07:31 Visitor call'],
      },
      body: 'A vandal-resistant door station with a camera, two-way audio and built-in face recognition that keeps working with no network or internet. Add-on controllers drive up to three locks, gates or barriers.',
      points: [
        'DS06A: face recognition for up to 30 people, stored on the device',
        'Up to three SIP accounts, or door opening by tone from any phone',
        'DSxxxP-3L controller for three actuators, powered by PoE',
        'Rated for -50 to +50 °C, with a microSD card for local recording',
      ],
    },
    {
      name: 'DKS multi-apartment panels',
      kicker: 'Many residents',
      art: {
        type: 'network',
        alt: 'A Beward multi-apartment panel calling indoor monitors, phones and the concierge, with door and gate locks on its relays',
        uplink: 'SIP PBX',
        switchLabel: 'DKS15135 panel',
        switchSub: 'Up to 9,999 subscribers',
        ports: [
          { label: 'SM710', icon: 'laptop' },
          { label: 'Apt 204', icon: 'phone' },
          { label: 'Concierge', icon: 'headset' },
          { label: 'Lobby door', icon: 'door' },
          { label: 'Car gate', icon: 'lock' },
        ],
        caption: 'One panel calls monitors, phones and the concierge over SIP',
      },
      body: 'A keypad panel for apartment buildings and hotels that calls each resident’s indoor monitor or phone over SIP, with a Mifare card reader and two door relays built in.',
      points: [
        'DKS15135: up to 9,999 subscribers on one panel',
        'Mifare reader with AES-128 encryption, holding 7,250 keys',
        'IP66 and IK08 housing, rated -50 to +60 °C',
        'SM710 7-inch indoor monitors answer the call and open the door',
      ],
    },
  ],

  capabilitiesEyebrow: 'Features',
  capabilitiesHeading: 'What a Beward intercom does',
  capabilitiesIntro: 'Beward puts the intelligence in the door station itself, so face recognition and door control do not depend on a server or the internet. These are the features that matter most on site.',
  capabilities: [
    {
      title: 'Face recognition at the door',
      art: {
        type: 'search',
        alt: 'A face at the front entry checked against the people enrolled on the door station, with one clear match',
        query: 'Face at the front entry, 08:02',
        badge: '1 match',
        results: [
          { label: 'Jess · resident', score: '97%', highlight: true },
          { label: 'Sam · resident', score: '38%' },
          { label: 'Cleaner', score: '21%' },
        ],
        caption: 'Checked on the door station, with no server needed',
      },
      body: 'The DS06A compares each face with up to 30 enrolled people and opens the door on a match. It all runs on the device, so it still works if the network or the internet drops.',
    },
    {
      title: 'Calls to any SIP device',
      art: {
        type: 'mobile',
        alt: 'A visitor call from the front door arriving in the BEWARD Intercom app, with buttons to answer or open the door',
        app: 'BEWARD Intercom',
        icon: 'door',
        tone: 'accent',
        notice: 'Front door',
        sub: 'Visitor calling',
        time: 'Now · 14:32',
        actions: ['Answer', 'Open door'],
        side: [
          { label: 'Desk phone', sub: 'Via IP-PBX', icon: 'phone' },
          { label: 'Monitor', sub: 'SM710 7-inch', icon: 'laptop' },
          { label: 'Mobile', sub: 'Tone to open', icon: 'phone' },
        ],
      },
      body: 'Calls go to any SIP device: desk phones through an IP-PBX, softphones, indoor monitors or the free BEWARD Intercom app. A visitor can even be let in from an ordinary mobile by pressing a key.',
    },
    {
      title: 'Locks, gates and lights',
      art: {
        type: 'lock',
        alt: 'An electric lock opened up to show the 12 V supply, relay contacts and exit button wired through a Beward controller',
        variant: 'electronic',
        parts: [
          { label: 'Maglock or strike', tone: 'accent' },
          { label: '12 V from PoE', tone: 'ok' },
          { label: 'NO / NC contacts', tone: 'muted' },
          { label: 'Exit button', tone: 'muted' },
        ],
        caption: 'The DSxxxP-3L powers and switches the lock',
      },
      body: 'The DSxxxP-3L controller adds three relay outputs to a DS door station for a door, a gate or barrier, and lights or a siren. Running on PoE, it can also supply 12 V to the lock.',
    },
    {
      title: 'Old intercoms onto IP',
      art: {
        type: 'onPrem',
        alt: 'An existing analogue door station and lock connected through a Beward DK103M converter to become a SIP video intercom',
        devices: [
          { label: 'Old panel', icon: 'speaker' },
          { label: 'Door lock', icon: 'lock' },
        ],
        server: 'DK103M',
        badge: '2 SIP accounts',
        title: 'Analogue to SIP',
        sub: 'Keeps the existing panel',
        points: ['Up to 5 phones', 'Unlock in the app', 'microSD recording'],
      },
      body: 'The DK103M converter turns an existing 4-wire analogue door station into a SIP video intercom, so it can ring phones and the app and open the door without replacing the panel outside.',
    },
    {
      title: 'Recording and motion alerts',
      art: {
        type: 'storage',
        alt: 'Door station footage kept on its own microSD card, copied to an FTP server on each event and recorded in Beward software',
        tiers: [
          { label: 'microSD in the door station', sub: 'Clips and snapshots on site', icon: 'door' },
          { label: 'FTP server', sub: 'Copies sent on each event', icon: 'server' },
          { label: 'Record Center', sub: 'Free for up to 36 channels', icon: 'laptop' },
        ],
        active: 0,
        stat: '4',
        statLabel: 'motion zones per unit',
        badge: 'Event recording',
        points: ['Records on the device', 'Sends clips on motion', 'Free recording app'],
        caption: 'Every call and movement at the door is kept',
      },
      body: 'Each door station records to its own microSD card, watches up to four motion zones, and can send clips and snapshots to an FTP server or record into Beward’s free software.',
    },
    {
      title: 'Indoor monitors',
      art: {
        type: 'dashboard',
        alt: 'An SM710 indoor monitor screen with missed calls, saved visitor photos, a weekly call trend and a call log',
        title: 'SM710 · Apt 204',
        tiles: [
          { label: 'Missed calls', value: '2', tone: 'warn' },
          { label: 'Visitor photos', value: '148' },
          { label: 'Front door', value: 'Locked', tone: 'ok' },
        ],
        bars: [4, 6, 3, 8, 5, 2, 7],
        chart: 'Calls this week',
        eventsTitle: 'Call log',
        events: [
          { text: '14:32 Front door', tone: 'accent' },
          { text: '11:05 Courier · opened', tone: 'ok' },
          { text: '09:40 Missed call', tone: 'warn' },
        ],
      },
      body: 'The SM710 indoor monitor has a 7-inch screen, answers calls from the door station over SIP and opens the door with a touch. It keeps a log of up to 500 calls and up to 5,000 caller photos.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Beward makes',
  range: [
    {
      title: 'Door stations',
      items: ['DS06A single-entry door station with face recognition', 'DKS15135 multi-apartment panel', 'DSxxxP and DSxxxP-3L controllers', 'PR-105 RFID reader and NC311P lock controller'],
    },
    {
      title: 'Monitors and converters',
      items: ['SM710 and SM400W indoor monitors', 'DK103M analogue-to-SIP converter', 'Wi-Fi and 4G modules for door stations'],
    },
    {
      title: 'IP cameras',
      items: ['B1000 series professional cameras', 'SV series for difficult light', 'BD series day-night cameras', 'PTZ and fisheye cameras'],
    },
    {
      title: 'Software',
      items: ['BEWARD Intercom app for Android and iOS', 'IP Visor and Record Center, free up to 36 channels', 'IP Searcher for finding and updating devices'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Beward system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Beward door stations, panels and converters call monitors, desk phones and the app over SIP, while switching locks and gates on site',
    devices: [
      { label: 'DS06A door station', sub: 'Face recognition', icon: 'face' },
      { label: 'DKS15135 panel', sub: 'Up to 9,999 users', icon: 'reader' },
      { label: 'DK103M converter', sub: 'Old analogue panels', icon: 'switch' },
      { label: 'Locks and gates', sub: 'Up to 3 relays', icon: 'lock' },
      { label: 'Beward cameras', sub: 'B, SV and BD series', icon: 'camera' },
    ],
    platforms: [
      { label: 'SIP network', sub: 'IP-PBX or direct calls', icon: 'switch' },
      { label: 'Beward software', sub: 'Free for 36 channels', icon: 'server' },
    ],
    people: [
      { label: 'Residents', sub: 'SM710 indoor monitors', icon: 'person' },
      { label: 'Reception', sub: 'SIP desk phones', icon: 'headset' },
      { label: 'Phones', sub: 'BEWARD Intercom app', icon: 'phone' },
    ],
    footer: 'Door stations call over SIP on your existing network; face recognition and lock control stay on the device',
  },
  architectureCaption: 'Door stations and panels call indoor monitors, desk phones and the BEWARD Intercom app over SIP on the network you already have. Face recognition and lock control run on the device, and cameras and door stations can record into Beward’s free software.',

  industriesHeading: 'Where we put it to work',
  industries: ['Apartment buildings', 'Hotels', 'Offices', 'Schools', 'Medical centres', 'Warehouses and depots', 'Homes'],

  teracomHeading: 'What Teracom does on a Beward job',
  teracom: [
    { title: 'Design', body: 'Door stations, monitors and controllers chosen for each entrance, with the SIP set-up planned around your phone system and network.' },
    { title: 'Install and commission', body: 'Units mounted, cabled and powered, faces and cards enrolled, and every call path and lock tested before handover.' },
    { title: 'Connect it up', body: 'Calls routed to the right phones and monitors, and locks, gates and barriers wired to the controller outputs so each entrance works as one.' },
    { title: 'Look after it', body: 'Firmware updates, user and face changes and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Beward IP video intercoms', href: 'https://www.beward.net/category/48' },
    { label: 'Beward support and downloads', href: 'https://www.beward.net/support/' },
    { label: 'Beward intercom catalogue (in Russian)', href: 'https://www.beward.ru/katalog/ip-videodomofony/' },
  ],
};

export default beward;