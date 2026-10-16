'use client';

import { PAGE_SIZES, pageInfo } from '@/lib/pageRange';

// Rows per page (10, 50, 100 or 200), which rows are showing, and Previous
// page / Next page. onPage(offset) and onSize(size) load the new page.
export default function AdminPager({ total, offset, pageSize, busy, onPage, onSize }) {
  const info = pageInfo(total, offset, pageSize);
  return (
    <div className="admin-actions" style={{ alignItems: 'center', margin: '12px 0' }}>
      <label>
        Rows per page{' '}
        <select value={info.size} onChange={(e) => onSize(Number(e.target.value))} disabled={busy} aria-label="Rows per page">
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>
      <span className="admin-muted">
        {info.total === 0
          ? 'No rows'
          : `Showing ${info.first.toLocaleString('en-AU')} to ${info.last.toLocaleString('en-AU')} of ${info.total.toLocaleString('en-AU')} (page ${info.page} of ${info.pages})`}
      </span>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(info.prevOffset)} disabled={busy || !info.hasPrev}>
        Previous page
      </button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(info.nextOffset)} disabled={busy || !info.hasNext}>
        Next page
      </button>
    </div>
  );
}