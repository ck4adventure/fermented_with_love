/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';
import { mockLoggedIn, authedRequest, unauthedRequest, TEST_USER } from '../../test-utils/authMock';

const mockDb = { select: jest.fn(), update: jest.fn(), delete: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const params = Promise.resolve({ id: 'batch-1', entryId: 'entry-1' });
const OWNED_BATCH = { id: 'batch-1', ownerId: TEST_USER.id };
const ENTRY = { id: 'entry-1', batchId: 'batch-1', observation: 'Original' };

function init(method: string, body?: unknown) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined };
}

// getOwnedEntry() does getOwnedBatch() (1 select) then looks up the entry (1 select).
function mockOwnedEntryFound(entry: unknown = ENTRY) {
  mockDb.select.mockReturnValueOnce(chainMock([OWNED_BATCH]));
  mockDb.select.mockReturnValueOnce(chainMock([entry]));
}

function mockOwnedEntryNotFound() {
  mockDb.select.mockReturnValueOnce(chainMock([])); // batch not owned/found
}

describe('/api/batches/[id]/entries/[entryId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET rejects unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/[entryId]/route');

    const res = await GET(unauthedRequest('http://localhost/api/batches/batch-1/entries/entry-1'), { params });

    expect(res.status).toBe(401);
  });

  it('GET returns the entry when owned by the current user', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockLoggedIn(mockDb);
    mockOwnedEntryFound();

    const res = await GET(authedRequest('http://localhost/api/batches/batch-1/entries/entry-1'), { params });

    expect(res.status).toBe(200);
  });

  it('GET returns 404 when the entry is not owned by the current user', async () => {
    const { GET } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockLoggedIn(mockDb);
    mockOwnedEntryNotFound();

    const res = await GET(authedRequest('http://localhost/api/batches/batch-1/entries/entry-1'), { params });

    expect(res.status).toBe(404);
  });

  it('PATCH rejects unauthenticated requests without touching the db', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/entries/[entryId]/route');

    const res = await PATCH(unauthedRequest('http://localhost/api/batches/batch-1/entries/entry-1', init('PATCH', { observation: 'Updated' })), { params });

    expect(res.status).toBe(401);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('PATCH updates the entry when owned by the current user', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockLoggedIn(mockDb);
    mockOwnedEntryFound();
    mockDb.update.mockReturnValue(chainMock([{ id: 'entry-1', observation: 'Updated' }]));

    const res = await PATCH(authedRequest('http://localhost/api/batches/batch-1/entries/entry-1', init('PATCH', { observation: 'Updated' })), { params });

    expect(res.status).toBe(200);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('PATCH returns 404 when the entry is not owned by the current user, without touching update', async () => {
    const { PATCH } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockLoggedIn(mockDb);
    mockOwnedEntryNotFound();

    const res = await PATCH(authedRequest('http://localhost/api/batches/batch-1/entries/entry-1', init('PATCH', { observation: 'Updated' })), { params });

    expect(res.status).toBe(404);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('DELETE rejects unauthenticated requests without touching the db', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/entries/[entryId]/route');

    const res = await DELETE(unauthedRequest('http://localhost/api/batches/batch-1/entries/entry-1', init('DELETE')), { params });

    expect(res.status).toBe(401);
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('DELETE removes the entry when owned by the current user', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockLoggedIn(mockDb);
    mockOwnedEntryFound();
    mockDb.delete.mockReturnValue(chainMock([{ id: 'entry-1' }]));

    const res = await DELETE(authedRequest('http://localhost/api/batches/batch-1/entries/entry-1', init('DELETE')), { params });

    expect(res.status).toBe(200);
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('DELETE returns 404 when the entry is not owned by the current user, without touching delete', async () => {
    const { DELETE } = await import('@/app/api/batches/[id]/entries/[entryId]/route');
    mockLoggedIn(mockDb);
    mockOwnedEntryNotFound();

    const res = await DELETE(authedRequest('http://localhost/api/batches/batch-1/entries/entry-1', init('DELETE')), { params });

    expect(res.status).toBe(404);
    expect(mockDb.delete).not.toHaveBeenCalled();
  });
});
