import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, derivedHex] = stored.split(':');
  if (!salt || !derivedHex) return false;

  const derived = Buffer.from(derivedHex, 'hex');
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  return derived.length === candidate.length && timingSafeEqual(derived, candidate);
}
