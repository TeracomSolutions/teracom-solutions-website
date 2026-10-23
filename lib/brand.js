// Who the admin console is for. Teracom's own site sets none of these and shows Teracom;
// a copy of the console for another business (Luneva) sets them at build time:
//   NEXT_PUBLIC_BRAND_NAME      the business name (shows as text when there is no logo)
//   NEXT_PUBLIC_BRAND_LOGO      a logo image path under /public (optional)
//   NEXT_PUBLIC_BRAND_SITE_URL  where View website goes (default: this site's own home page)
//   NEXT_PUBLIC_STAFF_DOMAIN    the email domain staff sign in with
// Each is written out in full below because Next.js only inlines NEXT_PUBLIC values it can see by name.

export function brandFrom(env) {
  const name = String(env.NEXT_PUBLIC_BRAND_NAME || '').trim();
  const logo = String(env.NEXT_PUBLIC_BRAND_LOGO || '').trim();
  return {
    name: name || 'Teracom Solutions',
    custom: Boolean(name),
    logo: logo || (name ? '' : '/assets/teracom-logo.png'),
    siteUrl: String(env.NEXT_PUBLIC_BRAND_SITE_URL || '').trim() || '/',
    staffDomain: String(env.NEXT_PUBLIC_STAFF_DOMAIN || '').trim() || 'teracomsolutions.com.au',
  };
}

// A page title written for Teracom ("Pricing|Teracom Solutions") with the business name swapped in.
export function retitle(title, brand) {
  if (!brand.custom) return title;
  return String(title || '').replace(/\s*\|\s*Teracom Solutions\s*$/, ` | ${brand.name}`);
}

export const BRAND = brandFrom({
  NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
  NEXT_PUBLIC_BRAND_LOGO: process.env.NEXT_PUBLIC_BRAND_LOGO,
  NEXT_PUBLIC_BRAND_SITE_URL: process.env.NEXT_PUBLIC_BRAND_SITE_URL,
  NEXT_PUBLIC_STAFF_DOMAIN: process.env.NEXT_PUBLIC_STAFF_DOMAIN,
});
