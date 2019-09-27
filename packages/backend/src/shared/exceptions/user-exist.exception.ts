import { HttpException, HttpStatus } from "@nestjs/common";

export class UserExistException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 15,
                error: "User exist",
                message,
                statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT,
        );
    }
}
