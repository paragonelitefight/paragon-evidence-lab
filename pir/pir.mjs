// Local two-server XOR PIR primitives. No network services or transport security included.
export const WIDTH = 64;
export function encodeRows(strings) {
  if (!Array.isArray(strings) || strings.length < 2 || strings.length > 64) throw new Error('Expected 2..64 synthetic records');
  return strings.map(s => { const b = new TextEncoder().encode(s); if (b.length > WIDTH - 1) throw new Error('Record too long'); const row = new Uint8Array(WIDTH); row[0] = b.length; row.set(b, 1); return row; });
}
export function queries(index, count, randomBytes) {
  if (!Number.isSafeInteger(count) || count < 2 || count > 64 || !Number.isSafeInteger(index) || index < 0 || index >= count) throw new Error('Invalid index/count');
  const random = randomBytes(count);
  if (!(random instanceof Uint8Array) || random.length !== count) throw new Error('Secure random bytes required');
  const left = Uint8Array.from(random, b => b & 1); const right = left.slice(); right[index] ^= 1; return {left, right};
}
export function answer(rows, mask) {
  if (!(mask instanceof Uint8Array) || !Array.isArray(rows) || mask.length !== rows.length || rows.length < 2 || rows.length > 64) throw new Error('Invalid database/mask');
  const result = new Uint8Array(WIDTH);
  for (let i = 0; i < rows.length; i++) { if (!(rows[i] instanceof Uint8Array) || rows[i].length !== WIDTH || ![0,1].includes(mask[i])) throw new Error('Malformed row/mask'); if (mask[i]) for (let j = 0; j < WIDTH; j++) result[j] ^= rows[i][j]; }
  return result;
}
export function recover(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array) || a.length !== WIDTH || b.length !== WIDTH) throw new Error('Invalid responses');
  const row = Uint8Array.from(a, (v, i) => v ^ b[i]); if (row[0] > WIDTH-1) throw new Error('Malformed result');
  return new TextDecoder('utf-8', {fatal:true}).decode(row.subarray(1, row[0] + 1));
}
