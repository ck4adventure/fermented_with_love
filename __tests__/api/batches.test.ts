/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';
import { mockLoggedIn, authedRequest, unauthedRequest, TEST_USER } from '../../test-utils/authMock';

const mockDb = { select: jest.fn(), insert: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

function postInit(body: unknown) {
  return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

describe('/api/batches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET rejects unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/batches/route');

    const res = await GET(unauthedRequest('http://localhost/api/batches'));

    expect(res.status).toBe(401);
  });

  it("GET returns only the current user's batches when authenticated", async () => {
    const { GET } = await import('@/app/api/batches/route');
    mockLoggedIn(mockDb);
    mockDb.select.mockReturnValueOnce(chainMock([{ id: 'abc', ownerId: TEST_USER.id }]));

    const res = await GET(authedRequest('http://localhost/api/batches'));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'abc', ownerId: TEST_USER.id }]);
  });

  it('POST rejects unauthenticated requests without touching the db', async () => {
    const { POST } = await import('@/app/api/batches/route');

    const res = await POST(unauthedRequest('http://localhost/api/batches', postInit({ name: 'Cider', type: 'wine', startDate: '2026-01-01' })));

    expect(res.status).toBe(401);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('POST creates a batch owned by the current user when authenticated', async () => {
    const { POST } = await import('@/app/api/batches/route');
    mockLoggedIn(mockDb);
    const created = { id: 'abc', name: 'Cider', type: 'wine', startDate: '2026-01-01', ownerId: TEST_USER.id };
    mockDb.insert.mockReturnValue(chainMock([created]));

    const res = await POST(authedRequest('http://localhost/api/batches', postInit({ name: 'Cider', type: 'wine', startDate: '2026-01-01' })));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('POST passes volume fields through to the insert', async () => {
    const { POST } = await import('@/app/api/batches/route');
    mockLoggedIn(mockDb);
    const created = { id: 'abc', name: 'Cider', type: 'wine', startDate: '2026-01-01', volumeAmount: 5, volumeUnit: 'gallon', ownerId: TEST_USER.id };
    mockDb.insert.mockReturnValue(chainMock([created]));

    const res = await POST(authedRequest('http://localhost/api/batches', postInit({ name: 'Cider', type: 'wine', startDate: '2026-01-01', volumeAmount: 5, volumeUnit: 'gallon' })));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
  });
});
