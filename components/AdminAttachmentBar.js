'use client';

import { Paperclip, X } from 'lucide-react';
import { humanSize } from '@/lib/attachments';

// Internal component for displaying a file thumbnail
function Thumb({ item }) {
  if (item.kind === 'image' && item.preview) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.preview} alt="" width="28" height="28" style={{ objectFit: 'cover', borderRadius: '4px' }} aria-hidden="true" />;
  }

  return <Paperclip size={14} aria-hidden="true" />;
}

// Named export for showing attachments that are waiting to go with the next message
export function AttachmentChips({ attachments }) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="admin-assistant-files">
      {attachments.map((item) => (
        <span key={item.id || attachments.indexOf(item)} className="admin-assistant-file" title={item.name}>
          <Thumb item={item} />
          <span>{item.name}</span>
        </span>
      ))}
    </div>
  );
}

// Default export for the attachment bar
export default function AdminAttachmentBar({ items, reading, onRemove }) {
  if ((!items || items.length === 0) && !reading) {
    return null;
  }

  // Check if any item is an image or PDF
  const hasImageOrPdf = items.some((item) => item.kind === 'image' || item.kind === 'pdf');

  return (
    <div className="admin-assistant-attachments">
      <div className="admin-assistant-files">
        {items.map((item) => (
          <span key={item.id} className="admin-assistant-file" title={item.name}>
            <Thumb item={item} />
            <span>{item.name}</span>
            <span className="admin-muted">{humanSize(item.size)}</span>
            <button
              type="button"
              className="admin-assistant-file-remove"
              aria-label={`Remove ${item.name}`}
              onClick={() => onRemove(item.id)}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      {reading && (
        <span className="admin-muted">Reading the file…</span>
      )}

      {hasImageOrPdf && (
        <p className="admin-muted" style={{ fontSize: '12px', margin: '4px 0 0' }}>
          Pictures and PDFs go to the AI as they are: the privacy rules can only clean text. Do not attach pictures that show personal details of customers.
        </p>
      )}
    </div>
  );
}