import { ETaskStatus, IBaseTask } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";
import { toSnakeCase } from "services/string";

export interface IExtendedTask extends IBaseTask {
    // marketplace
    address: string | null;
    city: string | null;
    format: string | null;
    region: string | null;
    // stage
    stageTitle: string | null;
    deadline: string | null;
}

export interface IGetTasksExtendedResponse extends IResponse {
    total: number;
    all: number;
    tasks: IExtendedTask[];
}

export type TExtendedTaskSortKeys = keyof IExtendedTask | "";

export async function getTasksExtended(
    courier: ICourier,
    status?: ETaskStatus,
    sort?: "ASC" | "DESC",
    sortBy?: TExtendedTaskSortKeys,
    title?: string,
    region?: string,
    city?: string,
) {
    const query = {
        limit: `?limit=${Number.MAX_SAFE_INTEGER}`,
        status: `${status ? `&status=${toSnakeCase(status)}` : ""}`,
        sort: `${sort ? `&sort=${sort}` : ""}`,
        sortBy: `${sortBy ? `&sortBy=${toSnakeCase(sortBy)}` : ""}`,
        title: `${title ? `&title=${title}` : ""}`,
        region: `${region ? `&region=${region}` : ""}`,
        city: `${city ? `&city=${city}` : ""}`,
    };
    return courier.get<IGetTasksExtendedResponse>(
        `tasks/extended${query.limit}${query.status}${query.sort}${query.sortBy}${query.title}${query.region}${query.city}`,
    );
}
