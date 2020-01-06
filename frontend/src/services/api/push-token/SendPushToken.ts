import { ICourier, IResponse } from "../entities";

export interface IPushTokenResponse extends IResponse {}

export interface IPushToken {
    body?: string;
    title?: string;
}

export function sendPushToken(courier: ICourier, pushToken: IPushToken) {
    return courier.post<IPushTokenResponse>("push_token/send", pushToken);
}
