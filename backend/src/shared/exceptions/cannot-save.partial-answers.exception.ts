import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotSavePartialAnswersException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 12,
                error: "Bad Request",
                message,
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
