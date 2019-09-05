import _ from "lodash";
import { ICourier, IMiddleware, TMethod } from "./entities";

export class FetchCourier implements ICourier {
    constructor(
        private readonly host: string | undefined,
        private readonly version: string,
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

    private async send<T>(path: string, method: TMethod, body?: any) {
        try {
            if (this.middlewares) {
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
        const base64user = `${process.env.REACT_APP_AIRWATCH_USER}:${process.env.REACT_APP_AIRWATCH_PASSWORD}`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(base64user)}`,
        };
        if (body instanceof FormData) {
            delete headers["Content-Type"];
        }
        const response = await fetch(`${this.host}/${this.version}/${path}`, {
            method,
            headers,
            body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
    }
}
