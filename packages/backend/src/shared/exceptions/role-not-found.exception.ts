import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleNotFoundException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 17,
                error: "Not Found",
                message,
                statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
