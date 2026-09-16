'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import CategoryIcon from './CategoryIcon';

export default function DocumentList({ documents, emptyMessage }) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (documents.length === 0) {
    return (
      <div className="form-note-banner" role="status">
        {emptyMessage} In the meantime, <Link href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>contact us</Link> for what you need.
      </div>
    );
  }

  // Get unique category slugs from documents, maintaining order from categories.js
  const documentCategories = [...new Set(documents.map((d) => d.category))];
  
  // Build tabs list with titles and icons from categories.js, preserving order
  const tabs = [
    { slug: 'all', title: 'All' },
    ...documentCategories
      .map(slug => {
        const category = categories.find(c => c.slug === slug);
        if (!category) return null;

        return {
          slug,
          title: category.title,
          icon: slug,
        };
      })
      .filter(Boolean)
  ];

  const visible = activeCategory === 'all' ? documents : documents.filter((d) => d.category === activeCategory);

  return (
    <>
      {tabs.length > 1 && (
        <div className="brand-tabs" role="tablist" aria-label="Filter by category">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              className={`brand-tab ${activeCategory === tab.slug ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.slug)}
              role="tab"
              aria-selected={activeCategory === tab.slug}
            >
              {tab.icon && (
                <CategoryIcon slug={tab.icon} />
              )}
              {tab.title}
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
