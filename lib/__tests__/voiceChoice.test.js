import test from 'node:test';
import assert from 'node:assert/strict';

import { pickVoice } from '../assistantVoice.js';
import { DEFAULT_VOICE_CONFIG, normaliseVoiceConfig } from '../voiceConfig.js';

const BROWSER_VOICES = [
  { lang: 'en-GB', name: 'Microsoft Sonia Online (Natural) - English (United Kingdom)' },
  { lang: 'en-AU', name: 'Microsoft Catherine - English (Australia)' },
  { lang: 'en-AU', name: 'Microsoft Natasha Online (Natural) - English (Australia)' },
];

test('a natural Australian voice beats a plain one, and any Australian beats British', () => {
  assert.equal(pickVoice(BROWSER_VOICES).name, BROWSER_VOICES[2].name);
  assert.equal(pickVoice(BROWSER_VOICES.slice(0, 2)).name, BROWSER_VOICES[1].name);
});

test('New Zealand and British English come before American, natural before plain', () => {
  const voices = [
    { lang: 'en-US', name: 'Microsoft Zira', default: true },
    { lang: 'en-GB', name: 'Daniel' },
    { lang: 'en-NZ', name: 'Karen' },
  ];
  assert.equal(pickVoice(voices).name, 'Karen');
  assert.equal(pickVoice(voices.slice(0, 2)).name, 'Daniel');
  const american = [
    { lang: 'en-US', name: 'David', default: true },
    { lang: 'en-US', name: 'Microsoft Aria Online (Natural) - English (United States)' },
  ];
  assert.equal(pickVoice(american).name, american[1].name);
});

test('a preferred voice name wins when the browser has it and is ignored when it does not', () => {
  assert.equal(pickVoice(BROWSER_VOICES, 'catherine').name, BROWSER_VOICES[1].name);
  assert.equal(pickVoice(BROWSER_VOICES, '  SONIA ').name, BROWSER_VOICES[0].name);
  assert.equal(pickVoice(BROWSER_VOICES, 'nobody').name, BROWSER_VOICES[2].name);
});

test('voice settings from the website are reduced to safe values', () => {
  assert.deepEqual(normaliseVoiceConfig({ engine: 'cloud', rate: '1.1', browserVoice: ' Natasha ' }), {
    engine: 'cloud',
    rate: 1.1,
    browserVoice: 'Natasha',
  });
  assert.deepEqual(normaliseVoiceConfig({ engine: 'weird', rate: 99, browserVoice: 5 }), { engine: 'browser', rate: 1.5, browserVoice: '' });
  assert.equal(normaliseVoiceConfig({ rate: 0.1 }).rate, 0.5);
  assert.equal(normaliseVoiceConfig({ rate: null }).rate, 1);
  assert.equal(normaliseVoiceConfig({ rate: 'fast' }).rate, 1);
  assert.equal(normaliseVoiceConfig({ browserVoice: 'x'.repeat(200) }).browserVoice.length, 80);
  assert.deepEqual(normaliseVoiceConfig(null), DEFAULT_VOICE_CONFIG);
  assert.deepEqual(normaliseVoiceConfig(undefined), DEFAULT_VOICE_CONFIG);
});
