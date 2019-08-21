import { ICourier, IResponse } from "services/api";

export interface IUpdateTemplatesToTaskResponse extends IResponse {}

export async function updateTemplateAssignment(
    courier: ICourier,
    taskId: number,
    templateId: number,
    body: { editable: boolean },
) {
    return courier.put<IUpdateTemplatesToTaskResponse>(
        `tasks/${taskId}/templates/${templateId}`,
        body,
    );
}
