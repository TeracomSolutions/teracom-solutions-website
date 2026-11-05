'use client';

import { SHEET_SIZES, pageCount, rangeLabel, sheetSize } from '@/lib/sheetQuery';

// First, previous, next and last for a sheet that loads one page at a time,
// and how many rows a page holds (Robert, 2026-11-05: 10, 20, 50 or 100).
export default function AdminSheetPager({ total, page, size, onPage, onSize, loading }) {
  const rows = sheetSize(size);
  const last = pageCount(total, rows);
  return (
    <div className="admin-pager">
      {onSize && (
        <label className="admin-pager-size">
          Rows per page
          <select value={rows} onChange={(e) => onSize(Number(e.target.value))} disabled={loading}>
            {SHEET_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
      <span className="admin-muted">{rangeLabel(total, page, rows)} · page {page} of {last}</span>
      <span className="admin-pager-buttons">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(1)} disabled={loading || page <= 1}>First</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(page - 1)} disabled={loading || page <= 1}>Previous</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(page + 1)} disabled={loading || page >= last}>Next</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onPage(last)} disabled={loading || page >= last}>Last</button>
      </span>
    </div>
  );
}
