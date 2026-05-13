import { pgTable, uuid, varchar, integer, index } from 'drizzle-orm/pg-core';

import { questionsTable } from './questions-schema.js';

export const optionsTable = pgTable(
  'options',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    questionId: uuid('question_id')
      .references(() => questionsTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    optionText: varchar('option_text', {
      length: 255,
    }).notNull(),

    optionOrder: integer('option_order').default(1).notNull(),
  },

  (table) => [index('option_question_idx').on(table.questionId)]
);
