// Server-only. Global's public Department catalogue for /teracom-ai, refreshed hourly
// (Vercel Hobby: one fetch an hour, no work per visit). If Global does not answer
// while the page is being refreshed, the error keeps the last good page Vercel already
// has; only a build with no catalogue at all falls back to the bundled copy.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/departmentCatalogue.js must only be used on the server.');
}

import { CATALOGUE_URL, SAMPLE_CATALOGUE, USE_LIVE_CATALOGUE, cleanCatalogue } from '../departmentCatalogue.js';

const REFRESH_SECONDS = 3600;

export async function fetchDepartmentCatalogue() {
  if (!USE_LIVE_CATALOGUE) return { source: 'bundled', entries: SAMPLE_CATALOGUE };
  const url = process.env.DEPARTMENT_CATALOGUE_URL || CATALOGUE_URL;
  try {
    const response = await fetch(url, { next: { revalidate: REFRESH_SECONDS }, signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Department catalogue answered ${response.status}`);
    const entries = cleanCatalogue(await response.json());
    if (!entries.some((e) => e.kind === 'department')) throw new Error('Department catalogue has no Departments');
    return { source: 'live', entries };
  } catch (error) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Department catalogue not read at build; using the bundled copy.', error instanceof Error ? error.message : error);
      return { source: 'bundled', entries: SAMPLE_CATALOGUE };
    }
    // During a refresh: throwing keeps the last good page instead of replacing it.
    throw error;
  }
}
