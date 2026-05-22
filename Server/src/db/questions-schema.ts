import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
  boolean
} from 'drizzle-orm/pg-core';
import { pollsTable } from './polls-schema.js';

export const questionsTable = pgTable(
  'questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    pollId: uuid('poll_id')
      .references(() => pollsTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    questionText: varchar('question_text', {
      length: 500,
    }).notNull(),

    isMandatory: boolean('is_mandatory').default(false).notNull(),

    questionOrder: integer('question_order').default(1).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },

  (table) => [index('question_poll_idx').on(table.pollId)]
);
