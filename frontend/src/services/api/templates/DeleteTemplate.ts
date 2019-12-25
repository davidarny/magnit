import { ICourier, IResponse } from "services/api";

export interface IDeleteTemplateResponse extends IResponse {}

export function deleteTemplate(courier: ICourier, id: number) {
    return courier.delete<IDeleteTemplateResponse>(`templates/${id}`);
}
