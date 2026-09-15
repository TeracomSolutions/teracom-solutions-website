import Link from 'next/link';

import JsonLd from './JsonLd';
import { absoluteUrl } from '@/lib/seo';

/**
 * Visible breadcrumb trail plus the matching BreadcrumbList structured data.
 *
 * Both halves are emitted together on purpose. Google's guidance is that
 * breadcrumb markup should describe a trail the user can actually see, and
 * shipping the schema without the UI (or vice versa) is the usual way these
 * drift apart. It also earns the breadcrumb treatment in search results in
 * place of a raw URL, and gives the deep brand/category/capability pages real
 * internal links back up the hierarchy -- which is how link equity reaches
 * them in the first place.
 *
 * `items` is the trail excluding the current page; `current` is the current
 * page's label (rendered as plain text, not a link, since linking a page to
 * itself is noise for both users and crawlers).
 */
export default function Breadcrumbs({ items = [], current }) {
  const trail = [{ name: 'Home', href: '/' }, ...items];

  const schema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...trail.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.href),
      })),
      {
        '@type': 'ListItem',
        position: trail.length + 1,
        name: current,
      },
    ],
  };

  return (
    <>
      <JsonLd schema={schema} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
          <li aria-current="page">{current}</li>
        </ol>
      </nav>
    </>
  );
}
