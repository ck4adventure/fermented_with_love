/**
 * @jest-environment node
 */
import { chainMock } from '../../test-utils/chainMock';

const mockDb = { select: jest.fn() };
jest.mock('@/db', () => ({ db: mockDb }));

const ORIGINAL_ENV = process.env;

describe('/api/public/batches', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns an empty list when PUBLIC_USER_ID is not configured, without touching the db', async () => {
    delete process.env.PUBLIC_USER_ID;
    const { GET } = await import('@/app/api/public/batches/route');

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('returns the public user\'s batches when configured', async () => {
    process.env.PUBLIC_USER_ID = 'public-user-1';
    const { GET } = await import('@/app/api/public/batches/route');
    mockDb.select.mockReturnValueOnce(chainMock([{ id: 'batch-1', ownerId: 'public-user-1' }]));

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'batch-1', ownerId: 'public-user-1' }]);
  });
});
