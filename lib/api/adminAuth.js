// Server-only. MFA-related API calls for the admin console.
// This is separate from adminCatalog.js which contains non-MFA staff functions.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAuth.js must only be used on the server.');
}

import { backendFetch } from './client.js';

// MFA verification - called after initial login when MFA is required
export async function staffMfaVerify(challengeToken, code, clientIp) {
  return backendFetch('/staff/login/mfa', {
    method: 'POST',
    body: { challenge_token: challengeToken, code },
    headers: clientIp
      ? {
          'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '',
          'X-Client-IP': clientIp,
        }
      : undefined,
  });
}

// MFA status check
export async function staffMfaStatus(token) {
  return backendFetch('/staff/mfa/status', {
    method: 'GET',
    token,
  });
}

// MFA setup - returns secret, otpauth_uri, qr_png_data_url
export async function staffMfaSetup(token) {
  return backendFetch('/staff/mfa/setup', {
    method: 'POST',
    token,
  });
}

// Enable MFA with a code
export async function staffMfaEnable(token, code) {
  return backendFetch('/staff/mfa/enable', {
    method: 'POST',
    token,
    body: { code },
  });
}

// Disable MFA with a code
export async function staffMfaDisable(token, code) {
  return backendFetch('/staff/mfa/disable', {
    method: 'POST',
    token,
    body: { code },
  });
}

// Who is signed in (id, email, staff_role), for the account page.
export async function staffMe(token) {
  return backendFetch('/staff/me', { token });
}
