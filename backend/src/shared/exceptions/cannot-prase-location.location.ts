import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotParseLocationException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 14,
                message,
                error: "Bad Request",
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
