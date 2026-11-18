import AdminComparisons from '@/components/AdminComparisons';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminResourcesTabs from '@/components/AdminResourcesTabs';
import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';

export const metadata = {
  title: retitle('Product comparisons|Teracom Solutions', BRAND),
};

export default async function AdminComparisonsPage() {
  await requireAdminToken();
  return (
    <AdminShell>
      <h1 className="admin-heading">
        Resources
        <AdminHelpIcon>
          <h4>Product comparisons</h4>
          <p>The side-by-side tables on the website&apos;s Resources &gt; Product Comparisons pages, starting with the VMS comparison.</p>
          <ul>
            <li><strong>Add a product</strong>: its name and the maker&apos;s page for it. The backend reads that page, the datasheet and licensing pages it links to, and the AI fills every row with a link to where it came from. Adding the datasheet or licensing page under <em>More pages to read</em> gives the best results.</li>
            <li><strong>Every week</strong> each product is read again. The AI changes only rows the maker&apos;s pages show are out of date, and only when it can quote the words from the page. Each change is listed with the old wording under <em>Changes</em>.</li>
            <li><strong>Edit</strong> any row, its source, or the Help me choose answers by hand. Hide a product without deleting it.</li>
            <li><strong>Published</strong> puts the comparison on the website. Changes show there straight away.</li>
          </ul>
          <p>Uses the free AI connections, so a new product can take a couple of minutes, and rows the maker&apos;s pages do not answer say &quot;Not stated by the maker&quot;.</p>
        </AdminHelpIcon>
      </h1>
      <AdminResourcesTabs />
      <p className="lead">Product comparisons on the website: what is in each table, where it came from, and what the weekly check changed.</p>
      <AdminComparisons />
    </AdminShell>
  );
}
