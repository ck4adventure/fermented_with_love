/**
 * @jest-environment node
 */
import { isAuthenticated } from '@/lib/auth';

const ORIGINAL_ENV = process.env;

describe('isAuthenticated', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SESSION_SECRET: 'super-secret' };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function requestWithCookie(cookie?: string) {
    const headers = new Headers();
    if (cookie !== undefined) headers.set('cookie', cookie);
    return new Request('http://localhost/api/batches', { headers });
  }

  it('returns true when the session cookie matches the secret', () => {
    expect(isAuthenticated(requestWithCookie('fwl_session=super-secret'))).toBe(true);
  });

  it('returns true when the session cookie is alongside other cookies', () => {
    expect(isAuthenticated(requestWithCookie('foo=bar; fwl_session=super-secret; baz=qux'))).toBe(true);
  });

  it('returns false when there is no cookie header', () => {
    expect(isAuthenticated(requestWithCookie())).toBe(false);
  });

  it('returns false when the session cookie value is wrong', () => {
    expect(isAuthenticated(requestWithCookie('fwl_session=wrong-value'))).toBe(false);
  });

  it('returns false when SESSION_SECRET is not configured', () => {
    delete process.env.SESSION_SECRET;
    expect(isAuthenticated(requestWithCookie('fwl_session=super-secret'))).toBe(false);
  });
});
