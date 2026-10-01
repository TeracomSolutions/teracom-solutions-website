// The deeper brand pages, by brand slug. A brand with a profile gets the
// longer page (platforms, analytics, range, how it fits together, what
// Teracom does); every other brand keeps the short page until its profile
// is written.
import avigilon from './avigilon.js';

const PROFILES = {
  avigilon,
};

export function findBrandProfile(slug) {
  return PROFILES[slug] || null;
}