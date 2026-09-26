export function isAreaActive(area, pathname) {
  if (area.exact) {
    return pathname === area.href;
  }

  // For non-exact matches, check if pathname matches the href or starts with it
  if (pathname === area.href || pathname.startsWith(`${area.href}/`)) {
    return true;
  }

  // Check match array if provided
  if (area.match && Array.isArray(area.match)) {
    return area.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  }

  return false;
}