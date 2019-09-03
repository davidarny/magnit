import * as admin from "firebase-admin";
import MessagingOptions = admin.messaging.MessagingOptions;
import MessagingPayload = admin.messaging.MessagingPayload;

export interface IPushMessage {
    token: string;
    message: MessagingPayload;
    options?: MessagingOptions;
}
