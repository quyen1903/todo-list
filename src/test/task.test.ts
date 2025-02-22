import request from "supertest";
import { createApp } from "../app";
import { AppDataSource } from "../config/database";
import { Application } from "express";

describe("Task API", () => {
    let app: Application;
    
    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        app = createApp();
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy(); // Properly close connection
        }
    });

    beforeEach(async () => {
        // Clear the database before each test
        const entities = AppDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = AppDataSource.getRepository(entity.name);
            await repository.clear();
        }
    });

    describe("POST /api/tasks", () => {
        it("should create a new task with valid data", async () => {
            const task = {
                name: "Test Task",
                startDate: "2025-01-01",
                endDate: "2025-01-10"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(201);

            expect(response.body).toHaveProperty("id");
            expect(response.body.name).toBe(task.name);
            expect(response.body.startDate).toBe(task.startDate);
            expect(response.body.endDate).toBe(task.endDate);
        });

        it("should create a task with only a name", async () => {
            const task = {
                name: "Task without dates"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(201);

            expect(response.body).toHaveProperty("id");
            expect(response.body.name).toBe(task.name);
            expect(response.body.startDate).toBeUndefined();
            expect(response.body.endDate).toBeUndefined();
        });

        it("should create a task with only a startDate", async () => {
            const task = {
                name: "Task with start date only",
                startDate: "2025-01-01"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(201);

            expect(response.body).toHaveProperty("id");
            expect(response.body.name).toBe(task.name);
            expect(response.body.startDate).toBe(task.startDate);
            expect(response.body.endDate).toBeUndefined();
        });

        it("should reject a task with empty name", async () => {
            const task = {
                name: "",
                startDate: "2025-01-01"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(400);

            expect(response.body.errors).toContain("Task name is required");
        });

        it("should reject a task with name longer than 80 characters", async () => {
            const task = {
                name: "A".repeat(81),
                startDate: "2025-01-01"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(400);

            expect(response.body.errors).toContain("Task name cannot exceed 80 characters");
        });

        it("should reject a task with end date but no start date", async () => {
            const task = {
                name: "Invalid Task",
                endDate: "2025-01-10"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(400);

            expect(response.body.errors).toContain("Start date is required when end date is provided");
        });

        it("should reject a task with invalid date format", async () => {
            const task = {
                name: "Invalid Date Format",
                startDate: "01/01/2025"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(400);

            expect(response.body.errors).toContain("Start date must be in YYYY-MM-DD format");
        });

        it("should reject a task with end date before start date", async () => {
            const task = {
                name: "Invalid Date Range",
                startDate: "2025-01-10",
                endDate: "2025-01-01"
            };

            const response = await request(app)
                .post("/api/tasks")
                .send(task)
                .expect(400);

            expect(response.body.errors).toContain("End date must be after start date");
        });
    });

    describe("GET /api/tasks", () => {
        it("should return an empty array when no tasks exist", async () => {
            const response = await request(app)
                .get("/api/tasks")
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it("should return all tasks", async () => {
            // Create some test tasks
            await request(app)
                .post("/api/tasks")
                .send({ name: "Task 1", startDate: "2025-01-01", endDate: "2025-01-10" });
                
            await request(app)
                .post("/api/tasks")
                .send({ name: "Task 2", startDate: "2025-02-01", endDate: "2025-02-10" });

            const response = await request(app)
                .get("/api/tasks")
                .expect(200);

            expect(response.body.length).toBe(2);
            expect(response.body[0].name).toBe("Task 1");
            expect(response.body[1].name).toBe("Task 2");
        });
    });

    describe("GET /api/tasks/:id", () => {
        it("should return a task by ID", async () => {
            // Create a test task
            const createResponse = await request(app)
                .post("/api/tasks")
                .send({ name: "Get Task Test", startDate: "2025-01-01" });

            const taskId = createResponse.body.id;

            const response = await request(app)
                .get(`/api/tasks/${taskId}`)
                .expect(200);

            expect(response.body.id).toBe(taskId);
            expect(response.body.name).toBe("Get Task Test");
            expect(response.body.startDate).toBe("2025-01-01");
        });

        it("should return 404 for non-existent task ID", async () => {
            await request(app)
                .get("/api/tasks/999")
                .expect(404);
        });

        it("should handle invalid ID parameter", async () => {
            await request(app)
                .get("/api/tasks/invalid-id")
                .expect(404);
        });
    });

    describe("PUT /api/tasks/:id", () => {
        it("should update an existing task", async () => {
            // Create a test task
            const createResponse = await request(app)
                .post("/api/tasks")
                .send({ name: "Original Task", startDate: "2025-01-01" });

            const taskId = createResponse.body.id;

            // Update the task
            const updatedTask = {
                name: "Updated Task",
                startDate: "2025-02-01",
                endDate: "2025-02-15"
            };

            const response = await request(app)
                .put(`/api/tasks/${taskId}`)
                .send(updatedTask)
                .expect(200);

            expect(response.body.id).toBe(taskId);
            expect(response.body.name).toBe(updatedTask.name);
            expect(response.body.startDate).toBe(updatedTask.startDate);
            expect(response.body.endDate).toBe(updatedTask.endDate);
        });

        it("should return 404 when updating non-existent task", async () => {
            const updatedTask = {
                name: "This Task Doesn't Exist",
                startDate: "2025-01-01"
            };

            await request(app)
                .put("/api/tasks/999")
                .send(updatedTask)
                .expect(404);
        });

        it("should reject updates with invalid data", async () => {
            // Create a test task
            const createResponse = await request(app)
                .post("/api/tasks")
                .send({ name: "Task to Update", startDate: "2025-01-01" });

            const taskId = createResponse.body.id;

            // Try to update with invalid data
            const invalidUpdate = {
                name: "",
                startDate: "2025-01-01"
            };

            const response = await request(app)
                .put(`/api/tasks/${taskId}`)
                .send(invalidUpdate)
                .expect(400);

            expect(response.body.errors).toContain("Task name is required");
        });
    });

    describe("DELETE /api/tasks/:id", () => {
        it("should delete an existing task", async () => {
            // Create a test task
            const createResponse = await request(app)
                .post("/api/tasks")
                .send({ name: "Task to Delete", startDate: "2025-01-01" });

            const taskId = createResponse.body.id;

            // Delete the task
            await request(app)
                .delete(`/api/tasks/${taskId}`)
                .expect(204);

            // Verify task is deleted
            await request(app)
                .get(`/api/tasks/${taskId}`)
                .expect(404);
        });

        it("should return 404 when deleting non-existent task", async () => {
            await request(app)
                .delete("/api/tasks/999")
                .expect(404);
        });
    });
});