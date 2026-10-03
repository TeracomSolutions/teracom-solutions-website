import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ART_TYPES, renderArt } from '../brandArt/index.js';
import { usableAccent } from '../brandArt/kit.js';

test('every drawing renders an SVG from an empty spec', () => {
  for (const type of ART_TYPES) {
    const svg = renderArt({ type }, { uid: `t-${type}`, accent: '#0082ff' });
    assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/, type);
    assert.ok(svg.endsWith('</svg>'), type);
    assert.doesNotMatch(svg, /undefined|NaN/, type);
  }
});

test('an unknown type draws nothing', () => {
  assert.equal(renderArt({ type: 'nope' }, { uid: 'x', accent: '#0082ff' }), '');
  assert.equal(renderArt(null, { uid: 'x', accent: '#0082ff' }), '');
});

test('labels are escaped', () => {
  const svg = renderArt({ type: 'search', query: '<script>alert(1)</script> & "x"' }, { uid: 'esc', accent: '#0082ff' });
  assert.ok(!svg.includes('<script>'));
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(svg.includes('&amp; &quot;x&quot;'));
});

test('ids are scoped to the uid so two drawings on a page do not clash', () => {
  const svg = renderArt({ type: 'door' }, { uid: 'gallagher platform 1', accent: '#0082ff' });
  assert.ok(svg.includes('id="gallagher-platform-1-bg"'));
  assert.ok(!svg.includes('id="art-bg"'));
});

test('grey brand colours get a usable blue', () => {
  assert.equal(usableAccent('#9fb0c8'), '#4f8cff');
  assert.equal(usableAccent('#e30513'), '#e30513');
  assert.equal(usableAccent('#fc3'), '#ffcc33');
});
