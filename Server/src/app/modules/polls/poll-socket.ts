import type { Server, Socket } from "socket.io";
import db from "../../../db/index.js";
import { pollsTable } from "../../../db/polls-schema.js";
import { responsesTable } from "../../../db/responses-schema.js";
import { responseAnswersTable } from "../../../db/response-answers-schema.js";
import getPollAnalysisService from "./services/get-poll-analysis-service.js";
import { publish, subscribe } from "../../../services/redis/redis.js";
import { eq, and } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface VotePayload {
  publicLink: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
}

export const registerPollSocket = (io: Server) => {
  // Join Room & Fetch Live Poll Data Handler
  const handleJoinPoll = async (socket: Socket, publicLink: string) => {
    // 1. Pre-validation of parameter format (zero-waste DB queries)
    if (!publicLink || !UUID_REGEX.test(publicLink)) {
      socket.emit("server:poll:error", {
        message: "Invalid poll link format",
        code: "INVALID_LINK_FORMAT",
      });
      return;
    }

    try {
      // 2. Fetch poll from DB
      const [poll] = await db
        .select({
          id: pollsTable.id,
          title: pollsTable.title,
          description: pollsTable.description,
          publicLink: pollsTable.publicLink,
          isActive: pollsTable.isActive,
          expiresAt: pollsTable.expiresAt,
          isAnonymousAllowed: pollsTable.isAnonymousAllowed,
        })
        .from(pollsTable)
        .where(eq(pollsTable.publicLink, publicLink))
        .limit(1);

      if (!poll) {
        socket.emit("server:poll:error", {
          message: "Poll not found",
          code: "NOT_FOUND",
        });
        return;
      }

      // 3. Active & Expiration Check
      if (!poll.isActive) {
        socket.emit("server:poll:error", {
          message: "This poll is currently inactive",
          code: "POLL_INACTIVE",
        });
        return;
      }

      if (new Date(poll.expiresAt).getTime() <= Date.now()) {
        socket.emit("server:poll:error", {
          message: "This poll has expired and is no longer accepting responses",
          code: "POLL_EXPIRED",
        });
        return;
      }

      // 4. Anonymous Authorization Check via socket.user (from authSocketMiddleware)
      const user = (socket as any).user;
      if (!poll.isAnonymousAllowed && !user?.isAuth) {
        socket.emit("server:poll:error", {
          message: "Authentication required: Anonymous voting is disabled for this poll. Please login.",
          code: "AUTH_REQUIRED",
        });
        return;
      }

      // 5. Join the socket rooms
      await socket.join(`poll:${publicLink}`);
      await socket.join(`poll:${poll.id}`);

      // 6. Send initial real-time poll results to the connecting socket
      const initialStats = await getPollAnalysisService({ pollId: poll.id });
      socket.emit("server:live:poll", initialStats);
      socket.emit("poll_results_updated", initialStats);
    } catch (error) {
      console.error("Socket poll join error:", error);
      socket.emit("server:poll:error", {
        message: "Failed to load live poll",
        code: "INTERNAL_ERROR",
      });
    }
  };

  // Vote Submission Handler
  const handleVote = async (socket: Socket, data: VotePayload) => {
    const { publicLink, answers } = data || {};
    if (!publicLink || !UUID_REGEX.test(publicLink)) {
      socket.emit("server:poll:error", { message: "Invalid poll link format" });
      return;
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      socket.emit("server:poll:error", { message: "At least one answer must be selected" });
      return;
    }

    try {
      const [poll] = await db
        .select({
          id: pollsTable.id,
          isActive: pollsTable.isActive,
          expiresAt: pollsTable.expiresAt,
          isAnonymousAllowed: pollsTable.isAnonymousAllowed,
        })
        .from(pollsTable)
        .where(eq(pollsTable.publicLink, publicLink))
        .limit(1);

      if (!poll || !poll.isActive || new Date(poll.expiresAt).getTime() <= Date.now()) {
        socket.emit("server:poll:error", { message: "This poll is closed or not available" });
        return;
      }

      const user = (socket as any).user;
      if (!poll.isAnonymousAllowed && !user?.isAuth) {
        socket.emit("server:poll:error", { message: "Login required to vote in this poll" });
        return;
      }

      // Duplicate vote check for authenticated user
      if (user?.userId) {
        const [existing] = await db
          .select({ id: responsesTable.id })
          .from(responsesTable)
          .where(
            and(
              eq(responsesTable.pollId, poll.id),
              eq(responsesTable.respondentId, user.userId)
            )
          )
          .limit(1);

        if (existing) {
          socket.emit("server:poll:error", { message: "You have already voted in this poll" });
          return;
        }
      }

      // Persist response & answers in PostgreSQL
      await db.transaction(async (trx) => {
        const [response] = await trx
          .insert(responsesTable)
          .values({
            pollId: poll.id,
            respondentId: user?.userId || null,
            isAnonymous: !user?.userId,
          })
          .returning({ id: responsesTable.id });

        if (response && answers.length > 0) {
          await trx.insert(responseAnswersTable).values(
            answers.map((a) => ({
              responseId: response.id,
              questionId: a.questionId,
              selectedOptionId: a.selectedOptionId,
            }))
          );
        }
      });

      // Recalculate statistics
      const updatedStats = await getPollAnalysisService({ pollId: poll.id });

      // Publish to Redis Pub/Sub for horizontal scaling
      await publish("poll_updates", {
        pollId: poll.id,
        publicLink,
        stats: updatedStats,
      });

      // Confirm to voter
      socket.emit("server:vote:success", { message: "Vote recorded successfully" });

      // Broadcast live results to all clients connected to this poll
      io.to(`poll:${publicLink}`).to(`poll:${poll.id}`).emit("poll_results_updated", updatedStats);
      io.to(`poll:${publicLink}`).to(`poll:${poll.id}`).emit("server:live:poll", updatedStats);
    } catch (err) {
      console.error("Socket vote error:", err);
      socket.emit("server:poll:error", { message: "Failed to record vote" });
    }
  };

  // Socket Connection Event Listener
  io.on("connection", (socket) => {
    // Both "client:live:poll" and "client:poll:join" supported
    socket.on("client:live:poll", (publicLink: string) => handleJoinPoll(socket, publicLink));
    socket.on("client:poll:join", (publicLink: string) => handleJoinPoll(socket, publicLink));

    // Both "client:poll:vote" and "client:poll:response" supported
    socket.on("client:poll:vote", (data: VotePayload) => handleVote(socket, data));
    socket.on("client:poll:response", (data: VotePayload) => handleVote(socket, data));

    // Leave Poll Room
    socket.on("client:poll:leave", async (publicLink: string) => {
      if (publicLink) {
        await socket.leave(`poll:${publicLink}`);
      }
    });
  });

  // Redis Pub/Sub Subscriber: Broadcasts updates across all server instances
  subscribe("poll_updates", (data: { pollId: string; publicLink?: string; stats: any }) => {
    if (data?.pollId) {
      io.to(`poll:${data.pollId}`).emit("poll_results_updated", data.stats);
      io.to(`poll:${data.pollId}`).emit("server:live:poll", data.stats);
    }
    if (data?.publicLink) {
      io.to(`poll:${data.publicLink}`).emit("poll_results_updated", data.stats);
      io.to(`poll:${data.publicLink}`).emit("server:live:poll", data.stats);
    }
  });
};
