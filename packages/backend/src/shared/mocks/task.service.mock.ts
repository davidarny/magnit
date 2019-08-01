import { Task } from "../../modules/tasks/entities/task.entity";
import { ITaskService } from "../interfaces/task.service.interface";

export class TaskServiceMock implements ITaskService {
    deleteById(id: string): Promise<any> {
        return undefined;
    }

    findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        status?: "in_progress" | "on_check" | "draft" | "completed",
        name?: string
    ): Promise<any> {
        return undefined;
    }

    findById(id: string): Promise<any> {
        return undefined;
    }

    save(task: Task): Promise<any> {
        return undefined;
    }
}
