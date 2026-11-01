import { test } from "node:test";
import assert from "node:assert/strict";
import { campaignStateText, campaignStateTone, hourLabel, todayIso } from "../marketingView.js";

test("campaign states", () => {
  assert.deepEqual(campaignStateText('live'), "Live now");
  assert.deepEqual(campaignStateText('scheduled'), "Starts later");
  assert.deepEqual(campaignStateTone('live'), "good");
  assert.deepEqual(campaignStateTone('ended'), "muted");
});

test("hours and dates", () => {
  assert.deepEqual(hourLabel(0), "12 am");
  assert.deepEqual(hourLabel(9), "9 am");
  assert.deepEqual(hourLabel(13), "1 pm");
  assert.deepEqual(todayIso(new Date('2026-10-26T03:00:00Z')), "2026-10-26");
});
