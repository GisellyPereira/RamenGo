import test from 'node:test';
import assert from 'node:assert/strict';
import { broths, proteins, extras, totalPrice, combinationImage } from '../js/menu.js';
test('empty and partial bowls only charge selected ingredients', () => {
  assert.equal(totalPrice({ broth: null, protein: null, extras: [] }), 0);
  assert.equal(totalPrice({ broth: broths[0], protein: null, extras: [] }), 18);
});
test('all combinations include the exact prices of selected toppings', () => {
  for (const broth of broths) for (const protein of proteins) {
    assert.equal(totalPrice({ broth, protein, extras: [extras[0], extras[2]] }), broth.price + protein.price + 11);
  }
});

test('nine broth and protein combinations map to unique existing photographs', async () => {
  const { existsSync } = await import('node:fs');
  const paths = new Set();
  for (const broth of broths) for (const protein of proteins) {
    const path = combinationImage(broth.id, protein.id);
    assert.equal(existsSync(path), true, path);
    paths.add(path);
  }
  assert.equal(paths.size, 9);
  assert.equal(combinationImage('unknown', 'tofu'), null);
  assert.equal(combinationImage('shoyu', null), null);
});

test('all 144 selections resolve to distinct existing PNG photographs', async () => {
  const { readFileSync } = await import('node:fs');
  const paths = new Set();
  for (const broth of broths) for (const protein of proteins) for (let mask = 0; mask < 16; mask++) {
    const selected = extras.filter((_, index) => mask & (1 << index)).map(item => item.id);
    const path = combinationImage(broth.id, protein.id, selected);
    assert.equal(combinationImage(broth.id, protein.id, [...selected].reverse()), path);
    const file = readFileSync(path);
    assert.equal(file.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', path);
    paths.add(path);
  }
  assert.equal(paths.size, 144);
  assert.equal(combinationImage('shoyu', 'chasu', ['invalid']), null);
  assert.equal(combinationImage('shoyu', 'chasu', ['egg', 'egg']), combinationImage('shoyu', 'chasu', ['egg']));
});
