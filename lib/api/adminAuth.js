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

// Automatic sign-out (api/staff_auth.py /session and /refresh).
export async function getStaffSession(token) {
  return backendFetch('/staff/session', { token });
}

export async function setStaffSession(token, idleMinutes) {
  return backendFetch('/staff/session', { method: 'PUT', token, body: { idle_minutes: idleMinutes } });
}

// Records activity and returns a fresh access token, or a 401 once the
// staff member has been inactive for their chosen time.
export async function refreshStaffSession(refreshToken) {
  return backendFetch('/staff/refresh', { method: 'POST', body: { refresh_token: refreshToken } });
}

export async function revokeStaffSession(token, refreshToken) {
  return backendFetch('/staff/logout', { method: 'POST', token, body: { refresh_token: refreshToken } });
}

// Change password for the currently signed-in staff member
export async function changeStaffPassword(token, body) {
  return backendFetch('/staff/password', {
    method: 'POST',
    token,
    body,
  });
}
