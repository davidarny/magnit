import { ICourier, TMethod } from "./entities";
import { IMiddleware } from "./entities";

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
        const response = await this.send(path, "POST", body);
        return response.json();
    }

    async get<T>(path: string): Promise<T> {
        const response = await this.send(path, "GET");
        return response.json();
    }

    async put<T>(path: string, body?: object): Promise<T> {
        const response = await this.send(path, "PUT", body);
        return response.json();
    }

    async delete<T>(path: string, body?: object): Promise<T> {
        const response = await this.send(path, "DELETE", body);
        return response.json();
    }

    private async send<T>(path: string, method: TMethod, body?: object) {
        try {
            const response = await this.fetch(path, method, body);
            if (this.middlewares) {
                await Promise.all(
                    this.middlewares.map(async middleware =>
                        middleware.apply({ path, method, version: this.version }, response)
                    )
                );
            }
            return response;
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
