import { ICourier, IResponse } from "services/api";

export interface IHistoryResponse {
    id: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface IStageResponse {
    id: number;
    title: string;
    finished: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    history: IHistoryResponse[];
}

export interface IGetStagesWithFullHistoryResponse extends IResponse {
    stages: IStageResponse[];
}

export async function getStagesWithFullHistory(courier: ICourier, id: number) {
    return courier.get<IGetStagesWithFullHistoryResponse>(`tasks/${id}/stages/history/full`);
}
