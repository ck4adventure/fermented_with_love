import { db } from '@/db';
import { batchEntries, type NewBatchEntry } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { entryId } = await params;
  const [entry] = await db.select().from(batchEntries).where(eq(batchEntries.id, entryId));

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function PATCH(request: Request, { params }: Params) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { entryId } = await params;
  const body = await request.json() as Partial<Pick<NewBatchEntry, 'entryDate' | 'observation' | 'actionTaken' | 'gravity'>>;

  const [entry] = await db
    .update(batchEntries)
    .set(body)
    .where(eq(batchEntries.id, entryId))
    .returning();

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { entryId } = await params;
  const [entry] = await db.delete(batchEntries).where(eq(batchEntries.id, entryId)).returning();

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
