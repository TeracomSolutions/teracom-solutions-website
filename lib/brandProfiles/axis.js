// The deeper Axis brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from axis.com (October 2026); figures are
// Axis's own. Drawings are specs drawn by lib/brandArt.

const axis = {
  heroArt: {
    type: 'hero',
    alt: 'An Axis camera sorting people from vehicles on the camera itself, recording to AXIS Camera Station Pro or its own SD card and alerting a phone',
    device: 'camera',
    left: { title: 'Record', sub: 'ACS Pro server', foot: 'Or an SD card in camera', icon: 'server' },
    right: { title: 'View', sub: 'ACS mobile app', foot: 'Desktop, web or phone', icon: 'phone' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Time in area', tone: 'warn', icon: 'person' },
    ],
    chips: [
      { text: 'AI on the camera', tone: 'accent' },
      { text: 'Signed, secure boot', tone: 'ok' },
    ],
  },

  stats: [
    { value: '5 years', label: 'warranty on most Axis products, with nothing to register' },
    { value: '50%+', label: 'less bandwidth and storage from Zipstream, standard in every camera' },
    { value: '1,000 doors', label: 'and 50,000 cardholders per AXIS Camera Station Pro server' },
    { value: 'Included', label: 'AXIS Object Analytics comes preinstalled on compatible cameras' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'A server on site, or camera straight to cloud',
  platformsIntro: 'Axis makes its own video management software in two forms. Both work with the same cameras, intercoms and speakers; the choice comes down to site size, how many sites you run and whether you want a server to look after.',
  platforms: [
    {
      name: 'AXIS Camera Station Pro',
      kicker: 'On-premise',
      art: {
        type: 'onPrem',
        alt: 'Axis cameras, doors, speakers and radar reporting to an AXIS Camera Station Pro server kept on site',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'Doors', icon: 'door' },
          { label: 'Speakers', icon: 'speaker' },
          { label: 'Radar', icon: 'sensor' },
        ],
        server: 'S30 recorder',
        badge: 'Video + access',
        title: 'On your premises',
        sub: 'Server, recorder or VM',
        points: ['1,000 doors/server', 'Smart Search 2', 'Mobile and web'],
      },
      body: 'Video management and access control on a server you own, from a single small site up to several sites with hundreds of devices. It is tuned for Axis gear and also takes third-party cameras. Licences that come preloaded on Axis recorders do not expire.',
      points: [
        'Runs on AXIS S30 recorders, your own servers or virtual machines',
        'Secure Entry: up to 1,000 doors and 50,000 cardholders per server',
        'AXIS Audio Manager Pro for speakers and intercoms in the same client',
        'Windows client, web client and a free mobile app',
      ],
    },
    {
      name: 'AXIS Camera Station Edge',
      kicker: 'Camera to cloud',
      art: {
        type: 'cloud',
        alt: 'Three small sites with Axis cameras recording to SD cards and connecting through Axis Cloud Connect, viewed in a browser or the app',
        title: 'Cloud Connect',
        sub: 'No server on site',
        badge: 'SD card in each camera',
        sites: [
          { label: 'Shopfront', sub: 'Mini domes', icon: 'camera' },
          { label: 'Depot', sub: 'Bullet cameras', icon: 'bullet' },
          { label: 'Office', sub: 'Video intercom', icon: 'door' },
        ],
        clients: [
          { label: 'Web', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'No recording server at all. Each camera records to an Axis SD card, or to a compact S30 recorder, and you watch, search and export from a phone, a browser or the desktop app through Axis Cloud Connect.',
      points: [
        'Licences come with compatible Axis devices',
        'AXIS Camera Station Cloud Storage keeps a second copy off site',
        'Software updates arrive automatically',
        'Answer intercom calls and talk through speakers from the app',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics and devices',
  capabilitiesHeading: 'What an Axis system actually does',
  capabilitiesIntro: 'Most Axis analytics run on the camera or radar itself, so only the results travel over the network. These are the functions that do the most work on the sites we look after.',
  capabilities: [
    {
      title: 'Smart Search 2',
      art: {
        type: 'search',
        alt: 'A typed description of a white van finds it on three cameras around a loading dock, best match first',
        query: 'White van near the loading dock, last night',
        badge: '3 matches',
        results: [
          { label: 'Dock cam · 21:14', score: '96%', highlight: true, kind: 'vehicle' },
          { label: 'Gate · 21:09', score: '88%', kind: 'vehicle' },
          { label: 'Car park · 20:52', score: '74%', kind: 'vehicle' },
        ],
        caption: 'Search runs on your own server, so footage stays on site',
      },
      body: 'Built into AXIS Camera Station Pro. Find people and vehicles across hours of recordings by type and colour, or type a plain description, then narrow it down by camera and time. The search runs on your own server.',
    },
    {
      title: 'Counting and occupancy',
      art: {
        type: 'dashboard',
        alt: 'A dashboard showing people counted through a shop entrance, current occupancy, time in area and a tailgating event',
        title: 'Store entrance',
        tiles: [
          { label: 'Entered today', value: '1,284', tone: 'accent' },
          { label: 'In store now', value: '57', tone: 'ok' },
          { label: 'Avg time in area', value: '6 min', tone: 'muted' },
          { label: 'Tailgating', value: '2', tone: 'warn' },
        ],
        bars: [40, 85, 120, 160, 140, 175, 130, 90],
        chart: 'Entries by hour',
        eventsTitle: 'Latest events',
        events: [
          { text: 'Occupancy over limit', tone: 'warn' },
          { text: 'Tailgate at staff door', tone: 'alert' },
          { text: 'Count reset 6:00 am', tone: 'muted' },
        ],
      },
      body: 'AXIS Object Analytics counts people and vehicles crossing a line, tracks how many are in an area and how long they stay, and can flag someone following a staff member through a door. It comes on compatible cameras at no extra cost.',
    },
    {
      title: 'AXIS Perimeter Defender',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a back fence alerts on a person crossing it and ignores a kangaroo',
        lineLabel: 'Back fence',
        alert: 'Person · intrusion',
        ignored: 'Kangaroo · ignored',
      },
      body: 'Made for long-range perimeter protection and tuned for thermal cameras. It picks out people and vehicles entering a restricted area or loitering, and can hand off to a PTZ camera that zooms in and follows the intruder.',
    },
    {
      title: 'Licence plates',
      art: {
        type: 'plate',
        alt: 'A car at a boom gate has its plate read on the camera, matched to an allow list and let through',
        plate: 'XYZ 123',
        confidence: 'Allow list match',
        status: 'Boom gate open',
        statusTone: 'ok',
        lines: ['Silver sedan · Toyota', 'West car park · 07:58'],
      },
      body: 'AXIS License Plate Verifier reads plates on the camera, along with vehicle type, colour and make, and checks them against allow and block lists. A match can lift a boom gate, with rules such as staff parking between 8 am and 6 pm.',
    },
    {
      title: 'Security radar',
      art: {
        type: 'sensor',
        alt: 'A radar covering a yard picks up a person and a vehicle and filters out a swaying tree',
        icon: 'sensor',
        target: 'person',
        label: 'AXIS D2210-VE',
        sub: '60 GHz security radar',
        coverage: '95° field, people to 60 m, cars to 90 m',
        events: [
          { text: 'Person 42 m', sub: 'Tracked in yard', tone: 'alert' },
          { text: 'Vehicle 75 m', sub: 'Classified', tone: 'warn' },
          { text: 'Tree swaying', sub: 'Filtered out', tone: 'muted' },
        ],
      },
      body: 'Radar works in rain, fog and full darkness. The AXIS D2210-VE detects and tracks people out to 60 m and vehicles to 90 m across a 95° field, and filters out swaying branches and animals that set off ordinary motion alarms.',
    },
    {
      title: 'Network audio',
      art: {
        type: 'audio',
        alt: 'The security desk sending a live warning to a car park horn speaker while other zones play music or a recorded message',
        source: 'Security desk',
        sourceSub: 'AXIS Audio Manager',
        sourceIcon: 'mic',
        zones: [
          { name: 'Car park horn', note: 'Live talk-down', level: 80, live: true },
          { name: 'Shop floor', note: 'Background music', level: 40, live: false },
          { name: 'Loading dock', note: 'Recorded warning', level: 60, live: false },
        ],
        announcement: 'You are on camera. Please leave the car park now.',
      },
      body: 'Axis network speakers are powered over the network cable and carry their own amplifier. Use them for live or recorded talk-down from the security desk, as well as paging and background music, all run from AXIS Audio Manager.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Axis makes',
  range: [
    {
      title: 'Cameras',
      items: ['Dome, box and bullet', 'PTZ, panoramic and corner', 'Modular cameras for discreet fit-outs', 'Thermal and explosion-protected', 'Onboard cameras for road and rail'],
    },
    {
      title: 'Recording and software',
      items: ['AXIS Camera Station Pro', 'AXIS Camera Station Edge', 'AXIS S30 recorders and Axis SD cards', 'AXIS Device Manager', 'AXIS Site Designer for planning'],
    },
    {
      title: 'Access control and intercoms',
      items: ['Door controllers: AXIS A1210, A1610 and A1810-B', 'Network and OSDP readers', 'Network video intercoms', 'AXIS Camera Station Secure Entry'],
    },
    {
      title: 'Audio, radar and more',
      items: ['Network speakers and paging consoles', 'AXIS Audio Manager', 'Security and traffic radar', 'Body-worn cameras'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Axis system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Axis cameras, radar, doors and speakers report to AXIS Camera Station Pro, Camera Station Edge or another VMS, and people act from a desk or phone',
    devices: [
      { label: 'Cameras', sub: 'Dome, PTZ, thermal', icon: 'camera' },
      { label: 'Radar', sub: 'AXIS D2210-VE', icon: 'sensor' },
      { label: 'Door controllers', sub: 'AXIS A1610 + readers', icon: 'door' },
      { label: 'Speakers', sub: 'PoE network audio', icon: 'speaker' },
    ],
    platforms: [
      { label: 'ACS Pro', sub: 'Server on site', icon: 'server' },
      { label: 'ACS Edge', sub: 'Camera to cloud', icon: 'cloud' },
      { label: 'Your VMS', sub: 'Genetec or Milestone', icon: 'laptop' },
    ],
    people: [
      { label: 'Security desk', sub: 'ACS Pro client', icon: 'laptop' },
      { label: 'Phones', sub: 'ACS mobile app', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Analytics run on the cameras and radar; the server, cloud or VMS records and shows what they find',
  },
  architectureCaption: 'Axis cameras, radar, door controllers and speakers report to AXIS Camera Station Pro on site, AXIS Camera Station Edge in the cloud, or a VMS you already run. Your team works from the security desk or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Schools and universities', 'Healthcare', 'Government', 'Commercial property', 'Transport and car parks', 'Manufacturing', 'Utilities and critical infrastructure'],

  teracomHeading: 'What Teracom does on an Axis job',
  teracom: [
    { title: 'Design', body: 'Camera, radar and speaker positions planned from the site drawings, with storage and bandwidth worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'Every device mounted, cabled and focused, with analytics lines, zones and plate lists set up and tested before handover.' },
    { title: 'Connect to monitoring', body: 'Intrusion and analytics alarms can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'AXIS OS updates, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Axis technical documentation', href: 'https://help.axis.com/en-us/' },
    { label: 'AXIS Site Designer', href: 'https://www.axis.com/en-au/tools/axis-site-designer' },
    { label: 'Axis warranty', href: 'https://www.axis.com/en-au/support/warranty' },
  ],
};

export default axis;