import { Task, TTaskStatus } from "../entities/task.entity";

export interface ITaskService {
    findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        status?: TTaskStatus,
        statuses?: TTaskStatus[],
        title?: string,
    ): Promise<Task[]>;

    insert(task: Task): Promise<Task>;

    update(id: string, task: Task): Promise<Task>;

    findById(id: string, relations?: string[]): Promise<Task>;

    deleteById(id: string): Promise<void>;
}
