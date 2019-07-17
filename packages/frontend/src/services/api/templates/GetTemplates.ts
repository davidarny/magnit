import { ICourier, IResponse } from "services/api";

interface IGetTemplatesResponse extends IResponse {
    total: number;
    templates: Array<{
        id: number;
        title: string;
        description: string;
        assigned: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
}

export async function getTemplates(courier: ICourier) {
    return courier.get<IGetTemplatesResponse>("templates");
}
