import UnsubscribeForm from '@/components/UnsubscribeForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = {
  ...pageMetadata({
    title: 'Unsubscribe | Teracom Solutions',
    description: 'Stop marketing emails from Teracom Solutions.',
    path: '/unsubscribe',
  }),
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage(props) {
  const searchParams = await props.searchParams;
  const customerId = typeof searchParams?.c === 'string' ? searchParams.c : '';
  const token = typeof searchParams?.t === 'string' ? searchParams.t : '';

  return (
    <main id="main-content">
      <section className="section section-spacious">
        <div className="container">
          <div className="copy-block">
            <h1>Marketing emails</h1>
            <p className="lead">Press the button to stop marketing emails from Teracom Solutions. This does not affect order, account or warranty emails.</p>
            <UnsubscribeForm customerId={customerId} token={token} />
          </div>
        </div>
      </section>
    </main>
  );
}
