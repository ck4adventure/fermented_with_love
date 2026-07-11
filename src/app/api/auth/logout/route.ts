import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashSessionToken } from '@/lib/session';
import { SESSION_COOKIE, getSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  const token = getSessionToken(request);
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashSessionToken(token)));
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}
