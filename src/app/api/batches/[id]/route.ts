import { db } from '@/db';
import { batches, type NewBatch } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOwnedBatch } from '@/lib/ownership';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const batch = await getOwnedBatch(user.id, id);

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(batch);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json() as Partial<Pick<NewBatch, 'name' | 'type' | 'status' | 'notes' | 'gravity' | 'volumeAmount' | 'volumeUnit'>>;

  const [batch] = await db
    .update(batches)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(batches.id, id), eq(batches.ownerId, user.id)))
    .returning();

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(batch);
}

export async function DELETE(request: Request, { params }: Params) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const [batch] = await db
    .delete(batches)
    .where(and(eq(batches.id, id), eq(batches.ownerId, user.id)))
    .returning();

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
