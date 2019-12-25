import { IMiddleware, IMiddlewareMeta } from "services/api";
import { traverse } from "@magnit/template-editor";
import _ from "lodash";
import { toCamelCase, toSnakeCase } from "services/string";

export class CamelCaseMiddleware implements IMiddleware {
    async response(meta: IMiddlewareMeta, response: any): Promise<object> {
        traverse(response, object => {
            if (!(typeof object === "object" && object !== null)) {
                return;
            }
            for (const key of Object.keys(object)) {
                const value = object[key];
                delete object[key];
                object[toCamelCase(key)] = value;
            }
        });
        return response;
    }

    error<T>(meta: IMiddlewareMeta, reason: T): void {}

    async request(meta: IMiddlewareMeta, data: any): Promise<any> {
        const buffer = _.cloneDeep(data);
        // convert all props to snake_case before saving
        traverse(buffer, object => {
            if (!(typeof object === "object" && object !== null)) {
                return;
            }
            for (const key of Object.keys(object)) {
                const value = object[key];
                delete object[key];
                object[toSnakeCase(key)] = value;
            }
        });
        return buffer;
    }
}
