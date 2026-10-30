import Link from 'next/link';

import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';
import { pagesByMenu } from '@/lib/adminPages';

export const metadata = {
  title: retitle('Where to find everything|Teracom Solutions', BRAND),
};

function linkFor(path) {
  // A page for one order, run or supplier has no address of its own here: link to its list instead.
  return path.includes('[') ? path.split('/[')[0] : path;
}

export default async function WhereToFindPage() {
  await requireAdminToken();
  const groups = pagesByMenu();
  return (
    <AdminShell>
      <h1 className="admin-heading">Where to find everything</h1>
      <p className="lead">Every page in the console: how to get to it, what it shows and where that information comes from, with the Department it belongs to. Click a name to open the page.</p>
      {groups.map((group) => (
        <section key={group.top} className="admin-where-group">
          <h2>{group.top}{group.department ? <span className="admin-muted admin-where-dept"> · {group.department}</span> : null}</h2>
          <div className="admin-table-wrap">
            <table className="admin-table admin-where-table">
              <thead>
                <tr><th>Page</th><th>How to get there</th><th>What you see</th><th>Where it comes from</th><th>Who</th></tr>
              </thead>
              <tbody>
                {group.pages.map((page) => (
                  <tr key={page.path}>
                    <td><Link href={linkFor(page.path)}>{page.title}</Link><br /><span className="admin-muted">{page.what}</span></td>
                    <td>{page.menu}</td>
                    <td>{page.shows}</td>
                    <td>{page.source}</td>
                    <td>{page.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </AdminShell>
  );
}
