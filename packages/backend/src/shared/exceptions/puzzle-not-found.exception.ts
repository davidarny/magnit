import { HttpException, HttpStatus } from "@nestjs/common";

export class PuzzleNotFoundException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 3,
                error: "Not Found",
                message,
                statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
