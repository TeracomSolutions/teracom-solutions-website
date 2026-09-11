export default function StructuredData() {
  const graph = [
    {
      '@type': 'Organization',
      name: 'Teracom Solutions',
      url: 'https://www.teracomsolutions.com.au',
      logo: 'https://www.teracomsolutions.com.au/assets/teracom-logo.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+61 3 9708 2685',
        email: 'sales@teracomsolutions.com.au',
        contactType: 'sales'
      }
    },
    {
      '@type': 'LocalBusiness',
      name: 'Teracom Solutions',
      image: 'https://www.teracomsolutions.com.au/assets/teracom-logo.svg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1B Yazaki Way',
        addressLocality: 'Carrum Downs',
        addressRegion: 'VIC',
        postalCode: '3201',
        addressCountry: 'AU'
      },
      telephone: '+61 3 9708 2685'
    }
  ];

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@graph': graph }) }} />
  );
}
