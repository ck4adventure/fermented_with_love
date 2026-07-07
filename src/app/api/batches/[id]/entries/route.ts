import { db } from '@/db';
import { batchEntries, type NewBatchEntry } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const entries = await db
    .select()
    .from(batchEntries)
    .where(eq(batchEntries.batchId, id))
    .orderBy(asc(batchEntries.entryDate));

  return NextResponse.json(entries);
}

export async function POST(request: Request, { params }: Params) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json() as Pick<NewBatchEntry, 'entryDate' | 'observation' | 'actionTaken' | 'gravity'>;

  if (!body.entryDate || !body.observation) {
    return NextResponse.json({ error: 'entryDate and observation are required' }, { status: 400 });
  }

  const [entry] = await db
    .insert(batchEntries)
    .values({ ...body, batchId: id })
    .returning();

  return NextResponse.json(entry, { status: 201 });
}
