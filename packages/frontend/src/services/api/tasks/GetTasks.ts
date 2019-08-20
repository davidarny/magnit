import { IResponse, ICourier } from "services/api";
import { ETaskStatus } from "@magnit/services";

export interface IGetTasksResponse extends IResponse {
    total: number;
    tasks: Array<{
        id: number;
        name: string;
        status: ETaskStatus;
        descriptions: string;
        updatedAt: string;
        createdAt: string;
    }>;
}

export async function getTasks(courier: ICourier, status?: ETaskStatus) {
    return courier.get<IGetTasksResponse>(
        `tasks${status ? `?status=${status.replace(/-/g, "_")}` : ""}`,
    );
}
