// Essential Eight self-check (Robert, 2026-11-02). Each answer describes what a
// business actually does today, in plain words, and maps to the maturity level it
// roughly meets in ASD's Essential Eight Maturity Model (November 2023 version).
// It is a conversation starter, not an assessment: only a proper assessment against
// the published model can say what level a business is at, and the wording below
// simplifies it on purpose.

const NOT_SURE = { value: '0', label: "Not sure / we don't do this" };

export const ESSENTIAL_EIGHT = [
  {
    id: 'patchApps',
    title: 'Patch applications',
    options: [
      NOT_SURE,
      { value: '1', label: 'Browsers, Office, email, PDF and security software are updated within two weeks; unsupported programs are removed' },
      { value: '2', label: 'As above, plus every other program within a month, with weekly scans for missing updates' },
      { value: '3', label: 'As above, plus urgent fixes within 48 hours when a weakness is being exploited' },
    ],
    fix: 'Turn on automatic updates for browsers, Office, PDF readers and email, remove programs that no longer get updates, and check weekly that updates are actually installing.',
  },
  {
    id: 'patchOs',
    title: 'Patch operating systems',
    options: [
      NOT_SURE,
      { value: '1', label: 'Windows and other operating systems are updated within a month (two weeks for servers facing the internet); unsupported versions are replaced' },
      { value: '2', label: 'All computers and servers are updated within two weeks, with regular scans for missing updates' },
      { value: '3', label: 'As above, plus the latest supported version everywhere and urgent fixes within 48 hours' },
    ],
    fix: 'Replace any computer or server on an unsupported version of Windows, and make sure updates install every month without waiting for someone to click.',
  },
  {
    id: 'mfa',
    title: 'Multi-factor authentication',
    options: [
      NOT_SURE,
      { value: '1', label: 'Everyone uses a second step (app, code or key) for email, Microsoft 365 or Google, remote access and online services with important data' },
      { value: '2', label: 'As above, plus administrators and anyone reaching sensitive systems, using phishing-resistant methods where possible' },
      { value: '3', label: 'Phishing-resistant sign-in (security keys or passkeys) for everyone, everywhere' },
    ],
    fix: 'Turn on multi-factor authentication for email, Microsoft 365 or Google, remote access and banking first. It stops most stolen-password attacks.',
  },
  {
    id: 'admin',
    title: 'Restrict administrative privileges',
    options: [
      NOT_SURE,
      { value: '1', label: 'Staff use normal accounts day to day; admin accounts are separate, approved, and never used for email or browsing' },
      { value: '2', label: 'As above, plus admin access is reviewed every year, unused accounts are disabled and admin activity is logged' },
      { value: '3', label: 'Admin rights are granted only when needed, from dedicated admin computers, and the logs are watched' },
    ],
    fix: 'Take admin rights off everyday accounts. Give the few people who need them a separate admin account that is not used for email or the web.',
  },
  {
    id: 'appControl',
    title: 'Application control',
    options: [
      NOT_SURE,
      { value: '1', label: "Computers only run approved programs; programs can't run from users' own folders or downloads" },
      { value: '2', label: 'As above, plus on servers facing the internet, with the recommended block lists and logging' },
      { value: '3', label: 'As above, on every server, including drivers, with the logs watched' },
    ],
    fix: 'Stop programs running from Downloads and other user folders (Windows Defender Application Control or AppLocker), so a malicious download cannot start.',
  },
  {
    id: 'macros',
    title: 'Microsoft Office macro settings',
    options: [
      NOT_SURE,
      { value: '1', label: "Macros are blocked for staff who don't need them and for files from the internet; staff can't change these settings" },
      { value: '2', label: 'As above, plus only macros from trusted locations or signed by a trusted publisher can run, and their use is logged' },
      { value: '3', label: 'Only macros signed by publishers we review every year can run' },
    ],
    fix: 'Block macros in Office files that come from the internet, for everyone, and lock the setting so staff cannot turn it back on.',
  },
  {
    id: 'hardening',
    title: 'User application hardening',
    options: [
      NOT_SURE,
      { value: '1', label: "Browsers block ads and Java from the internet, Internet Explorer is disabled, and staff can't change the security settings" },
      { value: '2', label: 'As above, plus Office and PDF programs are stopped from starting other programs, and PowerShell is restricted' },
      { value: '3', label: 'As above, plus older components are removed and blocked activity is logged and watched' },
    ],
    fix: 'Lock browser security settings centrally, block web ads, and disable Internet Explorer on every computer.',
  },
  {
    id: 'backups',
    title: 'Regular backups',
    options: [
      NOT_SURE,
      { value: '1', label: 'Important data, software and settings are backed up on a schedule, and we have tested a restore' },
      { value: '2', label: "As above, plus ordinary admin accounts can't change or delete the backups" },
      { value: '3', label: "As above, plus only the backup administrators can change backups, and restores are tested as part of a disaster recovery exercise" },
    ],
    fix: 'Back up important data, software and settings on a schedule, keep a copy that cannot be changed or deleted, and test a restore.',
  },
];

const LEVEL_TEXT = ['Maturity Level Zero', 'Maturity Level One', 'Maturity Level Two', 'Maturity Level Three'];

export function levelText(level) {
  return LEVEL_TEXT[level] || LEVEL_TEXT[0];
}

export function essentialEightCheck(values) {
  const strategies = ESSENTIAL_EIGHT.map((s) => {
    const level = Math.min(3, Math.max(0, Number.parseInt(values[s.id], 10) || 0));
    // Nothing in place: the first step. Otherwise: what the next level adds.
    const fix = level === 0 ? s.fix : level < 3 ? `Next level: ${s.options[level + 1].label}.` : '';
    return { id: s.id, title: s.title, level, fix };
  });
  const overall = Math.min(...strategies.map((s) => s.level));
  const total = strategies.reduce((sum, s) => sum + s.level, 0);
  // Fix the weakest first; ties keep the order above, which puts patching and MFA early.
  const priorities = [...strategies].sort((a, b) => a.level - b.level).filter((s) => s.level < 3).slice(0, 3);
  return { strategies, overall, score: total, scorePercent: (total / 24) * 100, priorities };
}
