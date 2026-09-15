import { NOINDEX } from '@/lib/seo';

// Pass-through layout that exists purely to attach a noindex directive to
// every route under /checkout -- checkout outcome pages.
//
// It has to live in a layout rather than on the pages themselves because
// several of them are client components ('use client'), and a client
// component cannot export `metadata`. Child pages inherit this and override
// only the fields they set.
//
// robots.txt already disallows this path, but that alone is not enough: a
// disallowed URL can still be indexed without a snippet if something links to
// it. The page-level directive is what actually keeps it out of the index.
export const metadata = {
  title: 'Checkout|Teracom Solutions',
  ...NOINDEX,
};

export default function NoIndexLayout({ children }) {
  return children;
}
