import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotSaveDuplicateAnswerException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 6,
                error: "Bad Request",
                message,
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
