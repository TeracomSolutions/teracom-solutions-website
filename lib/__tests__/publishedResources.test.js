import test from 'node:test';
import assert from 'node:assert/strict';

import { SITE_DOCUMENT_SECTIONS, brandCounts, describeSource, filterDocuments, formatSize, groupByBrand, pickBrand, sectionForType, sectionLabel } from '../publishedResources.js';

const docs = [
  { id: '1', title: 'TVN-2216P manual', brand: 'Aritech', model: 'TVN-2216P' },
  { id: '2', title: 'Range brochure', brand: null },
  { id: '3', title: 'DS-2CD datasheet', brand: 'Hikvision', model: 'DS-2CD2143' },
  { id: '4', title: 'ATS1500A guide', brand: 'Aritech', model: 'ATS1500A' },
];

test('the five website sections', () => {
  assert.deepEqual(SITE_DOCUMENT_SECTIONS, ['user-manuals', 'datasheets', 'installer-manuals', 'brochures', 'downloads']);
  assert.equal(sectionLabel('installer-manuals'), 'Installer Manuals');
});

test('groups by brand alphabetically with Other last', () => {
  const groups = groupByBrand(docs);
  assert.deepEqual(groups.map((g) => g.brand), ['Aritech', 'Hikvision', 'Other']);
  assert.equal(groups[0].documents.length, 2);
  assert.deepEqual(groupByBrand([]), []);
});

test('filters by brand and by search on title, model or brand', () => {
  assert.deepEqual(filterDocuments(docs, { brand: 'Aritech' }).map((d) => d.id), ['1', '4']);
  assert.deepEqual(filterDocuments(docs, { brand: 'Other' }).map((d) => d.id), ['2']);
  assert.deepEqual(filterDocuments(docs, { q: 'ds-2cd2' }).map((d) => d.id), ['3']);
  assert.deepEqual(filterDocuments(docs, { q: 'hik' }).map((d) => d.id), ['3']);
  assert.deepEqual(filterDocuments(docs, { brand: 'Aritech', q: 'ats' }).map((d) => d.id), ['4']);
  assert.equal(filterDocuments(docs).length, 4);
});

test('sizes and sections', () => {
  assert.equal(formatSize(0), '');
  assert.equal(formatSize(640 * 1024), '640 KB');
  assert.equal(formatSize(1.25 * 1024 * 1024), '1.3 MB');
  assert.equal(sectionForType('installer_manual'), 'installer-manuals');
  assert.equal(sectionForType('mystery'), 'downloads');
});

test('describes the source by host, then by name', () => {
  assert.equal(describeSource({ source_url: 'https://www.aritech.com.au/resources/' }), 'From aritech.com.au');
  assert.equal(describeSource({ source_url: 'not a url', source_name: 'Aritech' }), 'From Aritech');
  assert.equal(describeSource({}), '');
});

test('brand buttons: counts in order, and which brand to show', () => {
  assert.deepEqual(brandCounts(docs), [{ brand: 'Aritech', count: 2 }, { brand: 'Hikvision', count: 1 }, { brand: 'Other', count: 1 }]);
  assert.deepEqual(brandCounts([]), []);
  const names = ['Aritech', 'Hikvision', 'Other'];
  assert.equal(pickBrand(names, 'Hikvision'), 'Hikvision');
  assert.equal(pickBrand(names, 'hikVISION'), 'Hikvision');
  assert.equal(pickBrand(names, 'Bosch'), 'Aritech');
  assert.equal(pickBrand(names, ''), 'Aritech');
  assert.equal(pickBrand([], 'Aritech'), '');
});
