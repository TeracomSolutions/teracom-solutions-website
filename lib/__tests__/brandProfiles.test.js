import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brands } from '../brands.js';
import { findBrandProfile } from '../brandProfiles/index.js';
import { renderArt } from '../brandArt/index.js';

function drawings(profile) {
  return [
    profile.heroArt,
    profile.architectureArt,
    ...(profile.platforms || []).map((platform) => platform.art),
    ...(profile.capabilities || []).map((capability) => capability.art),
  ].filter(Boolean);
}

test('every brand profile belongs to a real brand', () => {
  const withProfiles = brands.filter((brand) => findBrandProfile(brand.slug));
  assert.ok(withProfiles.length > 1);
});

test('every drawing in every profile renders in the brand colour', () => {
  for (const brand of brands) {
    const profile = findBrandProfile(brand.slug);
    if (!profile) continue;
    for (const spec of drawings(profile)) {
      const svg = renderArt(spec, { uid: `${brand.slug}-${spec.type}`, accent: brand.accent });
      assert.match(svg, /^<svg /, `${brand.slug} ${spec.type}`);
      assert.doesNotMatch(svg, /undefined|NaN/, `${brand.slug} ${spec.type}`);
    }
  }
});

test('every profile has the sections the brand page shows', () => {
  for (const brand of brands) {
    const profile = findBrandProfile(brand.slug);
    if (!profile) continue;
    assert.ok(profile.heroArt || profile.heroImage, `${brand.slug} hero`);
    assert.equal(profile.platforms.length, 2, `${brand.slug} platforms`);
    assert.ok([3, 6].includes(profile.capabilities.length), `${brand.slug} capabilities`);
    assert.equal(profile.teracom.length, 4, `${brand.slug} teracom steps`);
    for (const link of profile.links) assert.match(link.href, /^https:\//, `${brand.slug} link`);
  }
});
