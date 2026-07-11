import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'fwl_session';

// Cheap UX redirect only (cookie presence, not validity) — the authoritative
// check (session valid, not expired, user exists) happens in getCurrentUser()
// inside each API route handler. Keeps this edge-runtime middleware from
// needing a DB round trip on every navigation.
export function middleware(request: NextRequest) {
  const session = request.cookies.get(COOKIE)?.value;

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/batches', '/batches/:path*'],
};
