export function groupProviders(providers) {
  const native = [];
  const hosted = [];
  const selfHosted = [];

  for (const provider of providers) {
    if (provider.kind === 'native') {
      native.push(provider);
    } else if (provider.kind === 'hosted') {
      hosted.push(provider);
    } else if (provider.kind === 'self_hosted') {
      selfHosted.push(provider);
    }
  }

  return { native, hosted, selfHosted };
}

export function providerStatus(provider, connections) {
  const connection = connections.find((c) => c.provider === provider.key);
  if (!connection) {
    return 'not_connected';
  }
  return connection.enabled ? 'connected' : 'disabled';
}

export function kindLabel(kind) {
  switch (kind) {
    case 'native': return 'Native API';
    case 'hosted': return 'Hosted API (key)';
    case 'self_hosted': return 'Self-hosted (host)';
    default: return kind;
  }
}