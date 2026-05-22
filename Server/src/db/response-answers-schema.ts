import { pgTable, uuid, index } from 'drizzle-orm/pg-core';
import { responsesTable } from './responses-schema.js';
import { questionsTable } from './questions-schema.js';
import { optionsTable } from './options-schema.js';

export const responseAnswersTable = pgTable(
  'response_answers',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    responseId: uuid('response_id')
      .references(() => responsesTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    selectedOptionId: uuid('selected_option_id')
      .references(() => optionsTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    questionId: uuid('question_id')
      .references(() => questionsTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },

  (table) => [
    index('response_answer_response_idx').on(table.responseId),

    index('response_answer_question_idx').on(table.questionId),
  ]
);
