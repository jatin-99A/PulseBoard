import db from "../../../../db/index.js";
import { pollsTable } from "../../../../db/polls-schema.js";
import { questionsTable } from "../../../../db/questions-schema.js";
import { optionsTable } from "../../../../db/options-schema.js";
import { responsesTable } from "../../../../db/responses-schema.js";
import { responseAnswersTable } from "../../../../db/response-answers-schema.js";
import ApiError from "../../../../common/utils/api-error.js";
import { eq, inArray, asc, count } from "drizzle-orm";

interface GetPollAnalysisPayload {
  pollId: string;
  creatorId?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getPollAnalysisService = async (payload: GetPollAnalysisPayload) => {
  try {
    const isUuid = UUID_REGEX.test(payload.pollId);

    // 1. Fetch poll
    const [poll] = await db
      .select({
        id: pollsTable.id,
        creatorId: pollsTable.creatorId,
        title: pollsTable.title,
        description: pollsTable.description,
        publicLink: pollsTable.publicLink,
        isActive: pollsTable.isActive,
        expiresAt: pollsTable.expiresAt,
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

    // Check ownership if creatorId is specified
    if (payload.creatorId && poll.creatorId !== payload.creatorId) {
      throw ApiError.forbidden("You do not have permission to view analysis for this poll");
    }

    // 2. Fetch total responses count
    const [responseCountResult] = await db
      .select({ total: count() })
      .from(responsesTable)
      .where(eq(responsesTable.pollId, poll.id));

    const totalResponses = Number(responseCountResult?.total || 0);

    // 3. Fetch questions
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
        pollId: poll.id,
        title: poll.title,
        publicLink: poll.publicLink,
        totalResponses,
        questions: [],
      };
    }

    // 4. Fetch options for all questions
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

    // 5. Fetch vote counts per option for this poll
    const optionVotes = await db
      .select({
        selectedOptionId: responseAnswersTable.selectedOptionId,
        votes: count(),
      })
      .from(responseAnswersTable)
      .innerJoin(
        responsesTable,
        eq(responseAnswersTable.responseId, responsesTable.id)
      )
      .where(eq(responsesTable.pollId, poll.id))
      .groupBy(responseAnswersTable.selectedOptionId);

    const voteCountMap = new Map<string, number>();
    for (const row of optionVotes) {
      voteCountMap.set(row.selectedOptionId, Number(row.votes));
    }

    // 6. Assemble analysis data with percentage calculation
    const questionsWithAnalysis = questions.map((question) => {
      const questionOptions = options.filter(
        (opt) => opt.questionId === question.id
      );

      const totalQuestionVotes = questionOptions.reduce((sum, opt) => {
        return sum + (voteCountMap.get(opt.id) || 0);
      }, 0);

      const optionsWithPercentages = questionOptions.map((opt) => {
        const votes = voteCountMap.get(opt.id) || 0;
        const percentage =
          totalQuestionVotes > 0
            ? Number(((votes / totalQuestionVotes) * 100).toFixed(2))
            : 0;

        return {
          id: opt.id,
          optionText: opt.optionText,
          optionOrder: opt.optionOrder,
          votes,
          percentage,
        };
      });

      return {
        id: question.id,
        questionText: question.questionText,
        questionOrder: question.questionOrder,
        totalVotes: totalQuestionVotes,
        options: optionsWithPercentages,
      };
    });

    return {
      pollId: poll.id,
      title: poll.title,
      description: poll.description,
      publicLink: poll.publicLink,
      isActive: poll.isActive,
      expiresAt: poll.expiresAt,
      createdAt: poll.createdAt,
      totalResponses,
      questions: questionsWithAnalysis,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Get poll analysis service error:", error);
    throw ApiError.internalError("Failed to fetch poll analysis");
  }
};

export default getPollAnalysisService;

