import { HttpException, HttpStatus } from "@nestjs/common";

export class UserUnauthorizedException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 8,
                message,
                error: "Unauthorized",
                statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}
