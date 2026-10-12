// Parse lead query parameters from URL search string
export function parseLeadQuery(search, modules = []) {
  // Handle invalid inputs
  if (typeof search !== 'string' || search === '') {
    return { lead: '', interest: '', message: '' };
  }

  // Ensure search starts with '?' for URLSearchParams
  const searchParams = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);

  const lead = searchParams.get('lead') || '';
  const interest = searchParams.get('interest') || '';
  const moduleName = searchParams.get('module') || '';

  // Construct message if module is in the list
  let message = '';
  if (moduleName && modules.includes(moduleName)) {
    message = `Please include us in the early access preview of ${moduleName}.`;
  }

  return { lead, interest, message };
}