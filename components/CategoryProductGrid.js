'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import ProductTile, { TILE_GRID } from '@/components/ProductTile';
import { searchHref, tileMatches } from '@/lib/storeSearch';

// A category's products as small tiles (Robert, 2026-10-03), with a search
// box that narrows them as you type and brand tabs (Robert, 2026-10-08).
// A category can hold hundreds of products: they show a page at a time.

const NOTE = { color: 'var(--muted)', fontSize: '12px', fontWeight: 400 };
const MORE = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '24px' };
const PAGE_SIZE = 24;

export default function CategoryProductGrid({ products, isSignedIn = false, customer = null, categoryTitle = '' }) {
  const [query, setQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('All');
  const [shown, setShown] = useState(PAGE_SIZE);

  const found = useMemo(() => (query.trim() ? products.filter((p) => tileMatches(p, query)) : products), [products, query]);
  const brands = useMemo(() => {
    const counts = new Map();
    for (const p of found) if (p.brand) counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en-AU', { sensitivity: 'base' }));
  }, [found]);
  const brand = brands.some(([name]) => name === activeBrand) ? activeBrand : 'All';
  const matching = brand === 'All' ? found : found.filter((p) => p.brand === brand);
  const visible = matching.slice(0, shown);
  const what = categoryTitle || 'these products';

  function typeQuery(value) {
    setQuery(value);
    setShown(PAGE_SIZE);
  }

  function chooseBrand(name) {
    setActiveBrand(name);
    setShown(PAGE_SIZE);
  }

  return (
    <>
      <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()} style={{ marginBottom: '14px' }}>
        <Search size={22} strokeWidth={2} aria-hidden="true" />
        <label htmlFor="category-search" className="visually-hidden">Search {what}</label>
        <input
          id="category-search"
          type="search"
          value={query}
          onChange={(event) => typeQuery(event.target.value)}
          placeholder={`Search ${what} by name, brand or part number`}
          autoComplete="off"
        />
      </form>
      <p style={{ ...NOTE, margin: '0 0 18px' }}>
        {query.trim() ? `${matching.length} of ${products.length} products match. ` : `${products.length} products. `}
        <Link href={searchHref({ q: query.trim() })}>Search the whole store</Link>
      </p>
      {brands.length > 1 && (
        <div className="brand-tabs" role="tablist" aria-label="Filter by brand">
          <button
            type="button"
            className={brand === 'All' ? 'brand-tab active' : 'brand-tab'}
            onClick={() => chooseBrand('All')}
          >
            All
          </button>
          {brands.map(([name, count]) => (
            <button
              key={name}
              type="button"
              className={brand === name ? 'brand-tab active' : 'brand-tab'}
              onClick={() => chooseBrand(name)}
            >
              {name}
              <span className="brand-tab-count">{count}</span>
            </button>
          ))}
        </div>
      )}
      {!isSignedIn && (
        <p className="form-note">
          Prices shown are RRP. <a href="/account/signup">Create a free account</a> for additional member discounts.
        </p>
      )}
      {matching.length === 0 ? (
        <p className="form-note">
          Nothing in {what} matches that. <Link href={searchHref({ q: query.trim() })}>Try the whole store</Link> or{' '}
          <Link href="/contact?interest=Teracom Store">ask us for a quote</Link>.
        </p>
      ) : (
        <div style={TILE_GRID}>
          {visible.map((p) => (
            <ProductTile key={p.id} p={p} isSignedIn={isSignedIn} customer={customer} />
          ))}
        </div>
      )}
      {matching.length > shown && (
        <div style={MORE}>
          <p style={NOTE}>Showing {shown} of {matching.length}</p>
          <button type="button" className="btn btn-secondary" onClick={() => setShown((n) => n + PAGE_SIZE)}>
            Show more
          </button>
        </div>
      )}
    </>
  );
}