import { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { validateTask } from "../validation/taskValidation";
import { TaskDto } from "../types/task";
import { NotFoundError, ValidationError, asyncHandler } from "../middleware/errorHandler";

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    getAllTasks = asyncHandler(async (req: Request, res: Response) => {
        const tasks = await this.taskService.getAllTasks();
        res.status(200).json(tasks);
    });

    getTaskById = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        
        const task = await this.taskService.getTaskById(id);
        if (!task) {
            throw new NotFoundError(`Task with id ${id} not found`);
        }
        
        res.status(200).json(task);
    });

    createTask = asyncHandler(async (req: Request, res: Response) => {
        const taskDto: TaskDto = req.body;
        
        const validationResult = validateTask(taskDto);
        if (!validationResult.isValid) {
            throw new ValidationError("Invalid task data", validationResult.errors);
        }
        
        const newTask = await this.taskService.createTask(taskDto);
        res.status(201).json(newTask);
    });

    updateTask = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        const taskDto: TaskDto = req.body;
        
        const validationResult = validateTask(taskDto);
        if (!validationResult.isValid) {
            throw new ValidationError("Invalid task data", validationResult.errors);
        }
        
        const updatedTask = await this.taskService.updateTask(id, taskDto);
        if (!updatedTask) {
            throw new NotFoundError(`Task with id ${id} not found`);
        }
        
        res.status(200).json(updatedTask);
    });

    deleteTask = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        
        const deleted = await this.taskService.deleteTask(id);
        if (!deleted) {
            throw new NotFoundError(`Task with id ${id} not found`);
        }
        
        res.status(204).send();
    });
}
