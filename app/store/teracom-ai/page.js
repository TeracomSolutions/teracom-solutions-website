import TeracomAiStoreView, { teracomAiStoreMetadata } from '@/components/storePages/TeracomAiStoreView';

// Store > Teracom AI: every Department and extension pack from Global's catalogue.
export const metadata = teracomAiStoreMetadata;
export const revalidate = 86400;

export default async function Page() {
  return TeracomAiStoreView();
}
