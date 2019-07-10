/* eslint-disable no-useless-concat */
import { IMiddleware, IMiddlewareMeta } from "services/api";

export class LoggerMiddleware implements IMiddleware {
    async apply(meta: IMiddlewareMeta, response: Response): Promise<void> {
        console.log(
            "%c%s",
            "color:" + "#006DFF",
            `[${meta.method} ${meta.version}/${meta.path}]`,
            await response.clone().json()
        );
    }

    error<T>(meta: IMiddlewareMeta, reason: T): void {
        console.log(
            "%c%s",
            "color:" + "#F07178",
            `[${meta.method} ${meta.version}/${meta.path}]`,
            reason
        );
    }
}
