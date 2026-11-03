import PackDetailView, { packMetadata } from '@/components/storePages/PackDetailView';
import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';

// One Teracom AI Department or extension pack, everything it includes. New packs in
// Global's catalogue get their page on first visit; all refresh hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  const { entries } = await fetchDepartmentCatalogue();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props) {
  const { slug } = await props.params;
  return packMetadata(slug);
}

export default async function Page(props) {
  const { slug } = await props.params;
  return PackDetailView({ slug });
}
