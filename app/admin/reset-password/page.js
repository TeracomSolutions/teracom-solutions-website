import AdminBrand from '@/components/AdminBrand';
import AdminResetPassword from '@/components/AdminResetPassword';

export const metadata = {
  title: 'Choose a new password|Teracom Solutions',
  robots: { index: false, follow: false },
};

// Opened from the "Reset your Teracom admin console password" email. The
// token is read here on the server and handed to the form.
export default async function AdminResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === 'string' ? params.token : '';
  return (
    <main id="main-content" className="admin-main">
      <section className="section section-spacious admin-section">
        <div className="container admin-container">
          <AdminBrand signedIn={false} />
        </div>
        <div className="container" style={{ maxWidth: '420px' }}>
          <h1>Choose a new password</h1>
          <p className="lead">For your Teracom Solutions admin console account.</p>
          <AdminResetPassword token={token} />
        </div>
      </section>
    </main>
  );
}
