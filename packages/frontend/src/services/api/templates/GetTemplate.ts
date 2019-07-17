import { ICourier, IResponse } from "services/api";

interface IGetTemplate extends IResponse {
    template: object;
}

export async function getTemplate(courier: ICourier, id: number) {
    return courier.get<IGetTemplate>(`templates/${id}`);
}
