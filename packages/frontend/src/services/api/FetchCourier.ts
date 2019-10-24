import _ from "lodash";
import { IAuthObservable, IAuthObserver, ICourier, IMiddleware, TMethod } from "./entities";

export class FetchCourier implements ICourier, IAuthObservable, IAuthObserver {
    private observers = new Set<(observer: IAuthObserver) => Promise<void>>();

    constructor(
        private readonly host: string | undefined,
        private readonly version: string,
        private token: string,
        private readonly middlewares?: IMiddleware[],
    ) {
        if (!host) {
            throw new Error("Host cannot be null or undefined!");
        }
    }

    async post<T>(path: string, body?: object): Promise<T> {
        return this.send(path, "POST", body);
    }

    async get<T>(path: string): Promise<T> {
        return this.send(path, "GET");
    }

    async put<T>(path: string, body?: object): Promise<T> {
        return this.send(path, "PUT", body);
    }

    async delete<T>(path: string, body?: object): Promise<T> {
        return this.send(path, "DELETE", body);
    }

    async file(path: string): Promise<Response> {
        return this.fetch(path, "GET");
    }

    doOnTokenExpired(onTokenExpire: (observer: IAuthObserver) => Promise<void>): void {
        this.observers.add(onTokenExpire);
    }

    setToken(token: string): void {
        this.token = token;
    }

    private async send<T>(path: string, method: TMethod, body?: any) {
        try {
            if (this.middlewares && !(body instanceof FormData)) {
                for (const middleware of this.middlewares) {
                    const result = await middleware.request(
                        { path, method, version: this.version },
                        body,
                    );
                    if (result) {
                        body = _.merge({}, result);
                    }
                }
            }
            const response = await this.fetch(path, method, body);
            const json = await response.clone().json();
            if (this.middlewares) {
                const responses = [];
                for (const middleware of this.middlewares) {
                    _.merge(json, ...responses);
                    const result = await middleware.response(
                        { path, method, version: this.version },
                        json,
                    );
                    responses.push(result);
                }
                _.merge(json, ...responses);
            }
            return json;
        } catch (error) {
            if (this.middlewares) {
                this.middlewares.forEach(middleware =>
                    middleware.error({ path, method, version: this.version }, error),
                );
            }
            throw error;
        }
    }

    private async fetch(path: string, method: TMethod, body?: object): Promise<Response> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        if (this.token) {
            headers["X-Access-Token"] = this.token;
        }
        if (body instanceof FormData) {
            delete headers["Content-Type"];
        }
        const response = await fetch(`${this.host}/${this.version}/${path}`, {
            method,
            headers,
            body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
        });
        // retry if X-Access-Token has expired
        // 9 stands for InvalidTokenException
        const json = await response.clone().json();
        if (response.status === 401 && json && json.errorCode === 9) {
            for (const observer of this.observers) {
                await observer(this);
            }
            return this.fetch(path, method, body);
        }
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
    }
}
