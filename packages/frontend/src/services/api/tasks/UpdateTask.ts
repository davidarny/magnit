import { ICourier, IResponse } from "services/api";

export interface IUpdateTaskResponse extends IResponse {}

export async function updateTask(courier: ICourier, id: number, task: object) {
    return courier.put<IUpdateTaskResponse>(`tasks/${id}`, { task });
}
