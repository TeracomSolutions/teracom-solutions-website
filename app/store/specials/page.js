import { cookies } from 'next/headers';

import SpecialsPageView, { specialsMetadata } from '@/components/storePages/SpecialsPageView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// Specials for signed-in customers, with their own prices; guests get the saved
// copy at /g/store/specials (proxy.js).
export const metadata = specialsMetadata;
export const revalidate = 3600;

export default async function SpecialsPage() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  return SpecialsPageView(token);
}
