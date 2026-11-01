import { test } from "node:test";
import assert from "node:assert/strict";
import { extensionOf, imageTypeOf, fileKind, humanSize } from "../attachments.js";

test("extensions and kinds", () => {
  assert.deepEqual(extensionOf('Report.PDF'), "pdf");
  assert.deepEqual(extensionOf('noext'), "");
  assert.deepEqual(imageTypeOf('a.jpg'), "image/jpeg");
  assert.deepEqual(fileKind('a.png'), "image");
  assert.deepEqual(fileKind('a.xlsx'), "sheet");
  assert.deepEqual(fileKind('a.csv'), "text");
  assert.deepEqual(fileKind('a.exe'), null);
});

test("sizes", () => {
  assert.deepEqual(humanSize(500), "500 B");
  assert.deepEqual(humanSize(2048), "2 KB");
  assert.deepEqual(humanSize(3 * 1024 * 1024), "3.0 MB");
});
