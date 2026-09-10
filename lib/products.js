export const products = [
  // Access Control Products
  {
    id: 'securityos-starter',
    sku: 'SECOS-STARTER',
    name: 'Teracom AI Starter',
    description: 'Entry subscription for AI support agents and organisational knowledge workflows.',
    priceCents: 4900,
    category: 'Software',
    type: 'subscription',
    features: ['AI Support', 'Knowledge Base', 'Security Workflows'],
  },
  {
    id: 'securityos-pro',
    sku: 'SECOS-PRO',
    name: 'Teracom AI Professional',
    description: 'Professional plan for support agents, scope generation, documentation and knowledge tools.',
    priceCents: 14900,
    category: 'Software',
    type: 'subscription',
    features: ['Scope Generation', 'Documentation Tools', 'Advanced Analytics'],
  },
  {
    id: 'sample-reader',
    sku: 'HW-READER-SAMPLE',
    name: 'Sample Access Control Reader',
    description: 'Professional access control reader for enterprise security systems.',
    priceCents: 29500,
    category: 'Access Control',
    type: 'hardware',
    features: ['RFID Compatible', 'IP67 Rated', 'Dual Interface'],
  },
  // Intrusion Detection
  {
    id: 'motion-detector',
    sku: 'PIR-MOTION-QUAD',
    name: 'Quad PIR Motion Detector',
    description: 'Advanced quad-element PIR sensor with pet immunity.',
    priceCents: 12900,
    category: 'Intrusion',
    type: 'hardware',
    features: ['Pet Immune', 'Quad Element', 'IP67', 'Adjustable Sensitivity'],
  },
  {
    id: 'door-window-sensor',
    sku: 'DOOR-SENS-WIRELESS',
    name: 'Wireless Door/Window Sensor',
    description: 'Wireless magnetic contact sensor for doors and windows.',
    priceCents: 4500,
    category: 'Intrusion',
    type: 'hardware',
    features: ['Wireless', '3-Year Battery', 'Surface Mount', 'Tamper Alert'],
  },

  // Services & Digital Products
  {
    id: 'sow-template-pack',
    sku: 'DIG-SOW-PACK',
    name: 'Security Scope of Works Template Pack',
    description: 'Digital template pack for electronic security project documentation and technical scopes.',
    priceCents: 19900,
    category: 'Digital',
    type: 'digital',
    features: ['30+ Templates', 'Editable Docs', 'Industry Standard', 'Updates Included'],
  },
  {
    id: 'design-review',
    sku: 'SVC-DESIGN-REVIEW',
    name: 'Security Design Review Consultation',
    description: 'Professional consulting service for architecture, product fit, risks, standards and technical validation.',
    priceCents: 69900,
    category: 'Services',
    type: 'service',
    features: ['4-Hour Session', 'Expert Consultant', 'Report Included', 'Follow-up Support'],
  },
  {
    id: 'system-integration',
    sku: 'SVC-INTEGRATION',
    name: 'System Integration Service',
    description: 'Full system integration and commissioning for security projects.',
    priceCents: 129900,
    category: 'Services',
    type: 'service',
    features: ['Full Integration', 'Testing', 'Training', 'Warranty Support'],
  },
];

export function formatMoney(cents) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100);
}

export function findProduct(id) {
  return products.find((p) => p.id === id);
}

export function getCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  return categories.sort();
}

export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category);
}
