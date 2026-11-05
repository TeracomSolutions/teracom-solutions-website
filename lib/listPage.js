// One page of a list that is already in the browser (Robert, 2026-11-05: long
// lists start short, 20 rows by default, with 10, 20, 50 or 100 to choose from
// and Previous and Next, so nothing below them is a long scroll away).

export const LIST_SIZES = [10, 20, 50, 100];
export const LIST_DEFAULT = 20;

export function listPage(rows, page, size, sizes = LIST_SIZES) {
  const list = Array.isArray(rows) ? rows : [];
  const perPage = sizes.includes(Number(size)) ? Number(size) : sizes.includes(LIST_DEFAULT) ? LIST_DEFAULT : sizes[0];
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, Math.floor(Number(page)) || 1), pages);
  const start = (current - 1) * perPage;
  return {
    rows: list.slice(start, start + perPage),
    page: current,
    pages,
    size: perPage,
    total: list.length,
    first: list.length === 0 ? 0 : start + 1,
    last: Math.min(start + perPage, list.length),
  };
}
