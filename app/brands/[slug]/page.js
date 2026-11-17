import { cookies } from 'next/headers';

import BrandPageView from '@/components/storePages/BrandPageView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// The brand page for signed-in customers: it reads their sign-in cookie so
// they see their own prices, so it is built on each visit. Visitors who are
// not signed in get the saved copy at /g/brands/... (see proxy.js).
export { generateMetadata } from '@/components/storePages/BrandPageView';
// Built on every visit (force-dynamic) because it reads the customer's sign-in cookie. It used to also say
// revalidate = 86400 with generateStaticParams, which made Next.js try to keep a saved copy and fail with
// DYNAMIC_SERVER_USAGE: every signed-in customer got an error page on products (found 17 November 2026).
export const dynamic = 'force-dynamic';

export default async function BrandPage(props) {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  return BrandPageView(props, token);
}
