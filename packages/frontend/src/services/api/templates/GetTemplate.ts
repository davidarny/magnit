import { ITemplate } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";

export interface IGetTemplate extends IResponse {
    template: ITemplate;
}

export async function getTemplate(courier: ICourier, id: number) {
    return courier.get<IGetTemplate>(`templates/${id}`);
}
