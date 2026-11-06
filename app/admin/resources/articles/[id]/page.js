import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import AdminNewsArticleEditor from '@/components/AdminNewsArticleEditor';
import AdminResourcesTabs from '@/components/AdminResourcesTabs';
import AdminShell from '@/components/AdminShell';
import { ApiError } from '@/lib/api/client';
import { fetchNewsArticleAdmin } from '@/lib/api/adminIndustryNews';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';

export const metadata = {
  title: retitle('Article|Teracom Solutions', BRAND),
};

export default async function AdminArticlePage(props) {
  const token = await requireAdminToken();
  const params = await props.params;
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  let article = null;
  try {
    article = await fetchNewsArticleAdmin(token, params.id);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  return (
    <AdminShell>
      <h1 className="admin-heading">Resources</h1>
      <AdminResourcesTabs />
      <p className="admin-muted"><Link className="admin-link" href="/admin/resources/articles">All articles</Link></p>
      <h2>{article.title}</h2>
      <AdminNewsArticleEditor initial={article} />
    </AdminShell>
  );
}
