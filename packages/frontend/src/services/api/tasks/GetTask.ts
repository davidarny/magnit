import { IResponse, ICourier } from "services/api";
import { ETaskStatus } from "@magnit/services";

export interface IGetTaskResponse extends IResponse {
    task: {
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
    };
}

export async function getTask(courier: ICourier, id: number) {
    return courier.get<IGetTaskResponse>(`tasks/${id}`);
}
