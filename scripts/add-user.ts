import { config as loadEnv } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, isNull } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { hashPassword } from '../src/lib/password';

const args = process.argv.slice(2);
const inviteFile = args.find(a => !a.startsWith('--'));
const claimExistingBatches = args.includes('--claim-existing-batches');

if (!inviteFile) {
  console.error('Usage: npm run user:add -- <path-to-invite.env> [--claim-existing-batches]');
  process.exit(1);
}

loadEnv({ path: inviteFile });

const email = process.env.INVITE_EMAIL?.toLowerCase();
const password = process.env.INVITE_PASSWORD;

if (!email || !password) {
  console.error('INVITE_EMAIL and INVITE_PASSWORD must be set in the invite file.');
  process.exit(1);
}

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });
  const passwordHash = hashPassword(password!);

  const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, email!));

  let userId: string;
  if (existing) {
    await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.id, existing.id));
    userId = existing.id;
    console.log(`Updated password for ${email} (${userId})`);
  } else {
    const [created] = await db.insert(schema.users).values({ email: email!, passwordHash }).returning();
    userId = created.id;
    console.log(`Created user ${email} (${userId})`);
  }

  if (claimExistingBatches) {
    const claimed = await db
      .update(schema.batches)
      .set({ ownerId: userId })
      .where(isNull(schema.batches.ownerId))
      .returning({ id: schema.batches.id });
    console.log(`Assigned ${claimed.length} previously unowned batch(es) to ${email}`);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
