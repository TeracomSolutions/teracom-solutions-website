import AdminShell from '@/components/AdminShell'
import GuideContent from '@/components/GuideContent'
import { GUIDE_SECTIONS } from '@/lib/adminGuide'
import { requireAdminToken } from '@/lib/adminPage'

export const metadata = {
  title: 'User guide|Teracom Solutions'
}

export default async function AdminGuidePage() {
  await requireAdminToken()
  
  return (
    <AdminShell>
      <h1 className="admin-heading" id="top">User guide</h1>
      <p className="lead">How every part of the Administration Console works, step by step.</p>
      
      <nav className="admin-guide-toc" aria-label="Contents">
        <ol>
          {GUIDE_SECTIONS.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>
      
      {GUIDE_SECTIONS.map(({ id, markdown }) => (
        <section key={id} id={id} className="admin-guide-section">
          <GuideContent markdown={markdown} />
          <p><a href="#top">Back to the contents</a></p>
        </section>
      ))}
    </AdminShell>
  )
}