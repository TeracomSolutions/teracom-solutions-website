import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminHomeBanner from '@/components/AdminHomeBanner';
import AdminResourcesTabs from '@/components/AdminResourcesTabs';
import AdminShell from '@/components/AdminShell';
import { backendFetch } from '@/lib/api/client';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';
import { HERO_INDUSTRIES, mergeBanner } from '@/lib/heroSlides';
import { NEWS_SOURCES } from '@/lib/industryNews';

export const metadata = {
  title: retitle('Home banner|Teracom Solutions', BRAND),
};

export default async function AdminHomeBannerPage() {
  const token = await requireAdminToken();
  let saved = null;
  let loadError = '';
  try {
    saved = (await backendFetch('/staff/home-banner', { token }))?.banner || null;
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the home banner settings from the backend.';
  }
  const industries = HERO_INDUSTRIES.concat(NEWS_SOURCES.map((s) => s.id).filter((id) => !HERO_INDUSTRIES.includes(id)))
    .map((id) => ({ id, label: NEWS_SOURCES.find((s) => s.id === id)?.label || id }))
    .filter((x) => NEWS_SOURCES.some((s) => s.id === x.id));

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Resources
        <AdminHelpIcon>
          <h4>Home banner</h4>
          <p>The big rotating banner at the top of the public home page, and the scrolling line of headlines under it. This tab sets how long each slide stays and what goes in it.</p>
          <ul>
            <li><strong>Dwell time</strong>: the seconds each slide stays before the next.</li>
            <li><strong>Teracom slides</strong>: your own announcements. Edit the wording, picture and buttons, switch one off, reorder, add or remove. <em>First</em> slides always show before the news; <em>After the news</em> slides fill the places the news does not use.</li>
            <li><strong>Industry news</strong>: the newest story from each ticked industry fills the rest of the banner by itself. Untick it for Teracom slides only.</li>
            <li><strong>News line</strong>: show or hide the scrolling headlines and set their speed.</li>
          </ul>
          <p>Nothing changes on the website until you press <strong>Save</strong>; then the home page shows it straight away. <strong>Back to the built-in banner</strong> removes your version.</p>
        </AdminHelpIcon>
      </h1>
      <AdminResourcesTabs />
      <p className="lead">The home page banner: how long each slide stays and what goes in it.</p>
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : (
        <AdminHomeBanner initial={mergeBanner(saved)} saved={Boolean(saved)} industries={industries} />
      )}
    </AdminShell>
  );
}
