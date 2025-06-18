const test = require('node:test');
const assert = require('node:assert');
const { generateShareLink, captureBookmark } = require('../Capture report views/js/bookmark_utils.js');

test('generateShareLink encodes id', () => {
  const link = generateShareLink('bookmark 1');
  assert.strictEqual(link, 'share_bookmark.html?id=bookmark%201');
});

test('captureBookmark resolves with state and screenshot', async () => {
  const fakeReport = {
    bookmarksManager: { capture: async () => ({ state: 's' }) },
    exportToFile: async () => ({ data: 'img' })
  };
  const result = await captureBookmark(fakeReport);
  assert.deepStrictEqual(result, { state: 's', screenshot: 'img' });
});
