import db from "../../../../db/index.js";
import { pollsTable } from "../../../../db/polls-schema.js";
import ApiError from "../../../../common/utils/api-error.js";
import { eq, desc } from "drizzle-orm";

interface GetAllPollsPayload {
  creatorId: string;
}

const getAllPollsService = async (payload: GetAllPollsPayload) => {
  try {
    const polls = await db
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
        updatedAt: pollsTable.updatedAt,
      })
      .from(pollsTable)
      .where(eq(pollsTable.creatorId, payload.creatorId))
      .orderBy(desc(pollsTable.createdAt));

    return polls;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Get all polls service error:", error);
    throw ApiError.internalError("Failed to fetch polls");
  }
};

export default getAllPollsService;

