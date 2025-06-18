const test = require('node:test');
const assert = require('node:assert');
const { getBookmarkNameFromURL } = require('../Capture report views/js/share_bookmark.js');

function setup(url) {
  global.regex = new RegExp('[?&]id(=([^&#]*)|&|#|$)');
  global.window = { location: { href: url }, parent: { location: {} } };
  window.parent.location = window.location; // make them equal
  global.document = { location: window.location, referrer: url };
}

test('returns null when no id is present', () => {
  setup('https://example.com/report');
  assert.strictEqual(getBookmarkNameFromURL(), null);
});

test('parses id from ?id=value', () => {
  setup('https://example.com/report?id=bookmark1');
  assert.strictEqual(getBookmarkNameFromURL(), 'bookmark1');
});

test('parses id from &id=value', () => {
  setup('https://example.com/report?foo=bar&id=bookmark2');
  assert.strictEqual(getBookmarkNameFromURL(), 'bookmark2');
});

