export type TMethod = "POST" | "GET" | "PUT" | "DELETE";

export interface ICourier {
    post<T>(path: string, body?: object): Promise<T>;

    get<T>(path: string): Promise<T>;

    put<T>(path: string, body?: object): Promise<T>;

    delete<T>(path: string, body?: object): Promise<T>;
}
