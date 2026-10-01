// One row per AI connection, in the order of preference, ready for the
// table and the diagram on Admin -> AI Connections. Built the same way as
// the TeracomAI Global Platform's AI Provider Connections (its
// lib/aiRouting.js) so the two consoles read alike. The website's health
// comes from its last real call or Check now, kept by the backend as
// last_ok_at / last_failed_at, rather than a stored check result.
// Pure functions, no fetching: the component does that.

export const STATE_COLOURS = {
  healthy: '#3ecf8e',
  failing: '#ff4b4b',
  off: '#6b7280',
  unknown: '#e0a536',
};

const FAILURE_WORDS = {
  credit: 'out of credit',
  auth: 'key rejected',
  rate_limit: 'rate limited',
  unreachable: 'not reachable',
  model: 'model not available',
  error: 'last call failed',
};

// The order staff reorder: every connection by priority, with the ones
// nobody has ordered last and in name order among themselves so the list
// does not shuffle between loads.
export function orderConnections(connections) {
  return [...(connections || [])]
    .sort((a, b) => {
      const ap = a.priority == null ? Number.MAX_SAFE_INTEGER : a.priority;
      const bp = b.priority == null ? Number.MAX_SAFE_INTEGER : b.priority;
      if (ap !== bp) return ap - bp;
      return a.provider.localeCompare(b.provider);
    })
    .map((connection) => connection.provider);
}

// Swap one entry with its neighbour. Returns the same array when the move
// would fall off either end, so the caller can skip the request.
export function moveInOrder(list, key, direction) {
  const index = list.indexOf(key);
  if (index === -1) return list;
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function latest(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  return new Date(a) > new Date(b) ? a : b;
}

// Disabled beats everything: a connection switched off is not failing.
export function stateOf(connection, health) {
  if (!connection || !connection.enabled) return 'off';
  const h = health || {};
  if (h.last_failed_at && (!h.last_ok_at || new Date(h.last_failed_at) > new Date(h.last_ok_at))) return 'failing';
  if (h.last_ok_at) return 'healthy';
  return 'unknown';
}

export function stateText(state, health) {
  if (state === 'off') return 'Disabled';
  if (state === 'unknown') return 'Not checked yet';
  if (state === 'healthy') return 'Responding';
  return `Failing: ${FAILURE_WORDS[health?.last_error_kind] || 'last call failed'}`;
}

/**
 * The rows for the table and the diagram.
 * connections: the saved connections (provider, enabled, priority, default_model, key_last4, base_url)
 * routing: the routing feed; routing.providers[provider] holds last_ok_at, last_failed_at, last_error, last_error_kind
 * catalogue: the provider list (key, label, kind, default_model)
 */
export function connectionRows(connections, routing, catalogue) {
  const health = routing?.providers || {};
  const list = connections || [];
  return orderConnections(list).map((provider, index) => {
    const connection = list.find((c) => c.provider === provider);
    const entry = (catalogue || []).find((p) => p.key === provider) || {};
    const h = health[provider] || {};
    const kind = entry.kind || h.kind || (provider === 'internet' ? 'source' : 'hosted');
    const state = stateOf(connection, h);
    let keyText = 'none needed';
    if (kind === 'native' || kind === 'hosted') {
      keyText = connection.key_last4 && connection.key_last4 !== '****' ? `••••${connection.key_last4}` : '-';
    } else if (kind === 'self_hosted') {
      keyText = 'host';
    }
    return {
      provider,
      position: index + 1,
      label: entry.label || h.label || provider,
      kind,
      enabled: Boolean(connection.enabled),
      model: connection.default_model || entry.default_model || '',
      keyText,
      state,
      stateText: stateText(state, h),
      detail: state === 'failing' ? h.last_error || '' : '',
      checkedAt: latest(h.last_ok_at, h.last_failed_at),
    };
  });
}

// Where the internet sits in the order, in one sentence: above every model
// means the web is searched first, below means the web is the fallback.
export function internetSentence(rows) {
  const list = rows || [];
  const internet = list.find((r) => r.provider === 'internet');
  if (!internet) return 'No internet connection is configured, so Scout works from the models only.';
  if (!internet.enabled) return 'Internet is switched off: Scout uses the models only.';
  const live = list.filter((r) => r.provider === 'internet' || r.enabled);
  const position = live.findIndex((r) => r.provider === 'internet');
  if (position === 0) {
    return 'Internet is above the models: Scout searches the web first, then a model writes the report.';
  }
  if (position === live.length - 1) {
    return 'Internet is below the models: a model answers from its own knowledge and the web is the fallback.';
  }
  return 'Internet sits between the models: the providers above it are tried first, then the web, then the rest.';
}

export function shorten(text, max = 28) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}