import { test } from "node:test";
import assert from "node:assert/strict";
import { loginScene, LOGIN_SCENES } from "../loginScene.js";

test("scenes by day and brand", () => {
  assert.deepEqual(loginScene({ custom: true }, new Date(0)), null);
  assert.deepEqual(loginScene(null, new Date(0)), null);
  assert.deepEqual(loginScene({ custom: false }, new Date(0)) === LOGIN_SCENES[0], true);
  assert.deepEqual(loginScene({ custom: false }, new Date(86400000)) === LOGIN_SCENES[1], true);
})