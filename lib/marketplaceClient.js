// Calls the admin Marketplace routes from the browser. Always resolves to { ok, data, error }.
export async function marketplaceRequest(path, { method = 'GET', body, query } = {}) {
  let url = '/api/admin/marketplace/' + path;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    const text = params.toString();
    if (text) url += '?' + text;
  }
  try {
    const response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return { ok: false, data: null, error: (data && data.error) || 'Something went wrong. Please try again.' };
    return { ok: true, data, error: '' };
  } catch (err) {
    return { ok: false, data: null, error: 'Unable to reach the server. Please try again.' };
  }
}
