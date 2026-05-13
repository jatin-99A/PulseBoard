import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { usersTable } from './user-schema.js';
import { pollsTable } from './polls-schema.js';

export const responsesTable = pgTable(
  'responses',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    respondentId: uuid('respondent_id')
      .references(() => usersTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    pollId: uuid('poll_id')
      .references(() => pollsTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },

  (table) => [
    index('response_poll_idx').on(table.pollId),

    uniqueIndex('unique_user_poll_response').on(
      table.respondentId,
      table.pollId
    ),
  ]
);
