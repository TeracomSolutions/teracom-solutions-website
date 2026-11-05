'use client';

import { useState } from 'react';

import { LIST_DEFAULT, LIST_SIZES, listPage } from '@/lib/listPage';

// The paging under a list held in the browser: rows per page, which rows are
// showing, Previous and Next. useListPage keeps the page and size; the list
// goes back to page one when its rows change length (a filter, say).
export function useListPage(rows, { sizes = LIST_SIZES, initialSize = LIST_DEFAULT } = {}) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [seenLength, setSeenLength] = useState(Array.isArray(rows) ? rows.length : 0);
  const length = Array.isArray(rows) ? rows.length : 0;
  if (length !== seenLength) {
    setSeenLength(length);
    setPage(1);
  }
  const view = listPage(rows, page, size, sizes);
  return {
    ...view,
    sizes,
    setPage,
    setSize: (n) => {
      setSize(n);
      setPage(1);
    },
  };
}

export default function AdminListPager({ view, label = 'rows' }) {
  if (!view || view.total === 0) return null;
  // A list that fits on the smallest page needs no controls.
  if (view.total <= Math.min(...view.sizes)) return null;
  return (
    <div className="admin-pager">
      <label className="admin-pager-size">
        Rows per page
        <select value={view.size} onChange={(e) => view.setSize(Number(e.target.value))}>
          {view.sizes.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <span className="admin-muted">
        {view.first.toLocaleString('en-AU')}–{view.last.toLocaleString('en-AU')} of {view.total.toLocaleString('en-AU')} {label} · page {view.page} of {view.pages}
      </span>
      <span className="admin-pager-buttons">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => view.setPage(view.page - 1)} disabled={view.page <= 1}>Previous</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => view.setPage(view.page + 1)} disabled={view.page >= view.pages}>Next</button>
      </span>
    </div>
  );
}
