import * as admin from "firebase-admin";
import MessagingOptions = admin.messaging.MessagingOptions;
import NotificationMessagePayload = admin.messaging.NotificationMessagePayload;

export interface IPushMessage {
    token: string;
    message: NotificationMessagePayload;
    options?: MessagingOptions;
}
