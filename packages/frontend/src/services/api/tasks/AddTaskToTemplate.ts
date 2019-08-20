import { ICourier, IResponse } from "services/api";

export interface IAddTemplatesToTaskResponse extends IResponse {}

export async function addTaskToTemplate(courier: ICourier, id: number, templates: number[]) {
    return courier.put<IAddTemplatesToTaskResponse>(`tasks/${id}/templates`, { templates });
}
