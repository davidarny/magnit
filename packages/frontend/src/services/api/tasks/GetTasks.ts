import { IResponse, ICourier } from "services/api";
import { ETaskStatus } from "@magnit/services";

export interface IGetTasksResponse extends IResponse {
    total: number;
    tasks: Array<{
        id: number;
        name: string;
        objectId: string | null;
        userId: string | null;
        status: ETaskStatus;
        deadlineDate: string;
        departureDate: string;
        descriptions: string;
        templates: string[];
        updatedAt: string;
    }>;
}

export async function getTasks(courier: ICourier, status?: ETaskStatus) {
    return courier.get<IGetTasksResponse>(
        `tasks${status ? `?status=${status.replace(/-/g, "_")}` : ""}`
    );
}
