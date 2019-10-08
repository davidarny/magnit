import { HttpException, HttpStatus } from "@nestjs/common";

export class UserExistException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 15,
                error: "Conflict",
                message,
                statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT,
        );
    }
}
