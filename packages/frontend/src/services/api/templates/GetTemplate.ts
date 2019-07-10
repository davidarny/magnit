import { IResponse, ICourier } from "services/api";

interface IGetTemplate extends IResponse {
    template: string;
}

export async function getTemplate(courier: ICourier, id: number) {
    return courier.get<IGetTemplate>(`templates/${id}`);
}
