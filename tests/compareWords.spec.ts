import { test, expect } from '@playwright/test';
import path from 'path';

// Load the pure module via CommonJS require to ensure no browser dependency
// eslint-disable-next-line @typescript-eslint/no-var-requires
const diffMod = require(path.join('..', 'logic', 'compareWords.js'));

const compareWords = diffMod.compareWords || diffMod?.WordDiff?.compareWords;

(test as any)('substitution (replace) is detected', async () => {
  const d = compareWords('ciao', 'cibo'); // a->b replace at position 2
  const types = d.ops.map((o: any) => o.type);
  expect(types.includes('replace')).toBeTruthy();
  expect(d.summary.totalErrors).toBeGreaterThan(0);
});

(test as any)('insertion (missing in user) is detected', async () => {
  const d = compareWords('cia', 'ciao'); // missing 'o'
  const hasInsert = d.ops.some((o: any) => o.type === 'insert' && o.b === 'o');
  expect(hasInsert).toBeTruthy();
  expect(d.summary.insertions).toBe(1);
});

(test as any)('deletion (extra in user) is detected', async () => {
  const d = compareWords('ciaoo', 'ciao'); // extra 'o'
  const hasDelete = d.ops.some((o: any) => o.type === 'delete' && o.a === 'o');
  expect(hasDelete).toBeTruthy();
  expect(d.summary.deletions).toBe(1);
});

(test as any)('empty input vs word yields only insertions', async () => {
  const d = compareWords('', 'ciao');
  const onlyInserts = d.ops.every((o: any) => o.type === 'insert');
  expect(onlyInserts).toBeTruthy();
  expect(d.summary.insertions).toBe(4);
});

(test as any)('entirely wrong input aligned with replacements', async () => {
  const d = compareWords('xxxx', 'ciao');
  expect(d.summary.totalErrors).toBeGreaterThan(0);
  const hasReplace = d.ops.some((o: any) => o.type === 'replace');
  expect(hasReplace).toBeTruthy();
});

(test as any)('diacritics ignored by default: caffe === caffè; sì === si', async () => {
  const d1 = compareWords('caffe', 'caffè');
  expect(d1.summary.totalErrors).toBe(0);
  const d2 = compareWords('si', 'sì');
  expect(d2.summary.totalErrors).toBe(0);
});

(test as any)('strict diacritics shows differences', async () => {
  const d = compareWords('caffe', 'caffè', { ignoreDiacritics: false });
  expect(d.summary.totalErrors).toBeGreaterThan(0);
});

(test as any)('Unicode combining marks are handled safely', async () => {
  const combining = 'e\u0301'; // e + combining acute
  const precomposed = 'é';
  const d = compareWords(combining, precomposed);
  expect(d.summary.totalErrors).toBe(0);
});

(test as any)('deterministic output for same inputs', async () => {
  const a = compareWords('abc', 'abdc');
  const b = compareWords('abc', 'abdc');
  expect(JSON.stringify(a)).toBe(JSON.stringify(b));
});
