import { IStageStep } from "@magnit/task-editor";
import { ICourier, IResponse } from "services/api";

export interface IAddStagesResponse extends IResponse {}

export async function addStages(courier: ICourier, id: number, stages: IStageStep[]) {
    return courier.post<IAddStagesResponse>(`tasks/${id}/stages`, { stages });
}
