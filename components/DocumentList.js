'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function DocumentList({ documents, emptyMessage }) {
  const brands = useMemo(
    () => [...new Set(documents.map((d) => d.brand).filter(Boolean))].sort(),
    [documents]
  );
  const [activeBrand, setActiveBrand] = useState('All');

  if (documents.length === 0) {
    return (
      <div className="form-note-banner" role="status">
        {emptyMessage} In the meantime, <Link href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>contact us</Link> for what you need.
      </div>
    );
  }

  const visible = activeBrand === 'All' ? documents : documents.filter((d) => d.brand === activeBrand);

  return (
    <>
      {brands.length > 1 && (
        <div className="brand-tabs" role="tablist" aria-label="Filter by brand">
          <button type="button" className={activeBrand === 'All' ? 'brand-tab active' : 'brand-tab'} onClick={() => setActiveBrand('All')}>
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
      <ul className="document-list">
        {visible.map((doc) => (
          <li key={doc.url}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <span className="document-title">{doc.title}</span>
              {doc.brand && <span className="document-brand">{doc.brand}</span>}
              {doc.fileType && <span className="document-filetype">{doc.fileType}</span>}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
