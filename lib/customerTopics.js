// What customers can choose to hear about, and what describes them (Robert,
// 2026-11-03). The same keys as the backend's services/customer_topics.py.
// Pure, so the plain Node test runner can load it.

export const EMAIL_TOPICS = [
  { key: 'specials', label: 'Specials and clearance' },
  { key: 'new_products', label: 'New products in the store' },
  { key: 'new_tools', label: 'New free tools' },
  { key: 'promos', label: 'Free promotions, giveaways and events' },
  { key: 'news', label: 'Industry news, guides and tips' },
];

export const CUSTOMER_ROLES = [
  { key: 'installer', label: 'Installer or integrator' },
  { key: 'business', label: 'Business owner or manager' },
  { key: 'facilities', label: 'Facilities or property manager' },
  { key: 'it', label: 'IT or networking' },
  { key: 'consultant', label: 'Consultant or designer' },
  { key: 'home', label: 'Home owner' },
  { key: 'other', label: 'Something else' },
];

// The market a customer works in, asked once at sign-up. Same keys as the backend's
// services/customer_topics.py.
export const CUSTOMER_INDUSTRIES = [
  { key: 'security_integrator', label: 'Security or technology installer / integrator' },
  { key: 'construction', label: 'Construction or building' },
  { key: 'property', label: 'Commercial property or facilities' },
  { key: 'residential', label: 'Residential or strata' },
  { key: 'retail', label: 'Retail or hospitality' },
  { key: 'healthcare', label: 'Healthcare or aged care' },
  { key: 'education', label: 'Education' },
  { key: 'government', label: 'Government or defence' },
  { key: 'transport', label: 'Transport, logistics or warehousing' },
  { key: 'industrial', label: 'Manufacturing, mining or energy' },
  { key: 'it_telecom', label: 'IT or telecommunications' },
  { key: 'other', label: 'Something else' },
];

export const topicLabel = (key) => EMAIL_TOPICS.find((t) => t.key === key)?.label || key;

/** The list with one topic added or taken out, in the fixed order. */
export function toggleTopic(topics, key, on) {
  const set = new Set(topics || []);
  if (on) set.add(key);
  else set.delete(key);
  return EMAIL_TOPICS.map((t) => t.key).filter((k) => set.has(k));
}
