import { NextResponse } from 'next/server';

const COOKIE = 'fwl_session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}
