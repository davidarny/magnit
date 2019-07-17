import { IMiddleware, IMiddlewareMeta } from "services/api";
import { traverse } from "@magnit/template-editor";
import _ from "lodash";
import { toCamelCase } from "services/string";

export class CamelCaseMiddleware implements IMiddleware {
    async apply(meta: IMiddlewareMeta, response: any): Promise<object> {
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
}
