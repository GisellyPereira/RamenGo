import test from 'node:test';
import assert from 'node:assert/strict';
import { broths, proteins, extras, totalPrice } from '../js/menu.js';
test('empty and partial bowls only charge selected ingredients', () => {
  assert.equal(totalPrice({ broth: null, protein: null, extras: [] }), 0);
  assert.equal(totalPrice({ broth: broths[0], protein: null, extras: [] }), 18);
});
test('all combinations include the exact prices of selected toppings', () => {
  for (const broth of broths) for (const protein of proteins) {
    assert.equal(totalPrice({ broth, protein, extras: [extras[0], extras[2]] }), broth.price + protein.price + 11);
  }
});
