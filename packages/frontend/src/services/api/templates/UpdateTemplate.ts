import { ICourier, IResponse } from "services/api";

export interface IUpdateTemplateResponse extends IResponse {}

export async function updateTemplate(courier: ICourier, id: number, template: object) {
    return courier.put<IUpdateTemplateResponse>(`templates/${id}`, { template });
}
