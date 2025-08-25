const assert = require('assert');
const path = require('path');

const checkAnswer = require(path.join('..', 'logic', 'checkAnswer.js'));

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

// Note: Current implementation of checkAnswer uses Utils.normalize in both
// strict and non-strict branches; normalize strips diacritics.
// These tests reflect the current behavior.

const accepted = ['caffè', 'sì', 'perché'];

test('checkAnswer accepts without accents when strictAccents=false', () => {
  assert.strictEqual(checkAnswer('caffe', accepted, { strictAccents: false }), true);
  assert.strictEqual(checkAnswer('si', accepted, { strictAccents: false }), true);
  assert.strictEqual(checkAnswer('perche', accepted, { strictAccents: false }), true);
});

test('checkAnswer also accepts without accents when strictAccents=true (current behavior)', () => {
  assert.strictEqual(checkAnswer('caffe', accepted, { strictAccents: true }), true);
  assert.strictEqual(checkAnswer('si', accepted, { strictAccents: true }), true);
  assert.strictEqual(checkAnswer('perche', accepted, { strictAccents: true }), true);
});

test('checkAnswer tolerates case and punctuation/spacing', () => {
  assert.strictEqual(checkAnswer('  Caffè! ', accepted, { strictAccents: true }), true);
  assert.strictEqual(checkAnswer('  SI?  ', accepted, { strictAccents: false }), true);
});

if (!process.exitCode) {
  console.log('\nAll checker tests executed.');
}
