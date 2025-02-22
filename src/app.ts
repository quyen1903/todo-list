import express, { Application, Request, Response } from "express";
import cors from "cors";    
import { errorHandler } from "./middleware/errorHandler";
import taskRoutes from "./routes/taskRoutes";

export const createApp = (): Application => {
    const app: Application = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
        
    // Routes
    app.use("/api/tasks", taskRoutes);
    
    // Base route
    app.get("/", (req: Request, res: Response) => {
        res.json({ message: "Todo API is running" });
    });

    // Error handling middleware
    app.use(errorHandler);

    return app;
};
