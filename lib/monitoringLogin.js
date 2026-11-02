// Monitoring customer login (Robert, 2026-11-02): monitoring customers will sign in
// through Teracom AI, which the Global Platform team builds first. Nothing about it is
// designed or scheduled yet (CTO, 2026-11-02), and no commercial monitoring service is
// offered online until the legal review is done (Architecture decision 8). So the page
// stays switched off: NEXT_PUBLIC_MONITORING_LOGIN=on adds it to the menus and the
// sitemap; until then it only opens with ?preview=1, and search engines leave it out.
//
// Rules for the copy below, all load-bearing:
//  - pre-launch only: no availability date, no price, no response time;
//  - no monitoring-specific sign-in address: the only one is the Teracom AI portal;
//  - nothing about Teracom reaching into a customer's site or equipment.

export const MONITORING_LOGIN_PATH = '/monitoring/customer-login';

export const TERACOM_AI_SIGN_IN = 'https://app.teracomsolutions.com.au/portal';

export function monitoringLoginEnabled(value = process.env.NEXT_PUBLIC_MONITORING_LOGIN) {
  return String(value || '').trim().toLowerCase() === 'on';
}

export function canShowMonitoringLogin(preview, enabled = monitoringLoginEnabled()) {
  return enabled || preview === '1';
}

// How a monitoring customer gets things done today. This is the service as it runs now.
export const monitoringLoginToday = [
  {
    title: 'Change your contacts or schedules',
    text: 'Call or email us and we update the control room record. Do it whenever staff change: a current contact list is the most useful thing you can give us.',
  },
  {
    title: 'Ask for a report',
    text: 'Signal history and open and close reports are available on request for your site.',
  },
  {
    title: 'Before you change anything on site',
    text: 'Tell us before you change phone or internet provider, move out or sell the site, or have work done on the alarm, so a genuine signal is not missed.',
  },
];

// What online access is planned to cover. Plans, not promises: the list can change.
export const monitoringLoginPlanned = [
  'See each of your monitored sites in one place',
  'Look back over signals and what was done about each one',
  'Open and close reports, without waiting for us to send them',
  'Ask for contact list and schedule changes, and see when they are done',
  'Your monitoring documents and invoices alongside the rest of your Teracom AI account',
];

export const monitoringLoginFaqs = [
  {
    question: 'Can I sign in now?',
    answer:
      'Not to monitoring yet. Online access for monitoring customers is still being planned, and it will be part of Teracom AI rather than a separate website. Until it opens, everything carries on as it does now: contact us for changes and reports.',
  },
  {
    question: 'When will it be available?',
    answer:
      'There is no date yet. Register your interest and we will tell you when it opens, before anything changes for your site.',
  },
  {
    question: 'Will it cost extra?',
    answer:
      'That has not been decided. Nothing will be charged for online access without you agreeing to it first.',
  },
  {
    question: 'Does it change my monitoring agreement?',
    answer:
      'No. Your monitoring keeps running under the agreement you have today. Online access, when it comes, is an extra way to see and manage your service, not a change to it.',
  },
];
