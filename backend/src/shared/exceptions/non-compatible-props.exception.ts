import { HttpException, HttpStatus } from "@nestjs/common";

export class NonCompatiblePropsException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 4,
                error: "Conflict",
                message,
                statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT,
        );
    }
}
