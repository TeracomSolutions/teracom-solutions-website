import { cookies } from 'next/headers';

import ProductPageView from '@/components/storePages/ProductPageView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// The product page for signed-in customers: it reads their sign-in cookie so
// they see their own prices, so it is built on each visit. Visitors who are
// not signed in get the saved copy at /g/store/product/... (see middleware.js).
export { generateMetadata, generateStaticParams } from '@/components/storePages/ProductPageView';
export const revalidate = 300;
export const dynamicParams = true;

export default async function ProductPage(props) {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  return ProductPageView(props, token);
}
