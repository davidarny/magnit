import { ICourier, TMethod } from "./entities";
import { IMiddleware } from "./entities";
import _ from "lodash";

export class FetchCourier implements ICourier {
    constructor(
        private readonly host: string | undefined,
        private readonly version: string,
        private readonly middlewares?: IMiddleware[]
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

    private async send<T>(path: string, method: TMethod, body?: object) {
        try {
            const response = await this.fetch(path, method, body);
            const json = await response.clone().json();
            if (this.middlewares) {
                const responses = [];
                for (const middleware of this.middlewares) {
                    _.merge(json, ...responses);
                    const result = await middleware.apply(
                        { path, method, version: this.version },
                        json
                    );
                    responses.push(result);
                }
                _.merge(json, ...responses);
            }
            return json;
        } catch (error) {
            if (this.middlewares) {
                this.middlewares.forEach(async middleware =>
                    middleware.error({ path, method, version: this.version }, error)
                );
            }
            throw error;
        }
    }

    private async fetch(path: string, method: TMethod, body?: object): Promise<Response> {
        return fetch(`${this.host}/${this.version}/${path}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : null,
        });
    }
}
