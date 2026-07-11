import { randomBytes, createHash } from 'crypto';

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
