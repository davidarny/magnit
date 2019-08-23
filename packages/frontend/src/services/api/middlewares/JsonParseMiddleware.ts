import { IMiddleware, IMiddlewareMeta } from "services/api";
import { traverse } from "@magnit/template-editor";

export class JsonParseMiddleware implements IMiddleware {
    async response(meta: IMiddlewareMeta, response: any): Promise<object> {
        traverse(response, object => {
            if (!(typeof object === "object" && object !== null)) {
                return;
            }
            for (const key of Object.keys(object)) {
                const value = object[key];
                if (this.hasJsonStructure(value)) {
                    object[key] = JSON.parse(value);
                }
            }
        });
        return response;
    }

    error<T>(meta: IMiddlewareMeta, reason: T): void {}

    async request(meta: IMiddlewareMeta, data: any): Promise<any> {}

    private hasJsonStructure(string: string) {
        try {
            const result = JSON.parse(string);
            const type = Object.prototype.toString.call(result);
            return type === "[object Object]" || type === "[object Array]";
        } catch {
            return false;
        }
    }
}
