// Where the tools project lives: this browser's own storage. Nothing is sent to
// Teracom. Storage can be blocked (private windows, strict settings), so every
// read and write is guarded and the caller is told when saving did not work.
import { STORAGE_KEY, parseProject, serializeProject } from './toolProject.js';

export function loadProject() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? parseProject(saved) : null;
  } catch {
    return null;
  }
}

export function saveProject(project) {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeProject(project));
    return true;
  } catch {
    return false;
  }
}

export function clearProject() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored, or storage blocked: either way there is nothing to clear.
  }
}
