// The product catalogue Meta (Facebook and Instagram) fetches for shop ads
// (Robert, 2026-11-03). The same products as the Google feed, with Meta's
// availability wording.
import { getAllProducts } from '@/lib/catalogue';
import { SITE_ORIGIN } from '@/lib/seo';
import { metaFeedItem, buildFeedXml } from '@/lib/shoppingFeed';

export const revalidate = 3600;

export async function GET() {
  const products = await getAllProducts();
  const items = products.map((product) => metaFeedItem(product, SITE_ORIGIN)).filter(Boolean);
  return new Response(buildFeedXml(items, SITE_ORIGIN), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
