import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

import { usersTable } from './user-schema.js';

export const pollsTable = pgTable(
  'polls',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    creatorId: uuid('creator_id')
      .references(() => usersTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    title: varchar('title', { length: 255 }).notNull(),

    description: varchar('description', { length: 1000 }),

    publicLink: varchar('public_link', { length: 255 }).notNull().unique(),

    expiryDays: integer('expiry_days').default(7).notNull(),

    expiresAt: timestamp('expires_at').notNull(),

    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (table) => [
    index('poll_creator_idx').on(table.creatorId),
    index('public_link_idx').on(table.publicLink),
  ]
);
