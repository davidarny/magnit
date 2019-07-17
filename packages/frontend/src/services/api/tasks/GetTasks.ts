import { IResponse, ICourier } from "services/api";
import { ETaskStatus } from "containers/tasks";

interface IGetTasksResponse extends IResponse {
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
        updatedAt: string;
    }>;
}

export async function getTasks(courier: ICourier) {
    return courier.get<IGetTasksResponse>("tasks");
}
