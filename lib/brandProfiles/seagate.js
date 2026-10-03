// The deeper Seagate brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from seagate.com/au/en (October 2026): the
// SkyHawk, SkyHawk AI, IronWolf, IronWolf Pro and Exos product pages and the
// Warranty & Replacements page, plus Seagate’s own press releases on
// investors.seagate.com for Mozaic 4+ and the desktop range. Figures are
// Seagate’s own. Drawings are specs drawn by lib/brandArt.

const seagate = {
  heroArt: {
    type: 'hero',
    alt: 'A Seagate hard drive between a video recorder using SkyHawk AI and a NAS using IronWolf Pro, with frame-perfect recording and drive health checks',
    device: 'server',
    left: { title: 'SkyHawk AI', sub: 'Surveillance', foot: 'Up to 64 HD cameras', icon: 'camera' },
    right: { title: 'IronWolf', sub: 'NAS drives', foot: 'Health checks in the NAS', icon: 'server' },
    tags: [
      { text: 'ImagePerfect', tone: 'ok', icon: 'camera' },
      { text: '32 AI streams', tone: 'accent', icon: 'chart' },
      { text: 'Health OK', tone: 'ok', icon: 'shield' },
    ],
    chips: [
      { text: 'Up to 32TB per drive', tone: 'accent' },
      { text: '3-year Rescue included', tone: 'ok' },
    ],
  },

  stats: [
    { value: '32TB', label: 'top size of SkyHawk AI, IronWolf Pro and Exos drives' },
    { value: '64 cameras', label: 'HD streams per SkyHawk drive, plus 32 AI streams on SkyHawk AI' },
    { value: '550 TB/yr', label: 'workload rating of SkyHawk AI, IronWolf Pro and Exos' },
    { value: '5 years', label: 'limited warranty on SkyHawk AI, IronWolf Pro and Exos' },
  ],

  platformsEyebrow: 'Two families we use most',
  platformsHeading: 'SkyHawk for recorders, IronWolf for NAS',
  platformsIntro: 'Seagate makes a hard drive family for each kind of system. On security and small-office jobs two matter most: SkyHawk in the video recorder and IronWolf in the NAS, each with a heavier-duty version. We choose by camera count, bay count and workload, then check the recorder’s or NAS’s compatibility list.',
  platforms: [
    {
      name: 'SkyHawk and SkyHawk AI',
      kicker: 'For video recorders',
      art: {
        type: 'storage',
        alt: 'SkyHawk for mainstream recorders and SkyHawk AI for AI-enabled recorders, with their capacities, workload ratings and warranties',
        tiers: [
          { label: 'SkyHawk', sub: '1TB to 8TB, mainstream NVRs', icon: 'camera' },
          { label: 'SkyHawk AI', sub: '8TB to 32TB, AI-enabled NVRs', icon: 'server' },
        ],
        active: 1,
        stat: '32',
        statLabel: 'AI streams at once',
        badge: 'ImagePerfect AI',
        points: ['180 or 550 TB/yr', 'Up to 64 HD cameras', '3 or 5-year warranty'],
        caption: 'SkyHawk for mainstream recorders, SkyHawk AI for AI and analytics',
      },
      body: 'Drives made for recorders writing video around the clock. SkyHawk covers mainstream DVRs and NVRs from 1TB to 8TB, and SkyHawk AI runs from 8TB to 32TB for recorders doing video analytics, handling 64 HD cameras and 32 AI streams at once.',
      points: [
        'ImagePerfect firmware to keep frames from being dropped',
        'SkyHawk: 180TB a year, 1M hours MTBF, 3-year warranty',
        'SkyHawk AI: 550TB a year and a 5-year warranty',
        'SkyHawk AI optimised for platforms such as Hikvision, Dahua and QNAP',
      ],
    },
    {
      name: 'IronWolf and IronWolf Pro',
      kicker: 'For NAS',
      art: {
        type: 'onPrem',
        alt: 'Office PCs, cameras and backups stored on a NAS fitted with IronWolf Pro drives and shared by the team on site',
        devices: [
          { label: 'Office PCs', icon: 'laptop' },
          { label: 'Cameras', icon: 'camera' },
          { label: 'Backups', icon: 'shield' },
          { label: 'Many users', icon: 'person' },
        ],
        server: 'NAS',
        badge: 'IronWolf Pro',
        title: 'Multi-user NAS',
        sub: 'Always on, drives in RAID',
        points: ['AgileArray', 'Health Management', 'Up to 32TB (Pro)'],
      },
      body: 'CMR drives made for always-on NAS units, with AgileArray firmware for smooth RAID performance. IronWolf suits home, SOHO and small business NAS of 1 to 8 bays; IronWolf Pro, up to 32TB, is for commercial and enterprise NAS with any number of bays.',
      points: [
        'IronWolf: up to 16TB, 180TB a year, 3-year warranty',
        'IronWolf Pro: up to 32TB, 550TB a year, 2.5M hours MTBF',
        'IronWolf Pro: 5-year limited warranty',
        'Tested with NAS makers such as Asustor, QNAP and UGREEN',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'The right drive, and enough of it',
  capabilitiesIntro: 'A drive’s job is to hold footage and files reliably for years. These are the parts of the Seagate range that matter when we size storage for a site.',
  capabilities: [
    {
      title: 'Cameras and AI streams',
      art: {
        type: 'network',
        alt: 'A recorder with a SkyHawk AI drive taking streams from up to 64 HD cameras plus 32 AI streams',
        uplink: 'NVR',
        switchLabel: 'SkyHawk AI',
        switchSub: '64 HD + 32 AI streams',
        ports: [
          { label: 'Gate', icon: 'camera' },
          { label: 'Car park', icon: 'bullet' },
          { label: 'Foyer', icon: 'camera' },
          { label: 'Dock', icon: 'bullet' },
          { label: 'AI events', icon: 'chart', tone: 'accent' },
          { label: '+ 59 more', icon: 'camera', tone: 'muted' },
        ],
        caption: 'ImagePerfect AI firmware keeps video and analytics streams flowing',
      },
      body: 'One SkyHawk AI drive takes video from up to 64 HD cameras plus 32 AI streams at the same time. ImagePerfect AI firmware is built so frames are not dropped, even under the heavier write load of video analytics.',
    },
    {
      title: 'Drive health in the box',
      art: {
        type: 'dashboard',
        alt: 'A NAS screen showing IronWolf Health Management results for four drives, with one drive flagged for action',
        title: 'IronWolf Health',
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
      body: 'IronWolf Health Management in compatible NAS units, and SkyHawk Health Management in compatible recorders, watch each drive and give prevention, intervention and recovery advice, so a tired drive can be replaced before it fails.',
    },
    {
      title: 'Rescue Data Recovery',
      art: {
        type: 'mobile',
        alt: 'A Rescue Data Recovery claim for a damaged NAS drive, with the files recovered in Seagate’s own lab',
        app: 'Seagate Rescue',
        icon: 'shield',
        tone: 'ok',
        notice: 'Files back',
        sub: 'IronWolf Pro · Bay 2',
        time: '3 years included',
        actions: ['View files', 'Arrange return'],
        side: [
          { label: 'Damaged', sub: 'Drive sent in', icon: 'server' },
          { label: 'Lab', sub: 'Seagate’s own', icon: 'lock' },
          { label: 'Returned', sub: 'Files back', icon: 'laptop' },
        ],
      },
      body: 'IronWolf and SkyHawk drives include three years of Rescue Data Recovery Services. If a drive is damaged or data is corrupted, Seagate recovers it in its own secure facilities, with a 95% success rate. The service is not offered in every country, so we confirm it when ordering.',
    },
    {
      title: 'Built for multi-drive boxes',
      art: {
        type: 'sensor',
        alt: 'An IronWolf Pro drive in a busy multi-bay NAS sensing vibration from its neighbours and holding performance steady',
        icon: 'server',
        target: 'server',
        label: 'IronWolf Pro',
        sub: 'RV sensors built in',
        coverage: 'Multi-bay NAS and recorders',
        events: [
          { text: 'Vibration seen', sub: 'From bay 3', tone: 'warn' },
          { text: 'Drive adjusts', sub: 'RV sensors', tone: 'accent' },
          { text: 'RAID steady', sub: 'AgileArray', tone: 'ok' },
        ],
      },
      body: 'In a box full of spinning drives, vibration from one drive affects the next. IronWolf and SkyHawk AI drives carry rotational vibration sensors to counter it, and AgileArray firmware keeps RAID performance smooth in multi-bay NAS units.',
    },
    {
      title: 'More terabytes per disk',
      art: {
        type: 'storage',
        alt: 'Seagate Exos drives on the Mozaic platform today, and Mozaic 4+ drives of up to 44TB shipping to cloud providers',
        tiers: [
          { label: 'Exos on Mozaic', sub: '24TB to 32TB, 3TB+ per disk', icon: 'server' },
          { label: 'Mozaic 4+', sub: 'Drives to 44TB, cloud providers', icon: 'cloud' },
          { label: 'Roadmap goal', sub: '10TB per disk, drives to 100TB', icon: 'map' },
        ],
        active: 0,
        stat: '32TB',
        statLabel: 'Exos in the channel',
        badge: 'Mozaic HAMR',
        points: ['Same form factor', 'Up to 3x efficiency', '5-year warranty'],
        caption: 'Heat-assisted recording packs more data onto each disk',
      },
      body: 'Exos brings Seagate’s enterprise drives under one name, with the newest models built on the heat-assisted Mozaic platform at more than 3TB per disk and up to 32TB per drive. Mozaic 4+ drives of up to 44TB are already running in large cloud data centres.',
    },
    {
      title: 'A drive for every box',
      art: {
        type: 'network',
        alt: 'Seagate drive families matched to a video recorder, a NAS, a server and desktop backup',
        uplink: 'Seagate',
        switchLabel: 'Match the workload',
        switchSub: 'SkyHawk, IronWolf, Exos',
        ports: [
          { label: 'NVR', icon: 'camera', tone: 'accent' },
          { label: 'NAS', icon: 'server', tone: 'accent' },
          { label: 'Servers', icon: 'server', tone: 'accent' },
          { label: 'Desktop', icon: 'laptop', tone: 'muted' },
          { label: 'Backup', icon: 'shield', tone: 'muted' },
        ],
        caption: 'SkyHawk for NVRs, IronWolf for NAS, Exos for servers',
      },
      body: 'Each family has its own job: SkyHawk and SkyHawk AI in recorders, IronWolf and IronWolf Pro in NAS units, Exos in servers and data centres, and One Touch and LaCie drives for desktop backup and creative work.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Seagate makes',
  range: [
    {
      title: 'Surveillance',
      items: ['SkyHawk, 1TB to 8TB, for mainstream DVRs and NVRs', 'SkyHawk AI, 8TB to 32TB, for AI-enabled recorders', 'SkyHawk Health Management on compatible recorders'],
    },
    {
      title: 'NAS',
      items: ['IronWolf up to 16TB for 1 to 8-bay NAS', 'IronWolf Pro up to 32TB for any number of bays', 'IronWolf Health Management on compatible NAS'],
    },
    {
      title: 'Enterprise',
      items: ['Exos enterprise drives up to 32TB', 'Mozaic 4+ drives up to 44TB for cloud providers', 'Seagate Secure protection for data at rest'],
    },
    {
      title: 'Desktop and external',
      items: ['Seagate One Touch desktop drives up to 24TB', 'FireCuda X Vault for game libraries', 'LaCie 8big Pro5 RAID up to 256TB'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'Seagate drives in a Teracom system',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras record to an NVR fitted with SkyHawk AI and office PCs save to a NAS fitted with IronWolf Pro, used by the security desk, staff and Teracom',
    columns: ['On site', 'Storage', 'People'],
    devices: [
      { label: 'IP cameras', sub: 'Video and AI events', icon: 'camera' },
      { label: 'Office PCs', sub: 'Files and backups', icon: 'laptop' },
      { label: 'Servers', sub: 'Business systems', icon: 'server' },
    ],
    platforms: [
      { label: 'NVR', sub: 'SkyHawk AI drives', icon: 'server' },
      { label: 'NAS', sub: 'IronWolf Pro drives', icon: 'server' },
    ],
    people: [
      { label: 'Security desk', sub: 'Footage on demand', icon: 'laptop' },
      { label: 'Staff', sub: 'Shared files', icon: 'person' },
      { label: 'Teracom', sub: 'Drive health and swaps', icon: 'headset' },
    ],
    footer: 'Surveillance drives in the recorder, NAS drives in the file server, each sized for how long data must be kept',
  },
  architectureCaption: 'Cameras record to an NVR fitted with SkyHawk AI, and office machines save to a NAS fitted with IronWolf Pro. The security desk and staff work as normal, and we watch drive health and replace a drive before it fails.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Schools', 'Small and medium businesses', 'Warehousing and logistics', 'Commercial property', 'Healthcare', 'Councils'],

  teracomHeading: 'What Teracom does with Seagate',
  teracom: [
    { title: 'Advise', body: 'Drive family and capacity worked out from the camera count, recording settings and how long footage must be kept, or from the office’s data and backup needs.' },
    { title: 'Supply', body: 'Seagate drives supplied through our distributors and checked against the recorder’s or NAS maker’s compatibility list.' },
    { title: 'Set up', body: 'Drives fitted, RAID built and health monitoring switched on in the NVR or NAS before handover.' },
    { title: 'Support', body: 'Drive health checked on a maintenance plan, with failing drives replaced and warranty claims for drives bought from us lodged through our distributor, as Seagate’s terms require.' },
  ],

  links: [
    { label: 'Seagate SkyHawk AI', href: 'https://www.seagate.com/au/en/products/video-analytics/skyhawk-ai-hard-drive/' },
    { label: 'Seagate IronWolf Pro', href: 'https://www.seagate.com/au/en/products/nas-drives/ironwolf-pro-hard-drive/' },
    { label: 'Seagate warranty and replacements', href: 'https://www.seagate.com/au/en/support/warranty-and-replacements/' },
  ],
};

export default seagate;