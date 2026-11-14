import StopEmailsForm from '@/components/StopEmailsForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = {
  ...pageMetadata({ title: 'Stop emails | Teracom Solutions', description: 'Stop emails from Teracom Solutions.', path: '/stop-emails' }),
  robots: { index: false, follow: false },
};

// Behind the unsubscribe link in the lead finder's emails (services/leadgen/outreach.py in the backend).
export default async function StopEmailsPage(props) {
  const searchParams = await props.searchParams;
  const email = typeof searchParams?.e === 'string' ? searchParams.e.slice(0, 255) : '';
  const token = typeof searchParams?.t === 'string' ? searchParams.t.slice(0, 128) : '';
  return (
    <main id="main-content">
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            <h1>Stop emails from us</h1>
            <p className="lead">Press the button and Teracom Solutions will not email {email || 'you'} again. It works straight away.</p>
            <StopEmailsForm email={email} token={token} />
          </div>
        </div>
      </section>
    </main>
  );
}
