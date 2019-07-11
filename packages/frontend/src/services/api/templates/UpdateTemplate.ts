import { ICourier, IResponse } from "services/api";

export async function updateTemplate(courier: ICourier, id: number, template: object) {
    return courier.put<IResponse>(`templates/${id}`, { template });
}
