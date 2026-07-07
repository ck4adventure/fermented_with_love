const COOKIE = 'fwl_session';

export function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  const session = match?.[1];
  const secret = process.env.SESSION_SECRET;
  return Boolean(secret) && session === secret;
}
