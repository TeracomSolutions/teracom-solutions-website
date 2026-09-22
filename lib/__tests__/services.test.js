import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { findService, serviceGroups, services } from '../services.js';
import { findBrand } from '../brands.js';

const publicDir = fileURLToPath(new URL('../../public', import.meta.url));

test('service slugs are unique and findService resolves each one', () => {
  const slugs = services.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.equal(findService(slug).slug, slug);
});

test('every service belongs to a group and every group has services', () => {
  const groupIds = serviceGroups.map((g) => g.id);
  for (const service of services) assert.ok(groupIds.includes(service.group), service.slug);
  for (const id of groupIds) assert.ok(services.some((s) => s.group === id), id);
});

test('software development and integration development are separate services', () => {
  assert.equal(findService('software-development').group, 'digital');
  assert.equal(findService('integration-development').group, 'digital');
});

test('service images exist and card tags are short', () => {
  for (const service of services) {
    if (service.image) assert.ok(existsSync(publicDir + service.image), service.image);
    assert.ok(service.tags.length >= 2 && service.tags.length <= 4, service.slug);
    for (const tag of service.tags) assert.ok(tag.length <= 22, tag);
  }
});

test('service brand slugs all exist', () => {
  for (const service of services) {
    for (const slug of service.brandSlugs) assert.ok(findBrand(slug), service.slug + ': ' + slug);
  }
});
