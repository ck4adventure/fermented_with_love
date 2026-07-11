/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

import { getCurrentUser } from '@/lib/auth';

function requestWithCookie(cookie?: string) {
  const headers = new Headers();
  if (cookie !== undefined) headers.set('cookie', cookie);
  return new Request('http://localhost/api/batches', { headers });
}

describe('getCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when there is no cookie header', async () => {
    expect(await getCurrentUser(requestWithCookie())).toBeNull();
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('returns the user for a valid, unexpired session', async () => {
    mockDb.select.mockReturnValueOnce(chainMock([
      { id: 'user-1', email: 'a@b.com', expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
    ]));

    const result = await getCurrentUser(requestWithCookie('fwl_session=some-token'));

    expect(result).toEqual({ id: 'user-1', email: 'a@b.com' });
  });

  it('finds the cookie alongside other cookies', async () => {
    mockDb.select.mockReturnValueOnce(chainMock([
      { id: 'user-1', email: 'a@b.com', expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
    ]));

    const result = await getCurrentUser(requestWithCookie('foo=bar; fwl_session=some-token; baz=qux'));

    expect(result).toEqual({ id: 'user-1', email: 'a@b.com' });
  });

  it('returns null when the session has expired', async () => {
    mockDb.select.mockReturnValueOnce(chainMock([
      { id: 'user-1', email: 'a@b.com', expiresAt: new Date(Date.now() - 1000) },
    ]));

    expect(await getCurrentUser(requestWithCookie('fwl_session=expired-token'))).toBeNull();
  });

  it('returns null when no session matches the token', async () => {
    mockDb.select.mockReturnValueOnce(chainMock([]));

    expect(await getCurrentUser(requestWithCookie('fwl_session=unknown-token'))).toBeNull();
  });
});
