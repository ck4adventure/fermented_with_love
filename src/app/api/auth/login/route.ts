import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/password';
import { generateSessionToken, hashSessionToken, SESSION_MAX_AGE_SECONDS } from '@/lib/session';
import { SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.insert(sessions).values({ tokenHash: hashSessionToken(token), userId: user.id, expiresAt });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });

  return response;
}
