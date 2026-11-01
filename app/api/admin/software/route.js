import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';
import { WEBSITE_PURPOSE, baseVersion, statusOf, summaryOf } from '@/lib/softwareInventory';
import pkg from '../../../../package.json';

// Connections > Software (Robert, 2026-11-01): the backend's own check (api/staff_software.py) and the
// website's packages, each with the version in use, the newest release and any published security advisory.
export const maxDuration = 60;

async function latestNpm(name, fresh) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${name.replaceAll('/', '%2F')}/latest`, fresh ? { cache: 'no-store' } : { next: { revalidate: 86400 } });
    if (!response.ok) return null;
    return (await response.json()).version || null;
  } catch {
    return null;
  }
}

async function npmAdvisories(packages, fresh) {
  try {
    const response = await fetch('https://api.osv.dev/v1/querybatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queries: packages.map(([name, version]) => ({ package: { name, ecosystem: 'npm' }, version })) }),
      ...(fresh ? { cache: 'no-store' } : { next: { revalidate: 86400 } }),
    });
    const data = await response.json();
    const found = {};
    (data.results || []).forEach((result, i) => {
      const ids = [...new Set((result?.vulns || []).map((v) => v.id).filter(Boolean))].sort();
      if (ids.length) found[packages[i][0]] = ids;
    });
    return found;
  } catch {
    return {};
  }
}

async function websiteInventory(fresh) {
  const declared = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const names = Object.keys(declared).sort();
  const packages = names.map((name) => [name, baseVersion(declared[name])]).filter(([, version]) => version);
  const [latest, advisories] = await Promise.all([
    Promise.all(packages.map(([name]) => latestNpm(name, fresh))),
    npmAdvisories(packages, fresh),
  ]);
  const items = [
    { kind: 'system', name: 'Node.js (website runtime)', running: process.version.replace(/^v/, ''), latest: null, pinned: pkg.engines?.node || null, advisories: [], purpose: 'Runs the website and console where they are hosted.' },
    ...packages.map(([name, version], i) => ({
      kind: 'package', name, running: version, pinned: declared[name], latest: latest[i], advisories: advisories[name] || [], purpose: WEBSITE_PURPOSE[name] || '',
    })),
  ].map((item) => ({ ...item, status: statusOf(item) }));
  return { checked_at: new Date().toISOString(), items, summary: summaryOf(items) };
}

export const GET = withAdminSession(async ({ token }) => {
  const [backend, website] = await Promise.all([
    backendFetch('/staff/software', { token }).catch(() => null),
    websiteInventory(false),
  ]);
  return NextResponse.json({ backend, website });
});

export const POST = withAdminSession(async ({ token }) => {
  const [backend, website] = await Promise.all([
    backendFetch('/staff/software/check', { method: 'POST', token }).catch(() => null),
    websiteInventory(true),
  ]);
  return NextResponse.json({ backend, website });
});
