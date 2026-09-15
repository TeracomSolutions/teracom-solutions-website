// Product Videos data. Two ways to surface video content here:
// 1. channelUrl -- link straight to the Teracom YouTube channel (set this
//    once a channel exists) for a "browse everything" fallback.
// 2. videos -- curate specific videos to embed inline (installation guides,
//    product overviews). Add entries as { title, youtubeId, description,
//    category } -- youtubeId is the part of a youtube.com/watch?v=<this>
//    URL, or the id from a youtu.be/<this> share link. `category` is a
//    slug from lib/categories.js (the same taxonomy the Store uses), so
//    tabs/icons stay consistent site-wide -- don't invent a separate
//    category system here.
// Both are intentionally empty until Robert provides real links -- no
// placeholder/fake videos.
export const channelUrl = '';

export const videos = [
  {
    title: 'Seagate SkyHawk AI Surveillance Storage',
    youtubeId: 'VitWIKyVeuE',
    description: 'An overview of Seagate SkyHawk AI hard drives, built for surveillance workloads.',
    category: 'nas',
  },
  {
    title: 'BEWARD Intercom Mobile App',
    youtubeId: 'CPpCBzNhvqU',
    description: 'Using the BEWARD mobile app to manage and answer IP intercom calls.',
    category: 'intercoms',
  },
  {
    title: 'Teravision Wall Mounting',
    youtubeId: 'wmQ7SfILa4U',
    description: 'How to wall-mount a Teravision intercom unit.',
    category: 'intercoms',
  },
  {
    title: 'Teravision Wall Mounting Adaptor',
    youtubeId: 'FYcHsjoanYQ',
    description: 'Fitting the Teravision wall mounting adaptor.',
    category: 'intercoms',
  },
  {
    title: 'Teravision Turnstile Adaptor',
    youtubeId: 'SVHI7K8Jfis',
    description: 'Fitting the Teravision turnstile mounting adaptor.',
    category: 'intercoms',
  },
  {
    title: 'Teravision Telescopic Adapter',
    youtubeId: '_Sugi128lYE',
    description: 'Using the Teravision telescopic mounting adapter.',
    category: 'intercoms',
  },
  {
    title: 'RG59 vs RG6 Coax Cable',
    youtubeId: 'gvgqFrZYTbY',
    description: 'The difference between RG59 and RG6 coaxial cable, and when to use each.',
    category: 'cable',
  },
  {
    title: 'How to Install an RJ45 Connector on a CAT5 Cable',
    youtubeId: 'qud_XmdpXHM',
    description: 'Step-by-step guide to terminating a CAT5 cable with an RJ45 connector.',
    category: 'cable',
  },
  {
    title: 'BEWARD Crush Test',
    youtubeId: 'OaZyQl9VBzo',
    description: 'A durability crush test of a BEWARD intercom unit.',
    category: 'intercoms',
  },
  {
    title: 'BEWARD IP Intercoms Overview',
    youtubeId: '9Uqv8RsSXAc',
    description: "BEWARD's IP intercom range and its key technology.",
    category: 'intercoms',
  },
  {
    title: 'Teravision 5" Face Recognition Terminal — 360° View',
    youtubeId: 'LC9SquLz3Gs',
    description: 'A 360-degree look at the Teravision 5-inch face recognition terminal.',
    category: 'facial-recognition',
  },
  {
    title: 'Teravision 8" Face Recognition Terminal — 360° View',
    youtubeId: 'thDkIs-8-qQ',
    description: 'A 360-degree look at the Teravision 8-inch face recognition terminal.',
    category: 'facial-recognition',
  },
  {
    title: 'Teravision 5" Face Recognition Terminal — 360° View (2)',
    youtubeId: 'KftbBdu6FEE',
    description: 'A second 360-degree look at the Teravision 5-inch face recognition terminal.',
    category: 'facial-recognition',
  },
  {
    title: 'Hik-Connect: Alarm Notifications Configuration',
    youtubeId: 'lJBCMjBZe7g',
    description: 'Full step-by-step guide to configuring alarm notifications in Hik-Connect.',
    category: 'cctv',
  },
];
