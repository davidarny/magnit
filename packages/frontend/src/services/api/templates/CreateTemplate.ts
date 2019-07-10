import { ICourier, IResponse } from "services/api";

interface ICreateTemplateResponse extends IResponse {
    template_id: number;
}

export async function createTemplate(courier: ICourier, template: object) {
    return courier.post<ICreateTemplateResponse>("templates", { template });
}
