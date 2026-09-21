// Category copy adapted from the pre-rebuild teracomsolutions.com.au site
// (recovered via the Wayback Machine after the original Zoho Commerce
// backup was lost -- see ~/crewai/uploads/wayback-archive/ on the VM).
// productCategory links a category to real, Stripe-wired listings already
// in lib/products.js; categories without one show a "coming soon" note
// instead of a checkout, since no real stock/pricing data is loaded yet
// for them.
// seoTitle is the search-result <title> only (never rendered on the page);
// categories without one fall back to "<title> | Teracom Store".
export const categories = [
  {
    slug: 'new-arrivals',
    seoTitle: 'New Security Products | Teracom Store',
    title: 'New Arrivals',
    description: 'The newest products added to the Teracom Store, automatically featured here for their first month.',
    isDynamic: true,
  },
  {
    slug: 'cctv',
    seoTitle: 'CCTV Cameras & Surveillance Systems | Teracom Store',
    title: 'CCTV',
    description: 'CCTV systems are one of the most common forms of surveillance available today -- an affordable and reliable way to safeguard your business and people.',
    productCategory: 'CCTV',
  },
  {
    slug: 'access-control',
    seoTitle: 'Access Control Systems & Hardware | Teracom Store',
    title: 'Access Control',
    description: 'Our specialists have delivered access control solutions across high-level, technically challenging sites. Whether single-site or multi-site, we tailor a solution to suit your business.',
    productCategory: 'Access Control',
  },
  {
    slug: 'intrusion',
    seoTitle: 'Intrusion Alarm Systems & Sensors | Teracom Store',
    title: 'Intrusion',
    description: 'A security alarm system is designed to detect intrusion -- unauthorised entry into a building or area -- protecting against burglary, property damage and personal safety.',
    productCategory: 'Intrusion',
  },
  {
    slug: 'networking',
    seoTitle: 'Networking Equipment for Security | Teracom Store',
    title: 'Networking',
    description: 'Networking solutions that keep your business connected and productive -- lowering communication costs, enhancing efficiency and improving customer service.',
  },
  {
    slug: 'audio',
    seoTitle: 'Audio Systems & Loudspeakers | Teracom Store',
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
    seoTitle: 'Security & Data Cable | Teracom Store',
    title: 'Cable',
    description: 'Certified, independently tested cabling -- manufactured to ISO9001/ISO14001 standards and verified against Australian and NZ standards.',
  },
  {
    slug: 'intercoms',
    seoTitle: 'IP Intercom Systems | Teracom Store',
    title: 'Intercoms',
    description: 'IP intercom solutions with facial recognition, SIP and push notification support.',
  },
  {
    slug: 'facial-recognition',
    seoTitle: 'Facial Recognition Systems | Teracom Store',
    title: 'Facial Recognition',
    description: 'AI-powered facial recognition for secure, contactless identification and access -- a non-contact biometric technique with fast, accurate results.',
  },
  {
    slug: 'video-accessories',
    seoTitle: 'PoE Switches & Video Accessories | Teracom Store',
    title: 'Video Accessories',
    description: 'Network accessories that complete any CCTV or Wi-Fi deployment -- from PoE switches to Ethernet extenders.',
  },
  {
    slug: 'nas',
    seoTitle: 'NAS & Video Storage | Teracom Store',
    title: 'NAS & Storage',
    description: 'Enterprise-grade network attached storage -- secure, reliable data management from flash to disk to cloud.',
  },
  {
    slug: 'power-supplies',
    seoTitle: 'Security Power Supplies & Batteries | Teracom Store',
    title: 'Power Supplies',
    description: 'Reliable power supplies for security systems, including lithium battery UPS options for access control, CCTV and alarm applications.',
  },
  {
    slug: 'screens',
    seoTitle: 'Projector Screens | Teracom Store',
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
    seoTitle: 'Z-Wave Home & Building Automation | Teracom Store',
    title: 'Automation',
    description: 'Wireless home and building automation -- control lighting, locks, appliances and climate from one connected system.',
  },
  {
    slug: 'it-equipment',
    title: 'IT Equipment',
    description: 'IT hardware and equipment for the networks and systems Teracom Solutions deploys and supports.',
  },
];

export function findCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
