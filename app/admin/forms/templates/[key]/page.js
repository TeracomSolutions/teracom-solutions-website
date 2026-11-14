import { BRAND, retitle } from '@/lib/brand';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import AdminFormEditor from '@/components/AdminFormEditor';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchFormEdits } from '@/lib/api/forms';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { findOnlineForm } from '@/lib/onlineForms';
import { TERMS_VERSION } from '@/lib/termsDocument';
import { staffMe } from '@/lib/api/adminAuth';

export const metadata = {
  title: retitle('Change a form|Teracom Solutions', BRAND),
};

// One of the forms customers sign on the website: read it, see it as customers do, and
// change its wording, questions and agreement (lib/onlineForms/edits.js).
export default async function AdminFormTemplatePage(props) {
  const params = await props.params;
  const form = findOnlineForm(params.key);
  if (!form) notFound();
  const token = await requireAdminToken();
  let edits = null;
  let loadError = null;
  try {
    const data = await fetchFormEdits(token);
    edits = (data?.forms || {})[form.key] || null;
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'The saved changes could not be loaded from the backend, so this shows the form as built and cannot be saved.';
  }
  const me = await staffMe(token).catch(() => null);
  const role = me?.staff_role || '';
  const canEdit = !loadError && role === 'platform_admin';

  return (
    <AdminShell>
      <p className="admin-muted"><Link className="admin-link" href="/admin/forms">Forms</Link> &rsaquo; The forms</p>
      <h1 className="admin-heading">
        {form.title}
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Read this form, see it exactly as customers do, and change it. Nothing changes on the website until you click Save changes.</p>
          <ul>
            <li><strong>The page</strong> - the title, the line under it and the introduction.</li>
            <li><strong>Each section</strong> - click it to open: change a heading, a question, its help text and its choices, tick Must answer, Hide a question, or Add a question.</li>
            <li><strong>Needed</strong> - questions the reply email or other questions depend on can be reworded but not hidden or given new choices.</li>
            <li><strong>Agreement</strong> - the sentence customers tick and, for a form with its own document, the clauses. A change to the clauses gets a new change number, recorded on every signed copy.</li>
            <li><strong>Preview</strong> - on the right, with your unsaved changes. You can fill it in to try it; nothing is sent.</li>
            <li><strong>Put back as built</strong> - removes every change. Forms already signed keep their own signed copy either way.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">{form.lead}</p>
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : null}
      <AdminFormEditor formKey={form.key} initial={edits} termsVersion={TERMS_VERSION} canEdit={canEdit} />
    </AdminShell>
  );
}
