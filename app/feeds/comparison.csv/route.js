// The product feed for Australian price comparison sites (growth tool 13:
// StaticICE, Getprice, ShopBot and the like): the same products as the Google
// Shopping feed, as CSV. Only while the tool is switched on in the console.
import { getAllProducts } from '@/lib/catalogue';
import { growthOn } from '@/lib/api/growthPublic';
import { comparisonCsv } from '@/lib/comparisonFeed';
import { SITE_ORIGIN } from '@/lib/seo';
import { feedItem } from '@/lib/shoppingFeed';

export const revalidate = 3600;

export async function GET() {
  if (!(await growthOn('comparison_feeds'))) return new Response('Not found', { status: 404 });
  const items = (await getAllProducts()).map((product) => feedItem(product, SITE_ORIGIN)).filter(Boolean);
  return new Response(comparisonCsv(items), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
