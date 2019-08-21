import { IMiddleware, IMiddlewareMeta } from "services/api";
import { traverse } from "@magnit/template-editor";
import _ from "lodash";
import { toCamelCase, toSnakeCase } from "services/string";

export class CamelCaseMiddleware implements IMiddleware {
    async response(meta: IMiddlewareMeta, response: any): Promise<object> {
        traverse(response, (object: any) => {
            if (_.isObject(object)) {
                _.mapKeys(object, (value: any, key: string) => {
                    delete (object as { [key: string]: any })[key];
                    (object as { [key: string]: any })[toCamelCase(key)] = value;
                });
            }
        });
        return response;
    }

    error<T>(meta: IMiddlewareMeta, reason: T): void {}

    async request(meta: IMiddlewareMeta, data: any): Promise<any> {
        const buffer = _.cloneDeep(data);
        // convert all props to snake_case before saving
        traverse(buffer, (object: any) => {
            if (_.isObject(object)) {
                _.mapKeys(object, (value: any, key: string) => {
                    delete (object as { [key: string]: any })[key];
                    (object as { [key: string]: any })[toSnakeCase(key)] = value;
                });
            }
        });
        return buffer;
    }
}
