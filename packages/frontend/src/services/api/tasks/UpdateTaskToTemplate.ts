import { ICourier, IResponse } from "services/api";

export interface IUpdateTemplatesToTaskResponse extends IResponse {}

export async function updateTaskToTemplate(
    courier: ICourier,
    taskId: number,
    templateId: number,
    editable: boolean,
) {
    return courier.put<IUpdateTemplatesToTaskResponse>(`tasks/${taskId}/templates/${templateId}`, {
        editable,
    });
}
