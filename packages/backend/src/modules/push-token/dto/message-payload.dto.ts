import { ApiModelProperty } from "@nestjs/swagger";
import * as admin from "firebase-admin";
import MessagingPayload = admin.messaging.MessagingPayload;

export class MessagePayloadDto implements MessagingPayload {
    @ApiModelProperty() readonly data: admin.messaging.DataMessagePayload;
    @ApiModelProperty() readonly notification: admin.messaging.NotificationMessagePayload;
}
