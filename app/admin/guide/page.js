import AdminShell from '@/components/AdminShell'
import GuideContent from '@/components/GuideContent'
import { GUIDE_SECTIONS } from '@/lib/adminGuide'
import { requireAdminToken } from '@/lib/adminPage'
import { guideOutline } from '@/lib/guideReader'

export const metadata = {
  title: 'User guide|Teracom Solutions'
}

export default async function AdminGuidePage() {
  await requireAdminToken()
  
  return (
    <AdminShell>
      <h1 className="admin-heading" id="top">User guide</h1>
      <p className="lead">How every part of the Administration Console works, step by step.</p>
      
      <div className="admin-guide-layout">
        <nav className="admin-guide-nav" aria-label="Guide contents">
          <p>Contents</p>
          {GUIDE_SECTIONS.map(({ id, title, markdown }) => (
            <div key={id} className="admin-guide-nav-group">
              <a href={`#${id}`} className="admin-guide-nav-chapter">{title}</a>
              {guideOutline(markdown).map((part) => (
                <a key={part.id} href={`#${id}-${part.id}`} className="admin-guide-nav-part">{part.text}</a>
              ))}
            </div>
          ))}
        </nav>
        
        <div className="admin-guide-body">
          {GUIDE_SECTIONS.map(({ id, markdown }) => (
            <section key={id} id={id} className="admin-guide-section">
              <GuideContent markdown={markdown} idPrefix={id} />
              <p><a href="#top">Back to the top</a></p>
            </section>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}