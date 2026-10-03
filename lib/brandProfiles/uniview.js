// The deeper Uniview brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from uniview.com (October 2026); figures are
// Uniview's own. Drawings are specs drawn by lib/brandArt.

const uniview = {
  heroArt: {
    type: 'hero',
    alt: 'A Uniview camera telling people and vehicles apart, recording to a UNV NVR on site and sending alerts to the UniEase app',
    device: 'camera',
    left: { title: 'UNV NVR', sub: 'IQ, IM and IX', foot: 'Records and searches', icon: 'server' },
    right: { title: 'UniEase', sub: 'Phone app', foot: 'Live view and alarms', icon: 'phone' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Deterrence on', tone: 'warn', icon: 'speaker' },
    ],
    chips: [
      { text: 'Colour at night', tone: 'accent' },
      { text: 'Fewer false alarms', tone: 'ok' },
    ],
  },

  stats: [
    { value: 'Under 3%', label: 'false alarm rate Uniview quotes for Smart Intrusion Prevention' },
    { value: 'F1.0', label: 'lens or a 1/1.8-inch sensor on every OwlView camera, for night colour' },
    { value: '56 drives', label: 'on a Pro series NVR with two disk enclosures added' },
    { value: 'For ANZ', label: 'camera models, with signed Australian cyber security statements' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'A UNV recorder, or the UNV Guard platform',
  platformsIntro: 'Most Uniview sites run on a network video recorder that does the AI work itself. Larger sites that also want doors, attendance and reporting in one place step up to UNV Guard. We help you choose on camera count, the other systems involved and how the site is managed.',
  platforms: [
    {
      name: 'UNV recorders',
      kicker: 'Recorder on site',
      art: {
        type: 'onPrem',
        alt: 'Uniview turret, PTZ, thermal and plate cameras recording to a UNV NVR on site, with search and RAID built in',
        devices: [
          { label: 'Turrets', icon: 'camera' },
          { label: 'PTZ', icon: 'bullet' },
          { label: 'Thermal', icon: 'thermo' },
          { label: 'Plates', icon: 'vehicle' },
        ],
        server: 'UNV NVR',
        badge: 'AI search on NVR',
        title: 'Recorded on site',
        sub: 'EZStation and UniEase app',
        points: ['SeekFree text', 'AcuSearch', 'RAID and failover'],
      },
      body: 'Cameras record to a UNV NVR, and the NVR runs the search and intrusion analytics itself. EZStation 3.0 on a Windows or Mac PC brings several recorders onto one screen, and the UniEase app puts live view, playback and alarms on a phone.',
      points: [
        'IQ, IM and IX smart NVRs, the IX series with over 20 analytics',
        'EZStation 3.0 for live view, playback, e-maps and video walls',
        'UniEase with one-tap arming, playback and camera sharing',
        'Pro series with RAID, 1+1 failover and up to 56 drives',
      ],
    },
    {
      name: 'UNV Guard',
      kicker: 'Central platform',
      art: {
        type: 'dashboard',
        alt: 'A UNV Guard screen for a school showing cameras online, doors, people counted and open alarms, with entries by hour and recent events',
        title: 'UNV Guard · Campus',
        tiles: [
          { label: 'Cameras online', value: '128', tone: 'ok' },
          { label: 'Doors', value: '24', tone: 'accent' },
          { label: 'People today', value: '1,840', tone: 'accent' },
          { label: 'Open alarms', value: '2', tone: 'warn' },
        ],
        bars: [35, 80, 95, 60, 45, 50, 85, 40],
        chart: 'Entries by hour',
        eventsTitle: 'Recent events',
        events: [
          { text: 'Gate 2 · card granted', tone: 'ok' },
          { text: 'Oval · line crossed', tone: 'warn' },
          { text: 'Camera 14 offline', tone: 'alert' },
          { text: 'Staff check-in 08:02', tone: 'muted' },
        ],
      },
      body: 'A management platform that puts video, access control, attendance and intercom in one interface, with modules added as the site needs them. It runs on a modest PC, from an Intel Core i3-8100 up, or on a UNV Guard all-in-one server.',
      points: [
        'Video, access control, attendance and intercom modules',
        'E-maps, alarm handling, people counting and data reports',
        'Third-party cameras over ONVIF, plus an open API',
        'All-in-one Guard server with 16 drive bays',
      ],
    },
  ],

  capabilitiesEyebrow: 'AI and imaging',
  capabilitiesHeading: 'What the cameras and recorders actually do',
  capabilitiesIntro: 'Uniview puts most of its intelligence in the NVR and the camera rather than in extra servers. These are the features we set up most often.',
  capabilities: [
    {
      title: 'SeekFree and AcuSearch',
      art: {
        type: 'search',
        alt: 'A typed description of a man pushing a bike finds him on three cameras at a depot, best match first',
        query: 'Man in a red jacket pushing a bike',
        badge: '3 matches',
        results: [
          { label: 'Gate 1 · 21:42', score: '96%', highlight: true },
          { label: 'Car park · 21:38', score: '88%' },
          { label: 'Lobby · 21:30', score: '71%' },
        ],
        caption: 'Typed words find the person across every camera on the NVR',
      },
      body: 'SeekFree NVRs search recorded video from a typed description, such as a person pushing a pram, and return matches from every camera in seconds. AcuSearch does the same from a box drawn around someone on screen, with up to eight targets at once.',
    },
    {
      title: 'Smart Intrusion Prevention',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a yard fence alerts on a person crossing it and ignores a possum',
        lineLabel: 'Yard fence',
        alert: 'Person · line crossed',
        ignored: 'Possum · ignored',
      },
      body: 'Line-crossing and intrusion rules that sort people from vehicles and ignore leaves, lights and animals. Playback can then be filtered by camera, time and target type, so finding the one real event takes minutes.',
    },
    {
      title: 'Tri-Guard deterrence',
      art: {
        type: 'mobile',
        alt: 'A UniEase alert from a Tri-Guard camera with buttons to talk or view the clip, beside its red and blue lights, speaker and microphone',
        app: 'UniEase',
        icon: 'person',
        tone: 'alert',
        notice: 'Person seen',
        sub: 'Rear yard · Tri-Guard',
        time: 'Today 1:47 am',
        actions: ['Talk', 'View clip'],
        side: [
          { label: 'Lights', sub: 'Red and blue', icon: 'bolt' },
          { label: 'Speaker', sub: '3 W warning', icon: 'speaker' },
          { label: 'Talk-back', sub: 'Built-in mic', icon: 'mic' },
        ],
      },
      body: 'Tri-Guard cameras pair intrusion detection with colour imaging at night and a warning on the spot. When someone enters a protected area, Tri-Guard 2.0 models flash red and blue lights and sound a 3 W speaker, and the built-in mic lets you speak to them.',
    },
    {
      title: 'Thermal and fire detection',
      art: {
        type: 'thermal',
        alt: 'A dual-spectrum thermal camera picking out a hot spot in a storage bay at night',
        temp: '96 °C',
        alert: 'Hot spot · bay 3',
      },
      body: 'Dual-spectrum bullets pair a thermal sensor with a normal lens. They run intrusion rules on both channels day and night, detect smoke and flame, and carry red and blue lights with a voice warning.',
    },
    {
      title: 'Plates and parking',
      art: {
        type: 'plate',
        alt: 'A car at a staff car park boom gate has its plate read and is let in automatically',
        plate: '2XR 7KM',
        confidence: 'Plate read 97%',
        status: 'Boom gate open',
        statusTone: 'ok',
        lines: ['Staff parking list', 'Entry lane 1 · 07:56'],
      },
      body: 'Plate recognition cameras read vehicles at entries and exits. Parking space detection cameras, including 12 MP fisheye models, feed guidance and availability screens that point drivers to free bays.',
    },
    {
      title: 'MultiView and OmniView',
      art: {
        type: 'map',
        alt: 'A loading yard plan where one MultiView camera and two panoramic cameras cover the whole area, with one person flagged near the dock',
        markers: [
          { x: 50, y: 48, icon: 'camera', tone: 'accent', label: 'MultiView' },
          { x: 12, y: 18, icon: 'camera', label: 'OmniView' },
          { x: 88, y: 20, icon: 'camera', label: 'Fisheye' },
          { x: 20, y: 82, icon: 'vehicle', label: 'Bay 4' },
          { x: 78, y: 80, icon: 'person', tone: 'warn', label: 'Dock' },
          { x: 50, y: 12, icon: 'door', label: 'Gate' },
        ],
        caption: 'Three cameras covering the whole yard',
      },
      body: 'MultiView cameras carry several lenses on one IP address, with a detail lens that zooms in and follows a target while the wide view keeps watching. OmniView models cover up to 180°, and fisheye models a full 360°.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Uniview makes',
  range: [
    {
      title: 'Cameras',
      items: ['Easy, Prime and Pro series IP cameras', 'OwlView and ColorHunter for colour at night', 'Tri-Guard deterrence cameras', 'MultiView, OmniView and fisheye', 'PTZ, thermal and explosion-proof'],
    },
    {
      title: 'Recording and software',
      items: ['Easy, Prime and Pro series NVRs', 'IQ, IM and IX smart NVRs with SeekFree', 'EZStation 3.0 and UNV Guard', 'UniEase and UniTools Pro apps'],
    },
    {
      title: 'Access and intercom',
      items: ['Card readers and door controllers', 'Video intercom door and indoor stations', 'Tripod and swing speed gates'],
    },
    {
      title: 'Beyond cameras',
      items: ['Plate recognition and parking guidance', 'Network switches and wireless links', 'Video storage and disk enclosures', 'IP speakers', 'Solar power products'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Uniview system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Uniview cameras, thermal and plate cameras and door controllers report to a UNV NVR or UNV Guard, and people act from a desk, a phone or monitoring',
    devices: [
      { label: 'IP cameras', sub: 'OwlView, Tri-Guard', icon: 'camera' },
      { label: 'Thermal cameras', sub: 'Fire and perimeter', icon: 'thermo' },
      { label: 'Plate cameras', sub: 'Gates and car parks', icon: 'vehicle' },
      { label: 'Door controllers', sub: 'Readers, intercoms', icon: 'reader' },
    ],
    platforms: [
      { label: 'UNV NVR', sub: 'SeekFree, AcuSearch', icon: 'server' },
      { label: 'UNV Guard', sub: 'Video, doors, people', icon: 'chart' },
    ],
    people: [
      { label: 'Security desk', sub: 'EZStation or Guard', icon: 'laptop' },
      { label: 'Phones', sub: 'UniEase app', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Cameras sort people from vehicles; the NVR searches the footage and UNV Guard adds doors and reports',
  },
  architectureCaption: 'Uniview cameras, thermal and plate cameras and door controllers report to a UNV NVR, with UNV Guard added where the site needs doors and reporting in one place. Your team works from the desk or the UniEase app, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Small and medium businesses', 'Schools', 'Hospitals', 'Hotels', 'Warehousing and logistics', 'Farms', 'Car parks'],

  teracomHeading: 'What Teracom does on a Uniview job',
  teracom: [
    { title: 'Design', body: 'Camera positions, lenses and recorders planned from the site drawings, with storage and bandwidth worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'Cameras mounted, cabled and focused, with intrusion lines, deterrence and search set up so alerts mean something from the first day.' },
    { title: 'Connect to monitoring', body: 'Intrusion and deterrence events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, security updates and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Uniview download centre', href: 'https://www.uniview.com/Support/Download_Center/Product_Resource/Network_Cameras/' },
    { label: 'Uniview Australian cyber security statements', href: 'https://www.uniview.com/Support/Download_Center/Statement/' },
    { label: 'UNV Guard platform', href: 'https://www.uniview.com/Technology/UNV_Guard/' },
  ],
};

export default uniview;