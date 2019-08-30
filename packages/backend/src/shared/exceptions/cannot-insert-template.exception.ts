import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotInsertTemplateException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 2,
                error: "Internal Server Error",
                message,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
