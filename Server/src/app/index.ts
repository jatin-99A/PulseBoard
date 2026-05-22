import express from 'express';

import errorHandlerMiddleware from '../common/middlewares/error-handler-middleware.js';
import authMiddleware from '../common/middlewares/auth-middleware.js';
import { catchAsync } from '../common/utils/catch-async-error.js';

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

  // Body parser
  app.use(express.json());

  // Middlewares
  app.use(express.json());
  app.use(catchAsync(authMiddleware));

  // Routes
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
  });

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
