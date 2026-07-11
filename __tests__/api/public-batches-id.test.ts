/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const ORIGINAL_ENV = process.env;
const params = Promise.resolve({ id: 'batch-1' });

describe('/api/public/batches/[id]', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns 404 when PUBLIC_USER_ID is not configured, without touching the db', async () => {
    delete process.env.PUBLIC_USER_ID;
    const { GET } = await import('@/app/api/public/batches/[id]/route');

    const res = await GET(new Request('http://localhost/api/public/batches/batch-1'), { params });

    expect(res.status).toBe(404);
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('returns the batch when it belongs to the public user', async () => {
    process.env.PUBLIC_USER_ID = 'public-user-1';
    const { GET } = await import('@/app/api/public/batches/[id]/route');
    mockDb.select.mockReturnValueOnce(chainMock([{ id: 'batch-1', ownerId: 'public-user-1' }]));

    const res = await GET(new Request('http://localhost/api/public/batches/batch-1'), { params });

    expect(res.status).toBe(200);
  });

  it('returns 404 for a batch owned by someone else', async () => {
    process.env.PUBLIC_USER_ID = 'public-user-1';
    const { GET } = await import('@/app/api/public/batches/[id]/route');
    mockDb.select.mockReturnValueOnce(chainMock([]));

    const res = await GET(new Request('http://localhost/api/public/batches/batch-1'), { params });

    expect(res.status).toBe(404);
  });
});
