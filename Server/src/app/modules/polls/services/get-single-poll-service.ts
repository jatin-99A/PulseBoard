import db from "../../../../db/index.js";
import { pollsTable } from "../../../../db/polls-schema.js";
import { questionsTable } from "../../../../db/questions-schema.js";
import { optionsTable } from "../../../../db/options-schema.js";
import ApiError from "../../../../common/utils/api-error.js";
import { eq, inArray, asc } from "drizzle-orm";

interface GetSinglePollPayload {
  pollId: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getSinglePollService = async (payload: GetSinglePollPayload) => {
  try {
    const isUuid = UUID_REGEX.test(payload.pollId);

    // 1. Fetch poll by ID or publicLink
    const [poll] = await db
      .select({
        id: pollsTable.id,
        title: pollsTable.title,
        description: pollsTable.description,
        publicLink: pollsTable.publicLink,
        expiryDays: pollsTable.expiryDays,
        expiresAt: pollsTable.expiresAt,
        isActive: pollsTable.isActive,
        isAnonymousAllowed: pollsTable.isAnonymousAllowed,
        createdAt: pollsTable.createdAt,
      })
      .from(pollsTable)
      .where(
        isUuid
          ? eq(pollsTable.id, payload.pollId)
          : eq(pollsTable.publicLink, payload.pollId)
      )
      .limit(1);

    if (!poll) {
      throw ApiError.notFound("Poll not found");
    }

    // 2. Fetch questions for the poll
    const questions = await db
      .select({
        id: questionsTable.id,
        questionText: questionsTable.questionText,
        isMandatory: questionsTable.isMandatory,
        questionOrder: questionsTable.questionOrder,
      })
      .from(questionsTable)
      .where(eq(questionsTable.pollId, poll.id))
      .orderBy(asc(questionsTable.questionOrder));

    if (questions.length === 0) {
      return {
        ...poll,
        questions: [],
      };
    }

    // 3. Fetch options for all questions
    const questionIds = questions.map((q) => q.id);
    const options = await db
      .select({
        id: optionsTable.id,
        questionId: optionsTable.questionId,
        optionText: optionsTable.optionText,
        optionOrder: optionsTable.optionOrder,
      })
      .from(optionsTable)
      .where(inArray(optionsTable.questionId, questionIds))
      .orderBy(asc(optionsTable.optionOrder));

    // Group options by questionId
    const questionsWithOptions = questions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      isMandatory: question.isMandatory,
      questionOrder: question.questionOrder,
      options: options
        .filter((opt) => opt.questionId === question.id)
        .map((opt) => ({
          id: opt.id,
          optionText: opt.optionText,
          optionOrder: opt.optionOrder,
        })),
    }));

    return {
      ...poll,
      questions: questionsWithOptions,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Get single poll service error:", error);
    throw ApiError.internalError("Failed to fetch poll");
  }
};

export default getSinglePollService;

