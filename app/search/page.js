import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Calculator,
  CircleHelp,
  FileText,
  LayoutGrid,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  Wrench,
} from 'lucide-react';
import { groupResults, searchSite } from '@/lib/search';

export const metadata = {
  title: 'Search | Teracom Solutions',
  description: 'Search Teracom Solutions for products, services, brands, free tools and help.',
  // Search result pages are thin, endless variations of the same content --
  // keep them out of Google's index but let it follow the links.
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
};

const TYPE_ICONS = {
  page: FileText,
  service: Wrench,
  product: ShoppingBag,
  category: LayoutGrid,
  brand: Tag,
  tool: Calculator,
  ai: Sparkles,
  resource: BookOpen,
  help: CircleHelp,
};

const POPULAR = [
  { label: 'CCTV', q: 'cctv' },
  { label: 'Access control', q: 'access control' },
  { label: 'PoE calculator', q: 'poe' },
  { label: 'Software development', q: 'software' },
  { label: 'Warranty', q: 'warranty' },
  { label: 'Teracom AI', q: 'teracom ai' },
];

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === 'string' ? searchParams.q.trim().slice(0, 100) : '';
  const results = q ? searchSite(q) : [];
  const groups = groupResults(results);

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero search-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Search</span>
            <h1>{q ? <>Results for &ldquo;{q}&rdquo;</> : 'Search the site.'}</h1>
            <form className="search-form" action="/search" role="search">
              <Search size={22} strokeWidth={2} aria-hidden="true" />
              <label htmlFor="search-page-input" className="visually-hidden">Search Teracom Solutions</label>
              <input
                id="search-page-input"
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Products, services, brands, tools…"
                autoComplete="off"
                autoFocus={!q}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            {q ? (
              <p className="search-count">
                {results.length === 0
                  ? 'No matches.'
                  : `${results.length} ${results.length === 1 ? 'match' : 'matches'}${results.length === 60 ? ' (showing the top 60)' : ''}.`}
              </p>
            ) : null}
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <Search size={96} strokeWidth={1.3} />
            </span>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          {groups.length > 0 ? (
            groups.map((group) => {
              const Icon = TYPE_ICONS[group.type] || Boxes;
              return (
                <div className="search-group" key={group.type}>
                  <h2 className="search-group-title">
                    {group.label} <span>{group.items.length}</span>
                  </h2>
                  <ul className="search-results">
                    {group.items.map((r) => (
                      <li key={`${r.href}|${r.title}`}>
                        <Link href={r.href} className="search-result">
                          <span className="tool-card-icon">
                            <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                          </span>
                          <span className="search-result-text">
                            <strong>{r.title}</strong>
                            {r.description ? <span>{r.description}</span> : null}
                          </span>
                          <ArrowRight className="search-result-arrow" size={18} strokeWidth={2} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          ) : (
            <div className="search-empty">
              <h2>{q ? 'Nothing matched that search.' : 'What are you looking for?'}</h2>
              <p>
                {q
                  ? 'Try fewer or different words, or one of these popular searches. You can also contact us -- we are happy to help.'
                  : 'Search products, services, brands, free tools and the help centre, or start with a popular search.'}
              </p>
              <div className="service-jump search-popular">
                {POPULAR.map((p) => (
                  <Link key={p.q} href={`/search?q=${encodeURIComponent(p.q)}`}>{p.label}</Link>
                ))}
                {q ? <Link href="/contact">Contact us</Link> : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
