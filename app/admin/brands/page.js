import { redirect } from 'next/navigation';

import AdminBrands from '@/components/AdminBrands';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { listStoreBrands } from '@/lib/api/adminBrands';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Brands|Teracom Solutions',
};

export default async function AdminBrandsPage() {
  const token = await requireAdminToken();

  let brands = [];
  let loadError = '';
  try {
    brands = (await listStoreBrands(token)).brands || [];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the brands from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Store
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Every brand on a product in the store gets its own page on the website, with its logo and its products, without anyone coding it. A new brand appears here within a few minutes of its products going live, and Teracom looks for its logo on the brand&apos;s own website.</p>
          <h4>What you can do</h4>
          <ul>
            <li><strong>Find logo</strong> looks again for the logo on the brand&apos;s website. <strong>Upload logo</strong> replaces it with your own file (PNG, JPEG, WebP or SVG, under 1 MB). <strong>Remove</strong> takes it off.</li>
            <li><strong>Edit</strong> changes the brand&apos;s name, website, other spellings (for example UNV for Uniview, so both count as one brand), a one-line description and the page text. Leave the text blank to use the standard wording.</li>
            <li><strong>Shown with the brands we work with</strong> puts the brand in the main Brands list; unticked brands are listed under More brands in the store.</li>
            <li>A transparent logo is shown as a white silhouette like the others. <strong>Show the logo as it is</strong> keeps a solid logo (a square icon) in its own colours on a light tile.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">The brands in the store: their pages, logos and spellings.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminBrands initial={brands} />}
    </AdminShell>
  );
}