import { scrypt as scryptCallback, createCipheriv, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);

// Firebase's published scrypt format: scrypt(password, salt + separator),
// then AES-256-CTR encrypt the project's signer key with a zero IV.
// See https://github.com/firebase/scrypt for the format and reference vector.
export async function verifyPassword(password, account, configuration) {
  const config = configuration?.signIn?.hashConfig || configuration?.signIn?.email?.hashConfig;
  const configs = Array.isArray(config) ? config : [config];
  const current = configs.find(c => c && (c.algorithm === 'SCRYPT' || c.algorithm === 'STANDARD_SCRYPT') &&
    (c.version === undefined || Number(c.version) === Number(account.version || 0)));
  if (!current || current.algorithm !== 'SCRYPT' || !account.passwordHash || account.disabled || account.mfaInfo?.length) return false;
  const memoryCost = Number(current.memoryCost ?? current.memCost ?? 14);
  const rounds = Number(current.rounds ?? 8);
  if (!Number.isInteger(memoryCost) || memoryCost < 1 || memoryCost > 17 || rounds < 1 || rounds > 32) return false;
  const derived = await scrypt(password, Buffer.concat([
    Buffer.from(account.salt || '', 'base64'), Buffer.from(current.saltSeparator || '', 'base64')
  ]), 64, { N: 2 ** memoryCost, r: rounds, p: 1, maxmem: 256 * 1024 * 1024 });
  const cipher = createCipheriv('aes-256-ctr', derived.subarray(0, 32), Buffer.alloc(16));
  const hash = Buffer.concat([cipher.update(Buffer.from(current.signerKey, 'base64')), cipher.final()]);
  const expected = Buffer.from(account.passwordHash, 'base64');
  return hash.length === expected.length && timingSafeEqual(hash, expected);
}
