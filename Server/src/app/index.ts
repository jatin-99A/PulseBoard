import express from 'express';
import errorHandlerMiddleware from '../common/middlewares/error-handler-middleware';


export function setupApp() {
    const app: express.Application = express();

    // Middleware
    app.use(express.json());

    // Routes
    app.get("/", (req, res) => {
        res.status(200).json({ status: "OK", message: "Server is running" });
    });

    // Default
    app.use((req, res) => {
        res.status(404).json({
            message: "Route not found",
        });
    });

    // Error Handler
    app.use(errorHandlerMiddleware);

    return app;
}