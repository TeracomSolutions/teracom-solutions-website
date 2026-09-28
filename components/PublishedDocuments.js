'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

import { DOC_TYPE_LABELS, brandCounts, describeSource, filterDocuments, formatSize, pickBrand } from '@/lib/publishedResources';

// The documents staff published to one Resources section, one manufacturer
// at a time: a button per brand (Robert, 2026-09-28: "click on each one ...
// and it'll change between those brands"), a search within that brand, and
// the list. Downloads come from our own copy on the backend; the small line
// under each says where the manufacturer's original lives. The chosen brand
// is kept in the address (?brand=...) so a link to it can be shared.
function updated(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

function setBrandInAddress(brand) {
  try {
    const url = new URL(window.location.href);
    if (brand) url.searchParams.set('brand', brand);
    else url.searchParams.delete('brand');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // the address is a convenience; the page works without it
  }
}

export default function PublishedDocuments({ listing, emptyMessage }) {
  const documents = useMemo(() => listing?.documents || [], [listing]);
  const brands = useMemo(() => brandCounts(documents), [documents]);
  const brandNames = useMemo(() => brands.map((b) => b.brand), [brands]);
  const [brand, setBrand] = useState(() => pickBrand(brandNames, ''));
  const [q, setQ] = useState('');

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('brand') || '';
    if (wanted) setBrand(pickBrand(brandNames, wanted));
  }, [brandNames]);

  const current = pickBrand(brandNames, brand);
  const visible = useMemo(() => filterDocuments(documents, { brand: current, q }), [documents, current, q]);
  const elsewhere = useMemo(() => {
    if (!q.trim() || visible.length) return [];
    return brandCounts(filterDocuments(documents, { q })).filter((b) => b.brand !== current);
  }, [documents, q, visible.length, current]);

  function choose(name) {
    setBrand(name);
    setBrandInAddress(name);
  }

  if (documents.length === 0) {
    return (
      <div className="form-note-banner" role="status">
        {emptyMessage} In the meantime, <Link href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>contact us</Link> for what you need.
      </div>
    );
  }

  const inBrand = brands.find((b) => b.brand === current)?.count || 0;

  return (
    <div className="published-docs">
      <div className="brand-tabs" role="tablist" aria-label="Choose a brand">
        {brands.map(({ brand: name, count }) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={current === name}
            className={`brand-tab ${current === name ? 'active' : ''}`}
            onClick={() => choose(name)}
          >
            {name}
            <span className="brand-tab-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="published-docs-tools">
        <input
          type="search"
          className="published-docs-search"
          placeholder={`Search ${current} by product, model or name`}
          aria-label={`Search ${current} documents`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="muted">{visible.length} of {inBrand} {current} documents</span>
      </div>

      {visible.length === 0 && (
        <div className="published-docs-elsewhere">
          {elsewhere.length > 0 ? (
            <>
              <span className="muted">Not in {current}. Found in:</span>
              {elsewhere.map(({ brand: name, count }) => (
                <button key={name} type="button" className="brand-tab brand-tab-small" onClick={() => choose(name)}>
                  {name}
                  <span className="brand-tab-count">{count}</span>
                </button>
              ))}
            </>
          ) : (
            <span className="muted">Nothing matches. Try another word.</span>
          )}
        </div>
      )}

      {visible.length > 0 && (
        <ul className="document-list published-doc-list" role="tabpanel" aria-label={`${current} documents`}>
          {visible.map((doc) => {
            const model = doc.model ? `${doc.model} · ` : '';
            return (
              <li key={doc.id}>
                <a className="published-doc" href={doc.download_url} target="_blank" rel="noopener noreferrer">
                  <span className="published-doc-main">
                    <span className="published-doc-title">{doc.title}</span>
                    <span className="published-doc-meta">{model}{describeSource(doc)}{updated(doc.last_changed_at) ? ` · updated ${updated(doc.last_changed_at)}` : ''}</span>
                  </span>
                  <span className="published-doc-tags">
                    <span className="published-doc-type">{DOC_TYPE_LABELS[doc.doc_type] || DOC_TYPE_LABELS.other}</span>
                    {formatSize(doc.size_bytes) && <span className="published-doc-size">{formatSize(doc.size_bytes)}</span>}
                    <Download size={16} aria-hidden />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
