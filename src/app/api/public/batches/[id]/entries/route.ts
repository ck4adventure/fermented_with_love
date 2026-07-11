import { db } from '@/db';
import { batchEntries } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getPublicBatch } from '@/lib/ownership';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const batch = await getPublicBatch(id);
  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const entries = await db
    .select()
    .from(batchEntries)
    .where(eq(batchEntries.batchId, id))
    .orderBy(asc(batchEntries.entryDate));

  return NextResponse.json(entries);
}
