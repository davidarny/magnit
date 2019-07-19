import { IResponse, ICourier } from "services/api";
import { ITask } from "@magnit/task-editor";
import { ETaskStatus } from "@magnit/services";

export interface ICreateTaskResponse extends IResponse {
    taskId: string;
}

export async function createTask(courier: ICourier, task: Partial<ITask>) {
    return courier.post<ICreateTaskResponse>("tasks", {
        task: {
            id: task.id,
            name: task.title,
            status: ETaskStatus.DRAFT,
        },
    });
}
