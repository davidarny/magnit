import { ApiModelPropertyOptional } from "@nestjs/swagger";
import * as admin from "firebase-admin";
import NotificationMessagePayload = admin.messaging.NotificationMessagePayload;

export class MessagePayloadDto implements NotificationMessagePayload {
    [key: string]: string;
    @ApiModelPropertyOptional() readonly tag?: string;
    @ApiModelPropertyOptional() readonly body?: string;
    @ApiModelPropertyOptional() readonly icon?: string;
    @ApiModelPropertyOptional() readonly badge?: string;
    @ApiModelPropertyOptional() readonly color?: string;
    @ApiModelPropertyOptional() readonly sound?: string;
    @ApiModelPropertyOptional() readonly title?: string;
}
