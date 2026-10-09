export const resourcesSections = [
  { slug: 'submit-a-request', title: 'Submit a Request', description: 'Book a service call, request a recorder password reset, or open a trade account.' },
  { slug: 'help-centre', title: 'Help Centre & FAQs', description: 'Technical explainer articles and troubleshooting Q&A for the camera, recorder and app technology behind our systems.' },
  { slug: 'articles', title: 'Articles', description: 'Plain-English guides to access control, intruder alarms, power supplies and projector screens.' },
  { slug: 'user-manuals', title: 'User Manuals', description: 'Product manuals for the systems and equipment we supply and install.' },
  { slug: 'datasheets', title: 'Datasheets', description: 'Technical specification sheets for our product range.' },
  { slug: 'installer-manuals', title: 'Installer Manuals', description: 'Installation and commissioning manuals for the systems we supply.' },
  { slug: 'brochures', title: 'Brochures', description: 'Product brochures and range overviews from the manufacturers we work with.' },
  { slug: 'product-videos', title: 'Product Videos', description: 'Installation, configuration and product overview videos.' },
  { slug: 'downloads', title: 'Downloads', description: 'Software, firmware and supporting documents.' },
  { slug: 'industry-news', title: 'Industry News', description: 'The latest Australian security industry headlines from SEN.news, updated automatically.' },
];

// The sections the console publishes crawled documents to.
export const SITE_DOCUMENT_SECTIONS = ['user-manuals', 'datasheets', 'installer-manuals', 'brochures', 'downloads'];

export const DOC_TYPE_LABELS = {
  datasheet: 'Datasheet',
  user_manual: 'User manual',
  installer_manual: 'Installer manual',
  brochure: 'Brochure',
  other: 'Document',
};

export function findResourcesSection(slug) {
  return resourcesSections.find((s) => s.slug === slug);
}
