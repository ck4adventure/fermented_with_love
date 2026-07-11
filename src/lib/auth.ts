import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashSessionToken } from '@/lib/session';

export const SESSION_COOKIE = 'fwl_session';

export function getSessionToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie') ?? '';
  return cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`))?.[1];
}

export async function getCurrentUser(request: Request): Promise<{ id: string; email: string } | null> {
  const token = getSessionToken(request);
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const [row] = await db
    .select({ id: users.id, email: users.email, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.tokenHash, tokenHash));

  if (!row || row.expiresAt < new Date()) return null;
  return { id: row.id, email: row.email };
}
