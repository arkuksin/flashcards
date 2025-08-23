const assert = require('assert');
const path = require('path');

const GC = require(path.join('..', 'logic', 'grammar', 'comparatives.js'));

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

test('enForms basic and irregulars', () => {
  assert.deepStrictEqual(GC.enForms('big'), ['big', 'bigger', 'biggest']);
  assert.deepStrictEqual(GC.enForms('happy'), ['happy', 'happier', 'happiest']);
  assert.deepStrictEqual(GC.enForms('nice'), ['nice', 'nicer', 'nicest']);
  assert.deepStrictEqual(GC.enForms('interesting'), ['interesting', 'more interesting', 'most interesting']);
  assert.deepStrictEqual(GC.enForms('good'), ['good', 'better', 'best']);
});

test('deForms irregulars and defaults', () => {
  assert.deepStrictEqual(GC.deForms('gut'), ['gut', 'besser', 'am besten']);
  assert.deepStrictEqual(GC.deForms('hoch'), ['hoch', 'höher', 'am höchsten']);
  // default pattern
  assert.deepStrictEqual(GC.deForms('schnell'), ['schnell', 'schneller', 'am schnellsten']);
});

test('itForms and ruForms are periphrastic', () => {
  assert.deepStrictEqual(GC.itForms('bello'), ['bello', 'più bello', 'il più bello']);
  assert.deepStrictEqual(GC.ruForms('красивый'), ['красивый', 'более красивый', 'самый красивый']);
});

test('makeExercise and validateAnswer work for all modes', () => {
  const mc = GC.makeExercise('en', 'big', 'mc');
  assert.strictEqual(mc.mode, 'mc');
  assert.ok(mc.options.includes(mc.correct));
  const mcRes = GC.validateAnswer(mc, mc.correct);
  assert.strictEqual(mcRes.correct, true);

  const fill = GC.makeExercise('en', 'happy', 'fill');
  const fillRes = GC.validateAnswer(fill, fill.correct);
  assert.strictEqual(fillRes.correct, true);

  const dnd = GC.makeExercise('en', 'nice', 'dnd');
  const ans = { positive: dnd.item.pos, comparative: dnd.item.comp, superlative: dnd.item.sup };
  const dndRes = GC.validateAnswer(dnd, ans);
  assert.strictEqual(dndRes.correct, true);
});

if (!process.exitCode) {
  console.log('\nAll grammar logic tests executed.');
}
