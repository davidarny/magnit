import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotSendPushNotificationException extends HttpException {
    constructor(message) {
        super(
            {
                errorCode: 10,
                error: "Conflict",
                message,
                statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT,
        );
    }
}
