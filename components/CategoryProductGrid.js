'use client';

import { useMemo, useState } from 'react';
import CheckoutButton from '@/components/CheckoutButton';
import AddToCartButton from '@/components/AddToCartButton';
import { formatMoney } from '@/lib/products';

export default function CategoryProductGrid({ products }) {
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products]
  );
  const [activeBrand, setActiveBrand] = useState('All');

  const visible = activeBrand === 'All' ? products : products.filter((p) => p.brand === activeBrand);

  return (
    <>
      {brands.length > 1 && (
        <div className="brand-tabs" role="tablist" aria-label="Filter by brand">
          <button
            type="button"
            className={activeBrand === 'All' ? 'brand-tab active' : 'brand-tab'}
            onClick={() => setActiveBrand('All')}
          >
            All
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              className={activeBrand === brand ? 'brand-tab active' : 'brand-tab'}
              onClick={() => setActiveBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      )}
      <div className="product-grid">
        {visible.map((p) => (
          <article className="product-card" key={p.id}>
            <div>
              <span className="badge">{p.type}</span>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </div>
            <div>
              <p className="price">
                {formatMoney(p.priceCents)}
                <span className="price-gst-note"> inc. GST</span>
              </p>
              {p.type === 'subscription' ? (
                <CheckoutButton productId={p.id} label="Subscribe" />
              ) : (
                <AddToCartButton productId={p.id} label="Add to Cart" />
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
