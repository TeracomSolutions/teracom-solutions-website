import { Search } from 'lucide-react';

// The store search box (Robert, 2026-10-08): a plain form that opens the
// results page, so it works on the Store page, in a category and on the
// results page itself. category is a store category slug that narrows the
// search to that category.
export default function StoreSearchBox({
  id = 'store-search',
  q = '',
  category = '',
  placeholder = 'Search products, brands or part numbers',
  label = 'Search the store',
  autoFocus = false,
}) {
  return (
    <form className="search-form" action="/store/search" role="search">
      <Search size={22} strokeWidth={2} aria-hidden="true" />
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <input
        id={id}
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      {category ? <input type="hidden" name="category" value={category} /> : null}
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
}