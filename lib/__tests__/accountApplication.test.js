import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ACCOUNT_TYPES,
  accountApplication,
  formatApplication,
  isCompanyLike,
  isCreditAccount,
  missingFrom,
  needsGuarantee,
  visibleDeclarations,
  visibleFields,
  visibleSteps,
} from '../accountApplication.js';

const soleTraderCash = { accountType: 'cash', entityType: 'sole_trader' };
const companyCredit = { accountType: 'credit', entityType: 'company' };
const soleTraderCredit = { accountType: 'credit', entityType: 'sole_trader' };

test('a sole trader never sees the company step, and a company never sees the applicant step', () => {
  // The Zoho form shows both to everyone, even though its own first page
  // says you complete one or the other.
  const sole = visibleSteps(soleTraderCash).map((s) => s.id);
  const company = visibleSteps(companyCredit).map((s) => s.id);
  assert.ok(sole.includes('applicant'));
  assert.ok(!sole.includes('company'));
  assert.ok(company.includes('company'));
  assert.ok(!company.includes('applicant'));
});

test('the guarantee applies to companies and trusts on credit, and nobody else', () => {
  // Terms v3.3 Schedule 7 clause 7.1(b). The Zoho form demanded a signature
  // on a guarantee from cash applicants, which its own page 1 said they did
  // not need.
  assert.equal(needsGuarantee(companyCredit), true);
  assert.equal(needsGuarantee({ accountType: 'credit', entityType: 'trust' }), true);
  assert.equal(needsGuarantee(soleTraderCredit), false);
  assert.equal(needsGuarantee({ accountType: 'cash', entityType: 'company' }), false);
  assert.equal(needsGuarantee(soleTraderCash), false);
  assert.equal(needsGuarantee({}), false);
});

test('only a credit applicant is asked for a credit limit and trade references', () => {
  const step = accountApplication.steps.find((s) => s.id === 'business');
  const creditIds = visibleFields(step, companyCredit).map((f) => f.id);
  const cashIds = visibleFields(step, soleTraderCash).map((f) => f.id);

  assert.ok(creditIds.includes('creditLimit'));
  assert.ok(creditIds.includes('ref1Company'));
  assert.ok(!cashIds.includes('creditLimit'));
  assert.ok(!cashIds.includes('ref1Company'));

  // A sole trader on credit still gives references -- they just do not give
  // a guarantee.
  const soleCreditIds = visibleFields(step, soleTraderCredit).map((f) => f.id);
  assert.ok(soleCreditIds.includes('ref1Company'));
  assert.equal(isCreditAccount(soleTraderCredit), true);
});

test('the guarantee declaration only appears for those who give one', () => {
  const step = accountApplication.steps.find((s) => s.id === 'declarations');
  const forCompany = visibleDeclarations(step, companyCredit).map((d) => d.id);
  const forSole = visibleDeclarations(step, soleTraderCredit).map((d) => d.id);
  assert.ok(forCompany.includes('guarantee'));
  assert.ok(!forSole.includes('guarantee'));
  // Everyone confirms the basics.
  for (const id of ['accurate', 'authorised', 'terms']) {
    assert.ok(forCompany.includes(id) && forSole.includes(id));
  }
});

test('a partnership is asked about the second partner and a sole trader is not', () => {
  const step = accountApplication.steps.find((s) => s.id === 'applicant');
  const partnership = visibleFields(step, { entityType: 'partnership' }).map((f) => f.id);
  const sole = visibleFields(step, { entityType: 'sole_trader' }).map((f) => f.id);
  assert.ok(partnership.includes('p2Name'));
  assert.ok(!sole.includes('p2Name'));
});

test('a company must name at least one director', () => {
  const step = accountApplication.steps.find((s) => s.id === 'company');
  assert.ok(step.repeatable);
  assert.equal(step.repeatable.min, 1);
  const missing = missingFrom(step, companyCredit, []);
  assert.ok(missing.some((m) => /at least one director/i.test(m)));
  const withDirector = missingFrom(
    step,
    { ...companyCredit, companyName: 'X', abn: '1', bizStreet: 'a', bizSuburb: 'b', bizState: 'VIC', bizPostcode: '3201', bizPhone: '1', bizEmail: 'e@x.com' },
    [{ name: 'A', home: 'B', mobile: 'C' }]
  );
  assert.deepEqual(withDirector, []);
});

test('required fields are reported by label, not by id', () => {
  const step = accountApplication.steps.find((s) => s.id === 'business');
  const missing = missingFrom(step, companyCredit);
  assert.ok(missing.includes('Date business commenced'));
  assert.ok(!missing.some((m) => /^commenced$/.test(m)));
});

test('the submission reads as an application a person can assess', () => {
  const message = formatApplication(
    {
      ...companyCredit,
      companyName: 'Example Pty Ltd',
      abn: '11 111 111 111',
      creditLimit: '5000',
      accurate: true,
      terms: true,
    },
    [{ name: 'A Director', mobile: '0400000000' }]
  );
  assert.match(message, /TRADE ACCOUNT APPLICATION/);
  assert.match(message, /Account type: 30-day commercial credit account/);
  assert.match(message, /Entity type: Company/);
  assert.match(message, /Company or trust name: Example Pty Ltd/);
  assert.match(message, /director 1:/);
  assert.match(message, /Declarations accepted:/);
  // The step a company never sees does not appear in what staff read.
  assert.ok(!message.includes('Second partner'));
});

test('no dollar figures and no licence-number claim in the form copy', () => {
  // The 2015 source claimed Teracom collects driver's licence numbers and
  // had no field for one. v3.3 drops the claim; the form must not
  // reintroduce it.
  const text = JSON.stringify(accountApplication);
  assert.ok(!/driver/i.test(text), "the form must not ask for or mention driver's licences");
  assert.ok(!/\$\d/.test(text), 'no prices belong in this form');
  assert.ok(isCompanyLike('trust'));
  assert.ok(!isCompanyLike('partnership'));
});

test('the values a choice emits are the values the branching compares against', () => {
  // The bug this exists to prevent: the radio emitted "Company" as its value
  // while every branch tested for 'company', so picking Company silently did
  // nothing and the applicant saw the wrong questions.
  const step = accountApplication.steps.find((s) => s.id === 'account-type');
  const emitted = Object.fromEntries(
    step.fields.map((field) => [field.id, (field.options || []).map((o) => (typeof o === 'string' ? o : o.value))])
  );

  assert.deepEqual(emitted.accountType.sort(), ['cash', 'credit']);
  assert.deepEqual(emitted.entityType.sort(), ['company', 'partnership', 'sole_trader', 'trust']);

  // Every emitted value routes to a real set of steps, and the two that
  // should differ actually do.
  for (const accountType of emitted.accountType) {
    for (const entityType of emitted.entityType) {
      const ids = visibleSteps({ accountType, entityType }).map((s) => s.id);
      assert.ok(ids.includes('account-type') && ids.includes('business') && ids.includes('declarations'));
      assert.equal(ids.includes('company'), isCompanyLike(entityType), `${entityType} routed to the wrong step`);
    }
  }
});
