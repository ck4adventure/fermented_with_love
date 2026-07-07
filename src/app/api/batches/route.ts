import { db } from '@/db';
import { batches, type NewBatch } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const all = await db.select().from(batches).orderBy(desc(batches.createdAt));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as Pick<NewBatch, 'name' | 'type' | 'startDate' | 'notes' | 'gravity'>;

  if (!body.name || !body.type || !body.startDate) {
    return NextResponse.json({ error: 'name, type, and startDate are required' }, { status: 400 });
  }

  const [batch] = await db.insert(batches).values(body).returning();
  return NextResponse.json(batch, { status: 201 });
}
