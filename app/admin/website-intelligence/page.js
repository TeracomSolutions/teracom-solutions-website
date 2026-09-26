import { redirect } from 'next/navigation';

// "Website Intelligence" was the Global Platform's name for this area. On
// the website itself it is two plain pages; old links and bookmarks land
// on the right one.
export default async function WebsiteIntelligenceRedirect({ searchParams }) {
  const { tab } = await searchParams;
  redirect(tab === 'leads' ? '/admin/leads' : '/admin/suppliers');
}
