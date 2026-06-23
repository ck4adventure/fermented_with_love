import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';

export const batches = pgTable('batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('active'),
  startDate: date('start_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const batchEntries = pgTable('batch_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  batchId: uuid('batch_id')
    .notNull()
    .references(() => batches.id, { onDelete: 'cascade' }),
  entryDate: date('entry_date').notNull(),
  observation: text('observation').notNull(),
  actionTaken: text('action_taken'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;
export type BatchEntry = typeof batchEntries.$inferSelect;
export type NewBatchEntry = typeof batchEntries.$inferInsert;
