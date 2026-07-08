import type { Request, Response } from "express";
import ApiResponse from "../../../common/utils/api-response.js";
import ApiError from "../../../common/utils/api-error.js";
import createPollService from "./services/create-poll-service.js";
import type { CreatePollDtoType } from "./dto/create-poll-dto.js";

class PollController {
  public async createPoll(
    req: Request<{}, {}, CreatePollDtoType>,
    res: Response
  ) {
    const userId = req.user?.userId;

    if (!userId) {
      throw ApiError.unauthorized();
    }

    const result = await createPollService({
      ...req.body,
      creatorId: userId,
    });

    return ApiResponse.created(res, "Poll created successfully", result);
  }
}

export default PollController;
