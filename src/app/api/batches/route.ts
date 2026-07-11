import { db } from '@/db';
import { batches, type NewBatch } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const all = await db.select().from(batches).where(eq(batches.ownerId, user.id)).orderBy(desc(batches.createdAt));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as Pick<NewBatch, 'name' | 'type' | 'startDate' | 'notes' | 'gravity' | 'volumeAmount' | 'volumeUnit'>;

  if (!body.name || !body.type || !body.startDate) {
    return NextResponse.json({ error: 'name, type, and startDate are required' }, { status: 400 });
  }

  const [batch] = await db.insert(batches).values({ ...body, ownerId: user.id }).returning();
  return NextResponse.json(batch, { status: 201 });
}
