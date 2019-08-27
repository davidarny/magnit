import { ETaskStatus, Task } from "../entities/task.entity";

export interface ITaskService {
    findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        status?: ETaskStatus,
        statuses?: ETaskStatus[],
        title?: string,
    ): Promise<Task[]>;

    insert(task: Task): Promise<Task>;

    update(id: string, task: Task): Promise<Task>;

    findById(id: string, relations?: string[]): Promise<Task>;

    deleteById(id: string): Promise<void>;

    setTaskAnswers(
        ids: string[],
        files: Express.Multer.File[],
        body: { [key: string]: string },
    ): Promise<void>;

    getDescriptionByTransition(prevStatus: ETaskStatus, nextStatus: ETaskStatus): string;
}
