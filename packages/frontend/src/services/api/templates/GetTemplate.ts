import { ITemplate } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";

export interface IGetTemplateResponse extends IResponse {
    template: ITemplate;
}

export async function getTemplate(courier: ICourier, id: number) {
    return courier.get<IGetTemplateResponse>(`templates/${id}`);
}
