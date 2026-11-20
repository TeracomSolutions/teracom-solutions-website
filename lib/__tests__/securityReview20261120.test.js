import { test } from "node:test";
import assert from "node:assert/strict";

import { guestPathStripped } from "../guestPages.js";
import { sameOrigin } from "../sameOrigin.js";

const req = (headers) => ({ headers: { get: (name) => headers[name.toLowerCase()] ?? null } });

test("a guest path cannot become a link to another site", () => {
  assert.equal(guestPathStripped("/g/store"), "/store");
  assert.equal(guestPathStripped("/g//evil.example"), null);
  assert.equal(guestPathStripped("/g/\\evil.example"), null);
});

test("state-changing requests must come from this site", () => {
  assert.equal(sameOrigin(req({ host: "www.example.au", origin: "https://www.example.au" })), true);
  assert.equal(sameOrigin(req({ host: "www.example.au", origin: "https://shop.example.au" })), false);
  assert.equal(sameOrigin(req({ host: "www.example.au" })), true);
  assert.equal(sameOrigin(req({ host: "www.example.au", origin: "null" })), false);
});
