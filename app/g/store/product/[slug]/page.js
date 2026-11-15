import ProductPageView from '@/components/storePages/ProductPageView';

// The product page for visitors who are not signed in (proxy.js rewrites them
// here, the address in their browser does not change). It is built on each
// visit and NOT kept as a saved copy: with thousands of products, most visited
// rarely and mostly by search engines, Vercel measured more saved copies being
// written than read (10K write units against 3.9K read, 16 Nov 2026), and
// those writes were what pushed the site over the plan's limit. Category,
// brand and store pages are still saved copies.
export { generateMetadata } from '@/components/storePages/ProductPageView';
export const dynamic = 'force-dynamic';

export default async function GuestProductPage(props) {
  return ProductPageView(props, null);
}
