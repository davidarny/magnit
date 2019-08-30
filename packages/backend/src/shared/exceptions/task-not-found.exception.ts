import { HttpException, HttpStatus } from "@nestjs/common";

export class TaskNotFoundException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 1,
                error: "Not Found",
                message,
                statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
