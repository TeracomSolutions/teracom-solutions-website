import CategoryPageView from '@/components/storePages/CategoryPageView';

// The saved copy of the category page for visitors who are not signed in
// (middleware.js rewrites them here, the address in their browser does not
// change). It never reads cookies, so Next.js keeps it and rebuilds it at
// most every half hour.
export { generateMetadata, generateStaticParams } from '@/components/storePages/CategoryPageView';
export const revalidate = 3600;
export const dynamicParams = true;

export default async function GuestCategoryPage(props) {
  return CategoryPageView(props, null);
}
