import { FileText } from 'lucide-react';

import { fetchProductResources } from '@/lib/api/resources';
import { formatDate } from '@/lib/adminFormat';

// Data sheets and manuals for a store product, collected by the admin's
// Resources section. Renders nothing when there are none or the backend is
// unreachable -- a product page must never break over a brochure.
const TYPE_LABELS = {
  datasheet: 'Data sheet',
  user_manual: 'User manual',
  installer_manual: 'Installer manual',
  brochure: 'Brochure',
  other: 'Document',
};

function sizeLabel(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ProductResources({ sku }) {
  let documents = [];
  try {
    documents = await fetchProductResources(sku);
  } catch {
    return null;
  }
  if (!Array.isArray(documents) || documents.length === 0) return null;

  return (
    <section className="section section-spacious">
      <div className="container">
        <div className="section-heading left">
          <span className="eyebrow">Downloads</span>
          <h2>Data sheets and manuals</h2>
          <p>The manufacturer&apos;s documents for this product, kept up to date from their website.</p>
        </div>
        <ul className="product-resources">
          {documents.map((doc) => (
            <li key={doc.id}>
              <a href={doc.download_url} target="_blank" rel="noopener noreferrer">
                <span className="tool-card-icon">
                  <FileText size={20} strokeWidth={1.8} aria-hidden="true" focusable="false" />
                </span>
                <span className="product-resource-text">
                  <strong>{doc.title}</strong>
                  <small>
                    {TYPE_LABELS[doc.doc_type] || TYPE_LABELS.other}
                    {doc.size_bytes ? ` · ${sizeLabel(doc.size_bytes)}` : ''}
                    {doc.last_changed_at ? ` · ${formatDate(doc.last_changed_at)}` : ''}
                  </small>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
