import { ETaskStatus } from "@magnit/services";
import { IBaseTask } from "@magnit/task-editor";
import { ICourier, IResponse } from "services/api";

export interface IGetTasksResponse extends IResponse {
    total: number;
    tasks: IBaseTask[];
}

export async function getTasks(courier: ICourier, status?: ETaskStatus) {
    return courier.get<IGetTasksResponse>(
        `tasks${status ? `?status=${status.replace(/-/g, "_")}` : ""}`,
    );
}
