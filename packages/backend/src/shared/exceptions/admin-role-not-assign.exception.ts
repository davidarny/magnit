import { HttpException, HttpStatus } from "@nestjs/common";

export class AdminRoleNotAssignException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 501,
                message,
                error: "Not Implemented",
                statusCode: HttpStatus.NOT_IMPLEMENTED,
            },
            HttpStatus.NOT_IMPLEMENTED,
        );
    }
}
