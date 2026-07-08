import express from 'express';
import cors from 'cors';
import env from '../config/env.js';
import errorHandlerMiddleware from '../common/middlewares/error-handler-middleware.js';
import authMiddleware from '../common/middlewares/auth-middleware.js';
import { catchAsync } from '../common/utils/catch-async-error.js';
import authRoutes from './modules/auth/auth-routes.js';
import pollRoutes from './modules/polls/poll-routes.js';
import cookieParser from "cookie-parser";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        isAuth: boolean;
        userId: string | null;
      };
    }
  }
}

// Function to setup the Express app
export function setupApp() {
  const app: express.Application = express();

  const allowedOrigins = env.ALLOWED_ORIGINS.split(",");

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
    })
  );

  // Body parser
  app.use(express.json());
  app.use(cookieParser());

  // Middlewares
  app.use(catchAsync(authMiddleware));

  // Routes
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/polls', pollRoutes);

  // Default
  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  // Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
