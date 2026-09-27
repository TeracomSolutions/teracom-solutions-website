export function providerState(info) {
  if (!info.enabled) return 'off';
  if (info.last_failed_at && (!info.last_ok_at || new Date(info.last_failed_at) > new Date(info.last_ok_at))) {
    return 'failing';
  }
  if (info.last_ok_at) return 'healthy';
  return 'unknown';
}

export function stateLabel(state, info) {
  switch (state) {
    case 'healthy':
      return 'Responding';
    case 'off':
      return 'Disabled';
    case 'failing':
      if (!info.last_error_kind) return 'Failing: last call failed';
      switch (info.last_error_kind) {
        case 'credit':
          return 'Failing: out of credit';
        case 'auth':
          return 'Failing: key rejected';
        case 'rate_limit':
          return 'Failing: rate limited';
        case 'unreachable':
          return 'Failing: not reachable';
        case 'model':
          return 'Failing: model not available';
        case 'error':
          return 'Failing: last call failed';
        default:
          return `Failing: ${info.last_error_kind}`;
      }
    default:
      return 'Not used yet';
  }
}

export function ringLayout(n, cx, cy, r) {
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2; // Start from top
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle: angle
    });
  }
  return points;
}

export function moveInList(list, key, direction) {
  const index = list.indexOf(key);
  if (index === -1 || (direction === -1 && index === 0) || (direction === 1 && index === list.length - 1)) {
    return list;
  }
  
  const newList = [...list];
  const targetIndex = index + direction;
  
  // Swap elements
  [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
  
  return newList;
}

export function workShare(providers) {
  // For each of assistant/research/critique, find which provider has the most ok calls in the last 7 days
  const result = {};
  
  for (const flowType of ['assistant', 'research', 'critique']) {
    let bestProvider = null;
    let maxOk = -1;
    
    for (const [key, info] of Object.entries(providers)) {
      if (!info.enabled) continue;
      
      const counts = info.counts?.[flowType];
      if (counts && counts.ok > maxOk) {
        maxOk = counts.ok;
        bestProvider = key;
      }
    }
    
    result[flowType] = bestProvider;
  }
  
  return result;
}