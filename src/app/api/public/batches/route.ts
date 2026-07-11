import { db } from '@/db';
import { batches } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getPublicUserId } from '@/lib/ownership';

export async function GET() {
  const publicUserId = getPublicUserId();
  if (!publicUserId) {
    return NextResponse.json([]);
  }

  const all = await db.select().from(batches).where(eq(batches.ownerId, publicUserId)).orderBy(desc(batches.createdAt));
  return NextResponse.json(all);
}
