import { Task } from "../../modules/tasks/entities/task.entity";
import { ITaskService } from "../interfaces/task.service.interface";

export class TaskServiceMock implements ITaskService {
    async deleteById(id: string): Promise<any> {}

    async findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        status?: "in_progress" | "on_check" | "draft" | "completed",
        name?: string,
    ): Promise<any> {}

    async findById(id: string): Promise<any> {}

    async save(task: Task): Promise<any> {}
}
