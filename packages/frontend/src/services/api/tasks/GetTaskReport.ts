import { ICourier, IResponse } from "services/api";

export enum EReportStatuses {
    IN_PROGRESS = "in_progress",
    ON_CHECK = "on_check",
    DRAFT = "draft",
    COMPLETED = "completed",
}

export interface IReportStageTemplate {
    id: number;
    createdAt: string;
    updatedAt: string;
    version: number;
    title: string;
}

export interface IReportStageResponse {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    finished: boolean;
    dueDate: string;
    templates: IReportStageTemplate[];
}

export interface IReportResponse {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    status: EReportStatuses;
    stages: IReportStageResponse[];
}

export interface IGetTaskReportResponse extends IResponse {
    report: IReportResponse;
}

export async function getTaskReport(courier: ICourier, id: number) {
    return courier.get<IGetTaskReportResponse>(`tasks/${id}/report`);
}
