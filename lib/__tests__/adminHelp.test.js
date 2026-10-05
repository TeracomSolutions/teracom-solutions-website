import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { GUIDE_SECTIONS } from '../adminGuide/index.js';
import { ADMIN_HELP } from '../adminHelp.generated.js';
import { buildIndex, guidePassages, helpPassages, passagesFrom, search, stem, tokens } from '../adminHelpSearch.js';
import { knowledgeFor, questionText } from '../adminKnowledge.js';
import { OUTPUT, buildAdminHelp, jsxToText, render } from '../../scripts/build-admin-help.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('the help file is in step with the help behind every page', () => {
  const onDisk = fs.readFileSync(path.join(ROOT, OUTPUT), 'utf8');
  assert.equal(onDisk, render(buildAdminHelp(ROOT)), 'run npm run help:build and commit lib/adminHelp.generated.js');
});

test('every console page with help is in the file, with its words', () => {
  const byId = Object.fromEntries(ADMIN_HELP.map((item) => [item.id, item]));
  for (const id of ['store-freight', 'support', 'leads', 'scout', 'ai-connections', 'connections', 'store-brands', 'your-account']) {
    assert.ok(byId[id], 'missing help for ' + id);
    assert.ok(byId[id].text.length > 200, id + ' has almost no text');
  }
  assert.match(byId['store-freight'].text, /minimum charge/);
  assert.ok(ADMIN_HELP.every((item) => !item.text.includes('{') && !item.text.includes('</') && !/&[a-z]+;/.test(item.text)));
});

test('JSX becomes headings, bullets and plain sentences', () => {
  const text = jsxToText(
    "<h4>Buttons</h4><p>Click <strong>Save</strong>{' '}now&apos;s &amp; later.</p><ul><li>One</li><li>Two {count}</li></ul>",
  );
  assert.equal(text, ['### Buttons', 'Click Save now' + "'" + 's & later.', '- One', '- Two'].join(String.fromCharCode(10)));
});

test('plurals and filler words do not get in the way of a match', () => {
  assert.equal(stem('settings'), 'setting');
  assert.equal(stem('policies'), 'policy');
  assert.equal(stem('status'), 'status');
  assert.deepEqual(tokens('What does the Freight minimum charge do?'), ['freight', 'minimum', 'charge']);
});

test('long text is cut into passages under the size the backend accepts', () => {
  const big = '## Big' + String.fromCharCode(10) + ('A line of words. '.repeat(40) + String.fromCharCode(10)).repeat(12);
  const passages = passagesFrom('guide:big', 'Big', big);
  assert.ok(passages.length > 1);
  assert.ok(passages.every((p) => p.text.length <= 2800 && p.title.length < 200));
  assert.match(passages[1].title, /part 2/);
});

const INDEX = buildIndex([...helpPassages(ADMIN_HELP), ...guidePassages(GUIDE_SECTIONS)]);

function topTitles(question, limit = 3) {
  return search(INDEX, question, limit).map((p) => p.title);
}

test('a question about a setting finds the page that explains it', () => {
  assert.match(topTitles('What does the minimum charge on freight do?', 6).join(' | '), /Freight/);
  assert.match(topTitles('How do I teach Tera a new answer?').join(' | '), /Support/);
  assert.match(topTitles('What is the Gold tier markup on cost?').join(' | '), /Pricing|Store/);
  assert.match(topTitles('How do I add a brand logo?').join(' | '), /Brands/);
});

test('a question with no match in the help finds nothing', () => {
  assert.deepEqual(search(INDEX, 'zzzzqx plugh', 5), []);
  assert.deepEqual(search(INDEX, 'the and of', 5), []);
});

test('a short follow-up is searched with the question before it', () => {
  const messages = [
    { role: 'user', content: 'What does the freight minimum charge do?' },
    { role: 'assistant', content: 'It sets the lowest price a customer pays for delivery.' },
    { role: 'user', content: 'and for StarTrack?' },
  ];
  assert.match(questionText(messages), /freight minimum charge/);
  assert.match(knowledgeFor(messages).map((p) => p.title).join(' | '), /Freight/);
});

test('what is sent to the backend stays within its limits', () => {
  const found = knowledgeFor([{ role: 'user', content: 'How do suppliers, price lists, markup and freight work together in the store?' }], 8);
  assert.ok(found.length > 0 && found.length <= 8);
  assert.ok(found.every((p) => p.title.length <= 200 && p.text.length <= 3000));
  assert.ok(found.reduce((sum, p) => sum + p.text.length, 0) <= 12000);
});