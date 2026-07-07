/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn(), insert: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const SECRET = 'super-secret';
const ORIGINAL_ENV = process.env;
const params = Promise.resolve({ id: 'batch-1' });

function authedRequest(body: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json', cookie: `fwl_session=${SECRET}` });
  return new Request('http://localhost/api/batches/batch-1/entries', { method: 'POST', headers, body: JSON.stringify(body) });
}

function unauthedRequest(body: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  return new Request('http://localhost/api/batches/batch-1/entries', { method: 'POST', headers, body: JSON.stringify(body) });
}

describe('/api/batches/[id]/entries', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SESSION_SECRET: SECRET };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('GET does not require auth', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/route');
    mockDb.select.mockReturnValue(chainMock([]));

    const res = await GET(unauthedRequest(undefined), { params });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('POST rejects unauthenticated requests without touching the db', async () => {
    const { POST } = await import('@/app/api/batches/[id]/entries/route');

    const res = await POST(unauthedRequest({ entryDate: '2026-01-02', observation: 'Bubbling nicely' }), { params });

    expect(res.status).toBe(401);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('POST creates an entry when authenticated', async () => {
    const { POST } = await import('@/app/api/batches/[id]/entries/route');
    const created = { id: 'entry-1', batchId: 'batch-1', entryDate: '2026-01-02', observation: 'Bubbling nicely' };
    mockDb.insert.mockReturnValue(chainMock([created]));

    const res = await POST(authedRequest({ entryDate: '2026-01-02', observation: 'Bubbling nicely' }), { params });

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
  });
});
