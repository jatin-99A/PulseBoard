import { Router } from "express";
import { catchAsync } from "../../../common/utils/catch-async-error.js";
import PollController from "./poll-controllers.js";
import validate from "../../../common/middlewares/validate-middleware.js";
import { CreatePollDto } from "./dto/create-poll-dto.js";
import protectedRoute from "../../../common/middlewares/protected-route-middleware.js";

const router = Router();

const pollController = new PollController();

// 1. Create Poll
router.post(
  "/create",
  protectedRoute,
  validate(CreatePollDto),
  catchAsync(pollController.createPoll.bind(pollController))
);

// 2. Get All Polls (Authenticated User's Polls)
router.get(
  "/",
  protectedRoute,
  catchAsync(pollController.getAllPolls.bind(pollController))
);

// 3. Poll Analysis / Results
router.get(
  "/:id/analysis",
  protectedRoute,
  catchAsync(pollController.getPollAnalysis.bind(pollController))
);

router.get(
  "/:id/results",
  protectedRoute,
  catchAsync(pollController.getPollAnalysis.bind(pollController))
);

// 4. Get Single Poll (by ID or publicLink)
router.get(
  "/:id",
  catchAsync(pollController.getSinglePoll.bind(pollController))
);

// 5. Delete Poll
router.delete(
  "/:id",
  protectedRoute,
  catchAsync(pollController.deletePoll.bind(pollController))
);

export default router;
