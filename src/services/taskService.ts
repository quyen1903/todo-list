import { Repository } from "typeorm";
import { Task } from "../entity/Task";
import { AppDataSource } from "../config/database";
import { TaskDto, TaskResponse } from "../types/task";

export class TaskService {
    private taskRepository: Repository<Task>;

    constructor() {
        this.taskRepository = AppDataSource.getRepository(Task);
    }

    async getAllTasks(): Promise<TaskResponse[]> {
        const tasks = await this.taskRepository.find();
        return tasks.map(task => this.mapToResponse(task));
    }

    async getTaskById(id: number): Promise<TaskResponse | null> {
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) {
            return null;
        }
        return this.mapToResponse(task);
    }

    async createTask(taskDto: TaskDto): Promise<TaskResponse> {
        const task = this.taskRepository.create({
            name: taskDto.name,
            startDate: taskDto.startDate,
            endDate: taskDto.endDate
        });
        
        const savedTask = await this.taskRepository.save(task);
        return this.mapToResponse(savedTask);
    }

    async updateTask(id: number, taskDto: TaskDto): Promise<TaskResponse | null> {
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) {
            return null;
        }

        task.name = taskDto.name;
        task.startDate = taskDto.startDate;
        task.endDate = taskDto.endDate;

        const updatedTask = await this.taskRepository.save(task);
        return this.mapToResponse(updatedTask);
    }

    async deleteTask(id: number): Promise<boolean> {
        const result = await this.taskRepository.delete(id);
        return result.affected !== 0;
    }

    private mapToResponse(task: Task): TaskResponse {
        return {
            id: task.id,
            name: task.name,
            startDate: task.startDate,
            endDate: task.endDate
        };
    }
}
