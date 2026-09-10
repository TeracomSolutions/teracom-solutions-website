// Category copy adapted from the pre-rebuild teracomsolutions.com.au site
// (recovered via the Wayback Machine after the original Zoho Commerce
// backup was lost -- see ~/crewai/uploads/wayback-archive/ on the VM).
// productCategory links a category to real, Stripe-wired listings already
// in lib/products.js; categories without one show a "coming soon" note
// instead of a checkout, since no real stock/pricing data is loaded yet
// for them.
export const categories = [
  {
    slug: 'cctv',
    title: 'CCTV',
    description: 'CCTV systems are one of the most common forms of surveillance available today -- an affordable and reliable way to safeguard your business and people.',
    productCategory: 'CCTV',
  },
  {
    slug: 'access-control',
    title: 'Access Control',
    description: 'Our specialists have delivered access control solutions across high-level, technically challenging sites. Whether single-site or multi-site, we tailor a solution to suit your business.',
    productCategory: 'Access Control',
  },
  {
    slug: 'intrusion',
    title: 'Intrusion',
    description: 'A security alarm system is designed to detect intrusion -- unauthorised entry into a building or area -- protecting against burglary, property damage and personal safety.',
    productCategory: 'Intrusion',
  },
  {
    slug: 'networking',
    title: 'Networking',
    description: 'Networking solutions that keep your business connected and productive -- lowering communication costs, enhancing efficiency and improving customer service.',
  },
  {
    slug: 'audio',
    title: 'Audio',
    description: 'Loudspeakers and audio systems that deliver power and precision wherever you place them -- standmount, bookshelf, surround sound and wireless options.',
  },
  {
    slug: 'ups',
    title: 'UPS & Power Protection',
    description: 'Uninterruptible power systems and power filtration products, engineered for reliability in the Australian market.',
  },
  {
    slug: 'cable',
    title: 'Cable',
    description: 'Certified, independently tested cabling -- manufactured to ISO9001/ISO14001 standards and verified against Australian and NZ standards.',
  },
  {
    slug: 'intercoms',
    title: 'Intercoms',
    description: 'IP intercom solutions with facial recognition, SIP and push notification support.',
  },
  {
    slug: 'facial-recognition',
    title: 'Facial Recognition',
    description: 'AI-powered facial recognition for secure, contactless identification and access -- a non-contact biometric technique with fast, accurate results.',
  },
  {
    slug: 'video-accessories',
    title: 'Video Accessories',
    description: 'Network accessories that complete any CCTV or Wi-Fi deployment -- from PoE switches to Ethernet extenders.',
  },
  {
    slug: 'nas',
    title: 'NAS & Storage',
    description: 'Enterprise-grade network attached storage -- secure, reliable data management from flash to disk to cloud.',
  },
  {
    slug: 'power-supplies',
    title: 'Power Supplies',
    description: 'Reliable power supplies for security systems, including lithium battery UPS options for access control, CCTV and alarm applications.',
  },
  {
    slug: 'screens',
    title: 'Screens',
    description: 'Projector screens for presentations and home theatre, in the aspect ratio and gain suited to your space.',
  },
  {
    slug: 'projectors',
    title: 'Projectors',
    description: 'Projectors for presentation, boardroom and home theatre applications.',
  },
  {
    slug: 'zwave',
    title: 'Automation',
    description: 'Wireless home and building automation -- control lighting, locks, appliances and climate from one connected system.',
  },
];

export function findCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
