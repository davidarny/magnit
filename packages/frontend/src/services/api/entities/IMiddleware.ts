import { TMethod } from "./ICourier";

export interface IMiddlewareMeta {
    method: TMethod;
    version: string;
    path: string;
}

export interface IMiddleware {
    apply(meta: IMiddlewareMeta, response: Response): Promise<void>;

    error<T>(meta: IMiddlewareMeta, reason: T): void;
}
