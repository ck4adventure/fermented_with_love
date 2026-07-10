/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn(), update: jest.fn(), delete: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const SECRET = 'super-secret';
const ORIGINAL_ENV = process.env;
const params = Promise.resolve({ id: 'batch-1', entryId: 'entry-1' });

function authedRequest(method: string, body?: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json', cookie: `fwl_session=${SECRET}` });
  return new Request('http://localhost/api/batches/batch-1/entries/entry-1', { method, headers, body: body ? JSON.stringify(body) : undefined });
}

function unauthedRequest(method: string, body?: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  return new Request('http://localhost/api/batches/batch-1/entries/entry-1', { method, headers, body: body ? JSON.stringify(body) : undefined });
}

describe('/api/batches/[id]/entries/[entryId]', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SESSION_SECRET: SECRET };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('GET does not require auth', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockDb.select.mockReturnValue(chainMock([{ id: 'entry-1' }]));

    const res = await GET(unauthedRequest('GET'), { params });

    expect(res.status).toBe(200);
  });

  it('GET returns 404 when the entry does not exist', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockDb.select.mockReturnValue(chainMock([]));

    const res = await GET(unauthedRequest('GET'), { params });

    expect(res.status).toBe(404);
  });

  it('PATCH rejects unauthenticated requests without touching the db', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/entries/[entryId]/route');

    const res = await PATCH(unauthedRequest('PATCH', { observation: 'Updated' }), { params });

    expect(res.status).toBe(401);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('PATCH updates the entry when authenticated', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockDb.update.mockReturnValue(chainMock([{ id: 'entry-1', observation: 'Updated' }]));

    const res = await PATCH(authedRequest('PATCH', { observation: 'Updated' }), { params });

    expect(res.status).toBe(200);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('PATCH returns 404 when the entry does not exist', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockDb.update.mockReturnValue(chainMock([]));

    const res = await PATCH(authedRequest('PATCH', { observation: 'Updated' }), { params });

    expect(res.status).toBe(404);
  });

  it('DELETE rejects unauthenticated requests without touching the db', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/entries/[entryId]/route');

    const res = await DELETE(unauthedRequest('DELETE'), { params });

    expect(res.status).toBe(401);
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('DELETE removes the entry when authenticated', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockDb.delete.mockReturnValue(chainMock([{ id: 'entry-1' }]));

    const res = await DELETE(authedRequest('DELETE'), { params });

    expect(res.status).toBe(200);
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('DELETE returns 404 when the entry does not exist', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockDb.delete.mockReturnValue(chainMock([]));

    const res = await DELETE(authedRequest('DELETE'), { params });

    expect(res.status).toBe(404);
  });
});
