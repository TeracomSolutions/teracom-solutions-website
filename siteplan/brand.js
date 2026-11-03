// Whose name is on everything the planner makes (Robert, 2026-11-03): the free
// tools advertise the business, so the logo, website, quote link and shop are on
// the Excel workbook, the saved picture and the screen. Another app using this
// folder passes its own as SitePlanner's `brand` prop, or changes these.
export const BRAND = {
  name: 'Teracom Solutions',
  logo: '/assets/teracom-logo.png',
  website: 'https://www.teracomsolutions.com.au',
  websiteLabel: 'teracomsolutions.com.au',
  email: 'sales@teracomsolutions.com.au',
  phone: '',
  toolUrl: 'https://www.teracomsolutions.com.au/tools/site-plan-designer',
  toolsUrl: 'https://www.teracomsolutions.com.au/tools',
  quoteUrl: 'https://www.teracomsolutions.com.au/contact',
  storeUrl: 'https://www.teracomsolutions.com.au/store',
  storeSearchUrl: 'https://www.teracomsolutions.com.au/store/search',
  tagline: 'Design · Supply · Install · Monitor',
  pitch: 'Teracom Solutions designs, supplies, installs and monitors CCTV, alarms, access control, intercoms, networks and AV for businesses.',
};

/** A link with campaign tags, so visits from a saved file show up in the website's analytics. */
export function tagged(url, medium, extra = {}) {
  try {
    const link = new URL(url);
    link.searchParams.set('utm_source', 'site-plan-designer');
    link.searchParams.set('utm_medium', medium);
    link.searchParams.set('utm_campaign', 'free-tools');
    for (const [key, value] of Object.entries(extra)) link.searchParams.set(key, value);
    return link.toString();
  } catch {
    return url;
  }
}
