import type { Request, Response } from "express";
import ApiResponse from "../../../common/utils/api-response.js";
import ApiError from "../../../common/utils/api-error.js";
import createPollService from "./services/create-poll-service.js";
import getAllPollsService from "./services/get-all-polls-service.js";
import getSinglePollService from "./services/get-single-poll-service.js";
import deletePollService from "./services/delete-poll-service.js";
import getPollAnalysisService from "./services/get-poll-analysis-service.js";
import type { CreatePollDtoType } from "./dto/create-poll-dto.js";

class PollController {
  public async createPoll(
    req: Request<{}, {}, CreatePollDtoType>,
    res: Response
  ) {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw ApiError.unauthorized();
    }

    const result = await createPollService({
      ...(req as any).body,
      creatorId: userId,
    });

    return ApiResponse.created(res, "Poll created successfully", result);
  }

  public async getAllPolls(req: Request, res: Response) {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw ApiError.unauthorized();
    }

    const result = await getAllPollsService({
      creatorId: userId,
    });

    return ApiResponse.ok(res, "Polls retrieved successfully", result);
  }

  public async getSinglePoll(
    req: Request,
    res: Response
  ) {
    const { id } = (req as any).params;

    if (!id) {
      throw ApiError.badRequest("Poll identifier is required");
    }

    const result = await getSinglePollService({
      pollId: id,
    });

    return ApiResponse.ok(res, "Poll retrieved successfully", result);
  }

  public async deletePoll(
    req: Request,
    res: Response
  ) {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw ApiError.unauthorized();
    }

    const { id } = (req as any).params;

    if (!id) {
      throw ApiError.badRequest("Poll identifier is required");
    }

    const result = await deletePollService({
      pollId: id,
      creatorId: userId,
    });

    return ApiResponse.ok(res, "Poll deleted successfully", result);
  }

  public async getPollAnalysis(
    req: Request,
    res: Response
  ) {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw ApiError.unauthorized();
    }

    const { id } = (req as any).params;

    if (!id) {
      throw ApiError.badRequest("Poll identifier is required");
    }

    const result = await getPollAnalysisService({
      pollId: id,
      creatorId: userId,
    });

    return ApiResponse.ok(res, "Poll analysis retrieved successfully", result);
  }
}

export default PollController;
