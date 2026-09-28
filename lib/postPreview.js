export const TITLED = ['linkedin', 'facebook', 'instagram'];

export function composeText(channel, { title = '', body = '', override = null } = {}) {
  if (typeof override === 'string') {
    return override;
  }
  
  if (TITLED.includes(channel) && title.trim() !== '') {
    return `${title.trim()}

${body}`;
  }
  
  return body;
}

export function displayText(channel, text, linkUrl) {
  if ((channel === 'x' || channel === 'instagram') && linkUrl.trim() !== '' && !text.includes(linkUrl.trim())) {
    return `${text.trim()}

${linkUrl.trim()}`;
  }
  
  return text;
}

export const SEE_MORE = { linkedin: 210, facebook: 250, instagram: 125 };

export function visiblePart(channel, text, expanded = false) {
  if (expanded || !SEE_MORE.hasOwnProperty(channel) || text.length <= SEE_MORE[channel]) {
    return { shown: text, more: false };
  }
  
  const limit = SEE_MORE[channel];
  const cutAt = text.lastIndexOf(' ', limit);
  
  if (cutAt === -1) {
    // No space found, cut at the limit
    return { shown: text.substring(0, limit), more: true };
  }
  
  // Cut at the last space before or at the limit
  const cut = text.substring(0, cutAt).trim();
  return { shown: cut, more: true };
}

export function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

export function shortLink(url) {
  try {
    const u = new URL(url);
    let hostPath = `${u.host}${u.pathname}`;
    // Remove leading www. and trailing slash
    hostPath = hostPath.replace(/^www\./, '').replace(/\/$/, '');
    
    if (hostPath.length > 25) {
      return hostPath.substring(0, 24) + '…';
    }
    
    return hostPath;
  } catch (e) {
    return '';
  }
}

export function mediaLayout(count) {
  if (count === 0) return 'none';
  if (count === 1) return 'single';
  if (count === 2) return 'two';
  if (count === 3) return 'three';
  return 'grid';
}

export function initials(name) {
  if (!name || typeof name !== 'string') return 'T';
  
  const words = name.split(' ').filter(w => w.length > 0);
  if (words.length === 0) return 'T';
  
  const first = words[0].charAt(0).toUpperCase();
  const second = words.length > 1 ? words[1].charAt(0).toUpperCase() : '';
  
  return first + second;
}