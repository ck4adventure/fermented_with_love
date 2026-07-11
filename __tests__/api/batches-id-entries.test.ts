/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';
import { mockLoggedIn, authedRequest, unauthedRequest, TEST_USER } from '../../test-utils/authMock';

const mockDb = { select: jest.fn(), insert: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const params = Promise.resolve({ id: 'batch-1' });
const OWNED_BATCH = { id: 'batch-1', ownerId: TEST_USER.id };

function postInit(body: unknown) {
  return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

describe('/api/batches/[id]/entries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET rejects unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/route');

    const res = await GET(unauthedRequest('http://localhost/api/batches/batch-1/entries'), { params });

    expect(res.status).toBe(401);
  });

  it('GET returns entries when the batch is owned by the current user', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([OWNED_BATCH])); // getOwnedBatch
    mockDb.select.mockReturnValueOnce(chainMock([])); // entries list

    const res = await GET(authedRequest('http://localhost/api/batches/batch-1/entries'), { params });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('GET returns 404 for a batch owned by someone else', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([])); // getOwnedBatch finds nothing

    const res = await GET(authedRequest('http://localhost/api/batches/batch-1/entries'), { params });

    expect(res.status).toBe(404);
  });

  it('POST rejects unauthenticated requests without touching the db', async () => {
    const { POST } = await import('@/app/api/batches/[id]/entries/route');

    const res = await POST(unauthedRequest('http://localhost/api/batches/batch-1/entries', postInit({ entryDate: '2026-01-02', observation: 'Bubbling nicely' })), { params });

    expect(res.status).toBe(401);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('POST creates an entry when the batch is owned by the current user', async () => {
    const { POST } = await import('@/app/api/batches/[id]/entries/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([OWNED_BATCH])); // getOwnedBatch
    const created = { id: 'entry-1', batchId: 'batch-1', entryDate: '2026-01-02', observation: 'Bubbling nicely' };
    mockDb.insert.mockReturnValue(chainMock([created]));

    const res = await POST(authedRequest('http://localhost/api/batches/batch-1/entries', postInit({ entryDate: '2026-01-02', observation: 'Bubbling nicely' })), { params });

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
  });

  it('POST returns 404 for a batch owned by someone else, without touching insert', async () => {
    const { POST } = await import('@/app/api/batches/[id]/entries/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([])); // getOwnedBatch finds nothing

    const res = await POST(authedRequest('http://localhost/api/batches/batch-1/entries', postInit({ entryDate: '2026-01-02', observation: 'Bubbling nicely' })), { params });

    expect(res.status).toBe(404);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
