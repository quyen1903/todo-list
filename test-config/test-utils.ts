import { DataSource } from "typeorm";
import { Task } from "../src/entity/Task";
import { TaskDto } from "../src/types/task";
import { AppDataSource } from "../src/config/database";
import supertest from "supertest";
import { createApp } from "../src/app";

// Database utilities
export const createTestDataSource = async (): Promise<DataSource> => {
    const testDataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: [Task],
        synchronize: true,
        logging: false
    });

    await testDataSource.initialize();
    return testDataSource;
};

export const clearDatabase = async (): Promise<void> => {
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.clear();
    }
};

// Test data generators
export const createTestTask = async (dataSource: DataSource, taskData: Partial<TaskDto> = {}): Promise<Task> => {
    const repository = dataSource.getRepository(Task);
    const task = repository.create({
        name: "Test Task",
        startDate: "2024-01-01",
        endDate: "2024-01-10",
        ...taskData
    });
    return await repository.save(task);
};

// API test helpers
export const createTestServer = () => {
    const app = createApp();
    return supertest(app);
};

// Date utilities for testing
export const generateFutureDate = (daysFromNow: number = 1): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
};

export const generatePastDate = (daysAgo: number = 1): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

// Common test assertions
export const expectTaskProperties = (task: any) => {
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('name');
    expect(task).toHaveProperty('startDate');
    expect(task).toHaveProperty('endDate');
};

// Error response assertions
export const expectErrorResponse = (response: any, statusCode: number, errorMessage?: string) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('statusCode', statusCode);
    if (errorMessage) {
        expect(response.body.message).toContain(errorMessage);
    }
};

// Validation helpers
export const expectValidationError = (response: any, errorMessage: string) => {
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(errorMessage);
};

// Type guards for testing
export const isTask = (obj: any): obj is Task => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'name' in obj
    );
};
