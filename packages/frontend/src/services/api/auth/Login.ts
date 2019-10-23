import { ICourier, IResponse } from "../entities";

export interface ILoginResponse extends IResponse {
    token: string;
}

export function login(courier: ICourier, username: string, password: string) {
    return courier.post<ILoginResponse>("auth/login", { username, password });
}
