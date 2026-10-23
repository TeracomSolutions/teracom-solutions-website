import { notFound } from 'next/navigation';

import { BACKEND_API_URL } from '@/lib/config';

// Public status and trust page (best-practice roadmap item 15). A DRAFT until Robert approves the
// wording: it only exists when STATUS_PAGE=on is set for the site, and search engines are told to
// leave it out. Everything on it is checked live when the page is loaded; nothing is claimed that
// is not true today.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Service status | Teracom Solutions',
  description: 'Whether the Teracom Solutions website and online store are working right now.',
  robots: { index: false, follow: false },
};

async function backendHealth() {
  const started = Date.now();
  try {
    const response = await fetch(`${BACKEND_API_URL}/healthz`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    return { ok: response.ok, ms: Date.now() - started };
  } catch {
    return { ok: false, ms: null };
  }
}

async function backendVersion() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/about/version`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function Row({ name, ok, detail }) {
  return (
    <tr>
      <td>{name}</td>
      <td><strong className={ok ? 'status-ok' : 'status-bad'}>{ok ? 'Working' : 'Having problems'}</strong></td>
      <td className="status-detail">{detail}</td>
    </tr>
  );
}

export default async function StatusPage() {
  if (process.env.STATUS_PAGE !== 'on') notFound();
  const [health, version] = await Promise.all([backendHealth(), backendVersion()]);
  const checked = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'medium', timeStyle: 'short' });
  return (
    <main id="main-content" className="section status-page">
      <div className="container">
        <span className="eyebrow">Service status</span>
        <h1>{health.ok ? 'Everything is working' : 'Some services are having problems'}</h1>
        <p className="lead">Checked just now, {checked} Sydney time. Reload the page to check again.</p>
        <table className="status-table">
          <thead><tr><th>Service</th><th>Now</th><th>Detail</th></tr></thead>
          <tbody>
            <Row name="Website" ok detail="This page loaded, so the website is answering." />
            <Row
              name="Online store, accounts and checkout"
              ok={health.ok}
              detail={health.ok ? `Answered in ${health.ms} ms.` : 'Did not answer within 5 seconds. Please try again in a few minutes.'}
            />
          </tbody>
        </table>

        <h2>How we look after the site</h2>
        <ul className="status-list">
          <li>Every page is served over an encrypted connection (HTTPS).</li>
          <li>Card payments are taken by Stripe; card numbers never reach our own servers.</li>
          <li>Staff sign in to manage the site with two-factor sign-in available on every account.</li>
          <li>Every change to the website is tested before it goes live, including a check in a real browser, and the software it is built on is checked for known security problems on every change.</li>
        </ul>

        <h2>Current version</h2>
        <p>
          Store and accounts service: {version ? `version ${version.version}, released ${String(version.build_time || '').slice(0, 10)}` : 'not available right now'}.
          {process.env.BUILD_COMMIT ? ` Website build ${String(process.env.BUILD_COMMIT).slice(0, 7)}.` : ''}
        </p>
        <p className="status-detail">Something not working? <a href="/contact">Contact us</a>.</p>
      </div>
    </main>
  );
}
