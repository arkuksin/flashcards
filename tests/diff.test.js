const assert = require('assert');
const path = require('path');

const computeBestDiff = require(path.join('..', 'logic', 'diff.js'));

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

// Core requirement: totalErrors = 0 on equal words

test('computeBestDiff returns totalErrors=0 for equal words', () => {
  const ans = ['ciao'];
  const d = computeBestDiff('ciao', ans, { caseInsensitive: true, ignoreDiacritics: true });
  assert.ok(d && d.summary, 'diff result must have summary');
  assert.strictEqual(d.summary.totalErrors, 0);
});

// Case-insensitive equal

test('computeBestDiff is case-insensitive when option set', () => {
  const ans = ['Ciao'];
  const d = computeBestDiff('ciao', ans, { caseInsensitive: true, ignoreDiacritics: true });
  assert.ok(d && d.summary);
  assert.strictEqual(d.summary.totalErrors, 0);
});

// Ignore diacritics equal

test('computeBestDiff treats caffe == caffè when ignoreDiacritics=true', () => {
  const ans = ['caffè'];
  const d = computeBestDiff('caffe', ans, { caseInsensitive: true, ignoreDiacritics: true });
  assert.ok(d && d.summary);
  assert.strictEqual(d.summary.totalErrors, 0);
});

if (!process.exitCode) {
  console.log('\nAll diff tests executed.');
}
