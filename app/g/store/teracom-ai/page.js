import TeracomAiStoreView, { teracomAiStoreMetadata } from '@/components/storePages/TeracomAiStoreView';

// The saved copy for visitors who are not signed in (proxy.js rewrites them here).
export const metadata = teracomAiStoreMetadata;
export const revalidate = 3600;

export default async function Page() {
  return TeracomAiStoreView();
}
