import { IResponse, ICourier } from "services/api";
import { IBaseTask } from "@magnit/task-editor";
import { ETaskStatus } from "@magnit/services";

export interface ICreateTaskResponse extends IResponse {
    taskId: string;
}

export async function createTask(courier: ICourier, task: IBaseTask) {
    return courier.post<ICreateTaskResponse>("tasks", {
        task: {
            id: task.id,
            name: task.title,
            status: ETaskStatus.DRAFT,
        },
    });
}
