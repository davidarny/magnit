import { ITemplate } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";
import { toSnakeCase } from "services/string";

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

export type TTemplateSortKeys = keyof ITemplate | "";

export async function getTemplates(
    courier: ICourier,
    title?: string,
    sort?: "ASC" | "DESC",
    sortBy?: TTemplateSortKeys,
) {
    const query = {
        limit: `?limit=${Number.MAX_SAFE_INTEGER}`,
        title: `${title ? `&title=${title}` : ""}`,
        sort: `${sort ? `&sort=${sort}` : ""}`,
        sortBy: `${sortBy ? `&sortBy=${toSnakeCase(sortBy)}` : ""}`,
    };
    return courier.get<IGetTemplatesResponse>(
        `templates${query.limit}${query.title}${query.sortBy}${query.sort}`,
    );
}
