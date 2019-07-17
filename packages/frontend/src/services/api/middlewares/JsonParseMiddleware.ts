import { IMiddleware, IMiddlewareMeta } from "services/api";
import { traverse } from "@magnit/template-editor";
import _ from "lodash";

export class JsonParseMiddleware implements IMiddleware {
    async apply(meta: IMiddlewareMeta, response: any): Promise<object> {
        traverse(response, (object: any) => {
            if (_.isObject(object)) {
                _.mapKeys(object, (value: any, key: string) => {
                    // delete (object as { [key: string]: any })[key];
                    // (object as { [key: string]: any })[toCamelCase(key)] = value;
                    if (_.isString(value)) {
                        try {
                            (object as { [key: string]: any })[key] = JSON.parse(value);
                        } catch {}
                    }
                });
            }
        });
        return response;
    }

    error<T>(meta: IMiddlewareMeta, reason: T): void {}
}
