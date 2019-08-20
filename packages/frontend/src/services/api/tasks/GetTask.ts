import { IResponse, ICourier } from "services/api";
import { ETaskStatus } from "@magnit/services";

export interface IGetTaskResponse extends IResponse {
    task: {
        id: number;
        name: string;
        status: ETaskStatus;
        descriptions: string;
        templates: string[];
        updatedAt: string;
        createdAt: string;
    };
}

export async function getTask(courier: ICourier, id: number) {
    return courier.get<IGetTaskResponse>(`tasks/${id}`);
}
