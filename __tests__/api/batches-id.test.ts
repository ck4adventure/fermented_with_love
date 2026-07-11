/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';
import { mockLoggedIn, authedRequest, unauthedRequest, TEST_USER } from '../../test-utils/authMock';

const mockDb = { select: jest.fn(), update: jest.fn(), delete: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const params = Promise.resolve({ id: 'batch-1' });

function init(method: string, body?: unknown) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined };
}

describe('/api/batches/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET rejects unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/batches/[id]/route');

    const res = await GET(unauthedRequest('http://localhost/api/batches/batch-1'), { params });

    expect(res.status).toBe(401);
  });

  it("GET returns the batch when owned by the current user", async () => {
    const { GET } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([{ id: 'batch-1', ownerId: TEST_USER.id }]));

    const res = await GET(authedRequest('http://localhost/api/batches/batch-1'), { params });

    expect(res.status).toBe(200);
  });

  it('GET returns 404 for a batch owned by someone else', async () => {
    const { GET } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([]));

    const res = await GET(authedRequest('http://localhost/api/batches/batch-1'), { params });

    expect(res.status).toBe(404);
  });

  it('PATCH rejects unauthenticated requests without touching the db', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');

    const res = await PATCH(unauthedRequest('http://localhost/api/batches/batch-1', init('PATCH', { status: 'finished' })), { params });

    expect(res.status).toBe(401);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('PATCH updates the batch when authenticated', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.update.mockReturnValue(chainMock([{ id: 'batch-1', status: 'finished' }]));

    const res = await PATCH(authedRequest('http://localhost/api/batches/batch-1', init('PATCH', { status: 'finished' })), { params });

    expect(res.status).toBe(200);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('PATCH updates volume fields when authenticated', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.update.mockReturnValue(chainMock([{ id: 'batch-1', volumeAmount: 750, volumeUnit: 'ml' }]));

    const res = await PATCH(authedRequest('http://localhost/api/batches/batch-1', init('PATCH', { volumeAmount: 750, volumeUnit: 'ml' })), { params });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 'batch-1', volumeAmount: 750, volumeUnit: 'ml' });
  });

  it('PATCH returns 404 for a batch owned by someone else', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.update.mockReturnValue(chainMock([]));

    const res = await PATCH(authedRequest('http://localhost/api/batches/batch-1', init('PATCH', { status: 'finished' })), { params });

    expect(res.status).toBe(404);
  });

  it('DELETE rejects unauthenticated requests without touching the db', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/route');

    const res = await DELETE(unauthedRequest('http://localhost/api/batches/batch-1', init('DELETE')), { params });

    expect(res.status).toBe(401);
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('DELETE removes the batch when authenticated', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.delete.mockReturnValue(chainMock([{ id: 'batch-1' }]));

    const res = await DELETE(authedRequest('http://localhost/api/batches/batch-1', init('DELETE')), { params });

    expect(res.status).toBe(200);
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('DELETE returns 404 for a batch owned by someone else', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/route');
    mockLoggedIn(mockDb);
    mockDb.delete.mockReturnValue(chainMock([]));

    const res = await DELETE(authedRequest('http://localhost/api/batches/batch-1', init('DELETE')), { params });

    expect(res.status).toBe(404);
  });
});
