import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeFields, encodeFields, encode } from '../server/values.js';
import { verifyPassword } from '../server/passwords.js';

test('editing a document preserves original Firestore types, large integers and nested data', () => {
  const original = {
    integer: { integerValue: '9007199254740993' },
    timestamp: { timestampValue: '2026-01-01T00:00:00.123456789Z' },
    reference: { referenceValue: 'projects/p/databases/(default)/documents/projects/x' },
    nested: { mapValue: { fields: { value: { arrayValue: { values: [{ booleanValue: true }, { nullValue: null }] } } } } }
  };
  assert.deepEqual(encodeFields(decodeFields(original), original), original);
  const edited = encodeFields({ ...decodeFields(original), title: 'Edited' }, original);
  assert.deepEqual(edited.integer, original.integer);
  assert.deepEqual(edited.timestamp, original.timestamp);
  assert.deepEqual(edited.reference, original.reference);
  assert.equal(edited.title.stringValue, 'Edited');
  assert.deepEqual(encode({ __op: 'increment', amount: 1 }, original.integer), { integerValue: '9007199254740994' });
});

test('existing Firebase passwords verify against Firebase reference vector without resets', async () => {
  const account = { salt: '42xEC+ixf3L2lw==', passwordHash: 'lSrfV15cpx95/sZS2W9c9Kp6i/LVgQNDNC/qzrCnh1SAyZvqmZqAjTdn3aoItz+VHjoZilo78198JAdRuid5lQ==' };
  const config = { signIn: { hashConfig: { algorithm: 'SCRYPT', signerKey: 'jxspr8Ki0RYycVU8zykbdLGjFQ3McFUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==', saltSeparator: 'Bw==', rounds: 8, memoryCost: 14 } } };
  assert.equal(await verifyPassword('user1password', account, config), true);
  assert.equal(await verifyPassword('wrong-password', account, config), false);
  assert.equal(await verifyPassword('user1password', { ...account, disabled: true }, config), false);
  assert.equal(await verifyPassword('user1password', { ...account, mfaInfo: [{ enrollmentId: 'mfa' }] }, config), false);
});
