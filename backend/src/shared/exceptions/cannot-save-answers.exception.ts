import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotSaveAnswersException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 5,
                error: "Bad Request",
                message,
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
