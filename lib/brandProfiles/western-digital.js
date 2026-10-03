// The deeper Western Digital brand page (Robert, 2026-10-01: build the brand
// pages out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from westerndigital.com/en-au (October 2026): the
// WD Purple, WD Purple Pro, WD Red Plus, WD Red Pro, WD Gold, Ultrastar DC
// HC590, My Book and My Passport product pages, the surveillance and NAS
// solution pages, and the warranty policy. Figures are Western Digital’s own.
// Drawings are specs drawn by lib/brandArt.

const westernDigital = {
  heroArt: {
    type: 'hero',
    alt: 'A Western Digital hard drive between a video recorder fitted with WD Purple and a NAS fitted with WD Red, recording cameras and sharing files',
    device: 'server',
    left: { title: 'WD Purple', sub: 'Surveillance', foot: 'Up to 64 HD cameras', icon: 'camera' },
    right: { title: 'WD Red', sub: 'NAS drives', foot: 'Tuned with NASware', icon: 'server' },
    tags: [
      { text: 'AllFrame', tone: 'ok', icon: 'camera' },
      { text: 'RAID healthy', tone: 'ok', icon: 'shield' },
      { text: 'Up to 26TB', tone: 'accent', icon: 'server' },
    ],
    chips: [
      { text: 'Built for 24/7 use', tone: 'accent' },
      { text: 'Up to 5-year warranty', tone: 'muted' },
    ],
  },

  stats: [
    { value: '26TB', label: 'top size of WD Purple Pro, WD Red Pro, WD Gold and Ultrastar drives' },
    { value: '64 cameras', label: 'single-stream HD cameras on a WD Purple drive of 6TB or more' },
    { value: '550 TB/yr', label: 'workload rating of WD Purple Pro, WD Red Pro and WD Gold' },
    { value: '5 years', label: 'limited warranty on WD Purple Pro, WD Red Pro, WD Gold and Ultrastar' },
  ],

  platformsEyebrow: 'Two families we use most',
  platformsHeading: 'WD Purple for recorders, WD Red for NAS',
  platformsIntro: 'Western Digital makes a hard drive family for each kind of workload. On security and small-office jobs two matter most: WD Purple in the video recorder and WD Red in the NAS, each in a standard and a Pro version. We choose by camera count, bay count and workload, then check the recorder’s or NAS’s compatibility list.',
  platforms: [
    {
      name: 'WD Purple and WD Purple Pro',
      kicker: 'For video recorders',
      art: {
        type: 'storage',
        alt: 'WD Purple for mainstream recorders and WD Purple Pro for AI-enabled recorders, with their workload ratings and warranties',
        tiers: [
          { label: 'WD Purple', sub: 'Mainstream NVRs and DVRs', icon: 'camera' },
          { label: 'WD Purple Pro', sub: 'AI recorders and analytics servers', icon: 'server' },
        ],
        active: 1,
        stat: '26TB',
        statLabel: 'largest WD Purple Pro',
        badge: 'AllFrame AI',
        points: ['180 or 550 TB/yr', 'Up to 64 HD cameras', '3 or 5-year warranty'],
        caption: 'WD Purple for mainstream recorders, WD Purple Pro for AI and analytics',
      },
      body: 'Drives made for recorders that run around the clock, where heat and vibration are higher than in a desktop PC. WD Purple suits mainstream NVRs and DVRs of up to 16 bays; WD Purple Pro, up to 26TB, is for AI-enabled recorders and analytics servers with any number of bays.',
      points: [
        'AllFrame technology to reduce dropped frames in playback',
        'WD Purple: up to 180TB a year, up to 1M hours MTBF, 3-year warranty',
        'WD Purple Pro: up to 550TB a year, 2.5M hours MTBF, 5-year warranty',
        'Device Analytics (WDDA) health data on compatible recorders',
      ],
    },
    {
      name: 'WD Red Plus and WD Red Pro',
      kicker: 'For NAS',
      art: {
        type: 'onPrem',
        alt: 'Office PCs, cameras and backups stored on a NAS fitted with WD Red drives and shared by the team on site',
        devices: [
          { label: 'Office PCs', icon: 'laptop' },
          { label: 'Cameras', icon: 'camera' },
          { label: 'Backups', icon: 'shield' },
          { label: 'Many users', icon: 'person' },
        ],
        server: 'NAS',
        badge: 'WD Red inside',
        title: 'Multi-user NAS',
        sub: 'Always on, drives in RAID',
        points: ['NASware tuning', 'TLER for RAID', 'Up to 26TB (Pro)'],
      },
      body: 'Drives made for always-on NAS units where several drives share the work in RAID. NASware firmware tunes each drive to NAS workloads, and Western Digital tests the drives with a wide range of NAS makers.',
      points: [
        'WD Red Plus for small and medium business NAS, 3-year warranty',
        'WD Red Pro from 2TB to 26TB, for any number of bays',
        'WD Red Pro: up to 550TB a year and a 5-year warranty',
        'Rotational vibration sensors for multi-bay enclosures',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'The right drive, and enough of it',
  capabilitiesIntro: 'A drive’s job is to hold footage and files reliably for years. These are the parts of the Western Digital range that matter when we size storage for a site.',
  capabilities: [
    {
      title: 'Many cameras, every frame',
      art: {
        type: 'network',
        alt: 'A recorder with a WD Purple drive taking streams from up to 64 HD cameras, with AllFrame reducing dropped frames',
        uplink: 'NVR',
        switchLabel: 'WD Purple 6TB+',
        switchSub: 'Up to 64 HD cameras',
        ports: [
          { label: 'Gate', icon: 'camera' },
          { label: 'Car park', icon: 'bullet' },
          { label: 'Foyer', icon: 'camera' },
          { label: 'Dock', icon: 'bullet' },
          { label: 'Office', icon: 'camera' },
          { label: '+ 59 more', icon: 'camera', tone: 'muted' },
        ],
        caption: 'AllFrame helps cut frame loss when many cameras write at once',
      },
      body: 'WD Purple drives of 6TB and above handle up to 64 single-stream HD cameras, and also cameras that send extra streams for basic AI. AllFrame improves how video is streamed to the disk, cutting frame loss in playback.',
    },
    {
      title: 'Drive health with WDDA',
      art: {
        type: 'dashboard',
        alt: 'A recorder screen showing Western Digital Device Analytics results for four WD Purple drives, with one flagged for action',
        title: 'WDDA drive health',
        tiles: [
          { label: 'Drive 1', value: 'Healthy', tone: 'ok' },
          { label: 'Drive 2', value: 'Healthy', tone: 'ok' },
          { label: 'Drive 3', value: 'Healthy', tone: 'ok' },
          { label: 'Drive 4', value: 'Action', tone: 'warn' },
        ],
        bars: [30, 32, 31, 35, 33, 34, 36, 33],
        chart: 'Storage used (TB)',
        eventsTitle: 'Recommendations',
        events: [
          { text: 'Drives 1 to 3 OK', tone: 'ok' },
          { text: 'Drive 4: replace soon', tone: 'warn' },
          { text: 'Spare drive ordered', tone: 'accent' },
        ],
      },
      body: 'Western Digital Device Analytics passes operating and diagnostic data from each drive to a compatible recorder, which turns it into recommended actions, so a tired drive can be swapped before it fails.',
    },
    {
      title: 'Sizing the storage',
      art: {
        type: 'prompt',
        alt: 'The Western Digital surveillance storage estimator turning cameras, resolution and retention into a total capacity',
        heading: 'Storage capacity estimator',
        prompt: '16 cameras, 4MP, H.265, 24 hours a day, keep 31 days',
        cards: [
          { label: 'Cameras', value: '16 at 4MP', sub: 'H.265, medium' },
          { label: 'Recording', value: '24 h a day', sub: 'Kept for 31 days' },
          { label: 'Result', value: 'Total TB', sub: 'Then choose drives' },
        ],
      },
      body: 'Western Digital’s surveillance storage estimator works out capacity from the camera count, resolution, video format, quality, scene activity, frame rate, hours a day and days kept. Most businesses keep 30 to 90 days, and some industries must keep more.',
    },
    {
      title: 'Built for RAID',
      art: {
        type: 'sensor',
        alt: 'A WD Red Pro drive in a busy multi-bay NAS sensing vibration from its neighbours and holding performance steady',
        icon: 'server',
        target: 'server',
        label: 'WD Red Pro',
        sub: 'RV sensors and TLER',
        coverage: 'Multi-bay NAS, tower or rack',
        events: [
          { text: 'Vibration seen', sub: 'From bay 3', tone: 'warn' },
          { text: 'Drive adjusts', sub: 'RV sensors', tone: 'accent' },
          { text: 'RAID steady', sub: 'TLER error limit', tone: 'ok' },
        ],
      },
      body: 'In a box full of spinning drives, vibration from one drive affects the next. WD Red drives use rotational vibration sensors to counter it, and RAID error recovery control (Time-Limited Error Recovery on WD Red Pro) helps keep the array running without interruption.',
    },
    {
      title: 'Enterprise and data centre',
      art: {
        type: 'storage',
        alt: 'WD Gold and Ultrastar DC HC590 drives built on an 11-disk platform of up to 26TB, with their reliability ratings',
        tiers: [
          { label: 'WD Gold', sub: 'Servers and AI workstations', icon: 'server' },
          { label: 'Ultrastar DC HC590', sub: 'Data centre storage', icon: 'cloud' },
        ],
        active: 0,
        stat: '26TB',
        statLabel: 'on an 11-disk platform',
        badge: 'HelioSeal',
        points: ['2.5M hours MTBF', '550 TB/yr (WD Gold)', '5-year warranty'],
        caption: 'Eleven disks in one drive for more capacity in the same bay',
      },
      body: 'WD Gold and Ultrastar DC HC590 reach 26TB on an 11-disk CMR platform, with 2.5 million hours MTBF and a 5-year warranty. WD Gold adds ArmorCache power-loss protection from 22TB, and Ultrastar uses OptiNAND flash to free up capacity.',
    },
    {
      title: 'A drive for every box',
      art: {
        type: 'network',
        alt: 'Western Digital drive families matched to a video recorder, a NAS, a server and a desktop backup drive',
        uplink: 'WD',
        switchLabel: 'Match the workload',
        switchSub: 'Purple, Red, Gold, My Book',
        ports: [
          { label: 'NVR', icon: 'camera', tone: 'accent' },
          { label: 'NAS', icon: 'server', tone: 'accent' },
          { label: 'Servers', icon: 'server', tone: 'accent' },
          { label: 'Backup', icon: 'shield', tone: 'muted' },
          { label: 'On the go', icon: 'bag', tone: 'muted' },
        ],
        caption: 'WD Purple for NVRs, WD Red for NAS, WD Gold for servers',
      },
      body: 'Each family has its own job: WD Purple in recorders, WD Red in NAS units, WD Gold and Ultrastar in servers and data centres, My Book drives of up to 26TB for desktop backup, and My Passport drives of up to 6TB to carry.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Western Digital makes',
  range: [
    {
      title: 'Surveillance',
      items: ['WD Purple for mainstream NVRs and DVRs of up to 16 bays', 'WD Purple Pro up to 26TB for AI-enabled recorders', 'Surveillance storage capacity estimator'],
    },
    {
      title: 'NAS',
      items: ['WD Red Plus for small and medium business NAS', 'WD Red Pro from 2TB to 26TB, for any number of bays'],
    },
    {
      title: 'Enterprise and data centre',
      items: ['WD Gold enterprise drives up to 26TB', 'Ultrastar DC HC590 data centre drives up to 26TB'],
    },
    {
      title: 'External',
      items: ['My Book desktop drives up to 26TB', 'My Passport portable drives up to 6TB'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'Western Digital drives in a Teracom system',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras record to an NVR fitted with WD Purple and office PCs save to a NAS fitted with WD Red Pro, used by the security desk, staff and Teracom',
    columns: ['On site', 'Storage', 'People'],
    devices: [
      { label: 'IP cameras', sub: 'Recorded 24/7', icon: 'camera' },
      { label: 'Office PCs', sub: 'Files and backups', icon: 'laptop' },
      { label: 'Servers', sub: 'Business systems', icon: 'server' },
    ],
    platforms: [
      { label: 'NVR', sub: 'WD Purple drives', icon: 'server' },
      { label: 'NAS', sub: 'WD Red Pro drives', icon: 'server' },
    ],
    people: [
      { label: 'Security desk', sub: 'Footage on demand', icon: 'laptop' },
      { label: 'Staff', sub: 'Shared files', icon: 'person' },
      { label: 'Teracom', sub: 'Drive health and swaps', icon: 'headset' },
    ],
    footer: 'Surveillance drives in the recorder, NAS drives in the file server, each sized for how long data must be kept',
  },
  architectureCaption: 'Cameras record to an NVR fitted with WD Purple, and office machines save to a NAS fitted with WD Red Pro. The security desk and staff work as normal, and we check drive health and replace a drive before it fails.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Schools', 'Small and medium businesses', 'Warehousing and logistics', 'Commercial property', 'Healthcare', 'Councils'],

  teracomHeading: 'What Teracom does with Western Digital',
  teracom: [
    { title: 'Advise', body: 'Drive family and capacity worked out from the camera count, recording settings and how long footage must be kept, or from the office’s data and backup needs.' },
    { title: 'Supply', body: 'Western Digital drives supplied through our distributors and checked against the recorder’s or NAS maker’s compatibility list.' },
    { title: 'Set up', body: 'Drives fitted, RAID built and health monitoring switched on in the NVR or NAS before handover.' },
    { title: 'Support', body: 'Drive health checked on a maintenance plan, with failing drives replaced and help lodging warranty claims for drives bought from us.' },
  ],

  links: [
    { label: 'WD Purple surveillance drives', href: 'https://www.westerndigital.com/en-au/products/internal-drives/wd-purple-sata-hdd' },
    { label: 'Western Digital surveillance storage', href: 'https://www.westerndigital.com/en-au/solutions/surveillance' },
    { label: 'Western Digital warranty policy', href: 'https://www.westerndigital.com/en-au/support/store/warranty-policy' },
  ],
};

export default westernDigital;