export type TMethod = "POST" | "GET" | "PUT" | "DELETE";

export interface ICourier {
    post<T>(path: string, body?: object): Promise<T>;

    get<T>(path: string): Promise<T>;

    file(path: string): Promise<Response>;

    put<T>(path: string, body?: object): Promise<T>;

    delete<T>(path: string, body?: object): Promise<T>;
}
