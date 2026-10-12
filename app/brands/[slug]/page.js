import { cookies } from 'next/headers';

import BrandPageView from '@/components/storePages/BrandPageView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// The brand page for signed-in customers: it reads their sign-in cookie so
// they see their own prices, so it is built on each visit. Visitors who are
// not signed in get the saved copy at /g/brands/... (see middleware.js).
export { generateMetadata, generateStaticParams } from '@/components/storePages/BrandPageView';
export const revalidate = 3600;
export const dynamicParams = true;

export default async function BrandPage(props) {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  return BrandPageView(props, token);
}
