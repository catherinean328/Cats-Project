import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

// Users in the queue table
export const queueUsers = pgTable('queue_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull().unique(), // Browser session ID
  role: text('role').notNull(), // 'listener' | 'venter'
  telegramUsername: text('telegram_username'), // Only for listeners
  isOnline: boolean('is_online').default(true),
  joinedAt: timestamp('joined_at').defaultNow(),
  lastSeen: timestamp('last_seen').defaultNow(),
});

// Active connections/matches
export const connections = pgTable('connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  listenerUserId: uuid('listener_user_id').notNull(),
  venterUserId: uuid('venter_user_id').notNull(),
  status: text('status').notNull().default('connecting'), // 'connecting' | 'connected' | 'ended'
  createdAt: timestamp('created_at').defaultNow(),
  endedAt: timestamp('ended_at'),
});

export type QueueUser = typeof queueUsers.$inferSelect;
export type NewQueueUser = typeof queueUsers.$inferInsert;
export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;