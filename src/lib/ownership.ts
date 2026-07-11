import { db } from '@/db';
import { batches, batchEntries } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

// Shared across the batch/entry API routes: this ownership check is
// security-critical and needed in several route handlers, so it's kept in
// one place rather than copy-pasted (unlike this repo's usual preference
// for inlining one-off queries).

export async function getOwnedBatch(userId: string, batchId: string) {
  const [batch] = await db
    .select()
    .from(batches)
    .where(and(eq(batches.id, batchId), eq(batches.ownerId, userId)));
  return batch ?? null;
}

export async function getOwnedEntry(userId: string, batchId: string, entryId: string) {
  const batch = await getOwnedBatch(userId, batchId);
  if (!batch) return null;

  const [entry] = await db
    .select()
    .from(batchEntries)
    .where(and(eq(batchEntries.id, entryId), eq(batchEntries.batchId, batchId)));
  return entry ?? null;
}

// The one account (if any) whose batches are shown on the public, no-login /brewing pages.
export function getPublicUserId(): string | null {
  return process.env.PUBLIC_USER_ID ?? null;
}

export async function getPublicBatch(batchId: string) {
  const publicUserId = getPublicUserId();
  if (!publicUserId) return null;
  return getOwnedBatch(publicUserId, batchId);
}
