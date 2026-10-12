// Returns the internal saved-copy address for a guest page, or null
export function guestRewritePath(pathname) {
  if (typeof pathname !== 'string') return null;

  // Remove trailing slash if present
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Check for /store/product/ + one segment
  if (pathname.startsWith('/store/product/')) {
    const remaining = pathname.substring(15); // Remove '/store/product/'
    if (remaining && !remaining.includes('/')) {
      return '/g' + pathname;
    }
  }

  // Check for /store/ + one segment that is NOT 'search' or 'product'
  if (pathname.startsWith('/store/') && pathname !== '/store' && pathname !== '/store/search' && pathname !== '/store/product') {
    const remaining = pathname.substring(7); // Remove '/store/'
    if (remaining && !remaining.includes('/')) {
      return '/g' + pathname;
    }
  }

  // Check for /brands/ + one segment
  if (pathname.startsWith('/brands/')) {
    const remaining = pathname.substring(8); // Remove '/brands/'
    if (remaining && !remaining.includes('/')) {
      return '/g' + pathname;
    }
  }

  return null;
}

// Returns the original path for a guest page, or null
export function guestPathStripped(pathname) {
  if (typeof pathname !== 'string') return null;

  if (pathname === '/g') {
    return '/';
  }

  if (pathname.startsWith('/g/')) {
    return '/' + pathname.substring(3); // Remove '/g/' and add leading slash
  }

  return null;
}