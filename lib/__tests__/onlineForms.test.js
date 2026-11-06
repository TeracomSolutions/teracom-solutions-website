import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ONLINE_FORMS,
  checkForm,
  cleanValues,
  findOnlineForm,
  identity,
  summarise,
  summaryText,
  termsTitle,
  visibleSections,
} from '../onlineForms/index.js';

const commissioning = findOnlineForm('monitoring-commissioning');
const watch = findOnlineForm('monitoring-247');

const complete = {
  name: 'Pat Example', company: 'Example Pty Ltd', email: 'pat@example.com', phone: '0400 000 000',
  street: '1 Test St', suburb: 'Carrum Downs', state: 'VIC', postcode: '3201',
  panelBrand: 'Bosch', panelModel: 'Solution 3000', panelLocation: 'Store room', keypadLocation: 'Front door',
  term: '12 months', billingEmail: 'accounts@example.com',
  contacts: [{ name: 'Sam', phone: '0411 111 111', voiceCode: 'apple' }],
  patrolRequired: 'No',
};

test('every form has a key, title, prefix, identity and an agreement', () => {
  const keys = new Set();
  for (const form of ONLINE_FORMS) {
    assert.ok(/^[a-z0-9-]+$/.test(form.key) && !keys.has(form.key), form.key);
    keys.add(form.key);
    assert.ok(/^[A-Z]{1,4}$/.test(form.referencePrefix), form.key);
    assert.ok(form.title && form.version && form.agreement.statement && (form.agreement.schedules?.length || form.agreement.document?.clauses.length), form.key);
    const ids = form.sections.flatMap((s) => s.fields.map((f) => f.id));
    assert.equal(new Set(ids).size, ids.length, `${form.key} has a repeated field id`);
    for (const id of Object.values(form.identity)) assert.ok(ids.includes(id), `${form.key} identity ${id}`);
  }
  assert.equal(findOnlineForm('nope'), null);
});

test('no dollar figures in the forms', () => {
  assert.ok(!/\$\s?\d/.test(JSON.stringify(ONLINE_FORMS)));
});

test('the commissioning form is live and the 24/7 form is not', () => {
  assert.equal(commissioning.live, true);
  assert.equal(watch.live, false);
});

test('a complete commissioning form passes, and gaps are named', () => {
  assert.deepEqual(checkForm(commissioning, complete), []);
  const problems = checkForm(commissioning, { ...complete, email: 'not-an-email', state: 'XYZ', contacts: [{ name: 'Sam' }] });
  assert.ok(problems.includes('Email is not an email address'));
  assert.ok(problems.includes('Choose one of the options for State'));
  assert.ok(problems.includes('Complete Mobile for contact 1'));
  assert.ok(checkForm(commissioning, {}).includes('Complete Contact list'));
});

test('patrol details only apply when patrols are wanted', () => {
  const no = visibleSections(commissioning, { patrolRequired: 'No' }).find((s) => s.id === 'patrols');
  assert.ok(!no.fields.some((f) => f.id === 'patrolInstruction'));
  const yes = visibleSections(commissioning, { patrolRequired: 'Yes' }).find((s) => s.id === 'patrols');
  assert.ok(yes.fields.some((f) => f.id === 'patrolInstruction'));
  const cleaned = cleanValues(commissioning, { ...complete, patrolInstruction: 'Patrol only' });
  assert.equal(cleaned.patrolInstruction, undefined);
});

test('files: count, size and type', () => {
  assert.deepEqual(checkForm(commissioning, complete, [{ field: 'zoneFile', name: 'zones.pdf', size: 1000 }]), []);
  assert.ok(checkForm(commissioning, complete, [{ field: 'zoneFile', name: 'zones.exe', size: 10 }])[0].includes('not a file type'));
  assert.ok(checkForm(commissioning, complete, [{ field: 'zoneFile', name: 'z.pdf', size: 4 * 1024 * 1024 }]).includes('The attached files are larger than 3 MB together'));
  const six = Array.from({ length: 6 }, (_, i) => ({ field: 'zoneFile', name: `z${i}.pdf`, size: 10 }));
  assert.ok(checkForm(commissioning, complete, six).includes('Attach at most 5 files'));
});

test('cleanValues keeps only the form\'s own answers, in shape', () => {
  const cleaned = cleanValues(commissioning, { ...complete, sneaky: 'x', options: ['Monthly reports', 7], contacts: [{ name: 'Sam', phone: '1', extra: 'no' }, {}] });
  assert.equal(cleaned.sneaky, undefined);
  assert.deepEqual(cleaned.options, ['Monthly reports', '7']);
  assert.deepEqual(cleaned.contacts, [{ name: 'Sam', phone: '1', userNumber: '', voiceCode: '' }]);
  assert.equal(Object.keys(cleaned.hours || {}).length, 0);
});

test('the summary reads like the form, without empty answers', () => {
  const summary = summarise(commissioning, { ...complete, hours: { mon: { open: '0730', close: '1730' } } }, [{ field: 'zoneFile', name: 'zones.pdf', size: 10 }]);
  const site = summary.find((s) => s.title === 'The site');
  assert.deepEqual(site.rows.map((r) => r.label), ['Street address', 'Suburb', 'State', 'Postcode']);
  const contacts = summary.find((s) => s.title === 'Who we call');
  assert.equal(contacts.rows[0].value, '1. First and last name: Sam, Mobile: 0411 111 111, Voice code: apple');
  assert.equal(contacts.rows[1].value, 'Monday: 0730 to 1730');
  assert.equal(summary.find((s) => s.title === 'Zones and areas').rows[0].value, 'zones.pdf');
  assert.ok(summaryText(summary).startsWith('ABOUT YOU\nYour name: Pat Example'));
});

test('who it is from, and the terms named with the version shown', () => {
  assert.deepEqual(identity(commissioning, complete), { name: 'Pat Example', email: 'pat@example.com', company: 'Example Pty Ltd', phone: '0400 000 000' });
  assert.equal(termsTitle(commissioning, complete, '3.4'), 'Teracom Terms and Conditions v3.4, Schedule 3 (Monitoring services)');
  assert.equal(termsTitle(watch, { service: 'AI monitoring' }, '3.4'), 'Teracom Terms and Conditions v3.4, Schedule 4 (Teracom AI platform)');
  assert.equal(termsTitle(watch, { service: 'Control room monitoring' }, '3.4'), 'Teracom Terms and Conditions v3.4, Schedule 4 (Teracom AI platform) and Schedule 3 (Monitoring services)');
});

test('the 24/7 form needs a plan for every kind of alarm', () => {
  const base = {
    name: 'Pat', company: 'Example', email: 'pat@example.com', phone: '1', service: 'AI monitoring', siteName: 'HQ',
    street: '1 Test St', suburb: 'Carrum Downs', state: 'VIC', postcode: '3201', contacts: [{ name: 'Sam', phone: '2' }],
  };
  const plans = Object.fromEntries(watch.sections.find((s) => s.id === 'plans').fields[0].rows.map((r) => [r.id, 'Tell us only']));
  assert.deepEqual(checkForm(watch, { ...base, plans }), []);
  assert.ok(checkForm(watch, { ...base, plans: { ...plans, backup: '' } }).includes('Choose what to do for A backup fails'));
  assert.ok(checkForm(watch, { ...base, plans, servers: 'lots' }).includes('Servers must be a whole number'));
});

test('forms with their own agreement carry its words into the signed copy', async () => {
  const { agreementVersion } = await import('../onlineForms/index.js');
  const nda = findOnlineForm('confidentiality-agreement');
  const rma = findOnlineForm('return-request');
  const con = findOnlineForm('contractor-application');
  assert.equal(nda.live, false, 'the NDA waits for a legal review');
  assert.ok(rma.live && con.live);
  assert.equal(termsTitle(nda, {}, '3.4'), 'Teracom Solutions Confidentiality Agreement');
  assert.equal(agreementVersion(nda, '3.4'), nda.agreement.document.version);
  assert.equal(agreementVersion(commissioning, '3.4'), '3.4');
  const summary = summarise(nda, { company: 'Acme Pty Ltd', name: 'Pat', direction: 'Both ways (mutual)', purpose: 'A tender' });
  const last = summary[summary.length - 1];
  assert.match(last.title, /^Teracom Solutions Confidentiality Agreement \(version /);
  assert.equal(last.rows.length, nda.agreement.document.clauses.length);
  assert.ok(last.rows.some((r) => /Electronic Transactions \(Victoria\) Act 2000/.test(r.value)));
});

test('the returns form needs a product line and the contractor form needs certificates', () => {
  const rma = findOnlineForm('return-request');
  const gaps = checkForm(rma, { company: 'A', name: 'B', phone: '1', email: 'a@b.co', invoices: 'INV-1', outcome: 'Repair' });
  assert.ok(gaps.some((g) => /product/i.test(g)), gaps.join('; '));
  const con = findOnlineForm('contractor-application');
  assert.ok(checkForm(con, {}).includes('Attach insurance certificates and licences'));
  assert.ok(!JSON.stringify(con).toLowerCase().includes('bsb'), 'no bank details on a web form');
});
