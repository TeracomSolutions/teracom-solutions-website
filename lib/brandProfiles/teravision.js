// The deeper TeraVision brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// TeraVision is Teracom's own range, so there is no manufacturer site: written
// in our own words from the TeraVision entry in brands.js and the live page
// teracomsolutions.com.au/brands/teravision (October 2026). No specifications
// or figures beyond those. Drawings are specs drawn by lib/brandArt.

const teravision = {
  heroArt: {
    type: 'hero',
    alt: 'A TeraVision camera recording to an NVR or XVR on site and sending live view and playback to the BitVision app on a phone',
    device: 'camera',
    left: { title: 'NVR or XVR', sub: 'Local storage', foot: 'Five input formats', icon: 'server' },
    right: { title: 'BitVision', sub: 'Phone app', foot: 'Live view and playback', icon: 'phone' },
    tags: [
      { text: 'Face match', tone: 'ok', icon: 'face' },
      { text: 'Front entry', tone: 'accent', icon: 'door' },
      { text: 'Car park', tone: 'muted', icon: 'vehicle' },
    ],
    chips: [
      { text: 'TeraVision', tone: 'accent' },
      { text: 'Cloud backup on', tone: 'ok' },
    ],
  },

  stats: [
    { value: '35+', label: 'years of Teracom CCTV work in Australia, since 1990' },
    { value: '5 formats', label: 'AHD, CVI, TVI, IP and analogue on the one recorder' },
    { value: 'BitVision', label: 'app for live view and playback from a phone' },
    { value: 'Dropbox', label: 'or Google Drive cloud backup alongside local recording' },
  ],

  platformsEyebrow: 'Two families',
  platformsHeading: 'IP cameras on NVRs, coax cameras on XVRs',
  platformsIntro: 'TeraVision comes in two families that share the same app and client software. Which one suits depends on the cabling already in the building, how many cameras are needed and how far the system has to grow.',
  platforms: [
    {
      name: 'IP cameras and NVRs',
      kicker: 'Network video',
      art: {
        type: 'network',
        alt: 'TeraVision fisheye, PTZ, indoor and outdoor IP cameras joining the site network and recording to an NVR, with a PC running iVMS320',
        uplink: 'NVR',
        switchLabel: 'Site network',
        switchSub: 'IP cameras to the NVR',
        ports: [
          { label: 'Fisheye', icon: 'camera' },
          { label: 'PTZ', icon: 'camera' },
          { label: 'Indoor', icon: 'camera' },
          { label: 'Outdoor', icon: 'bullet' },
          { label: 'iVMS320', icon: 'laptop', tone: 'accent' },
        ],
        caption: 'Each IP camera joins the network and records to the NVR',
      },
      body: 'IP cameras connect over the site network and record to a TeraVision NVR. It is the natural choice for new buildings and for systems that will keep growing, from a small business up to enterprise-scale CCTV.',
      points: [
        'Fisheye, PTZ, indoor and outdoor IP cameras',
        'NVRs for local recording on site',
        'Facial recognition on compatible models',
        'Viewed in iVMS320 on a PC or Mac, or BitVision on a phone',
      ],
    },
    {
      name: 'HD-over-coax and XVRs',
      kicker: 'Mixed fleets',
      art: {
        type: 'onPrem',
        alt: 'AHD, CVI, TVI and IP cameras all recording to one TeraVision XVR on site, so older and newer cameras share a recorder',
        devices: [
          { label: 'AHD camera', icon: 'camera' },
          { label: 'CVI camera', icon: 'camera' },
          { label: 'TVI camera', icon: 'bullet' },
          { label: 'IP camera', icon: 'camera' },
        ],
        server: 'XVR',
        badge: '5 input formats',
        title: 'One recorder',
        sub: 'Old and new cameras mixed',
        points: ['Keeps coax runs', 'Add IP over time', 'Keeps analogue'],
      },
      body: 'The XVRs take HD-over-coax cameras alongside IP and older analogue cameras on the one recorder. A site with coax already in the walls can keep it and change cameras when it suits, instead of replacing the whole fleet at once.',
      points: [
        'Records AHD, CVI, TVI, IP and analogue cameras',
        'Re-uses coax cabling already in place',
        'Upgrade a few cameras at a time',
        'Same BitVision app and iVMS320 software as the IP family',
      ],
    },
  ],

  capabilitiesEyebrow: 'Features',
  capabilitiesHeading: 'What the range actually does',
  capabilitiesIntro: 'TeraVision sticks to the features our customers use day to day: watching from anywhere, picking out faces, keeping a second copy of the footage, and getting a site set up quickly.',
  capabilities: [
    {
      title: 'Remote viewing with BitVision',
      art: {
        type: 'mobile',
        alt: 'The BitVision app on a phone showing the front entrance camera, with buttons for live view and playback',
        app: 'BitVision',
        icon: 'camera',
        tone: 'accent',
        notice: 'Cam 2 live',
        sub: 'Front entrance',
        time: 'Today, 9:41 am',
        actions: ['Live view', 'Playback'],
        side: [
          { label: 'Cam 1', sub: 'Car park', icon: 'bullet' },
          { label: 'Cam 2', sub: 'Front entrance', icon: 'camera' },
          { label: 'Cam 3', sub: 'Stock room', icon: 'camera' },
        ],
      },
      body: 'BitVision puts live view and playback on a phone, so an owner can check the shop or the house from anywhere and look back at what happened without going to the recorder.',
    },
    {
      title: 'Facial recognition',
      art: {
        type: 'search',
        alt: 'A face at the front entrance camera checked against a list of enrolled people, with one match picked out',
        query: 'Face at front entrance vs enrolled list',
        badge: '1 match',
        results: [
          { label: 'Staff member 04', score: 'Match', highlight: true },
          { label: 'Staff member 11' },
          { label: 'Contractor 02' },
          { label: 'Unknown visitor' },
        ],
        caption: 'A face at the camera is checked against an enrolled list',
      },
      body: 'Compatible TeraVision models include facial recognition, so faces at an entrance or a counter can be picked out and checked rather than simply recorded.',
    },
    {
      title: 'Cloud or local, your choice',
      art: {
        type: 'storage',
        alt: 'Footage recorded on a TeraVision recorder on site, with a backup copy in Dropbox or Google Drive and playback on a phone',
        tiers: [
          { label: 'TeraVision NVR or XVR', sub: 'Local recording on site', icon: 'server' },
          { label: 'Dropbox or Google Drive', sub: 'Backup copy in the cloud', icon: 'cloud' },
          { label: 'BitVision app', sub: 'Playback from a phone', icon: 'phone' },
        ],
        active: 1,
        stat: '2',
        statLabel: 'places footage is kept',
        badge: 'Cloud or local',
        points: ['Recorder on site', 'Dropbox backup', 'Google Drive backup'],
        caption: 'Footage is not left relying on a single recorder',
      },
      body: 'Footage records locally, and TeraVision can also back it up to Dropbox or Google Drive. A second copy off site means the footage does not rest on one recorder that could fail or be taken.',
    },
    {
      title: 'iVMS320 on a PC or Mac',
      art: {
        type: 'dashboard',
        alt: 'The iVMS320 client on a desk PC showing cameras, recorders and backup status, a week of activity and the latest events',
        title: 'iVMS320 client',
        tiles: [
          { label: 'Cameras online', value: '12', tone: 'ok' },
          { label: 'Recorders', value: '2', tone: 'accent' },
          { label: 'Cloud backup', value: 'On', tone: 'ok' },
          { label: 'Offline', value: '0', tone: 'muted' },
        ],
        bars: [5, 8, 6, 9, 7, 3, 2],
        chart: 'Activity this week',
        eventsTitle: 'Latest',
        events: [
          { text: 'Face match: entrance', tone: 'ok' },
          { text: 'Backup to Dropbox', tone: 'ok' },
          { text: 'Playback: Cam 3', tone: 'muted' },
          { text: 'Cam 9 back online', tone: 'warn' },
        ],
      },
      body: 'At a desk, iVMS320 client software on a PC or Mac connects to TeraVision recorders and cameras for viewing and playback. It suits a reception, an office or a security room where a bigger screen helps.',
    },
    {
      title: 'A camera for each spot',
      art: {
        type: 'map',
        alt: 'A floor plan of a small business with a fisheye, a PTZ and fixed indoor and outdoor cameras placed where each suits',
        markers: [
          { x: 50, y: 45, icon: 'camera', tone: 'accent', label: 'Fisheye' },
          { x: 20, y: 22, icon: 'camera', label: 'Entrance' },
          { x: 80, y: 20, icon: 'camera', label: 'Counter' },
          { x: 78, y: 72, icon: 'camera', label: 'Stock room' },
          { x: 10, y: 82, icon: 'bullet', label: 'Car park' },
          { x: 92, y: 88, icon: 'camera', tone: 'ok', label: 'PTZ yard' },
        ],
        caption: 'Fisheye, PTZ, indoor and outdoor placed',
      },
      body: 'The range covers fisheye, PTZ, indoor and outdoor cameras. A fisheye can take in a whole open room, a PTZ can be steered and zoomed across a yard or car park, and fixed cameras cover doors, counters and driveways.',
    },
    {
      title: 'Quick to find, quick to set up',
      art: {
        type: 'search',
        alt: 'The iVMS320 IP search tool listing the TeraVision recorders and cameras it found on the network, with a new camera highlighted',
        query: 'IP search: TeraVision devices on this LAN',
        badge: '6 found',
        results: [
          { label: 'XVR, comms room', kind: 'server' },
          { label: 'Cam 1, car park', kind: 'bullet' },
          { label: 'New PTZ, yard', kind: 'camera', highlight: true },
          { label: 'Cam 4, entrance', kind: 'camera' },
        ],
        caption: 'Every product line also ships with a quick-start guide and manual',
      },
      body: 'The IP search tool in iVMS320 lists the TeraVision recorders and cameras on a network, so they can be found and set up without hunting for addresses. Every product line also comes with its own quick-start guide and user manual.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What TeraVision includes',
  range: [
    {
      title: 'Cameras',
      items: ['Fisheye', 'PTZ', 'Indoor', 'Outdoor', 'Facial recognition on compatible models'],
    },
    {
      title: 'Recorders',
      items: ['NVRs for IP cameras', 'XVRs for HD-over-coax, IP and analogue cameras', 'Local recording, with cloud backup to Dropbox or Google Drive'],
    },
    {
      title: 'Supported formats',
      items: ['IP', 'AHD', 'CVI', 'TVI', 'Analogue'],
    },
    {
      title: 'Software and guides',
      items: ['BitVision app for phones', 'iVMS320 client for PC or Mac', 'IP search tool for finding devices', 'Quick-start guide and user manual for every product line'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom TeraVision system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'IP, HD-over-coax and analogue cameras record to TeraVision NVRs and XVRs with cloud backup, viewed on BitVision and iVMS320',
    columns: ['On site', 'Recording', 'People'],
    devices: [
      { label: 'IP cameras', sub: 'Indoor and outdoor', icon: 'camera' },
      { label: 'HD-over-coax', sub: 'AHD, CVI and TVI', icon: 'bullet' },
      { label: 'Analogue cameras', sub: 'Existing coax runs', icon: 'camera' },
    ],
    platforms: [
      { label: 'TeraVision NVR', sub: 'Records IP cameras', icon: 'server' },
      { label: 'TeraVision XVR', sub: 'Mixed-format recording', icon: 'server' },
      { label: 'Cloud backup', sub: 'Dropbox, Google Drive', icon: 'cloud' },
    ],
    people: [
      { label: 'Owners', sub: 'BitVision on a phone', icon: 'phone' },
      { label: 'Front desk', sub: 'iVMS320 on PC or Mac', icon: 'laptop' },
      { label: 'Teracom', sub: 'Install and support', icon: 'headset' },
    ],
    footer: 'Cameras of every generation record on site, back up to the cloud and are viewed on a phone or a PC',
  },
  architectureCaption: 'IP cameras record to a TeraVision NVR, and mixed coax and IP fleets to an XVR, with a backup copy in Dropbox or Google Drive. Owners watch on BitVision, the front desk uses iVMS320, and Teracom looks after the system.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail shops', 'Small businesses', 'Offices', 'Warehouses', 'Car parks and yards', 'Homes', 'Schools', 'Multi-site businesses'],

  teracomHeading: 'What Teracom does with TeraVision',
  teracom: [
    { title: 'Design', body: 'Camera types and positions planned from the site drawings, with an NVR or XVR chosen to suit the cabling already there and storage sized before anything is ordered.' },
    { title: 'Supply', body: 'TeraVision is our own range, so cameras and recorders come straight from Teracom, chosen to work together and matched to the job.' },
    { title: 'Install and commission', body: 'Cameras mounted, cabled and aimed, recorders set up with cloud backup, and BitVision and iVMS320 connected for the people who will use them.' },
    { title: 'Support', body: 'Because it is our own range, questions and faults come back to the team that chose and installed it, with maintenance to keep the system healthy.' },
  ],

  links: [
    { label: 'Teracom Store', href: 'https://www.teracomsolutions.com.au/store' },
    { label: 'Teracom CCTV and video surveillance', href: 'https://www.teracomsolutions.com.au/services/cctv' },
    { label: 'Talk to the Teracom team', href: 'https://www.teracomsolutions.com.au/contact' },
  ],
};

export default teravision;