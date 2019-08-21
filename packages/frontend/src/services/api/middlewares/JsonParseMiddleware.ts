import { IMiddleware, IMiddlewareMeta } from "services/api";
import { traverse } from "@magnit/template-editor";
import _ from "lodash";

export class JsonParseMiddleware implements IMiddleware {
    async response(meta: IMiddlewareMeta, response: any): Promise<object> {
        traverse(response, (object: any) => {
            if (_.isObject(object)) {
                _.mapKeys(object, (value: any, key: string) => {
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

    async request(meta: IMiddlewareMeta, data: any): Promise<any> {}
}
