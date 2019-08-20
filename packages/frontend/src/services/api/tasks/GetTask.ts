import { ITask } from "@magnit/task-editor";
import { ICourier, IResponse } from "services/api";

export interface IGetTaskResponse extends IResponse {
    task: ITask;
}

export async function getTask(courier: ICourier, id: number) {
    return courier.get<IGetTaskResponse>(`tasks/${id}`);
}
