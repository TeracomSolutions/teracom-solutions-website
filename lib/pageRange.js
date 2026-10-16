// The numbers behind the page controls of a list: which rows are showing and
// where Previous page and Next page go.
export const PAGE_SIZES = [10, 50, 100, 200];
export const DEFAULT_PAGE_SIZE = 50;

export function pageInfo(total, offset, pageSize) {
  const size = PAGE_SIZES.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE;
  const count = Math.max(0, Number(total) || 0);
  const start = Math.max(0, Math.min(Number(offset) || 0, Math.max(0, count - 1)));
  return {
    size,
    total: count,
    first: count === 0 ? 0 : start + 1,
    last: Math.min(start + size, count),
    page: Math.floor(start / size) + 1,
    pages: Math.max(1, Math.ceil(count / size)),
    hasPrev: start > 0,
    hasNext: start + size < count,
    prevOffset: Math.max(0, start - size),
    nextOffset: start + size,
  };
}