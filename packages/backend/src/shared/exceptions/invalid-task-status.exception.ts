import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidTaskStatusException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 11,
                error: "Bad Request",
                message,
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
