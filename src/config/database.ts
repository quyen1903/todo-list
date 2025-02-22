import { DataSource } from "typeorm";
import { Task } from "../entity/Task";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./data/database.sqlite",
    entities: [Task],
    synchronize: true,
    logging: false
});

export const initializeDatabase = async (): Promise<void> => {
    if (AppDataSource.isInitialized) return;    
    try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
};
