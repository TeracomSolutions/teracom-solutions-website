import { test } from 'node:test';
import assert from 'node:assert/strict';

import { samplePlan } from '../model.js';
import { ITP_POINTS, ITP_TEMPLATES, cableChecks, deviceChecks, inspectionPlans } from '../itp.js';
import { sitePlanWorkbook } from '../workbook.js';

test('every check in the templates has a check, criteria and a known point', () => {
  const points = ITP_POINTS.map((p) => p.id);
  const all = [
    ...Object.values(ITP_TEMPLATES.types).flat(),
    ...Object.values(ITP_TEMPLATES.groups).flatMap((g) => [...(g.device || []), ...(g.system || [])]),
    ...Object.values(ITP_TEMPLATES.cables).flat(),
    ...ITP_TEMPLATES.handover,
  ];
  assert.ok(all.length > 100);
  for (const x of all) {
    assert.ok(x.check && x.criteria, JSON.stringify(x));
    assert.ok(points.includes(x.point), `${x.check}: ${x.point}`);
  }
});

test('a camera is checked for focus, field of view, level and night picture, with its coverage filled in', () => {
  const checks = deviceChecks({ id: 'd1', type: 'camera', name: 'Camera 1', resolution: '2560', fovMode: 'lens', focal: '2.8', sensor: '5.4' });
  const names = checks.map((x) => x.check);
  for (const name of ['Field of view', 'Line and level', 'Focus (day)', 'Night picture']) assert.ok(names.includes(name), name);
  const fov = checks.find((x) => x.check === 'Field of view');
  assert.match(fov.criteria, /identify \d/);
  assert.ok(!fov.criteria.includes('{coverage}'));
  assert.ok(cableChecks('cat6').some((x) => x.check === 'Labels') && cableChecks('cat6').some((x) => x.reading === 'm'));
});

test('one plan per system on the plan, each device with its cable checks, then system and handover', () => {
  const plan = samplePlan();
  const plans = inspectionPlans(plan);
  assert.ok(plans.length >= 2);
  const cctv = plans.find((p) => p.system === 'CCTV');
  assert.ok(cctv);
  const titles = cctv.sections.map((s) => s.title);
  assert.equal(titles[titles.length - 1], 'Handover');
  assert.equal(titles[titles.length - 2], 'CCTV system');
  const camera = cctv.sections.find((s) => /^CC-\d\d/.test(s.ref));
  assert.ok(camera.items.some((x) => x.check.startsWith('Cable CC-') && x.check.endsWith('Labels')));
  assert.equal(camera.items[0].no, `${cctv.sections.indexOf(camera) + 1}.1`);
  // A company's own template replaces the checks.
  const own = inspectionPlans(plan, { types: { camera: [{ check: 'Ours', criteria: 'x', point: 'H' }] }, groups: {}, cables: {}, handover: [] });
  assert.ok(own.find((p) => p.system === 'CCTV').sections.some((s) => s.items.some((x) => x.check === 'Ours')));
});

test('the workbook has a signed-off ITP sheet per system with a Pass/Fail/N/A list', () => {
  const book = sitePlanWorkbook(samplePlan(), { date: '3 November 2026' });
  const itp = book.sheets.filter((s) => s.name.startsWith('ITP '));
  assert.ok(itp.some((s) => s.name === 'ITP CCTV'));
  for (const sheet of itp) {
    assert.deepEqual(sheet.validations[0].list, ['Pass', 'Fail', 'N/A']);
    assert.equal(sheet.breaks.length, 1, 'the sign-off starts its own page');
    const text = sheet.rows.flat().map((c) => (c && typeof c === 'object' ? c.v : c));
    assert.ok(text.includes('Accepted by (client)'));
    assert.ok(text.some((v) => String(v).startsWith('Like this plan?')));
  }
  assert.equal(sitePlanWorkbook(samplePlan(), { date: 'today', itp: false }).sheets.some((s) => s.name.startsWith('ITP ')), false);
});
