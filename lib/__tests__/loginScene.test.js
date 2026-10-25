import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { LOGIN_SCENES, loginScene } from '../loginScene.js';

test('a picture a day for Teracom, none for another business', () => {
  const day = new Date(Date.UTC(2026, 9, 25));
  const next = new Date(Date.UTC(2026, 9, 26));
  assert.ok(LOGIN_SCENES.includes(loginScene({ custom: false }, day)));
  assert.notEqual(loginScene({ custom: false }, day), loginScene({ custom: false }, next));
  assert.equal(loginScene({ custom: true }, day), null);
  assert.equal(loginScene(null, day), null);
});

test('every picture exists in public/assets', () => {
  for (const scene of LOGIN_SCENES) {
    assert.ok(fs.existsSync('public' + scene.image), scene.image);
    assert.ok(scene.headline && scene.sub);
  }
});
