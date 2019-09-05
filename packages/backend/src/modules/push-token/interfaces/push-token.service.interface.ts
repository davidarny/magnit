import { PushToken } from "../entities/push-token.entity";

export interface IPushTokenService {
    deletePreviousRecordsForToken(token: PushToken): Promise<void>;

    save(token: PushToken): Promise<PushToken>;

    createUniqueToken(token: PushToken): Promise<PushToken>;

    getTokensByUserId(id: string): Promise<PushToken[]>;
}
