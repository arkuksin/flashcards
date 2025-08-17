const assert = require('assert');
const path = require('path');

// Import from main.js (guarded for Node)
const { WORDS, stripDiacritics, normalize, shuffle } = require(path.join('..', 'main.js'));

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

// stripDiacritics tests
test('stripDiacritics removes accents from Italian words', () => {
  assert.strictEqual(stripDiacritics('caffè così perché'), 'caffe cosi perche');
});

test('stripDiacritics leaves plain ASCII unchanged', () => {
  assert.strictEqual(stripDiacritics('ciao'), 'ciao');
});

// normalize tests
test('normalize lowercases, removes punctuation, collapses spaces and strips diacritics', () => {
  // punctuation becomes spaces, then collapsed; diacritics removed
  assert.strictEqual(normalize("  Caffè! Così-così?  "), 'caffe cosi cosi');
  assert.strictEqual(normalize("come va?"), 'come va');
});

// shuffle tests
test('shuffle returns a new array instance and keeps the same items', () => {
  const a = [1, 2, 3, 4, 5];
  const b = shuffle(a);
  assert.notStrictEqual(b, a, 'shuffle must return a new array');
  assert.strictEqual(b.length, a.length, 'length must match');
  const sa = a.slice().sort();
  const sb = b.slice().sort();
  assert.deepStrictEqual(sb, sa, 'shuffled array must contain the same items');
});

// WORDS dataset tests
test('WORDS contains exactly 200 entries', () => {
  assert.strictEqual(WORDS.length, 200);
});

test('Кофе entry accepts both caffe and caffè', () => {
  const coffee = WORDS.find(x => x.ru === 'Кофе');
  assert.ok(coffee, 'Кофе entry exists');
  assert.ok(Array.isArray(coffee.it), 'Кофе.it is an array');
  assert.ok(coffee.it.includes('caffe'), 'Кофе includes caffe');
  assert.ok(coffee.it.includes('caffè'), 'Кофе includes caffè');
});

test('Да entry accepts both si and sì', () => {
  const yes = WORDS.find(x => x.ru === 'Да');
  assert.ok(yes, 'Да entry exists');
  assert.ok(yes.it.includes('si'), 'Да includes si');
  assert.ok(yes.it.includes('sì'), 'Да includes sì');
});

test('Ванная resolves to bagno (computed value)', () => {
  const bath = WORDS.find(x => x.ru === 'Ванная');
  assert.ok(bath, 'Ванная entry exists');
  assert.ok(bath.it.includes('bagno'), 'Ванная includes bagno');
});

if (!process.exitCode) {
  console.log('\nAll tests executed.');
}
