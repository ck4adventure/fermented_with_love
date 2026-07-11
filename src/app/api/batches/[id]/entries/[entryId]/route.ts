import { db } from '@/db';
import { batchEntries, type NewBatchEntry } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOwnedEntry } from '@/lib/ownership';

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function GET(request: Request, { params }: Params) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, entryId } = await params;
  const entry = await getOwnedEntry(user.id, id, entryId);

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, entryId } = await params;
  const owned = await getOwnedEntry(user.id, id, entryId);
  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json() as Partial<Pick<NewBatchEntry, 'entryDate' | 'observation' | 'actionTaken' | 'gravity'>>;

  const [entry] = await db
    .update(batchEntries)
    .set(body)
    .where(and(eq(batchEntries.id, entryId), eq(batchEntries.batchId, id)))
    .returning();

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function DELETE(request: Request, { params }: Params) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, entryId } = await params;
  const owned = await getOwnedEntry(user.id, id, entryId);
  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [entry] = await db
    .delete(batchEntries)
    .where(and(eq(batchEntries.id, entryId), eq(batchEntries.batchId, id)))
    .returning();

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
