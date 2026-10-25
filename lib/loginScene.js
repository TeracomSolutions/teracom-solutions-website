// The picture and words beside the console sign-in (Robert, 2026-10-25): one of the website's own photos,
// changing each day. A copy of the console for another business gets no Teracom picture (null).

export const LOGIN_SCENES = [
  { image: '/assets/hero-security-command-centre.webp', headline: 'Run the whole website from one place.', sub: 'Store, orders, customers, marketing and support.' },
  { image: '/assets/teracom-on-site.webp', headline: 'Every order, from paid to delivered.', sub: 'Follow each one through Zoho, suppliers and shipping.' },
  { image: '/assets/hero-technology.svg', headline: 'Products, prices and specials.', sub: 'Price lists in, prices live, offers out to customers.' },
  { image: '/assets/teracom-storefront-van.webp', headline: 'Customers first.', sub: 'Leads, Ask Tera and every conversation in one console.' },
  { image: '/assets/hero-tera-intelligence.webp', headline: 'AI that works for the team.', sub: 'The Assistant looks things up and gets things done, signed as you.' },
];

export function loginScene(brand, date) {
  if (!brand || brand.custom) return null;
  const day = Math.floor((date instanceof Date ? date.getTime() : Date.now()) / 86400000);
  return LOGIN_SCENES[((day % LOGIN_SCENES.length) + LOGIN_SCENES.length) % LOGIN_SCENES.length];
}
