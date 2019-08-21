/* eslint-disable no-useless-concat */
import { IMiddleware, IMiddlewareMeta } from "services/api";

export class LoggerMiddleware implements IMiddleware {
    async response(meta: IMiddlewareMeta, response: any): Promise<void> {
        console.log(
            "%c%s",
            "color:" + "#006DFF",
            `[${meta.method} ${meta.version}/${meta.path}]`,
            response,
        );
    }

    error<T>(meta: IMiddlewareMeta, reason: T): void {
        console.log(
            "%c%s",
            "color:" + "#F07178",
            `[${meta.method} ${meta.version}/${meta.path}]`,
            reason,
        );
    }

    async request(meta: IMiddlewareMeta, data: any): Promise<any> {}
}
