import { HttpException, HttpStatus } from "@nestjs/common";

export class NonCompatiblePropsException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 4,
                error: "Bad Request",
                message,
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
