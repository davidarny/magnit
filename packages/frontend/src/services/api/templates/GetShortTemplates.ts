import { ITemplate } from "@magnit/entities";
import { ICourier, IResponse } from "services/api";
import { toSnakeCase } from "services/string";

export type TShortTemplate = Omit<ITemplate, "sections">;

export interface IGetShortTemplatesResponse extends IResponse {
    total: number;
    all: number;
    templates: TShortTemplate[];
}

export type TShortTemplateSortKeys = keyof TShortTemplate | "";

export async function getShortTemplates(
    courier: ICourier,
    title?: string,
    sort?: "ASC" | "DESC",
    sortBy?: TShortTemplateSortKeys,
) {
    const query = {
        limit: `?limit=${Number.MAX_SAFE_INTEGER}`,
        title: `${title ? `&title=${title}` : ""}`,
        sort: `${sort ? `&sort=${sort}` : ""}`,
        sortBy: `${sortBy ? `&sortBy=${toSnakeCase(sortBy)}` : ""}`,
    };
    return courier.get<IGetShortTemplatesResponse>(
        `templates${query.limit}${query.title}${query.sortBy}${query.sort}`,
    );
}
