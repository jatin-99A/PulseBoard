import db from "../../../../db/index.js";
import { pollsTable } from "../../../../db/polls-schema.js";
import { questionsTable } from "../../../../db/questions-schema.js";
import { optionsTable } from "../../../../db/options-schema.js";
import ApiError from "../../../../common/utils/api-error.js";
import type { CreatePollDtoType } from "../dto/create-poll-dto.js";

interface CreatePollPayload extends CreatePollDtoType {
    creatorId: string;
}

const createPollService = async (payload: CreatePollPayload) => {
    try {
        // Execute transaction to ensure data consistency
        const result = await db.transaction(async (trx) => {
            // 1. Create the poll
            const [poll] = await trx
                .insert(pollsTable)
                .values({
                    creatorId: payload.creatorId,
                    title: payload.title,
                    description: payload.description,
                    publicLink: payload.publicLink,
                    expiryDays: payload.expiryDays,
                    expiresAt: new Date(
                        Date.now() + payload.expiryDays * 24 * 60 * 60 * 1000
                    ),
                    isActive: true,
                    isAnonymousAllowed: payload.isAnonymousAllowed,
                })
                .returning({
                    id: pollsTable.id,
                    title: pollsTable.title,
                    description: pollsTable.description,
                    publicLink: pollsTable.publicLink,
                    expiryDays: pollsTable.expiryDays,
                    expiresAt: pollsTable.expiresAt,
                    isAnonymousAllowed: pollsTable.isAnonymousAllowed,
                    createdAt: pollsTable.createdAt,
                });

            if (!poll) {
                throw ApiError.internalError("Failed to create poll");
            }

            // 2. Create questions and their options
            const questionsWithOptions = await Promise.all(
                payload.questions.map(async (question) => {
                    // Create question
                    const [createdQuestion] = await trx
                        .insert(questionsTable)
                        .values({
                            pollId: poll.id,
                            questionText: question.questionText,
                            isMandatory: question.isMandatory,
                            questionOrder: question.questionOrder,
                        })
                        .returning({
                            id: questionsTable.id,
                            questionText: questionsTable.questionText,
                            isMandatory: questionsTable.isMandatory,
                            questionOrder: questionsTable.questionOrder,
                        });

                    if (!createdQuestion) {
                        throw ApiError.internalError("Failed to create question");
                    }

                    // Create options for the question
                    const createdOptions = await trx
                        .insert(optionsTable)
                        .values(
                            question.options.map((option) => ({
                                questionId: createdQuestion.id,
                                optionText: option.optionText,
                                optionOrder: option.optionOrder,
                            }))
                        )
                        .returning({
                            id: optionsTable.id,
                            optionText: optionsTable.optionText,
                            optionOrder: optionsTable.optionOrder,
                        });

                    if (!createdOptions || createdOptions.length === 0) {
                        throw ApiError.internalError("Failed to create options");
                    }

                    return {
                        id: createdQuestion.id,
                        questionText: createdQuestion.questionText,
                        isMandatory: createdQuestion.isMandatory,
                        questionOrder: createdQuestion.questionOrder,
                        options: createdOptions,
                    };
                })
            );

            return {
                ...poll,
                questions: questionsWithOptions,
            };
        });

        return result;
    } catch (error) {
        // Check if it's a unique constraint error for publicLink
        if (
            error instanceof Error &&
            error.message.includes("unique constraint")
        ) {
            throw ApiError.conflict("Public link already exists. Choose a different one.");
        }

        // Re-throw if it's already an ApiError
        if (error instanceof ApiError) {
            throw error;
        }

        // Log the error for debugging
        console.error("Create poll service error:", error);
        throw ApiError.internalError("Failed to create poll");
    }
};

export default createPollService;
