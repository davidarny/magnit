export interface ITokenManager<T> {
    encode(payload: T): string;

    decode(token: string): T;
}
