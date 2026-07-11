/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const ORIGINAL_ENV = process.env;
const params = Promise.resolve({ id: 'batch-1' });

describe('/api/public/batches/[id]/entries', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns 404 when PUBLIC_USER_ID is not configured, without touching the db', async () => {
    delete process.env.PUBLIC_USER_ID;
    const { GET } = await import('@/app/api/public/batches/[id]/entries/route');

    const res = await GET(new Request('http://localhost/api/public/batches/batch-1/entries'), { params });

    expect(res.status).toBe(404);
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('returns entries when the batch belongs to the public user', async () => {
    process.env.PUBLIC_USER_ID = 'public-user-1';
    const { GET } = await import('@/app/api/public/batches/[id]/entries/route');
    mockDb.select.mockReturnValueOnce(chainMock([{ id: 'batch-1', ownerId: 'public-user-1' }])); // getPublicBatch
    mockDb.select.mockReturnValueOnce(chainMock([{ id: 'entry-1' }])); // entries list

    const res = await GET(new Request('http://localhost/api/public/batches/batch-1/entries'), { params });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'entry-1' }]);
  });

  it('returns 404 for a batch owned by someone else, without listing entries', async () => {
    process.env.PUBLIC_USER_ID = 'public-user-1';
    const { GET } = await import('@/app/api/public/batches/[id]/entries/route');
    mockDb.select.mockReturnValueOnce(chainMock([])); // getPublicBatch finds nothing

    const res = await GET(new Request('http://localhost/api/public/batches/batch-1/entries'), { params });

    expect(res.status).toBe(404);
    expect(mockDb.select).toHaveBeenCalledTimes(1);
  });
});
