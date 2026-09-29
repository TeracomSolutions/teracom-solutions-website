import { redirect } from 'next/navigation';

import AdminChangePassword from '@/components/AdminChangePassword';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSessionSettings from '@/components/AdminSessionSettings';
import AdminTwoFactor from '@/components/AdminTwoFactor';
import { getStaffSession, staffMe, staffMfaStatus } from '@/lib/api/adminAuth';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Your account|Teracom Solutions',
};

export default async function AdminAccountPage() {
  const token = await requireAdminToken();

  let status = { enabled: false, backup_codes_left: 0 };
  let email = '';
  let loadError = '';
  try {
    const [me, mfa] = await Promise.all([staffMe(token), staffMfaStatus(token)]);
    email = me?.email || '';
    status = mfa;
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load your account from the backend.';
  }

  // Loaded on its own so an older backend without it leaves the page working.
  let session = null;
  try {
    session = await getStaffSession(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    session = null;
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Your account
        <AdminHelpIcon>
          <h4>Automatic sign-out</h4>
          <p>The console signs you out after the time you choose with no activity: 5, 10, 15 or 30 minutes, or 1, 2, 4 or 8 hours. Clicking, typing, scrolling or moving between pages starts the clock again. The time left is shown next to <strong>Sign out</strong>; a minute before the end a banner offers <strong>Stay signed in</strong>. The setting is yours alone and applies straight away.</p>
          <h4>Two-factor sign-in</h4>
          <p>A second step after your password: a six-digit code that changes every 30 seconds. It comes from an authenticator app on your phone (Google or Microsoft Authenticator, Authy, 1Password) or from Zoho Vault, which can hold the same secret and generate the codes for you. Both work at the same time because they share one secret.</p>
          <h4>Setting it up</h4>
          <p>Click <strong>Set up two-factor</strong>: scan the QR code with your app, or copy the key into Zoho Vault as a time-based one-time password. Enter the code it shows to confirm. You are then given eight backup codes, shown once: each signs you in a single time if the phone or vault is not to hand. Save them in your password manager.</p>
          <h4>If you are locked out</h4>
          <p>Use a backup code at sign-in. With no codes left, an administrator can clear two-factor for your account on the server (scripts/reset_staff_mfa.py) and you set it up again.</p>
          <h4>Change password</h4>
          <ul>
            <li>Enter your current password</li>
            <li>Then the new one twice</li>
            <li>At least 12 characters, a mix of characters, not your email name and not the one you are using now</li>
            <li>When two-factor is on, the code from your app or a backup code is also needed</li>
          </ul>
          <p>This session stays signed in and every other signed-in session is signed out.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">{email ? `Signed in as ${email}.` : 'Your sign-in settings.'}</p>

      <AdminSessionSettings initial={session} />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <> <AdminChangePassword mfaEnabled={Boolean(status?.enabled)} /> <AdminTwoFactor initialStatus={status} email={email} /></>}
    </AdminShell>
  );
}
