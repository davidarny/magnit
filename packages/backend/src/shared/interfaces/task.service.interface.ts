import { Task, TTaskStatus } from "../../modules/tasks/entities/task.entity";

export interface ITaskService {
    findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        status?: TTaskStatus,
        name?: string
    ): Promise<any>;

    save(task: Task): Promise<any>;

    findById(id: string): Promise<any>;

    deleteById(id: string): Promise<any>;
}
