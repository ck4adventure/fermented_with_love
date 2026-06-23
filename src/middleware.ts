import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'fwl_session';

export function middleware(request: NextRequest) {
  const session = request.cookies.get(COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;

  if (!secret || session !== secret) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/batches/:path*'],
};
