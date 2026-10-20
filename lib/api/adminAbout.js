// Server-only API for the admin About page.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAbout.js must only be used on the server.');
}
import { backendFetch } from './client.js';
// Which version of the backend is running: version, commit, build time, environment, site name and the version history.
export async function fetchAbout(token) {
  return backendFetch('/about', { token });
}