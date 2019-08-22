import { ETaskStatus } from "@magnit/services";
import { IBaseTask } from "@magnit/task-editor";
import { ICourier, IResponse } from "services/api";

export interface IGetTasksResponse extends IResponse {
    total: number;
    tasks: IBaseTask[];
}

export async function getTasks(courier: ICourier, status?: ETaskStatus) {
    const query = {
        limit: `?limit=${Number.MAX_SAFE_INTEGER}`,
        status: `${status ? `&status=${status}` : ""}`,
    };
    return courier.get<IGetTasksResponse>(`tasks${query.limit}${query.status}`);
}
