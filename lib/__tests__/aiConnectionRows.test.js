import { test } from 'node:test';
import assert from 'node:assert/strict';

import { connectionRows, internetSentence, moveInOrder, orderConnections, stateOf, stateText } from '../aiConnectionRows.js';

const CATALOGUE = [
  { key: 'anthropic', label: 'Anthropic (Claude)', kind: 'native', default_model: 'claude-sonnet-5' },
  { key: 'openai', label: 'OpenAI (ChatGPT)', kind: 'hosted', default_model: 'gpt-4o-mini' },
  { key: 'ollama', label: 'Ollama (self-hosted)', kind: 'self_hosted' },
  { key: 'internet', label: 'Internet (web search)', kind: 'source' },
];

const CONNECTIONS = [
  { provider: 'openai', enabled: true, priority: 20, key_last4: 'ab12', default_model: null },
  { provider: 'ollama', enabled: true, priority: 10, key_last4: '****', default_model: 'qwen3' },
  { provider: 'internet', enabled: true, priority: 30, key_last4: '****' },
  { provider: 'anthropic', enabled: false, priority: null, key_last4: 'zz99' },
];

const ROUTING = {
  providers: {
    openai: { last_ok_at: '2026-09-30T01:00:00Z', last_failed_at: '2026-09-30T02:00:00Z', last_error: 'Incorrect API key provided', last_error_kind: 'auth' },
    ollama: { last_ok_at: '2026-09-30T03:00:00Z' },
  },
};

test('connections are ordered by priority, unordered ones last by name', () => {
  assert.deepEqual(orderConnections(CONNECTIONS), ['ollama', 'openai', 'internet', 'anthropic']);
});

test('moving past either end changes nothing', () => {
  const list = ['a', 'b', 'c'];
  assert.equal(moveInOrder(list, 'a', -1), list);
  assert.deepEqual(moveInOrder(list, 'a', 1), ['b', 'a', 'c']);
});

test('state: disabled beats everything, then the latest call decides', () => {
  assert.equal(stateOf({ enabled: false }, { last_ok_at: '2026-09-30T01:00:00Z' }), 'off');
  assert.equal(stateOf({ enabled: true }, ROUTING.providers.openai), 'failing');
  assert.equal(stateOf({ enabled: true }, ROUTING.providers.ollama), 'healthy');
  assert.equal(stateOf({ enabled: true }, {}), 'unknown');
  assert.equal(stateText('failing', { last_error_kind: 'credit' }), 'Failing: out of credit');
  assert.equal(stateText('unknown', {}), 'Not checked yet');
});

test('rows carry everything the table shows', () => {
  const rows = connectionRows(CONNECTIONS, ROUTING, CATALOGUE);
  assert.deepEqual(rows.map((r) => r.provider), ['ollama', 'openai', 'internet', 'anthropic']);
  const openai = rows[1];
  assert.equal(openai.position, 2);
  assert.equal(openai.label, 'OpenAI (ChatGPT)');
  assert.equal(openai.keyText, '••••ab12');
  assert.equal(openai.model, 'gpt-4o-mini');
  assert.equal(openai.stateText, 'Failing: key rejected');
  assert.equal(openai.detail, 'Incorrect API key provided');
  assert.equal(openai.checkedAt, '2026-09-30T02:00:00Z');
  assert.equal(rows[0].keyText, 'host');
  assert.equal(rows[2].keyText, 'none needed');
  assert.equal(rows[3].stateText, 'Disabled');
  assert.equal(rows[3].detail, '');
});

test('the internet sentence follows its place in the order', () => {
  const rows = connectionRows(CONNECTIONS, ROUTING, CATALOGUE);
  assert.match(internetSentence(rows), /below the models/);
  const first = connectionRows(CONNECTIONS.map((c) => (c.provider === 'internet' ? { ...c, priority: 1 } : c)), ROUTING, CATALOGUE);
  assert.match(internetSentence(first), /above the models/);
  const off = connectionRows(CONNECTIONS.map((c) => (c.provider === 'internet' ? { ...c, enabled: false } : c)), ROUTING, CATALOGUE);
  assert.match(internetSentence(off), /switched off/);
  assert.match(internetSentence([]), /No internet connection/);
});
