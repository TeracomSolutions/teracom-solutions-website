import test from 'node:test';
import assert from 'node:assert/strict';

import {
  fileKind,
  imageTypeOf,
  humanSize,
  ACCEPT,
  forSend,
  toBackendMessage
} from '../attachments.js';

// Test fileKind function
await test('fileKind sorts files correctly', () => {
  assert.strictEqual(fileKind('screen.png', 'image/png'), 'image');
  assert.strictEqual(fileKind('photo.JPG', ''), 'image');
  assert.strictEqual(fileKind('a.pdf', 'application/pdf'), 'pdf');
  assert.strictEqual(fileKind('prices.xlsx', ''), 'sheet');
  assert.strictEqual(fileKind('list.csv', 'text/csv'), 'text');
  assert.strictEqual(fileKind('notes.log', ''), 'text');
  assert.strictEqual(fileKind('data.json', 'application/json'), 'text');
});

await test('fileKind refuses unsupported file types', () => {
  assert.strictEqual(fileKind('logo.svg', 'image/svg+xml'), null);
  assert.strictEqual(fileKind('clip.mp4', 'video/mp4'), null);
  assert.strictEqual(fileKind('setup.exe', 'application/octet-stream'), null);
  assert.strictEqual(fileKind('', ''), null);
});

await test('imageTypeOf works correctly', () => {
  assert.strictEqual(imageTypeOf('x.png', 'image/webp'), 'image/webp');
  assert.strictEqual(imageTypeOf('x.jpeg', ''), 'image/jpeg');
  assert.strictEqual(imageTypeOf('x.png', 'application/octet-stream'), '');
  assert.strictEqual(imageTypeOf('x.txt', ''), '');
});

await test('humanSize formats bytes correctly', () => {
  assert.strictEqual(humanSize(0), '0 B');
  assert.strictEqual(humanSize(2048), '2 KB');
  assert.strictEqual(humanSize(3 * 1024 * 1024), '3.0 MB');
  assert.strictEqual(humanSize(undefined), '0 B');
});

await test('ACCEPT includes correct file types', () => {
  assert.ok(ACCEPT.includes('image/png'));
  assert.ok(ACCEPT.includes('application/pdf'));
  assert.ok(ACCEPT.includes('.xlsx'));
  assert.ok(ACCEPT.includes('.csv'));
});

await test('forSend keeps only necessary fields', () => {
  const messages = [
    { role: 'user', content: 'hello', id: 7 },
    { role: 'assistant', content: 'hi', actions: ['x'], model: 'm' },
    {
      role: 'user',
      content: 'look',
      attachments: [
        {
          id: 'a1',
          kind: 'image',
          name: 'a.png',
          mediaType: 'image/png',
          data: 'AAAA',
          preview: 'blob:x',
          size: 3
        }
      ]
    }
  ];

  const result = forSend(messages);

  assert.deepStrictEqual(result[0], { role: 'user', content: 'hello' });
  assert.deepStrictEqual(result[1], { role: 'assistant', content: 'hi' });
  assert.deepStrictEqual(result[2].attachments, [
    {
      kind: 'image',
      name: 'a.png',
      mediaType: 'image/png',
      data: 'AAAA',
      text: ''
    }
  ]);
});

await test('forSend drops oldest attachments first when too big', () => {
  const messages = [
    {
      role: 'user',
      content: 'first',
      attachments: [
        {
          kind: 'image',
          name: 'old.png',
          mediaType: 'image/png',
          data: 'x'.repeat(60)
        }
      ]
    },
    { role: 'assistant', content: 'ok' },
    {
      role: 'user',
      content: 'second',
      attachments: [
        {
          kind: 'image',
          name: 'new.png',
          mediaType: 'image/png',
          data: 'y'.repeat(60)
        }
      ]
    }
  ];

  const result = forSend(messages, 100);

  // The new.png attachment should be kept
  assert.strictEqual(result[2].attachments.length, 1);
  assert.strictEqual(result[2].attachments[0].name, 'new.png');

  // The old.png attachment should be dropped and noted
  assert.strictEqual(result[0].attachments, undefined);
  assert.match(result[0].content, /old.png.*no longer included/);
});

await test('toBackendMessage uses correct backend field names', () => {
  const message = {
    role: 'user',
    content: 'see',
    id: 1,
    attachments: [
      {
        kind: 'pdf',
        name: 'a.pdf',
        mediaType: 'application/pdf',
        data: 'QQ==' ,
        preview: 'x'
      }
    ]
  };

  const result = toBackendMessage(message);

  assert.deepStrictEqual(result, {
    role: 'user',
    content: 'see',
    attachments: [
      {
        kind: 'pdf',
        name: 'a.pdf',
        media_type: 'application/pdf',
        data: 'QQ==',
        text: ''
      }
    ]
  });

  // Test assistant message without attachments
  const assistantMessage = {
    role: 'assistant',
    content: 'ok',
    actions: []
  };

  const result2 = toBackendMessage(assistantMessage);
  assert.deepStrictEqual(result2, {
    role: 'assistant',
    content: 'ok'
  });
});