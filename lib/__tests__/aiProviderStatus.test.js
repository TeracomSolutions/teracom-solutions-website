import test from 'node:test';
import assert from 'node:assert/strict';

import { groupProviders, providerStatus, kindLabel } from '../aiProviderStatus.js';

test('groupProviders groups providers by kind', () => {
  const providers = [
    { key: 'a', label: 'A', kind: 'native' },
    { key: 'b', label: 'B', kind: 'hosted' },
    { key: 'c', label: 'C', kind: 'self_hosted' },
    { key: 'd', label: 'D', kind: 'hosted' },
    { key: 'e', label: 'E', kind: 'native' }
  ];

  const result = groupProviders(providers);

  assert.deepStrictEqual(result.native, [
    { key: 'a', label: 'A', kind: 'native' },
    { key: 'e', label: 'E', kind: 'native' }
  ]);

  assert.deepStrictEqual(result.hosted, [
    { key: 'b', label: 'B', kind: 'hosted' },
    { key: 'd', label: 'D', kind: 'hosted' }
  ]);

  assert.deepStrictEqual(result.selfHosted, [
    { key: 'c', label: 'C', kind: 'self_hosted' }
  ]);
});


test('providerStatus returns not_connected when no connection exists', () => {
  const provider = { key: 'test' };
  const connections = [];

  const result = providerStatus(provider, connections);

  assert.strictEqual(result, 'not_connected');
});

test('providerStatus returns connected when connection exists and is enabled', () => {
  const provider = { key: 'test' };
  const connections = [{ provider: 'test', enabled: true }];

  const result = providerStatus(provider, connections);

  assert.strictEqual(result, 'connected');
});

test('providerStatus returns disabled when connection exists but is not enabled', () => {
  const provider = { key: 'test' };
  const connections = [{ provider: 'test', enabled: false }];

  const result = providerStatus(provider, connections);

  assert.strictEqual(result, 'disabled');
});


test('kindLabel returns correct labels', () => {
  assert.strictEqual(kindLabel('native'), 'Native API');
  assert.strictEqual(kindLabel('hosted'), 'Hosted API (key)');
  assert.strictEqual(kindLabel('self_hosted'), 'Self-hosted (host)');
  assert.strictEqual(kindLabel('unknown'), 'unknown');
});