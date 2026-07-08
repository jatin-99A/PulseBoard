import { Router } from "express";
import { catchAsync } from "../../../common/utils/catch-async-error.js";
import PollController from "./poll-controllers.js";
import validate from "../../../common/middlewares/validate-middleware.js";
import { CreatePollDto } from "./dto/create-poll-dto.js";
import protectedRoute from "../../../common/middlewares/protected-route-middleware.js";

const router = Router();

const pollController = new PollController();

router.post(
  "/create",
  protectedRoute,
  validate(CreatePollDto),
  catchAsync(pollController.createPoll.bind(pollController))
);

export default router;
