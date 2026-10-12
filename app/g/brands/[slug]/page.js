import BrandPageView from '@/components/storePages/BrandPageView';

// The saved copy of the brand page for visitors who are not signed in
// (middleware.js rewrites them here, the address in their browser does not
// change). It never reads cookies, so Next.js keeps it and rebuilds it at
// most every half hour.
export { generateMetadata, generateStaticParams } from '@/components/storePages/BrandPageView';
export const revalidate = 1800;
export const dynamicParams = true;

export default async function GuestBrandPage(props) {
  return BrandPageView(props, null);
}
