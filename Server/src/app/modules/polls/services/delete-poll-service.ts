import db from "../../../../db/index.js";
import { pollsTable } from "../../../../db/polls-schema.js";
import ApiError from "../../../../common/utils/api-error.js";
import { eq } from "drizzle-orm";

interface DeletePollPayload {
  pollId: string;
  creatorId: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const deletePollService = async (payload: DeletePollPayload) => {
  try {
    if (!UUID_REGEX.test(payload.pollId)) {
      throw ApiError.badRequest("Invalid poll ID format");
    }

    // 1. Check if poll exists
    const [poll] = await db
      .select({
        id: pollsTable.id,
        creatorId: pollsTable.creatorId,
      })
      .from(pollsTable)
      .where(eq(pollsTable.id, payload.pollId))
      .limit(1);

    if (!poll) {
      throw ApiError.notFound("Poll not found");
    }

    // 2. Check ownership
    if (poll.creatorId !== payload.creatorId) {
      throw ApiError.forbidden("You do not have permission to delete this poll");
    }

    // 3. Delete poll
    await db.delete(pollsTable).where(eq(pollsTable.id, payload.pollId));

    return {
      id: payload.pollId,
      deleted: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Delete poll service error:", error);
    throw ApiError.internalError("Failed to delete poll");
  }
};

export default deletePollService;

