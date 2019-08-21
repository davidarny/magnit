import { ICourier, IResponse } from "services/api";

export interface IAddTemplatesToTaskResponse extends IResponse {}

export async function addTemplateAssignment(courier: ICourier, id: number, templates: number[]) {
    return courier.post<IAddTemplatesToTaskResponse>(`tasks/${id}/templates`, { templates });
}
