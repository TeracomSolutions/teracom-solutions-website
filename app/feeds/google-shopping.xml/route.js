// The feed that Google Merchant Center fetches; it lists only hardware products
// that have a photo, description, brand and price.
import { getAllProducts } from '@/lib/catalogue';
import { SITE_ORIGIN } from '@/lib/seo';
import { feedItem, buildFeedXml } from '@/lib/shoppingFeed';

export const revalidate = 3600;

export async function GET() {
  const products = await getAllProducts();

  // Build items and filter out nulls
  const items = products
    .map(product => feedItem(product, SITE_ORIGIN))
    .filter(item => item !== null);

  // Build XML
  const xml = buildFeedXml(items, SITE_ORIGIN);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}