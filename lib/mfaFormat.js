// Pure functions for formatting MFA-related data

export function groupSecret(secret) {
  // Split the base32 secret into groups of 4 characters separated by spaces
  if (!secret) return '';
  const groups = [];
  for (let i = 0; i < secret.length; i += 4) {
    groups.push(secret.substring(i, i + 4));
  }
  return groups.join(' ');
}

export function isBackupCode(code) {
  // Check if code matches the pattern xxxxx-xxxxx (10 hex characters with a hyphen)
  if (!code || typeof code !== 'string') return false;
  return /^[a-fA-F0-9]{5}-[a-fA-F0-9]{5}$/.test(code);
}

export function cleanCode(code) {
  // For a 6-digit code, return only digits; for backup codes, return normalized format
  if (!code || typeof code !== 'string') return '';
  
  // If it's a backup code (xxxxx-xxxxx), normalize to uppercase
  if (isBackupCode(code)) {
    return code.toUpperCase();
  }
  
  // For 6-digit codes, return only digits
  const digits = code.replace(/[^0-9]/g, '');
  if (digits.length === 6) {
    return digits;
  }
  
  return '';
}

export function backupCodesText(codes, email) {
  // Generate text content for a backup codes download file
  if (!codes || !Array.isArray(codes)) return '';
  
  const lines = [
    `Teracom Admin backup codes for ${email}`,
    ...codes.map(code => code.toUpperCase()),
    '',
    'Each code works once only.',
  ];
  
  return lines.join('\n');
}