'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { DOC_TYPE_LABELS, describeSource, filterDocuments, formatSize, groupByBrand } from '@/lib/publishedResources';

// The documents staff published to one Resources section: a search box,
// brand tabs, then the documents grouped by brand. Downloads come from our
// own copy on the backend; the small line under each says where the
// manufacturer's original lives.
function updated(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function PublishedDocuments({ listing, emptyMessage }) {
  const documents = useMemo(() => listing?.documents || [], [listing]);
  const [brand, setBrand] = useState('');
  const [q, setQ] = useState('');
  const brands = useMemo(() => groupByBrand(documents).map((g) => g.brand), [documents]);
  const visible = useMemo(() => filterDocuments(documents, { brand, q }), [documents, brand, q]);
  const groups = useMemo(() => groupByBrand(visible), [visible]);

  if (documents.length === 0) {
    return (
      <div className="form-note-banner" role="status">
        {emptyMessage} In the meantime, <Link href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>contact us</Link> for what you need.
      </div>
    );
  }

  return (
    <div className="published-docs">
      <div className="published-docs-tools">
        <input
          type="search"
          className="published-docs-search"
          placeholder="Search by product, model or brand"
          aria-label="Search documents"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="muted">{visible.length} of {documents.length} documents</span>
      </div>

      {brands.length > 1 && (
        <div className="brand-tabs" role="tablist" aria-label="Filter by brand">
          <button type="button" role="tab" aria-selected={!brand} className={`brand-tab ${!brand ? 'active' : ''}`} onClick={() => setBrand('')}>All brands</button>
          {brands.map((b) => (
            <button key={b} type="button" role="tab" aria-selected={brand === b} className={`brand-tab ${brand === b ? 'active' : ''}`} onClick={() => setBrand(b)}>{b}</button>
          ))}
        </div>
      )}

      {visible.length === 0 && <p className="muted">Nothing matches. Try another word or clear the brand.</p>}

      {groups.map(({ brand: name, documents: docs }) => (
        <section key={name} className="published-docs-group" aria-label={name}>
          <h2 className="published-docs-brand">{name}</h2>
          <ul className="document-list">
            {docs.map((doc) => (
              <li key={doc.id}>
                <a href={doc.download_url} target="_blank" rel="noopener noreferrer">
                  <span className="document-title">{doc.title}</span>
                  {doc.model && <span className="document-brand">{doc.model}</span>}
                  <span className="document-filetype">{DOC_TYPE_LABELS[doc.doc_type] || DOC_TYPE_LABELS.other}</span>
                  {formatSize(doc.size_bytes) && <span className="document-filetype">{formatSize(doc.size_bytes)}</span>}
                </a>
                <span className="published-docs-meta">
                  {describeSource(doc)}
                  {updated(doc.last_changed_at) ? ` · updated ${updated(doc.last_changed_at)}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
