import { ICourier, IResponse } from "../entities";

export interface IPushTokenResponse extends IResponse {}

export interface IPushToken {
    tag?: string;
    body?: string;
    icon?: string;
    badge?: string;
    color?: string;
    sound?: string;
    title?: string;
}

export function sendPushToken(courier: ICourier, pushToken: IPushToken) {
    return courier.post<IPushTokenResponse>("push_token/send", pushToken);
}
