import { IExtendedTask } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";

export interface IGetTaskExtendedResponse extends IResponse {
    task: IExtendedTask;
}

export async function getTaskExtended(courier: ICourier, id: number) {
    return courier.get<IGetTaskExtendedResponse>(`tasks/${id}/extended`);
}
