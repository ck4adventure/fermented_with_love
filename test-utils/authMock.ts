import { chainMock } from './chainMock';

export const TEST_USER = { id: 'user-1', email: 'christina@example.com' };
export const TEST_TOKEN = 'test-token';

// Queues the getCurrentUser() session/user lookup as the *next* db.select()
// call — must be called before the route handler's own db.select() calls,
// matching the order getCurrentUser() runs in (first thing every handler does).
export function mockLoggedIn(mockDb: { select: jest.Mock }, user: { id: string; email: string } = TEST_USER) {
  mockDb.select.mockReturnValueOnce(chainMock([{ ...user, expiresAt: new Date(Date.now() + 1000 * 60 * 60) }]));
}

export function mockLoggedOut(mockDb: { select: jest.Mock }) {
  mockDb.select.mockReturnValueOnce(chainMock([]));
}

export function authedRequest(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('cookie', `fwl_session=${TEST_TOKEN}`);
  return new Request(url, { ...init, headers });
}

export function unauthedRequest(url: string, init: RequestInit = {}) {
  return new Request(url, init);
}
