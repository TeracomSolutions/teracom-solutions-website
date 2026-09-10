export const resourcesSections = [
  { slug: 'help-centre', title: 'Help Centre & FAQs', description: 'Technical explainer articles and troubleshooting Q&A for the camera, recorder and app technology behind our systems.' },
  { slug: 'user-manuals', title: 'User Manuals', description: 'Product manuals for the systems and equipment we supply and install.' },
  { slug: 'datasheets', title: 'Datasheets', description: 'Technical specification sheets for our product range.' },
  { slug: 'product-videos', title: 'Product Videos', description: 'Installation, configuration and product overview videos.' },
  { slug: 'downloads', title: 'Downloads', description: 'Software, firmware and supporting documents.' },
];

export function findResourcesSection(slug) {
  return resourcesSections.find((s) => s.slug === slug);
}
