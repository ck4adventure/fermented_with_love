/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn(), update: jest.fn(), delete: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const SECRET = 'super-secret';
const ORIGINAL_ENV = process.env;
const params = Promise.resolve({ id: 'batch-1' });

function authedRequest(method: string, body?: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json', cookie: `fwl_session=${SECRET}` });
  return new Request('http://localhost/api/batches/batch-1', { method, headers, body: body ? JSON.stringify(body) : undefined });
}

function unauthedRequest(method: string, body?: unknown) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  return new Request('http://localhost/api/batches/batch-1', { method, headers, body: body ? JSON.stringify(body) : undefined });
}

describe('/api/batches/[id]', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SESSION_SECRET: SECRET };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('GET does not require auth', async () => {
    const { GET } = await import('@/app/api/batches/[id]/route');
    mockDb.select.mockReturnValue(chainMock([{ id: 'batch-1' }]));

    const res = await GET(unauthedRequest('GET'), { params });

    expect(res.status).toBe(200);
  });

  it('PATCH rejects unauthenticated requests without touching the db', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');

    const res = await PATCH(unauthedRequest('PATCH', { status: 'finished' }), { params });

    expect(res.status).toBe(401);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('PATCH updates the batch when authenticated', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');
    mockDb.update.mockReturnValue(chainMock([{ id: 'batch-1', status: 'finished' }]));

    const res = await PATCH(authedRequest('PATCH', { status: 'finished' }), { params });

    expect(res.status).toBe(200);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('PATCH updates volume fields when authenticated', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');
    mockDb.update.mockReturnValue(chainMock([{ id: 'batch-1', volumeAmount: 750, volumeUnit: 'ml' }]));

    const res = await PATCH(authedRequest('PATCH', { volumeAmount: 750, volumeUnit: 'ml' }), { params });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 'batch-1', volumeAmount: 750, volumeUnit: 'ml' });
  });

  it('DELETE rejects unauthenticated requests without touching the db', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/route');

    const res = await DELETE(unauthedRequest('DELETE'), { params });

    expect(res.status).toBe(401);
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('DELETE removes the batch when authenticated', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/route');
    mockDb.delete.mockReturnValue(chainMock([{ id: 'batch-1' }]));

    const res = await DELETE(authedRequest('DELETE'), { params });

    expect(res.status).toBe(200);
    expect(mockDb.delete).toHaveBeenCalled();
  });
});
