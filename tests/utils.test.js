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

// Normalization should remove diacritics and lowercase
test('normalize converts caffè → caffe', () => {
  assert.strictEqual(Utils.normalize('caffè'), 'caffe');
});

test('normalize handles punctuation and spaces', () => {
  assert.strictEqual(Utils.normalize('  Così-così!  '), 'cosi cosi');
});

if (!process.exitCode) {
  console.log('\nAll utils tests executed.');
}
