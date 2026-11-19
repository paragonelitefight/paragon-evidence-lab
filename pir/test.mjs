// Authored executable test, NOT executed by the assistant. Run with Node.js outside this sandbox.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { encodeRows, queries, answer, recover } from './pir.mjs';
const inputs = ['SYNTHETIC-GREECE', 'SYNTHETIC-GERMANY', 'SYNTHETIC-FRANCE', 'SYNTHETIC-BRAZIL'];
const rows = encodeRows(inputs);
for (let i = 0; i < inputs.length; i++) { const q = queries(i, inputs.length, n => new Uint8Array(randomBytes(n))); assert.equal(recover(answer(rows,q.left), answer(rows,q.right)), inputs[i]); }
assert.throws(() => queries(-1,4,n=>new Uint8Array(randomBytes(n))));
console.log('Local algebraic correctness checks passed. This does not test server non-collusion, network privacy or production security.');
