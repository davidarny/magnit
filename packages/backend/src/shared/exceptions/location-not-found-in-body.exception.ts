import { HttpException, HttpStatus } from "@nestjs/common";

export class LocationNotFoundInBodyException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 13,
                message,
                error: "Bad Request",
                statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
