import { ETaskStatus, IBaseTask } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";
import { toSnakeCase } from "services/string";

export interface IGetTasksResponse extends IResponse {
    total: number;
    tasks: IBaseTask[];
}

export async function getTasks(
    courier: ICourier,
    status?: ETaskStatus,
    sort?: "ASC" | "DESC",
    sortBy?: keyof IBaseTask,
    title?: string,
) {
    const query = {
        limit: `?limit=${Number.MAX_SAFE_INTEGER}`,
        status: `${status ? `&status=${toSnakeCase(status)}` : ""}`,
        sort: `${sort ? `&sort=${sort}` : ""}`,
        sortBy: `${sortBy ? `&sortBy=${toSnakeCase(sortBy)}` : ""}`,
        title: `${title ? `&title=${title}` : ""}`,
    };
    return courier.get<IGetTasksResponse>(
        `tasks${query.limit}${query.status}${query.sort}${query.sortBy}${query.title}`,
    );
}
