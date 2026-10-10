import test from 'node:test';
import assert from 'node:assert/strict';

import nextConfig from '../../next.config.mjs';

test('the old AI addresses go to the new ones with a permanent redirect', async () => {
  const redirects = await nextConfig.redirects();
  const bySource = Object.fromEntries(redirects.map((redirect) => [redirect.source, redirect]));
  assert.equal(bySource['/securityos-ai'].destination, '/teracom-ai');
  assert.equal(bySource['/securityos-ai'].permanent, true);
  assert.equal(bySource['/securityos-ai/:path*'].destination, '/teracom-ai/:path*');
  assert.equal(bySource['/securityos-ai/:path*'].permanent, true);
});
