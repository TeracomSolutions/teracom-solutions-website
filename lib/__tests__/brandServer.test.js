import { test } from "node:test";
import assert from "node:assert/strict";
import { brandFrom, rebrandText } from "../brand.js";

test("default server is VM 101", () => {
  assert.equal(brandFrom({}).server, "VM 101");
});

test("a copy names its own server", () => {
  const b = brandFrom({ NEXT_PUBLIC_BRAND_NAME: "Luneva", NEXT_PUBLIC_BRAND_SITE_URL: "https://www.luneva.com.au", NEXT_PUBLIC_BRAND_SERVER: "VM 105" });
  assert.equal(b.server, "VM 105");
  assert.equal(rebrandText("Teracom server VM 101", b), "Luneva server VM 105");
});

test("Teracom text is unchanged on Teracom", () => {
  assert.equal(rebrandText("Teracom server VM 101", brandFrom({})), "Teracom server VM 101");
});