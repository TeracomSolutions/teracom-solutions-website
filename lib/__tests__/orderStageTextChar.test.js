import { test } from "node:test";
import assert from "node:assert/strict";
import { stageName, stageStateText, stageTone, stageMark } from "../orderStages.js";

test("stage words", () => {
  assert.deepEqual(stageName('paid'), "Paid");
  assert.deepEqual(stageName('nonsense'), "nonsense");
  assert.deepEqual(stageStateText('done'), "Done");
  assert.deepEqual(stageStateText('stuck'), "stuck");
});

test("stage tones and marks", () => {
  assert.deepEqual(stageTone('done'), "good");
  assert.deepEqual(stageTone('stuck'), "muted");
  assert.deepEqual(stageTone('waiting'), "warn");
  assert.deepEqual(stageMark('done'), "✓");
  assert.deepEqual(stageMark('skipped'), "–");
});
