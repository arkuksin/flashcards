const assert = require('assert');
const path = require('path');

const Utils = require(path.join('..', 'logic', 'utils.js'));

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  }
}

test('stripDiacritics removes combining accents and cedilla/tilde (NFD)', () => {
  const src = 'ÀàÈèÉéÌìÒòÙùÑñÇç';
  const expected = 'AaEeEeIiOoUuNnCc';
  assert.strictEqual(Utils.stripDiacritics(src), expected);
});

test('normalize collapses punctuation (quotes/dashes) and spaces', () => {
  const src = '  “Così”—  detto...  '; // fancy quotes and em-dash
  const expected = 'cosi detto';
  assert.strictEqual(Utils.normalize(src), expected);
});

if (!process.exitCode) {
  console.log('\nAll utils edge tests executed.');
}
