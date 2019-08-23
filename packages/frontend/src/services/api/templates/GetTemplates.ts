import { ICourier, IResponse } from "services/api";

export interface ITemplateResponse {
    id: number;
    title: string;
    description: string;
    assigned: boolean;
    createdAt: string;
    updatedAt: string;
    editable: boolean;
}

export interface IGetTemplatesResponse extends IResponse {
    total: number;
    templates: ITemplateResponse[];
}

export async function getTemplates(courier: ICourier) {
    const query = {
        limit: `?limit=${Number.MAX_SAFE_INTEGER}`,
    };
    return courier.get<IGetTemplatesResponse>(`templates${query.limit}`);
}
