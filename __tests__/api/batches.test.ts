/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn(), insert: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const SECRET = 'super-secret';
const ORIGINAL_ENV = process.env;

function authedRequest(body: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json', cookie: `fwl_session=${SECRET}` });
  return new Request('http://localhost/api/batches', { method: 'POST', headers, body: JSON.stringify(body) });
}

function unauthedRequest(body: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  return new Request('http://localhost/api/batches', { method: 'POST', headers, body: JSON.stringify(body) });
}

describe('/api/batches', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SESSION_SECRET: SECRET };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('GET does not require auth', async () => {
    const { GET } = await import('@/app/api/batches/route');
    mockDb.select.mockReturnValue(chainMock([]));

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('POST rejects unauthenticated requests without touching the db', async () => {
    const { POST } = await import('@/app/api/batches/route');

    const res = await POST(unauthedRequest({ name: 'Cider', type: 'wine', startDate: '2026-01-01' }));

    expect(res.status).toBe(401);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('POST creates a batch when authenticated', async () => {
    const { POST } = await import('@/app/api/batches/route');
    const created = { id: 'abc', name: 'Cider', type: 'wine', startDate: '2026-01-01' };
    mockDb.insert.mockReturnValue(chainMock([created]));

    const res = await POST(authedRequest({ name: 'Cider', type: 'wine', startDate: '2026-01-01' }));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});
