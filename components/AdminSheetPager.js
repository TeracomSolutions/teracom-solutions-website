'use client';

import { pageCount, rangeLabel } from '@/lib/sheetQuery';

// First, previous, next and last for a sheet that loads one page at a time.
export default function AdminSheetPager({ total, page, onPage, loading }) {
  const last = pageCount(total);
  return (
    <div className="admin-actions" style={{ margin: '12px 0', alignItems: 'center' }}>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(1)} disabled={loading || page <= 1}>First</button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(page - 1)} disabled={loading || page <= 1}>Previous</button>
      <span className="admin-muted">{rangeLabel(total, page)} · page {page} of {last}</span>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(page + 1)} disabled={loading || page >= last}>Next</button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(last)} disabled={loading || page >= last}>Last</button>
    </div>
  );
}