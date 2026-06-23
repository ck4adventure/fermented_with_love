import { db } from '@/db';
import { batches, type NewBatch } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const [batch] = await db.select().from(batches).where(eq(batches.id, id));

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(batch);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json() as Partial<Pick<NewBatch, 'name' | 'type' | 'status' | 'notes'>>;

  const [batch] = await db
    .update(batches)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(batches.id, id))
    .returning();

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(batch);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const [batch] = await db.delete(batches).where(eq(batches.id, id)).returning();

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
