import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  connectionPaths,
  findMonitoringService,
  monitoringFaqs,
  monitoringPath,
  monitoringServices,
  monitoringSteps,
} from '../monitoring.js';

test('every monitoring service is complete enough to render a page', () => {
  assert.ok(monitoringServices.length >= 5);
  for (const service of monitoringServices) {
    assert.match(service.slug, /^[a-z0-9-]+$/);
    assert.ok(service.title);
    assert.ok(service.seoTitle);
    assert.ok(service.summary);
    assert.ok(service.lead);
    assert.ok(service.description);
    assert.ok(service.icon);
    assert.ok(service.intro.length >= 1);
    assert.ok(service.includes.length >= 3);
    assert.ok(service.considerations.length >= 3);
  }
});

test('slugs are unique and round-trip through monitoringPath', () => {
  const slugs = monitoringServices.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const service of monitoringServices) {
    assert.equal(monitoringPath(service), `/monitoring/${service.slug}`);
    assert.equal(findMonitoringService(service.slug), service);
  }
  assert.equal(monitoringPath(null), '/monitoring');
  assert.equal(findMonitoringService('nope'), undefined);
});

test('meta descriptions fit in a search result', () => {
  for (const service of monitoringServices) {
    assert.ok(
      service.description.length >= 70 && service.description.length <= 160,
      `${service.slug}: ${service.description.length} characters`
    );
    assert.ok(service.seoTitle.length <= 70, `${service.slug} title: ${service.seoTitle.length} characters`);
  }
});

test('the third-party control room is never named on a public page', () => {
  // Robert, 2026-09-23: monitoring is presented as a Teracom service. This
  // test exists so a future edit cannot quietly reintroduce the provider's
  // name from the source documents.
  const text = JSON.stringify({
    monitoringServices,
    connectionPaths,
    monitoringSteps,
    monitoringFaqs,
  }).toLowerCase();
  for (const name of ['staysafe', 'stay safe', 'scsi', 'permaconn', 'securitas']) {
    assert.ok(!text.includes(name), `monitoring copy must not name ${name}`);
  }
});

test('no prices or response-time promises the service agreement cannot back', () => {
  const text = JSON.stringify({ monitoringServices, connectionPaths, monitoringSteps, monitoringFaqs });
  // Stale prices on a public page are a misleading pricing claim, and the
  // agreement commits to monitoring 24/7, not to a number of minutes.
  assert.ok(!/\$\d/.test(text), 'monitoring copy must not quote a price');
  assert.ok(
    !/within \d+\s*(minute|minutes|min|hour|hours)\b/i.test(text),
    'monitoring copy must not promise a response time'
  );
});

test('there is a commissioning step, because nothing goes live untested', () => {
  assert.equal(monitoringSteps.length, 5);
  const titles = monitoringSteps.map((s) => s.title);
  assert.ok(titles.includes('Commission'));
  for (const step of monitoringSteps) {
    assert.ok(step.title);
    assert.ok(step.text);
  }
});

test('the FAQs answer the questions a buyer actually asks', () => {
  assert.ok(monitoringFaqs.length >= 6);
  for (const faq of monitoringFaqs) {
    assert.match(faq.question, /\?$/);
    assert.ok(faq.answer.length > 80);
  }
  const questions = monitoringFaqs.map((f) => f.question.toLowerCase()).join(' ');
  for (const topic of ['back-to-base', 'already have', 'phone line', 'polling', 'billed']) {
    assert.ok(questions.includes(topic), `no FAQ covers "${topic}"`);
  }
});

test('every connection path is explained, not just listed', () => {
  assert.ok(connectionPaths.length >= 3);
  for (const path of connectionPaths) {
    assert.ok(path.name);
    assert.ok(path.detail.length > 80);
  }
});
