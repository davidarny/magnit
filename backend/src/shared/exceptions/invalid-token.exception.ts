import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidTokenException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 9,
                message,
                error: "Unauthorized",
                statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}
