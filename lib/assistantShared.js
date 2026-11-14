// The one Assistant conversation shared by the floating Tera on every console page and the Assistant page
// (Robert, 14 November 2026): whichever is used, the other carries on the same chat. Only the chat's id is kept in
// this browser; the chat itself, and everything in it, is kept in the backend (services/assistant_history.py).

const CHAT_KEY = 'teracom-assistant-chat';
const PLACE_KEY = 'teracom-assistant-place';
const OPEN_KEY = 'teracom-assistant-open';
export const CHAT_EVENT = 'teracom-assistant-chat';

function store() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function currentChatId() {
  const id = store()?.getItem(CHAT_KEY) || '';
  return UUID.test(id) ? id : null;
}

export function setCurrentChatId(id) {
  const s = store();
  if (!s) return;
  try {
    if (id && UUID.test(id)) s.setItem(CHAT_KEY, id);
    else s.removeItem(CHAT_KEY);
    window.dispatchEvent(new CustomEvent(CHAT_EVENT, { detail: id || null }));
  } catch {
    // Storage full or blocked: the chat still works, it just is not shared.
  }
}

export function readPlace() {
  try {
    const p = JSON.parse(store()?.getItem(PLACE_KEY) || 'null');
    return p && Number.isFinite(p.right) && Number.isFinite(p.bottom) ? p : null;
  } catch {
    return null;
  }
}

export function writePlace(place) {
  try {
    store()?.setItem(PLACE_KEY, JSON.stringify(place));
  } catch {
    // not kept
  }
}

export const readOpen = () => store()?.getItem(OPEN_KEY) === '1';
export function writeOpen(open) {
  try {
    store()?.setItem(OPEN_KEY, open ? '1' : '0');
  } catch {
    // not kept
  }
}

/** Keeps the button inside the window: distances from the right and bottom edges, in pixels. */
export function clampPlace(place, view, size = 64, margin = 8) {
  const right = Math.min(Math.max(margin, Math.round(place.right)), Math.max(margin, view.w - size - margin));
  const bottom = Math.min(Math.max(margin, Math.round(place.bottom)), Math.max(margin, view.h - size - margin));
  return { right, bottom };
}

/** A press that moved less than this is a click, not a drag. */
export const isDrag = (dx, dy) => Math.abs(dx) + Math.abs(dy) > 6;
