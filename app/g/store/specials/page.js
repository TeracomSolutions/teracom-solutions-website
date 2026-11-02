import SpecialsPageView, { specialsMetadata } from '@/components/storePages/SpecialsPageView';

// The saved copy of the specials page for visitors who are not signed in (proxy.js
// rewrites them here). It never reads cookies, so it is kept and rebuilt every few minutes.
export const metadata = specialsMetadata;
export const revalidate = 300;

export default async function GuestSpecialsPage() {
  return SpecialsPageView(null);
}
